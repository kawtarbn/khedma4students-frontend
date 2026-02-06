import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ApplyModal from "../components/ApplyModal";
import {
  getEmployerById,
  getEmployerJobs,
  getEmployerApplications,
  deleteEmployer,
  deleteJob,
  getEmployerHiringRequests
} from "../api";

export default function EmpDash1() {
  const navigate = useNavigate();
  const employerId = localStorage.getItem("employerId");
  const [employer, setEmployer] = useState({});
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hiringRequests, setHiringRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');

  // Modal state
  const [openApplyModal, setOpenApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Edit hiring request modal state
  const [editHiringModalOpen, setEditHiringModalOpen] = useState(false);
  const [editingHiringRequest, setEditingHiringRequest] = useState(null);

  // Clean up invalid localStorage data
  React.useEffect(() => {
    if (employerId === 'undefined' || employerId === 'null' || !employerId) {
      console.log("Cleaning up invalid employerId from localStorage");
      localStorage.removeItem("employerId");
      localStorage.removeItem("role");
      localStorage.removeItem("full_name");
      navigate("/emplogin");
      return;
    }
  }, [employerId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!employerId || employerId === 'undefined' || employerId === 'null') {
          console.log("Invalid employerId, redirecting to login");
          navigate("/emplogin");
          return;
        }

        // Fetch employer data
        const resEmployer = await getEmployerById(employerId);
        if (resEmployer.data && resEmployer.data.id) {
          setEmployer(resEmployer.data);
        } else {
          console.error("Invalid employer data received");
          navigate("/emplogin");
          return;
        }

        // Fetch other data (may fail, but won't stop hiring requests)
        try {
          const resJobs = await getEmployerJobs(employerId);
          console.log("=== EMPLOYER JOBS DEBUG ===");
          console.log("Jobs API Response:", resJobs);
          console.log("Jobs data length:", resJobs.data?.data?.length || 0);
          
          // Multiple fallback strategies for jobs
          let jobsData = [];
          
          // Strategy 1: Try standard format
          if (resJobs.data?.data && Array.isArray(resJobs.data.data)) {
            jobsData = resJobs.data.data;
          }
          // Strategy 2: Try direct data array
          else if (resJobs.data && Array.isArray(resJobs.data)) {
            jobsData = resJobs.data;
          }
          // Strategy 3: Try response.data directly
          else if (Array.isArray(resJobs)) {
            jobsData = resJobs;
          }
          
          console.log("Final jobs data:", jobsData);
          console.log("Final jobs count:", jobsData.length);
          setJobs(jobsData);
        } catch (err) {
          console.error("Jobs fetch failed:", err);
          setJobs([]);
        }

        try {
          const resApps = await getEmployerApplications(employerId);
          console.log("=== EMPLOYER APPLICATIONS DEBUG ===");
          console.log("Applications API Response:", resApps);
          console.log("Applications data length:", resApps.data?.data?.length || 0);
          
          // Multiple fallback strategies for applications
          let applicationsData = [];
          
          // Strategy 1: Try standard format
          if (resApps.data?.data && Array.isArray(resApps.data.data)) {
            applicationsData = resApps.data.data;
          }
          // Strategy 2: Try direct data array
          else if (resApps.data && Array.isArray(resApps.data)) {
            applicationsData = resApps.data;
          }
          // Strategy 3: Try response.data directly
          else if (Array.isArray(resApps)) {
            applicationsData = resApps;
          }
          
          console.log("Final applications data:", applicationsData);
          console.log("Final applications count:", applicationsData.length);
          setApplications(applicationsData);
        } catch (err) {
          console.error("Applications fetch failed:", err);
          setApplications([]);
        }
        
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        // If there's an error fetching data, redirect to login
        if (err.response?.status === 404 || err.response?.status === 401) {
          navigate("/emplogin");
        }
      } finally {
        setLoading(false);
      }
    };

    // Always fetch hiring requests separately
    const fetchHiringRequests = async () => {
      if (!employerId || employerId === 'undefined' || employerId === 'null') {
        console.log("Cannot fetch hiring requests - invalid employerId");
        return;
      }

      try {
        const resHiringRequests = await getEmployerHiringRequests(employerId);
        console.log("=== EMPLOYER HIRING REQUESTS DEBUG ===");
        console.log("API Response:", resHiringRequests);
        console.log("Data length:", resHiringRequests.data?.data?.length || 0);
        
        // Multiple fallback strategies
        let hiringData = [];
        
        // Strategy 1: Try standard format
        if (resHiringRequests.data?.data && Array.isArray(resHiringRequests.data.data)) {
          hiringData = resHiringRequests.data.data;
        }
        // Strategy 2: Try direct data array
        else if (resHiringRequests.data && Array.isArray(resHiringRequests.data)) {
          hiringData = resHiringRequests.data;
        }
        // Strategy 3: Try response.data directly
        else if (Array.isArray(resHiringRequests)) {
          hiringData = resHiringRequests;
        }
        
        console.log("Final hiring data:", hiringData);
        console.log("Final hiring count:", hiringData.length);
        setHiringRequests(hiringData);
      } catch (error) {
        console.error("Employer hiring requests fetch failed:", error);
        setHiringRequests([]); // Always set to array to prevent crashes
      }
    };

    // Always fetch jobs separately
    const fetchJobs = async () => {
      console.log("=== FETCHJOBS FUNCTION CALLED ===");
      console.log("Employer ID:", employerId);
      
      if (!employerId || employerId === 'undefined' || employerId === 'null') {
        console.log("Cannot fetch jobs - invalid employerId");
        return;
      }

      try {
        console.log("Making API call to getEmployerJobs...");
        const resJobs = await getEmployerJobs(employerId);
        console.log("=== EMPLOYER JOBS DEBUG ===");
        console.log("Jobs API Response:", resJobs);
        console.log("Jobs data length:", resJobs.data?.data?.length || 0);
        
        // Multiple fallback strategies for jobs
        let jobsData = [];
        
        // Strategy 1: Try standard format
        if (resJobs.data?.data && Array.isArray(resJobs.data.data)) {
          jobsData = resJobs.data.data;
          console.log("Used Strategy 1: resJobs.data.data");
        }
        // Strategy 2: Try direct data array
        else if (resJobs.data && Array.isArray(resJobs.data)) {
          jobsData = resJobs.data;
          console.log("Used Strategy 2: resJobs.data");
        }
        // Strategy 3: Try response.data directly
        else if (Array.isArray(resJobs)) {
          jobsData = resJobs;
          console.log("Used Strategy 3: resJobs array");
        } else {
          console.log("No strategy matched, data structure:", resJobs);
        }
        
        console.log("Final jobs data:", jobsData);
        console.log("Final jobs count:", jobsData.length);
        setJobs(jobsData);
      } catch (error) {
        console.error("Jobs fetch failed:", error);
        console.error("Error details:", error.response);
        setJobs([]); // Always set to array to prevent crashes
      }
    };

    // Run all fetches independently
    fetchData();
    fetchJobs();
    fetchHiringRequests();
  }, [employerId, navigate]);

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

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      console.error("Delete job failed:", err.response || err);
      alert("Failed to delete job. Please try again.");
    }
  };

  const handleDeleteHiringRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this hiring request?")) return;

    try {
      await fetch(`http://127.0.0.1:8000/api/hiring-requests/${requestId}`, {
        method: 'DELETE',
      });
      setHiringRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error("Delete hiring request failed:", err.response || err);
      alert("Failed to delete hiring request. Please try again.");
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/Edit1/${jobId}`);
  };

  const handleEditHiringRequest = (request) => {
    setEditingHiringRequest(request);
    setEditHiringModalOpen(true);
  };

  const handleUpdateHiringRequest = async (updatedRequest) => {
    try {
      // Here you would make an API call to update the hiring request
      // For now, just update the local state
      setHiringRequests(prev => 
        prev.map(req => 
          req.id === updatedRequest.id ? updatedRequest : req
        )
      );
      setEditHiringModalOpen(false);
      setEditingHiringRequest(null);
    } catch (error) {
      console.error("Failed to update hiring request:", error);
    }
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
            description: `Your application for "${application.job?.title}" has been accepted!`,
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
            description: `Your application for "${application.job?.title}" has been rejected.`,
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

  // Callback for ApplyModal submission
  const handleNewApplication = (app) => {
    setApplications(prev => [app, ...prev]); // add new application to top
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="hh22">Loading dashboard...</div>
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
                <div className="logo-circle">
                  {employer.company?.charAt(0)}
                </div>
                <div className="profile-text">
                  <h2>{employer.company}</h2>
                  <p>
                    <strong>{employer.full_name}</strong><br />
                    {employer.contact_person && `Contact: ${employer.contact_person}<br />`}
                    {employer.email}<br />
                    {employer.phone && `Phone: ${employer.phone}<br />`}
                    {employer.city}<br />
                    {employer.location && `Location: ${employer.location}<br />`}
                    {employer.description && `About: ${employer.description}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="last">
              <div>
                <a href="/edit-employer" className="edit-btn">Edit Profile</a>
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
              {Array.isArray(applications) ? applications.filter(app => app.status === "accepted").length : 0}
            </p>
            <span>Accepted Applications</span>
          </div>
          <div className="ele">
            <p>
              {Array.isArray(applications) ? applications.filter(app => app.status === "pending").length : 0}
            </p>
            <span>Pending Applications</span>
          </div>
          <div className="ele">
            <p>
              {Array.isArray(jobs) ? jobs.length : 0}
            </p>
            <span>Posted Jobs</span>
          </div>
          <div className="ele">
            <p>
              {Array.isArray(hiringRequests) ? hiringRequests.length : 0}
            </p>
            <span>Hiring Requests</span>
          </div>
        </div>
      </section>

      <section className="mservices">
        <div className="bar">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`al ${activeTab === 'jobs' ? 'actform' : 'choose'}`}
            style={{ border: 'none', outline: 'none' }}
          >
            <b>My Jobs</b>
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`al ${activeTab === 'applications' ? 'actform' : 'choose'}`}
            style={{ border: 'none', outline: 'none' }}
          >
            <b>Applications</b>
          </button>
          <button 
            onClick={() => setActiveTab('hiring-requests')}
            className={`al ${activeTab === 'hiring-requests' ? 'actform' : 'choose'}`}
            style={{ border: 'none', outline: 'none' }}
          >
            <b>Hiring Requests</b>
          </button>
        </div>

        {/* JOBS SECTION */}
        {activeTab === 'jobs' && (
          <div className="jobs-c">
            <div className="posted-sev">
              <h2>My Posted Jobs</h2>
              <a href="/PostJob" className="add-service-btn">
                + Add a Job
              </a>
            </div>

            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <h3>No jobs posted yet</h3>
                <p>Start by posting your first job to attract talented students!</p>
                <a href="/PostJob" className="add-service-btn" style={{ marginTop: '15px', display: 'inline-block' }}>
                  + Post Your First Job
                </a>
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
                  Debug: Jobs array length = {jobs.length}
                </div>
              </div>
            ) : (
              jobs.map((job, index) => (
                <div className="job-c" key={job?.id || index} style={{ position: 'relative', marginBottom: '20px' }}>
                  <div className="job-info">
                    <div className="job-title">
                      <h3>{job?.title || 'Job Title'}</h3>
                      <span
                        className={`status ${
                          String(job?.status || "").toLowerCase() === "active" ? "act" : "filled"
                        }`}
                      >
                        {String(job?.status || "").charAt(0).toUpperCase() + String(job?.status || "").slice(1)}
                      </span>
                    </div>
                    <p className="job-category">{job?.category || 'Category'}</p>
                    <div className="job-meta">
                      <span>Posted: {job?.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
                      <span>Applications: {job?.applications_count ?? 0}</span>
                    </div>
                  </div>
                  <div className="job-actions" style={{ 
                    position: 'absolute', 
                    right: '15px', 
                    top: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 10
                  }}>
                    <button 
                      onClick={() => handleEditJob(job?.id)}
                      className="edit-btn"
                      style={{ fontSize: '0.8rem', padding: '4px 8px', minWidth: '50px' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteJob(job?.id)}
                      className="delete-btn"
                      style={{ fontSize: '0.8rem', padding: '4px 8px', minWidth: '50px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* APPLICATIONS SECTION */}
        {activeTab === 'applications' && (
          <div className="jobs-c">
            <div className="posted-sev">
              <h2>My Applications</h2>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <h3>No applications yet</h3>
                <p>When students apply to your jobs, they will appear here.</p>
              </div>
            ) : (
              applications.map(app => (
                <div key={app.id} className="application-card" style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '15px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div className="app-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h3 style={{ margin: '0', color: '#1f2937', fontSize: '1.2rem' }}>
                        {app.job?.title || 'Job Position'}
                      </h3>
                      <p style={{ margin: '5px 0', color: '#6b7280' }}>
                        Applicant: {app.student?.full_name || 'Student Name'}
                      </p>
                    </div>
                    <span className={`status ${app.status}`} style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      backgroundColor: app.status === 'accepted' ? '#10b981' : 
                                       app.status === 'rejected' ? '#ef4444' : '#f59e0b',
                      color: '#fff'
                    }}>
                      {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                    </span>
                  </div>

                  <div className="app-details" style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Student Information</h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Email: {app.student?.email || 'N/A'}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Phone: {app.student?.phone || 'N/A'}
                      </p>
                    </div>

                    <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Application Details</h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Applied: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Message: {app.message || 'No message provided'}
                      </p>
                    </div>

                    <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Experience</h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        {app.experience || 'No experience provided'}
                      </p>
                    </div>
                  </div>

                  <div className="app-actions" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      <span>📅 Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                    <div>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleAcceptApplication(app.id)}
                            className="edit-btn"
                            style={{ marginRight: '10px', fontSize: '0.85rem', padding: '5px 12px', backgroundColor: '#10b981' }}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleRejectApplication(app.id)}
                            className="edit-btn"
                            style={{ backgroundColor: '#ef4444', fontSize: '0.85rem', padding: '5px 12px' }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* HIRING REQUESTS SECTION */}
        {activeTab === 'hiring-requests' && (
          <div className="jobs-c">
            <div className="posted-sev">
              <h2>My Hiring Requests</h2>
            </div>

    {hiringRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <h3>No hiring requests yet</h3>
                <p>When you hire students, your requests will appear here.</p>
                <div style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
                  Debug: Array length = {hiringRequests.length}
                </div>
              </div>
            ) : (
              hiringRequests.map((request, index) => (
                <div key={request?.id || index} className="application-card" style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '15px',
                  backgroundColor: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div className="app-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <h3 style={{ margin: '0', color: '#1f2937', fontSize: '1.2rem' }}>
                        {request?.service_title || request?.service?.title || 'Service Request'}
                      </h3>
                      <p style={{ margin: '5px 0', color: '#6b7280' }}>
                        Student: {request?.student?.full_name || 'Student Name'}
                      </p>
                    </div>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      backgroundColor: '#10b981',
                      color: '#fff'
                    }}>
                      Sent Request
                    </span>
                  </div>

                  <div className="app-details" style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Student Information</h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Name: {request?.student?.full_name || 'N/A'}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Email: {request?.student?.email || 'N/A'}
                      </p>
                      {request?.student?.university && (
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          University: {request.student.university}
                        </p>
                      )}
                    </div>
                    
                    {request?.message && (
                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Your Message</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          {request.message}
                        </p>
                      </div>
                    )}
                    
                    <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Service Information</h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Service: {request?.service_title || request?.service?.title || 'N/A'}
                      </p>
                      {request?.service?.category && (
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          Category: {request.service.category}
                        </p>
                      )}
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Sent: {request?.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="app-actions" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '15px',
                    paddingTop: '15px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      <span>📅 Sent: {request?.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleEditHiringRequest(request)}
                        className="edit-btn"
                        style={{ fontSize: '0.85rem', padding: '5px 12px', marginRight: '10px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteHiringRequest(request?.id)}
                        style={{ backgroundColor: 'red', fontSize: '0.85rem', padding: '5px 12px' }}
                        className="edit-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {editHiringModalOpen && editingHiringRequest && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Edit Hiring Request</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message:</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                value={editingHiringRequest.message || ''}
                onChange={(e) => setEditingHiringRequest({...editingHiringRequest, message: e.target.value})}
                placeholder="Enter your message to the student"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Employer Phone:</label>
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px'
                }}
                value={editingHiringRequest.employer_phone || ''}
                onChange={(e) => setEditingHiringRequest({...editingHiringRequest, employer_phone: e.target.value})}
                placeholder="Your phone number"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Employer Email:</label>
              <input
                type="email"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px'
                }}
                value={editingHiringRequest.employer_email || ''}
                onChange={(e) => setEditingHiringRequest({...editingHiringRequest, employer_email: e.target.value})}
                placeholder="Your email address"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  setEditHiringModalOpen(false);
                  setEditingHiringRequest(null);
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateHiringRequest(editingHiringRequest)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
