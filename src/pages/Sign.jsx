import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { studentAPI } from "../api";
import { validateStudentForm } from "../utils/validateStudent";
import algerianCities from "../data/algerianCities";

export default function Sign() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.target;
    const full_name = form.full_name?.value.trim();
    const email = form.email?.value.trim();
    const password = form.password?.value.trim();
    const university = form.university?.value.trim();
    const city = form.city?.value;

    const messages = validateStudentForm({ full_name, email, password, university, city });

    if (messages.length > 0) {
      setError(messages.join("\n"));
      return;
    }

    try {
      const res = await studentAPI.create({ full_name, email, password, university, city });

      if (res.data.requires_verification) {
        // Store registration data for verification
        localStorage.setItem("pendingVerification", JSON.stringify({
          role: "student",
          email: email,
          full_name: res.data.full_name,
          studentId: res.data.id
        }));
        
        setSuccess("Registration successful! Please check your email for verification code.");
        setTimeout(() => navigate("/verify-email"), 2000);
      } else {
        // Legacy mode - no verification required
        localStorage.setItem("role", "student");
        localStorage.setItem("studentId", res.data.id); 
        localStorage.setItem("full_name", res.data.full_name);

        setSuccess("Account created successfully!");
        window.dispatchEvent(new Event("auth-change"));
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {




      if (err.response?.data?.errors) {
        const backendErrors = Object.values(err.response.data.errors).flat().join("\n");
        setError(backendErrors);
      } else {
        setError(err.response?.data?.message || "Error creating account");
      }
    }
  };

  return (
    <>
      <Header />
      <main className="mainlogin">
        <img src="/media/add-user.png" alt="login" style={{ width: "50px", marginBottom: "5px" }} />
        <p className="endform" style={{ color: "rgb(20, 20, 26)" }}>Create Account</p>
        <p className="endform" style={{ color: "gray" }}>Join Khedma4Students and start your journey</p>

        <div className="empstu">
          <Link className="al actform" to="/sign"><b>Student</b></Link>
          <Link className="al choose" to="/signemp"><b>Employer</b></Link>
        </div>

        <section className="loginform">
          <form id="studentSignUpForm" onSubmit={handleSubmit}>
            <label htmlFor="full_name">Full Name</label>
            <input className="inputlog" type="text" id="full_name" name="full_name" placeholder="Kawtar Benabdelmoumene" />

            <label htmlFor="email">Email</label>
            <input className="inputlog" type="text" id="email" name="email" placeholder="example@gmail.com" />

            <label htmlFor="password">Password</label>
            <input className="inputlog" type="password" id="password" name="password" />

            <label htmlFor="university">University/School</label>
            <input className="inputlog" type="text" id="university" name="university" placeholder="University of Algiers" />

            <label htmlFor="city">City</label>
            <select className="inputlog" id="city" name="city">
              <option value="">-- Select your city --</option>
              {algerianCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {error && <small className="error" style={{ whiteSpace: "pre-wrap" }}>{error}</small>}
            {success && <small className="success">{success}</small>}

            <button type="submit" className="btnlog"><b>Create Student Account</b></button>
          </form>

          <p className="endform">
            Already have an account? <a className="endform" href="/login" style={{ color: "blue", textDecoration: "none" }}><b>Login</b></a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}