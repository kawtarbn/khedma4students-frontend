import React, { useState } from "react";
import { applicationAPI } from "../services/api";

export default function ApplyModal({ onClose, job, onSubmitApplication }) {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};

    if (form.fullname.trim().length < 3)
      e.fullname = "Name must be at least 3 characters";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email is invalid";

    if (!/^0[5-7][0-9]{8}$/.test(form.phone))
      e.phone = "Phone must start with 05, 06 or 07 and have 10 digits";

    if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";

    if (form.experience && form.experience.trim().length < 5)
      e.experience = "Experience must be at least 5 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    if (validate()) {
      try {
        const studentId = localStorage.getItem("studentId");
        console.log("=== APPLICATION SUBMISSION DEBUG ===");
        console.log("Student ID from localStorage:", studentId);
        console.log("Job data:", job);
        console.log("Student ID type:", typeof studentId);
        console.log("Student ID value:", studentId);
        
        // Check if studentId exists
        if (!studentId) {
          alert("Please log in to submit applications");
          return;
        }
        
        // Check if job data exists
        if (!job?.id) {
          alert("Invalid job data");
          return;
        }
        
        // Validate form data
        if (!form.fullname?.trim()) {
          alert("Please enter your full name");
          return;
        }
        
        if (!form.email?.trim()) {
          alert("Please enter your email");
          return;
        }
        
        if (!form.message?.trim()) {
          alert("Please enter a message");
          return;
        }
        
        const applicationData = {
          student_id: parseInt(studentId), // Ensure it's a number
          job_id: parseInt(job?.id), // Ensure it's a number
          title: (job?.title || job?.job_title)?.trim(),
          employer_id: job?.employer_id || job?.id, // Use employer_id if available, fallback to job id
          employer_name: (job?.company || job?.employer_name)?.trim(),
          fullname: form.fullname?.trim(),
          email: form.email?.trim(),
          phone: form.phone?.trim(),
          experience: form.experience?.trim(),
          message: form.message?.trim(),
          status: 'pending'
        };

        console.log("Application data to submit:", applicationData);
        console.log("Available job fields:", Object.keys(job || {}));
        console.log("Student ID type:", typeof studentId, studentId);
        console.log("Job ID type:", typeof job?.id, job?.id);
        
        const response = await applicationAPI.create(applicationData);
        console.log("Application submitted response:", response);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        console.log("Response headers:", response.headers);
        console.log("Full response object:", response);
        
        // Check if the response has the expected structure
        if (!response.data) {
          console.error("No data in response");
          alert("Invalid response from server. Please try again.");
          return;
        }
        
        // Call the parent callback to update the applications list
        if (onSubmitApplication) {
          console.log("Calling onSubmitApplication with:", response.data);
          onSubmitApplication(response.data);
        }
        
        // Create notification for employer when student applies to job
        if (response.data && job?.id) {
          try {
            const employerNotificationData = {
              employer_id: job?.employer_id,
              student_id: localStorage.getItem("studentId"),
              title: 'New Application Received',
              description: `A student has applied to your job: ${job?.title}`,
              type: 'new_application',
              is_read: false
            };

            const notificationResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(employerNotificationData),
            });
            
            console.log("Employer notification created:", notificationResponse.data);
          } catch (notificationError) {
            console.error("Failed to create employer notification:", notificationError);
            // Don't fail the application submission if notification fails
          }
        }
        
        alert("Application submitted successfully!");
        onClose();
      } catch (error) {
        console.error("Error submitting application:", error);
        console.error("Error status:", error.response?.status);
        console.error("Error data:", error.response?.data);
        console.error("Full error:", error);
        
        // Check if it's a network error
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          alert("Network error. Please check your connection and try again.");
        } else if (error.response?.status === 401) {
          alert("Authentication error. Please log in again.");
        } else if (error.response?.status === 403) {
          alert("You are not authorized to submit applications.");
        } else if (error.response?.status === 404) {
          alert("Job not found. Please try a different job.");
        } else if (error.response?.status === 500) {
          console.error("Server error details:", error.response?.data);
          console.error("Full error object:", error);
          
          alert(`Server error occurred. Error details have been logged to console for support.\n\nError: ${error.response?.data?.message || error.message || 'Unknown server error'}\n\nPlease try again later. If this continues, contact support with the error details from the browser console.`);
        } else if (error.response?.status >= 400 && error.response?.status < 500) {
          console.error("Client error details:", error.response?.data);
          const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Unknown error occurred';
          alert(`Application failed: ${errorMessage}`);
        } else {
          console.error("Unexpected error:", error);
          alert("Failed to submit application. Please try again.");
        }
      }
    }
  }

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modalcontent">
        <div className="form-box">
          <button className="close-btn" onClick={onClose}>
            ×
          </button>

          <h2 className="h2m">Apply for this Job</h2>

          <form onSubmit={submit}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={(e) =>
                setForm({ ...form, fullname: e.target.value })
              }
              className="input"
              required
            />
            {errors.fullname && (
              <div className="error-msg">{errors.fullname}</div>
            )}

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="input"
              required
            />
            {errors.email && (
              <div className="error-msg">{errors.email}</div>
            )}

            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="input"
            />
            {errors.phone && (
              <div className="error-msg">{errors.phone}</div>
            )}

            <label>Experience</label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
              className="textarea"
              rows="3"
              placeholder="Describe your relevant experience..."
            />
            {errors.experience && (
              <div className="error-msg">{errors.experience}</div>
            )}

            <label>Cover Message</label>
            <textarea
              rows="4"
              name="message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="textarea"
              placeholder="Why are you interested in this position?"
              required
            />
            {errors.message && (
              <div className="error-msg">{errors.message}</div>
            )}

            <button type="submit" className="submit-btn">
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
