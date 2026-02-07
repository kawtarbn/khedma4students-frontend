import React, { useState } from "react";
import algerianCities from "../data/algerianCities";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../api";

const PostRequestSection = () => {
  const navigate = useNavigate();
  const studentId = Number(localStorage.getItem("studentId"));

  const [form, setForm] = useState({
    title: "",
    category: "",
    city: "",
    description: "",
    pay: "",
    availability: "",
    contactEmail: "",
    contactPhone: "",
    status: "open",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (form.title.trim().length < 3) newErrors.title = "Title is required";
    if (!form.category) newErrors.category = "Select a category";
    if (!form.city) newErrors.city = "Select a city";
    if (form.description.trim().length < 15) newErrors.description = "Description must be at least 15 characters";
    if (!form.availability) newErrors.availability = "Availability required";
    if (!form.contactEmail) newErrors.contactEmail = "Email required";
    if (!form.contactPhone) newErrors.contactPhone = "Phone required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (!studentId) {
        alert("You must be logged in as a student to post a request.");
        return;
      }

      const requestData = {
        title: form.title,
        description: form.description,
        category: form.category,
        city: form.city,
        pay: form.pay ? parseInt(form.pay.replace(/[^0-9]/g, '')) : 0, // Convert to number, default to 0 if empty
        availability: form.availability,
        contactEmail: form.contactEmail, // Use camelCase to match backend
        contactPhone: form.contactPhone, // Use camelCase to match backend
        student_id: studentId,
        status: form.status
      };

      console.log("=== POST REQUEST DEBUG ===");
      console.log("Student ID:", studentId);
      console.log("Form data:", form);
      console.log("Request data to send:", requestData);
      console.log("Making API call to createRequest...");

      const response = await createRequest(requestData);
      console.log("Request creation response:", response);
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      // Clear form
      setForm({
        title: "",
        category: "",
        city: "",
        description: "",
        pay: "",
        availability: "",
        contactEmail: "",
        contactPhone: "",
        status: "open",
      });

      alert("Request posted successfully!");
      navigate("/stdashboard1");

    } catch (err) {
      console.error("=== POST REQUEST ERROR ===");
      console.error("Error:", err);
      console.error("Error response:", err.response);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      // Show more specific error message
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to post request";
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <section className="postjob">
      <img src="/media/business.png" alt="request" />
      <h2>Post a Request</h2>
      <p>Students: let employers know what kind of service you need</p>

      <div className="job-form">
        <h4>Request details :</h4>
        <form className="request-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Request title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Math tutoring - 2h/week"
            value={form.title}
            onChange={handleChange}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <div className="error-msg">{errors.title}</div>}

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="6"
            placeholder="Describe what you need..."
            value={form.description}
            onChange={handleChange}
            className={errors.description ? "input-error" : ""}
          />
          {errors.description && <div className="error-msg">{errors.description}</div>}

          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={handleChange}
            className={errors.category ? "input-error" : ""}
          >
            <option value="">-- select a category --</option>
            <option value="Tutoring & education">Tutoring & education</option>
            <option value="Freelance & digital work">Freelance & digital work</option>
            <option value="Part time & small jobs">Part time & small jobs</option>
            <option value="Babysitting & Household Help">Babysitting & Household Help</option>
            <option value="Delivery and Errands">Delivery and Errands</option>
          </select>
          {errors.category && <div className="error-msg">{errors.category}</div>}

          <label htmlFor="city">City</label>
          <select
            id="city"
            value={form.city}
            onChange={handleChange}
            className={errors.city ? "input-error" : ""}
          >
            <option value="">-- select a city --</option>
            {algerianCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <div className="error-msg">{errors.city}</div>}

          <label htmlFor="pay">Pay (optional)</label>
          <input
            id="pay"
            type="text"
            placeholder="e.g., 2000 DA / hour"
            value={form.pay}
            onChange={handleChange}
          />

          <label htmlFor="availability">Availability</label>
          <input
            id="availability"
            type="text"
            placeholder="e.g., evenings, weekends"
            value={form.availability}
            onChange={handleChange}
            className={errors.availability ? "input-error" : ""}
          />
          {errors.availability && <div className="error-msg">{errors.availability}</div>}

          <label>Contact information</label>
          <input
            id="contactEmail"
            type="email"
            placeholder="Email"
            value={form.contactEmail}
            onChange={handleChange}
            className={errors.contactEmail ? "input-error" : ""}
          />
          {errors.contactEmail && <div className="error-msg">{errors.contactEmail}</div>}
          <input
            id="contactPhone"
            type="tel"
            placeholder="Phone number"
            value={form.contactPhone}
            onChange={handleChange}
            className={errors.contactPhone ? "input-error" : ""}
          />
          {errors.contactPhone && <div className="error-msg">{errors.contactPhone}</div>}

          <input type="submit" value="Post Request" className="post-request-butt" />
        </form>
      </div>
    </section>
  );
};

export default PostRequestSection;
