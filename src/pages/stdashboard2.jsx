import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ApplyModal from "../components/ApplyModal";
import { getStudentById, getStudentApplications, getStudentServiceApplications, deleteStudent } from "../api";

export default function Stdashboard2() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [serviceApplications, setServiceApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openApplyModal, setOpenApplyModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching data for studentId:", studentId);
        
        const studentRes = await getStudentById(studentId);
        console.log("Student response:", studentRes.data);
        setStudent(studentRes.data);

        const appsRes = await getStudentApplications(studentId);
        console.log("Student applications response:", appsRes);
        console.log("Student applications data:", appsRes.data);
        console.log("Student applications data.data:", appsRes.data?.data);
        console.log("Applications array length:", appsRes.data?.data?.length || 0);
        setApplications(Array.isArray(appsRes.data?.data) ? appsRes.data.data : []);

        // Fetch service applications
        const serviceAppsRes = await getStudentServiceApplications(studentId);
        console.log("Student service applications response:", serviceAppsRes);
        setServiceApplications(Array.isArray(serviceAppsRes.data?.data) ? serviceAppsRes.data.data : []);
      } catch (err) {
        console.error("Error fetching student data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [studentId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await deleteStudent(id);

      localStorage.removeItem("studentId");
      localStorage.removeItem("role");
      localStorage.removeItem("full_name");
      window.dispatchEvent(new Event("auth-change"));
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err.response || err);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/applications/${applicationId}`, {
        method: 'DELETE',
      });
      setApplications(prev => prev.filter(app => app.id !== applicationId));
    } catch (err) {
      console.error("Delete application failed:", err.response || err);
      alert("Failed to delete application. Please try again.");
    }
  };

  const handleEditApplication = (application) => {
    // For now, we'll show an alert that edit functionality is coming soon
    // In a real implementation, this would open an edit form for the application
    alert(`Edit application for: ${application.title || application.job_title}\nThis feature is coming soon!`);
  };

  // Callback for ApplyModal submission
  const handleNewApplication = (app) => {
    setApplications(prev => [app, ...prev]); // add to top
  };

  if (loading || !student) {
    return (
      <>
        <Header />
        <div className="hh22">Loading applications...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <section className="stprofile">
        <div className="hh22">
          <div className="cardd">
            <div className="profile-header">
              <div className="profile-info">
                <div className="logo-circle">{student.full_name.split(" ").map(n => n[0]).join("")}</div>
                <div className="profile-text">
                  <h2>{student.full_name}</h2>
                  <p>
                    {student.major} - {student.year_of_study}<br />
                    {student.university}<br />
                    {student.email}<br />
                    {student.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="last">
              <div>
                <a href={`/edit-student/${studentId}`} className="edit-btn">Edit</a>
              </div>
              <div>
                <button
                  onClick={() => handleDelete(student.id)}
                  style={{ backgroundColor: "red" }}
                  className="edit-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stcards">
        <div className="bar1">
          <div className="ele">
            <p>
              Active Applications
              <br />
              <br />
              {[...applications, ...serviceApplications].filter((a) => a.status?.toLowerCase() === "pending").length}
            </p>
          </div>

          <div className="ele">
            <p>
              Total Applications
              <br />
              <br />
              {applications.length + serviceApplications.length}
            </p>
          </div>

          <div className="ele">
            <p>
              Accepted Applications
              <br />
              <br />
              {[...applications, ...serviceApplications].filter((a) => a.status?.toLowerCase() === "accepted").length}
            </p>
          </div>
        </div>
      </section>

      <section className="mservices">
        <div className="bar">
          <a href="/stdashboard1" className="al choose"><b>My services</b></a>
          <a href="/stdashboard2" className="al actform"><b>Applications</b></a>
        </div>

        <div className="services-container">
          <div className="header-bar">
            <h2>My Applications</h2>
            <a href="/BrowseJobs" className="edit-btn" style={{ fontSize: '0.9rem', padding: '5px 15px' }}>
              Browse Jobs
            </a>
          </div>

          {[...applications, ...serviceApplications].length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <h3>No applications yet</h3>
              <p>When you apply to jobs or services, they will appear here.</p>
              <a href="/jobs" className="browse-btn" style={{ marginTop: '15px', display: 'inline-block' }}>
                Browse Jobs
              </a>
              <a href="/StudentServices" className="browse-btn" style={{ marginTop: '15px', marginLeft: '10px', display: 'inline-block' }}>
                Browse Services
              </a>
            </div>
          ) : (
            <div style={{ marginBottom: '20px' }}>
              <a href="/BrowseJobs" className="edit-btn" style={{ fontSize: '0.9rem', padding: '5px 15px', marginBottom: '15px' }}>
                Browse Jobs
              </a>
            </div>
          )}

          {[...applications, ...serviceApplications].map(app => (
            <div key={app.id} className="application-card">
              <div className="left-section">
                <h3>
                  {app.title || app.job_title || app.service_title} <span className={`status ${app.status.toLowerCase()}`}>{app.status}</span>
                </h3>
                <p className="emp">{app.employer_name || 'Service Provider'}</p>
                <p className="date">Applied on: {new Date(app.created_at).toLocaleDateString()}</p>
                <p className="type">Type: {app.job_title ? 'Job Application' : 'Service Application'}</p>
                <div className="application-actions" style={{ marginTop: "10px" }}>
                  <button 
                    onClick={() => handleEditApplication(app)}
                    className="edit-btn"
                    style={{ marginRight: "10px", backgroundColor: "#2563EB", fontSize: "0.9rem", padding: "5px 10px" }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteApplication(app.id)}
                    className="edit-btn"
                    style={{ backgroundColor: "#dc3545", fontSize: "0.9rem", padding: "5px 10px" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {openApplyModal && (
        <ApplyModal
          onClose={() => setOpenApplyModal(false)}
          job={null}
          onSubmitApplication={handleNewApplication}
        />
      )}

      <Footer />
    </>
  );
}
