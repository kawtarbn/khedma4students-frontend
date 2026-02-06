import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getRequestById } from "../api"; // API call

export default function JobDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: ""
  });

  // Determine user role
  const isStudent = !!localStorage.getItem("studentId");
  const isEmployer = !!localStorage.getItem("employerId");
  const userRole = isStudent ? "student" : isEmployer ? "employer" : "guest";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load request data
  useEffect(() => {
    setLoading(true);
    setError(null);
    getRequestById(id)
      .then(res => setRequest(res.data))
      .catch(() => setError("Service not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle sending message
  const handleSendMessage = () => {
    // Simple validation
    if (!form.fullname || !form.email || !form.message) {
      alert("Please fill all required fields!");
      return;
    }

    // Create hiring message data
    const hiringData = {
      student_id: request.student_id,
      employer_id: localStorage.getItem("employerId"),
      service_id: request.id,
      employer_name: form.fullname,
      employer_email: form.email,
      employer_phone: form.phone,
      message: form.message,
      service_title: request.title
    };

    // Send hiring request to backend
    fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/hiring-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hiringData),
    }).then(res => {
      console.log("Hiring request sent:", res.data);
      
      // Create notification for student
      const notificationData = {
        student_id: request.student_id,
        employer_id: localStorage.getItem("employerId"),
        title: '🎉 Congratulations! You\'ve Been Hired!',
        description: `${form.fullname} from ${form.email} wants to hire you for: ${request.title}. Message: ${form.message}`,
        type: 'hiring_notification',
        is_read: false
      };

      // Create notification for student
      fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      }).then(res => {
        console.log("Student notification created:", res.data);
        alert("Hiring request sent successfully! The student has been notified and will contact you soon.");
      }).catch(err => {
        console.error('Failed to create student notification:', err);
        alert("Hiring request sent, but notification failed. Student may not be notified immediately.");
      });
    }).catch(err => {
      console.error('Failed to send hiring request:', err);
      alert("Failed to send hiring request. Please try again.");
    });

    // Replace this with your actual API call later
    console.log("Sending message to student:", {
      studentId: request.student_id,
      serviceId: request.id,
      ...form
    });

    setForm({ fullname: "", email: "", phone: "", message: "" });
    setShowModal(false);
  };

  if (loading) return <><Header /><main className="loading-page"><p>Loading...</p></main><Footer /></>;
  if (error || !request) return <><Header /><main className="loading-page"><p>{error || "Service not found"}</p><Link to="/StudentServices" className="a">← Back to Services</Link></main><Footer /></>;

  return (
    <div>
      <Header />

      <section className="container2">
        <div className="main-content">
          <Link to="/StudentServices" className="back-link">
            ← Back to listings
          </Link>

          <div className="job-details">
            <div className="job-header">
              <h2>{request.title}</h2>
              <span className="posted">Posted by Student</span>
            </div>

            <div className="job-meta">
              <div>
                <img src="/media/location.png" alt="" /> {request.city}
              </div>
            </div>

            <h3>Job Description</h3>
            <p>{request.description}</p>

            <hr />
            <h3>Category</h3>
            <span className="categorymm">{request.category}</span>

            <hr />
            <h3>Availability</h3>
            <div className="availability">{request.availability}</div>

            <hr />
            <h3>Posted By</h3>
            <div className="posted-by">Student</div>
          </div>

          {/* CONTACT CARD */}
          <aside className="contact-card">
            <h3>Contact Information</h3>
            <p>{request.contactEmail}</p>
            <p>{request.contactPhone}</p>

            {userRole === "guest" && (
              <button className="login-btn" disabled>
                Login to Continue
              </button>
            )}

            {userRole === "employer" && (
              <button
                className="login-btn"
                onClick={() => setShowModal(true)}
              >
                Hire Student
              </button>
            )}
          </aside>
        </div>
      </section>

      {/* MODAL */}
      {showModal && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modalcontent">
            <div className="form-box">
              <button className="a" onClick={() => setShowModal(false)}>
                &times;
              </button>
              <h2 className="h2m">Hire Student</h2>

              <form onSubmit={e => e.preventDefault()}>
                <label className="label">Your Name</label>
                <input
                  className="input"
                  type="text"
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                />

                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />

                <label className="label">Phone Number</label>
                <input
                  className="input"
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                <label className="label">Message</label>
                <textarea
                  className="textarea"
                  name="message"
                  rows="4"
                  placeholder="Write your message..."
                  value={form.message}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="submit-btn"
                  onClick={handleSendMessage}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
