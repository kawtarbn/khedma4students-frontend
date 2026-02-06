import { useState } from "react";
import { submitContactForm } from "../api";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function validate() {
    const e = {};

    if (form.name.trim().length < 3)
      e.name = "Name must be at least 3 characters";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email is not valid";

    if (!form.subject || form.subject === "Select a subject")
      e.subject = "Please select a subject";

    if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitError(null);
    if (validate()) {
      setLoading(true);
      try {
        await submitContactForm(form);
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        setErrors({});
        alert("Message sent successfully!");
      } catch (err) {
        const msg = err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Failed to send message. Please try again.";
        setSubmitError(msg);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <form className="homem" onSubmit={submit}>
      <h3 className="H">Send us a Message</h3>
      <p className="H">
        Fill out the form below and we'll get back to you as soon as possible
      </p>

      <label className="H">Full Name</label>
      <input
        className="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Your name"
        style={
          errors.name
            ? { border: "2px solid red", backgroundColor: "rgba(255,0,0,0.1)" }
            : form.name
            ? { border: "2px solid green", backgroundColor: "rgba(0,255,0,0.1)" }
            : {}
        }
      />
      <div className="error-msg">{errors.name}</div>

      <label className="H">Email Address</label>
      <input
        className="text"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="your.email@example.com"
        style={
          errors.email
            ? { border: "2px solid red", backgroundColor: "rgba(255,0,0,0.1)" }
            : form.email
            ? { border: "2px solid green", backgroundColor: "rgba(0,255,0,0.1)" }
            : {}
        }
      />
      <div className="error-msg">{errors.email}</div>

      <label className="H">Subject</label>
      <select
        className="sub"
        value={form.subject}
        onChange={(e) => setForm({ ...form, subject: e.target.value })}
        style={
          errors.subject
            ? { border: "2px solid red", backgroundColor: "rgba(255,0,0,0.1)" }
            : form.subject
            ? { border: "2px solid green", backgroundColor: "rgba(0,255,0,0.1)" }
            : {}
        }
      >
        <option value="Select a subject">Select a subject</option>
        <option value="General inquiry">General inquiry</option>
        <option value="Technical support">Technical support</option>
        <option value="Feedback">Feedback</option>
        <option value="Partnership opportunity">
          Partnership opportunity
        </option>
        <option value="Other">Other</option>
      </select>
      <div className="error-msg">{errors.subject}</div>

      <label className="H">Message</label>
      <textarea
        className="msg"
        rows="4"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Tell us more about your inquiry..."
        style={
          errors.message
            ? { border: "2px solid red", backgroundColor: "rgba(255,0,0,0.1)" }
            : form.message
            ? { border: "2px solid green", backgroundColor: "rgba(0,255,0,0.1)" }
            : {}
        }
      />
      <div className="error-msg">{errors.message}</div>

      {submitError && <div className="error-msg">{submitError}</div>}

      <button className="but" type="submit" disabled={loading}>
        {loading ? "Sending..." : "✈ Send Message"}
      </button>
    </form>
  );
}
