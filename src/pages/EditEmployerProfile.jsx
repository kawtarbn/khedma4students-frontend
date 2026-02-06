import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getEmployerById, updateEmployerProfile } from "../api";
import { validateEmployerProfileForm } from "../utils/validateStudent";

export default function EditEmployerProfile() {
  const navigate = useNavigate();
  const employerId = localStorage.getItem("employerId");

  const [form, setForm] = useState({
    full_name: "",
    company: "",
    contact_person: "",
    phone: "",
    email: "",
    city: "",
    location: "",
    description: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Load employer info
  useEffect(() => {
    if (!employerId) return;

    getEmployerById(employerId)
      .then(res => setForm({
        full_name: res.data.full_name || "",
        company: res.data.company || "",
        contact_person: res.data.contact_person || "",
        phone: res.data.phone || "",
        email: res.data.email || "",
        city: res.data.city || "",
        location: res.data.location || "",
        description: res.data.description || "",
        password: "",
      }))
      .catch(() => setError("Could not load employer data"))
      .finally(() => setLoading(false));
  }, [employerId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateEmployerProfileForm(form);
    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    try {
      await updateEmployerProfile(employerId, form);
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/empdash1"), 1000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join("\n"));
      } else {
        setError(err.response?.data?.message || "Could not update profile");
      }
    }
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="hh22"><p>Loading profile...</p></div>
        <Footer />
      </>
    );

  return (
    <>
      <Header />
      <div className="hh22">
        <a href="/empdash1" className="bk">← Back to Dashboard</a>
        <div className="edit-form">
          <div className="form-header">
            <h3>Edit Employer Profile</h3>
          </div>
          <p>Update your company information to attract top student talent</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label1">Full Name</label>
              <input className="input1" type="text" name="full_name" value={form.full_name} onChange={handleChange} required />
            </div>
            <div>
              <label className="label1">Company</label>
              <input className="input1" type="text" name="company" value={form.company} onChange={handleChange} required />
            </div>
            <div>
              <label className="label1">Phone</label>
              <input className="input1" type="tel" name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div>
              <label className="label1">Email</label>
              <input className="input1" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label className="label1">City</label>
              <input className="input1" type="text" name="city" value={form.city} onChange={handleChange} required />
            </div>
            <div>
              <label className="label1">Location</label>
              <input className="input1" type="text" name="location" value={form.location} onChange={handleChange} />
            </div>
            <div className="full-width">
              <label className="label1">Description</label>
              <textarea className="textarea1" name="description" value={form.description} onChange={handleChange} />
            </div>

            {error && <small className="error" style={{ whiteSpace: "pre-wrap" }}>{error}</small>}
            {success && <small className="success">{success}</small>}

            <div className="form-actions">
              <button className="save-btn">💾 Save Changes</button>
              <a href="/empdash1" className="cancel-btn">Cancel</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
