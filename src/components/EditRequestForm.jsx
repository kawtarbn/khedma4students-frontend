import React, { useState } from "react";
import algerianCities from "../data/algerianCities";
import { updateRequest } from "../api";

export default function EditRequestForm({
  request = {},
  onSave = () => {},
  onCancel = () => {},
}) {
  const [title, setTitle] = useState(request.title || "");
  const [category, setCategory] = useState(request.category || "");
  const [city, setCity] = useState(request.city || "");
  const [description, setDescription] = useState(request.description || "");
  const [pay, setPay] = useState(request.pay || "");
  const [availability, setAvailability] = useState(
    request.availability || ""
  );
  const [status, setStatus] = useState(request.status || "Active");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!request.id) {
      console.error("Request ID is missing!");
      return;
    }

    try {
      const res = await updateRequest(request.id, {
        id: request.id,
        title,
        category,
        city,
        description,
        pay,
        availability,
        status,
      });

      onSave(res.data);
    } catch (err) {
      console.error("Error updating request:", err.response || err);
      alert("Failed to update request.");
    }
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "520px",
            backgroundColor: "#fff",
            padding: "30px 25px",
            paddingTop: "60px",  /* Increased top padding */
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>
            Edit Request
          </h2>
          <p style={{ margin: "6px 0 20px", color: "#555" }}>
            Update your request details below.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Category */}
            <label style={labelStyle}>Category</label>
            <input
              style={inputStyle}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            {/* Description */}
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: "100px", resize: "vertical" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* City */}
            <label style={labelStyle}>City</label>
            <select
              style={inputStyle}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">-- select a city --</option>
              {algerianCities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Pay */}
            <label style={labelStyle}>Pay</label>
            <input
              style={inputStyle}
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              placeholder="e.g. 2000 DA"
            />

            {/* Availability */}
            <label style={labelStyle}>Availability</label>
            <input
              style={inputStyle}
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Weekends"
            />

            {/* Status */}
            <label style={labelStyle}>Status</label>
            <select
              style={inputStyle}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                type="button"
                onClick={onCancel}
                style={cancelBtn}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={saveBtn}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ===== Styles ===== */

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  marginBottom: "12px",
  background: "#f3f6ff",
};

const labelStyle = {
  fontWeight: 600,
  marginBottom: 6,
  display: "block",
};

const cancelBtn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const saveBtn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};
