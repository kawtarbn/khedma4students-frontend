import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { studentVerifyEmailWithCode } from "../api";

export default function StudentEmailVerification() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerification = async () => {
    if (!email || !verificationCode) {
      setError("Please enter both email and verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Verification code must be 6 digits");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await studentVerifyEmailWithCode(email, verificationCode);
      setMessage(response.data.message);
      setVerified(true);
      
      // Set user session data after successful verification
      const pendingData = JSON.parse(localStorage.getItem("pendingVerification") || "{}");
      if (pendingData.role === "student") {
        localStorage.setItem("role", "student");
        localStorage.setItem("studentId", pendingData.studentId);
        localStorage.setItem("full_name", pendingData.full_name);
        localStorage.removeItem("pendingVerification");
        
        // Dispatch auth change event
        window.dispatchEvent(new Event("auth-change"));
        
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerification();
  };

  return (
    <>
      <Header />
      <main className="mainlogin">
        <img src="/media/enter.png" alt="email verification" style={{ width: 50, marginBottom: 5 }} />
        <p className="endform" style={{ color: "rgb(20,20,26)" }}>Email Verification</p>
        <p className="endform" style={{ color: "gray" }}>Verify your student account email</p>

        <section className="loginform">
          {message && <div className="success-message" style={{ color: "green", marginBottom: "15px", padding: "10px", backgroundColor: "#d4edda", borderRadius: "5px" }}>{message}</div>}
          {error && <div className="error-message" style={{ color: "red", marginBottom: "15px", padding: "10px", backgroundColor: "#f8d7da", borderRadius: "5px" }}>{error}</div>}
          
          {!verified ? (
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

              <button className="btnlog" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p style={{ color: "green", fontSize: "18px" }}>✓ Email verified successfully!</p>
              <p style={{ color: "gray" }}>Redirecting to your dashboard...</p>
            </div>
          )}

          <p className="endform" style={{ marginTop: "20px", fontSize: "14px", color: "gray" }}>
            Check your email for a 6-digit verification code.<br />
            The code expires in 30 minutes.
          </p>

          <p className="endform">
            <Link to="/login" style={{ color: "blue", textDecoration: "none" }}><b>Back to Login</b></Link>
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
