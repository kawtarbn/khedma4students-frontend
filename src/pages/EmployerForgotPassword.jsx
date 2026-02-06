import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { employerForgotPassword } from "../api";

export default function EmployerForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await employerForgotPassword(email);
      setMessage(response.data.message);
      // For development, show the token
      if (response.data.token) {
        setMessage(response.data.message + ` (Token: ${response.data.token})`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mainlogin">
        <img src="/media/enter.png" alt="forgot password" style={{ width: 50, marginBottom: 5 }} />
        <p className="endform" style={{ color: "rgb(20,20,26)" }}>Forgot Password</p>
        <p className="endform" style={{ color: "gray" }}>Enter your email to receive password reset instructions</p>

        <div className="empstu">
          <Link className="al choose" to="/forgot-password"><b>Student</b></Link>
          <Link className="al actform" to="/employer-forgot-password"><b>Employer</b></Link>
        </div>

        <section className="loginform">
          {message && <div className="success-message" style={{ color: "green", marginBottom: "15px", padding: "10px", backgroundColor: "#d4edda", borderRadius: "5px" }}>{message}</div>}
          {error && <div className="error-message" style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "5px" }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <input 
              className="inputlog" 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your employer email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <button className="btnlog" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="endform">
            Remember your password? <Link to="/emplogin" style={{ color: "blue", textDecoration: "none" }}><b>Back to Login</b></Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
