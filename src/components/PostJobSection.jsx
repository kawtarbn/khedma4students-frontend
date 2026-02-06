import React, { useState } from "react";
import algerianCities from "../data/algerianCities";
import { createJob } from "../api";

const PostJobSection = () => {
  const [form, setForm] = useState({
    job_title: "",
    job_description: "",
    job_category: "",
    job_city: "",
    std_email: "",
    std_phone: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (form.job_title.trim().length < 3)
      newErrors.job_title = "Title must be at least 3 characters.";
    if (form.job_description.trim().length < 15)
      newErrors.job_description = "Description must be at least 15 characters.";
    if (!form.job_category) newErrors.job_category = "Please select a category.";
    if (!form.job_city) newErrors.job_city = "Please select a city.";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.std_email))
      newErrors.std_email = "Enter a valid email address.";

    const phonePattern = /^(\+213|0)(5|6|7)\d{8}$/;
    if (!phonePattern.test(form.std_phone))
      newErrors.std_phone = "Enter a valid Algerian phone number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // ✅ Get employer ID from localStorage
      const employerId = localStorage.getItem("employerId");
      if (!employerId) {
        alert("You must be logged in as an employer to post a job.");
        return;
      }

      const res = await createJob({
        title: form.job_title,
        description: form.job_description,
        category: form.job_category,
        city: form.job_city,
        contactEmail: form.std_email,
        contactPhone: form.std_phone,
        status: "Active",
        employer_id: employerId, // ✅ Important: link job to employer
      });

      console.log("Job created:", res.data);

      setForm({
        job_title: "",
        job_description: "",
        job_category: "",
        job_city: "",
        std_email: "",
        std_phone: "",
      });

      alert("Job posted successfully!");
    } catch (err) {
      console.error("Error creating job:", err.response || err);
      alert("Failed to post job. Check backend or network.");
    }
  };

  return (
    <section className="postjob">
      <img src="/media/business.png" alt="business" />
      <h2>Post a Job</h2>
      <p>Share job opportunities and attract talented students</p>

      <div className="job-form">
        <h4>Job details :</h4>
        <form id="job-form" onSubmit={handleSubmit}>
          {/* Job Title */}
          <label htmlFor="job_title">Service title</label><br />
          <input
            id="job_title"
            type="text"
            placeholder="e.g., Math Tutoring - All levels"
            value={form.job_title}
            onChange={handleChange}
            className={errors.job_title ? "input-error" : ""}
          />
          {errors.job_title && <div className="error-msg">{errors.job_title}</div>}
          <br /><br />

          {/* Job Description */}
          <label htmlFor="job_description">Description</label><br />
          <textarea
            id="job_description"
            rows="6"
            placeholder="Describe the job..."
            value={form.job_description}
            onChange={handleChange}
            className={errors.job_description ? "input-error" : ""}
          />
          {errors.job_description && <div className="error-msg">{errors.job_description}</div>}
          <br /><br />

          {/* Category */}
          <label htmlFor="job_category">Category</label><br />
          <select
            id="job_category"
            value={form.job_category}
            onChange={handleChange}
            className={errors.job_category ? "input-error" : ""}
          >
            <option value="">-- select a category --</option>
            <option value="Tutoring & education">Tutoring & education</option>
            <option value="Freelance & digital work">Freelance & digital work</option>
            <option value="Part time & small jobs">Part time & small jobs</option>
            <option value="Babysitting & Household Help">Babysitting & Household Help</option>
            <option value="Delivery and Errands">Delivery and Errands</option>
          </select>
          {errors.job_category && <div className="error-msg">{errors.job_category}</div>}
          <br /><br />

          {/* City */}
          <label htmlFor="job_city">City</label><br />
          <select
            id="job_city"
            value={form.job_city}
            onChange={handleChange}
            className={errors.job_city ? "input-error" : ""}
          >
            <option value="">-- select a city --</option>
            {algerianCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.job_city && <div className="error-msg">{errors.job_city}</div>}
          <br /><br />

          {/* Contact info */}
          <label>Contact information</label><br />
          <input
            id="std_email"
            type="email"
            placeholder="Email"
            value={form.std_email}
            onChange={handleChange}
            className={errors.std_email ? "input-error" : ""}
          />
          {errors.std_email && <div className="error-msg">{errors.std_email}</div>}
          <br />
          <input
            id="std_phone"
            type="tel"
            placeholder="Phone number"
            value={form.std_phone}
            onChange={handleChange}
            className={errors.std_phone ? "input-error" : ""}
          />
          {errors.std_phone && <div className="error-msg">{errors.std_phone}</div>}
          <br /><br />

          <input type="submit" value="Post Job" className="post-job-butt" />
        </form>
      </div>
    </section>
  );
};

export default PostJobSection;
