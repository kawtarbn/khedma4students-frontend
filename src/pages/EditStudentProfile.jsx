import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getStudentById, updateStudent } from "../api";
import { validateStudentProfileForm } from "../utils/validateStudent";

export default function EditStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    university: "",
    major: "",
    year_of_study: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    getStudentById(id)
      .then(res => {
        setForm({
          full_name: res.data.full_name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          location: res.data.location || "",
          university: res.data.university || "",
          major: res.data.major || "",
          year_of_study: res.data.year_of_study || "",
          bio: res.data.bio || "",
        });
      })
      .catch(() => setError("Could not load student data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateStudentProfileForm(form);
    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    try {
      await updateStudent(id, form);
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/stdashboard1"), 1000);
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
        <a href="/stdashboard1" className="bk">← Back to Dashboard</a>
        <div className="edit-form">
          <div className="form-header">
            <h3>Edit Student Profile</h3>
          </div>
          <p>Update your profile information to help employers find you</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label1">Full Name</label>
              <input
                className="input1"
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label1">Email</label>
              <input
                className="input1"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label1">Phone Number</label>
              <input
                className="input1"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label1">Location</label>
              <input
                className="input1"
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label1">University</label>
              <input
                className="input1"
                type="text"
                name="university"
                value={form.university}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label1">Major</label>
              <input
                className="input1"
                type="text"
                name="major"
                value={form.major}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label1">Year of Study</label>
              <input
                className="input1"
                type="text"
                name="year_of_study"
                value={form.year_of_study}
                onChange={handleChange}
                required
              />
            </div>
            <div className="full-width">
              <label className="label1">Bio</label>
              <textarea
                className="textarea1"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                
              />
            </div>

            {error && <small className="error" style={{ whiteSpace: "pre-wrap" }}>{error}</small>}
            {success && <small className="success">{success}</small>}

            <div className="form-actions">
              <button className="save-btn">💾 Save Changes</button>
              <a href="/stdashboard1" className="cancel-btn">Cancel</a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
