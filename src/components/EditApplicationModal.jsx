import React, { useState, useEffect } from "react";

export default function EditApplicationModal({ onClose, application, onUpdate }) {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
    experience: ""
  });

  useEffect(() => {
    if (application) {
      setForm({
        fullname: application.fullname || "",
        email: application.email || "",
        phone: application.phone || "",
        message: application.message || "",
        experience: application.experience || ""
      });
    }
  }, [application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.fullname || !form.email || !form.message) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/applications/${application.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const updatedApplication = await response.json();
        onUpdate(updatedApplication);
        onClose();
        alert("Application updated successfully!");
      } else {
        throw new Error('Failed to update application');
      }
    } catch (error) {
      console.error("Error updating application:", error);
      alert("Failed to update application. Please try again.");
    }
  };

  return (
    <div className="modal" style={{ display: "flex" }}>
      <div className="modalcontent">
        <div className="form-box">
          <button className="close-btn" onClick={onClose}>
            ×
          </button>

          <h2 className="h2m">Edit Application</h2>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="input"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              required
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="input"
            />

            <label>Experience</label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="textarea"
              rows="3"
              placeholder="Describe your relevant experience..."
            />

            <label>Cover Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              className="textarea"
              rows="4"
              placeholder="Why are you interested in this position?"
              required
            />

            <button type="submit" className="submit-btn">
              Update Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
