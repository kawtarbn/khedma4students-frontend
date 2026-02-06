import { useState, useEffect, createElement as h } from "react";

export default function EditJobForm({ job = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(job.title || "");
  const [description, setDescription] = useState(job.description || "");
  const [category, setCategory] = useState(job.category || "");
  const [city, setCity] = useState(job.city || "");
  const [contactEmail, setContactEmail] = useState(job.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(job.contactPhone || "");
  const [status, setStatus] = useState(job.status || "Active");

  function submit(e) {
    e.preventDefault();
    onSave({
      title,
      description,
      category,
      city,
      contactEmail,
      contactPhone,
      status
    });
  }

  return h(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
      }
    },
    h(
      "div",
      {
        style: {
          width: "520px",
          background: "#fff",
          padding: "22px",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
        }
      },

      // HEADER
      h("div", { style: { marginBottom: "18px" } }, [
        h(
          "h2",
          { style: { margin: 0, fontSize: "20px", fontWeight: "700" } },
          "Edit Job Posting"
        ),
        h(
          "p",
          { style: { margin: "6px 0 0", color: "#555" } },
          "Update your job posting details below."
        )
      ]),

      // FORM
      h(
        "form",
        { onSubmit: submit },

        // Job Title
        h(
          "label",
          { style: { fontWeight: "600", marginBottom: "6px", display: "block" } },
          "Job Title"
        ),
        h("input", {
          style: inputStyle,
          value: title,
          onChange: (e) => setTitle(e.target.value),
          required: true
        }),

        // Category
        h(
          "label",
          { style: labelStyle },
          "Category"
        ),
        h(
          "select",
          {
            style: inputStyle,
            value: category,
            onChange: (e) => setCategory(e.target.value),
            required: true
          },
          [
            h("option", { value: "" }, "-- select a category --"),
            h("option", null, "Freelance & Digital Work"),
            h("option", null, "Tutoring & Education"),
            h("option", null, "Part-Time & Small Jobs"),
            h("option", null, "Delivery & Errands"),
            h("option", null, "Home & Household")
          ]
        ),

        // Description
        h("label", { style: labelStyle }, "Description"),
        h("textarea", {
          style: { ...inputStyle, height: "90px" },
          value: description,
          onChange: (e) => setDescription(e.target.value),
          required: true
        }),

        // Location
        h("label", { style: labelStyle }, "Location"),
        h(
          "select",
          {
            style: inputStyle,
            value: city,
            onChange: (e) => setCity(e.target.value),
            required: true
          },
          [
            h("option", { value: "" }, "-- select a city --"),
            h("option", null, "Algiers"),
            h("option", null, "Oran"),
            h("option", null, "Constantine"),
            h("option", null, "Annaba"),
            h("option", null, "Remote")
          ]
        ),

        // Contact Email
        h("label", { style: labelStyle }, "Contact Email"),
        h("input", {
          style: inputStyle,
          type: "email",
          value: contactEmail,
          onChange: (e) => setContactEmail(e.target.value)
        }),

        // Phone
        h("label", { style: labelStyle }, "Contact Phone"),
        h("input", {
          style: inputStyle,
          value: contactPhone,
          onChange: (e) => setContactPhone(e.target.value)
        }),

        // Status
        h("label", { style: labelStyle }, "Status"),
        h(
          "select",
          {
            style: { ...inputStyle, marginBottom: "16px" },
            value: status,
            onChange: (e) => setStatus(e.target.value)
          },
          [
            h("option", null, "Active"),
            h("option", null, "Inactive"),
            h("option", null, "Closed")
          ]
        ),

        // BUTTONS
        h(
          "div",
          { style: { display: "flex", justifyContent: "flex-end", gap: "10px" } },
          [
            h(
              "button",
              {
                type: "button",
                onClick: onCancel,
                style: {
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  cursor: "pointer"
                }
              },
              "Cancel"
            ),
            h(
              "button",
              {
                type: "submit",
                style: {
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: "pointer"
                }
              },
              "Save Changes"
            )
          ]
        )
      )
    )
  );
}

const labelStyle = {
  fontWeight: "600",
  marginBottom: "6px",
  display: "block"
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  marginBottom: "12px",
  background: "#f3f6ff"
};
