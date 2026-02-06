import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { employerResetPasswordWithCode } from "../api";

export default function EmployerResetPassword() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await employerResetPasswordWithCode(email, verificationCode, password, passwordConfirmation);
      setMessage(response.data.message);
      setTimeout(() => {
        window.location.href = "/emplogin";
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mainlogin">
        <img src="/media/enter.png" alt="reset password" style={{ width: 50, marginBottom: 5 }} />
        <p className="endform" style={{ color: "rgb(20,20,26)" }}>Reset Password</p>
        <p className="endform" style={{ color: "gray" }}>Enter your email and verification code</p>

        <section className="loginform">
          {message && <div className="success-message" style={{ color: "green", marginBottom: "15px", padding: "10px", backgroundColor: "#d4edda", borderRadius: "5px" }}>{message}</div>}
          {error && <div className="error-message" style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "5px" }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input 
              className="inputlog" 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />

            <label htmlFor="verification_code">Verification Code</label>
            <input 
              className="inputlog" 
              type="text" 
              id="verification_code" 
              name="verification_code" 
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              required 
              style={{ 
                letterSpacing: "4px", 
                textAlign: "center", 
                fontSize: "20px", 
                fontWeight: "bold",
                fontFamily: "monospace"
              }}
            />

            <label htmlFor="password">New Password</label>
            <input 
              className="inputlog" 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter new password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <label htmlFor="password_confirmation">Confirm New Password</label>
            <input 
              className="inputlog" 
              type="password" 
              id="password_confirmation" 
              name="password_confirmation" 
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required 
            />

            <button className="btnlog" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="endform" style={{ marginTop: "20px", fontSize: "14px", color: "gray" }}>
            Check your email for a 6-digit verification code.<br />
            The code expires in 30 minutes.
          </p>

          <p className="endform">
            <Link to="/emplogin" style={{ color: "blue", textDecoration: "none" }}><b>Back to Login</b></Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
