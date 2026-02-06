import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { createEmployer } from "../api";
import algerianCities from "../data/algerianCities";
import { validateEmployerForm, validateEmployerProfileForm } from "../utils/validateStudent";

export default function SignEmp() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.target;
    const full_name = form.namemployer.value.trim();
    const email = form.emailemployer.value.trim();
    const password = form.passemployer.value.trim();
    const company = form.univemp.value.trim();
    const city = form.cityemp.value;

    // Validation
    const messages = validateEmployerForm({ full_name, email, password, company, city });
    if (messages.length > 0) {
      setError(messages.join("\n"));
      return;
    }

    try {
      const res = await createEmployer({ full_name, email, password, company, city });

      if (res.data.requires_verification) {
        // Store registration data for verification
        localStorage.setItem("pendingVerification", JSON.stringify({
          role: "employer",
          email: email,
          full_name: res.data.full_name,
          employerId: res.data.id
        }));
        
        setSuccess("Registration successful! Please check your email for verification code.");
        setTimeout(() => navigate("/employer-verify-email"), 2000);
      } else {
        // Legacy mode - no verification required
        localStorage.setItem("role", "employer");
        localStorage.setItem("employerId", res.data.id);
        localStorage.setItem("full_name", res.data.full_name);

        setSuccess("Account created successfully!");
        window.dispatchEvent(new Event("auth-change"));
        setTimeout(() => navigate("/empdash1"), 1000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join("\n"));
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
          <Link className="al choose" to="/sign"><b>Student</b></Link>
          <Link className="al actform" to="/signemp"><b>Employer</b></Link>
        </div>

        <section className="loginform">
          <form id="employerSignUpForm" onSubmit={handleSubmit}>
            <label htmlFor="namemployer">Full Name</label>
            <input className="inputlog" type="text" id="namemployer" name="namemployer" placeholder="Kawtar Benabdelmoumene" />

            <label htmlFor="emailemployer">Email</label>
            <input className="inputlog" type="text" id="emailemployer" name="emailemployer" placeholder="example@gmail.com" />

            <label htmlFor="passemployer">Password</label>
            <input className="inputlog" type="password" id="passemployer" name="passemployer" />

            <label htmlFor="univemp">Company/Organization</label>
            <input className="inputlog" type="text" id="univemp" name="univemp" placeholder="University of Algiers" />

            <label htmlFor="cityemp">City</label>
            <select className="inputlog" id="cityemp" name="cityemp">
              <option value="">-- Select your city --</option>
              {algerianCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {error && <small className="error" style={{ whiteSpace: "pre-wrap" }}>{error}</small>}
            {success && <small className="success">{success}</small>}

            <button type="submit" className="btnlog"><b>Create Employer Account</b></button>
          </form>

          <p className="endform">
            Already have an account? <a className="endform" href="/emplogin" style={{ color: "blue", textDecoration: "none" }}><b>Login</b></a>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
