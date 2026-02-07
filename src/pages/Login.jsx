import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import Header from "../components/Header";

import Footer from "../components/Footer";

import { studentAPI } from "../services/api";

import { validateStudentForm } from "../utils/validateStudent";
import { clearStudentStorage, getStudentInfo } from "../utils/clearStorage";



export default function Login() {

  const [error, setError] = useState("");

  const navigate = useNavigate();



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    // Clear any old storage first
    clearStudentStorage();

    const form = e.target;

    const email = form.emailst.value.trim();

    const password = form.passst.value.trim();



    const messages = validateStudentForm({ full_name: "dummy", email, password, university: "dummy", city: "dummy" });



    if (messages.length > 0) {

      setError(messages.join("\n"));

      return;

    }



    try {

      const res = await studentAPI.login({ email, password });

      const student = res.data.student;

      console.log("=== LOGIN SUCCESS DEBUG ===");
      console.log("Logged in student:", student);
      console.log("Student ID:", student.id);
      console.log("Student Name:", student.full_name);

      localStorage.setItem("role", "student");
      localStorage.setItem("studentId", student.id);
      localStorage.setItem("full_name", student.full_name);
      
      // Verify storage was set correctly
      console.log("Storage set - Student ID:", localStorage.getItem("studentId"));
      console.log("Storage set - Full Name:", localStorage.getItem("full_name"));

      window.dispatchEvent(new Event("auth-change"));

      navigate("/");

    } catch (err) {

      console.error(err.response?.data || err);

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

          <Link className="al actform" to="/login"><b>Student</b></Link>

          <Link className="al choose" to="/emplogin"><b>Employer</b></Link>

        </div>



        <section className="loginform">

          <form onSubmit={handleSubmit}>

            <label htmlFor="emailst">Email</label>

            <input className="inputlog" type="text" id="emailst" name="emailst" placeholder="enter your email" />



            <label htmlFor="passst">Password</label>

            <input className="inputlog" type="password" id="passst" name="passst" placeholder="enter your password" />



            {error && <small className="error">{error}</small>}



            <button className="btnlog" type="submit"><b>Login as Student</b></button>

          </form>



          <p className="endform">
            <Link to="/forgot-password" style={{ color: "blue", textDecoration: "none" }}>Forgot Password?</Link>
          </p>

          <p className="endform">
            Don't have an account? <Link to="/sign" style={{ color: "blue", textDecoration: "none" }}><b>Sign Up</b></Link>
          </p>

        </section>

      </main>

      <Footer />

    </>

  );

}

