import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ApplyModal from "../components/ApplyModal";
import {
  getEmployerById,
  getEmployerJobs,
  getEmployerApplications,
  deleteEmployer
} from "../api";

export default function EmpDash2() {
  const navigate = useNavigate();
  const [employer, setEmployer] = useState({});
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employerId = localStorage.getItem("employerId");
        if (!employerId) return;

        const resEmployer = await getEmployerById(employerId);
        setEmployer(resEmployer.data);

        const resApps = await getEmployerApplications(employerId);
        console.log("Applications data:", resApps.data);
        setApplications(Array.isArray(resApps.data) ? resApps.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Callback for ApplyModal submission
  const handleNewApplication = (app) => {
    setApplications(prev => [app, ...prev]); // add new application to top
  };

  const handleAcceptApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to accept this application?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/applications/${applicationId}/accept`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }),
      });
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'accepted' }
            : app
        )
      );
      
      // Create notification for student about application status change
      const application = applications.find(app => app.id === applicationId);
      if (application && application.student_id) {
        try {
          const notificationData = {
            student_id: application.student_id,
            employer_id: null,
            title: 'Application Status Updated',
            description: `Your application for "${application.job?.title}" has been ${response.status === 200 ? 'accepted' : 'rejected'}`,
            type: 'application_status',
            is_read: false
          };

          const notificationResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData),
          });
          
          console.log("Student notification created:", notificationResponse.data);
        } catch (notificationError) {
          console.error("Failed to create student notification:", notificationError);
        }
      }

      alert("Application accepted successfully!");
    } catch (err) {
      console.error("Accept application failed:", err.response || err);
      alert("Failed to accept application. Please try again.");
    }
  };

  const handleRejectApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to reject this application?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/applications/${applicationId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' }),
      });
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'rejected' }
            : app
        )
      );
      
      // Create notification for student about application status change
      const application = applications.find(app => app.id === applicationId);
      if (application && application.student_id) {
        try {
          const notificationData = {
            student_id: application.student_id,
            employer_id: null,
            title: 'Application Status Updated',
            description: `Your application for "${application.job?.title}" has been ${response.status === 200 ? 'accepted' : 'rejected'}`,
            type: 'application_status',
            is_read: false
          };

          const notificationResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(notificationData),
          });
          
          console.log("Student notification created:", notificationResponse.data);
        } catch (notificationError) {
          console.error("Failed to create student notification:", notificationError);
        }
      }

      alert("Application rejected successfully!");
    } catch (err) {
      console.error("Reject application failed:", err.response || err);
      alert("Failed to reject application. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await deleteEmployer(id);

      localStorage.removeItem("employerId");
      localStorage.removeItem("role");
      localStorage.removeItem("full_name");
      window.dispatchEvent(new Event("auth-change"));
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err.response || err);
    }
  };

  if (loading) {
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
                <div className="logo-circle">{employer.company?.charAt(0)}</div>
                <div className="profile-text">
                  <h2>{employer.company}</h2>
                  <p>
                    {employer.description}<br />
                    {employer.city}<br />
                    {employer.email}<br />
                    {employer.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="last">
              <div>
                <a href="/edit-employer" className="edit-btn">Edit</a>
              </div>
              <div>
                <button
                  onClick={() => handleDelete(employer.id)}
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
              Active Jobs <br />
              <br />
              {applications.filter(app => app.job_status === "active").length}
            </p>
          </div>
          <div className="ele">
            <p>
              Total Applications <br />
              <br />
              {applications.length}
            </p>
          </div>
          <div className="ele">
            <p>
              Accepted Applications <br />
              <br />
              {applications.filter(app => app.status === "accepted").length}
            </p>
          </div>
        </div>
      </section>

      <section className="mservices">
        <div className="bar">
          <a href="/empdash1" className="al choose"><b>My Jobs</b></a>
          <a href="/empdash2" className="al actform"><b>Applications</b></a>
        </div>

        <div className="jobs-c">
          <div className="header-bar">
            <h2>Recent Applications</h2>
          </div>

          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <h3>No applications yet</h3>
              <p>When students apply to your jobs, they will appear here.</p>
            </div>
          ) : (
            applications.map((app) => (
              <div className="application-card" key={app.id}>
                <div className="app-left">
                  <div className="info">
                    <h3>
                      <span style={{ color: "#2563eb", fontSize: "1.1rem" }}>👤 {app.student_name}</span>
                      <span className={`status ${app.status}`}>{app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                    </h3>
                    <p className="applied-for">Applied for: {app.job?.title || 'Job Position'}</p>
                    <div className="extra">
                      <span className="category">Category: {app.job?.category || 'General'}</span>
                      <span className="pay">💰 {app.job?.pay_range || 'Salary'}</span>
                      <span className="date">Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="student-experience" style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "0.9rem" }}>Student's Experience:</h4>
                      <p style={{ margin: "0", fontSize: "0.85rem", color: "#666" }}>{app.experience || 'No experience provided'}</p>
                    </div>
                    <div className="job-description" style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "0.9rem" }}>Job Description:</h4>
                      <p style={{ margin: "0", fontSize: "0.85rem", color: "#666" }}>{app.job?.description || 'No description available'}</p>
                    </div>
                    <div className="application-actions" style={{ marginTop: "15px" }}>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAcceptApplication(app.id)}
                            className="edit-btn"
                            style={{ marginRight: "10px", backgroundColor: "#28a745", fontSize: "0.9rem", padding: "5px 15px" }}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleRejectApplication(app.id)}
                            className="edit-btn"
                            style={{ backgroundColor: "#dc3545", fontSize: "0.9rem", padding: "5px 15px" }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {openApplyModal && (
        <ApplyModal
          onClose={() => setOpenApplyModal(false)}
          job={selectedJob}
          onSubmitApplication={handleNewApplication}
        />
      )}

      <Footer />
    </>
  );
}
