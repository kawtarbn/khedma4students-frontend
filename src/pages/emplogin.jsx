import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { loginEmployer } from "../api";
import { validateEmployerForm, validateEmployerProfileForm } from "../utils/validateStudent";


export default function Emplogin() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const email = form.emailemp.value.trim();
    const password = form.passemp.value.trim();

    // Validate using the same utility
    const messages = validateEmployerForm({ full_name: "dummy", email, password, company: "dummy", city: "dummy" });
    if (messages.length > 0) {
      setError(messages.join("\n"));
      return;
    }

    try {
      const res = await loginEmployer(email, password);
      const employer = res.data;

      if (!employer || !employer.id) {
        setError("Login failed: Invalid response from server");
        // Clean up any existing invalid data
        localStorage.removeItem("employerId");
        localStorage.removeItem("role");
        localStorage.removeItem("full_name");
        return;
      }

      // Only store valid data
      localStorage.setItem("role", "employer");
      localStorage.setItem("employerId", employer.id.toString());
      if (employer.full_name) localStorage.setItem("full_name", employer.full_name);
      
      window.dispatchEvent(new Event("auth-change"));
      navigate("/empdash1");
    } catch (err) {
      // Clean up any existing invalid data on error
      localStorage.removeItem("employerId");
      localStorage.removeItem("role");
      localStorage.removeItem("full_name");
      
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <main className="mainlogin">
        <img src="/media/enter.png" alt="login" style={{ width: 50, marginBottom: 5 }} />
        <p className="endform" style={{ color: "rgb(20,20,26)" }}>Welcome Back</p>
        <p className="endform" style={{ color: "gray" }}>Login to your account to continue</p>

        <div className="empstu">
          <Link className="al choose" to="/login"><b>Student</b></Link>
          <Link className="al actform" to="/emplogin"><b>Employer</b></Link>
        </div>

        <section className="loginform">
          <form onSubmit={handleSubmit}>
            <label htmlFor="emailemp">Email</label>
            <input className="inputlog" type="text" id="emailemp" name="emailemp" placeholder="enter your email" />

            <label htmlFor="passemp">Password</label>
            <input className="inputlog" type="password" id="passemp" name="passemp" placeholder="enter your password" />

            {error && <small className="error">{error}</small>}

            <button className="btnlog" type="submit"><b>Login as Employer</b></button>
          </form>

          <p className="endform">
            <Link to="/employer-forgot-password" style={{ color: "blue", textDecoration: "none" }}>Forgot Password?</Link>
          </p>
          
          <p className="endform">
            Don't have an account? 
            <Link to="/signemp" style={{ color: "blue", textDecoration: "none" }}><b> Sign Up</b></Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
