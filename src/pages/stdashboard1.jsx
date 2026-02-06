import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EditApplicationModal from "../components/EditApplicationModal";
import {
  getStudentById,
  getStudentServices,
  getStudentApplications,
  getStudentHiringRequests,
  deleteStudent,
  deleteRequest,
} from "../api";

export default function Stdashboard1() {
  const navigate = useNavigate();
  const studentId = localStorage.getItem("studentId");
  
  console.log("=== STUDENT DASHBOARD DEBUG ===");
  console.log("Student ID from localStorage:", studentId);
  console.log("Student ID type:", typeof studentId);
  console.log("Student ID value:", studentId ? `'${studentId}'` : 'null or undefined');

  const [student, setStudent] = useState(null);
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hiringRequests, setHiringRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); // 'services', 'applications', or 'hiring-requests'
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch student info
        const studentRes = await getStudentById(studentId);
        setStudent(studentRes.data);

        // Fetch student services
        const servicesRes = await getStudentServices(studentId);
        setServices(Array.isArray(servicesRes.data.data) ? servicesRes.data.data : []);

        // Fetch student applications
        const appsRes = await getStudentApplications(studentId);
        console.log("=== STUDENT APPLICATIONS DEBUG ===");
        console.log("Student applications response:", appsRes);
        console.log("Applications data type:", typeof appsRes.data);
        console.log("Applications data:", appsRes.data);
        console.log("Is array:", Array.isArray(appsRes.data));
        console.log("Applications length:", appsRes.data?.length || 0);
        console.log("Direct data check:", appsRes.data);
        
        // Try to access the data property directly
        const applicationsData = appsRes.data?.data || [];
        console.log("Applications data from direct access:", applicationsData);
        console.log("Applications length from direct access:", applicationsData.length);
        
        setApplications(applicationsData);

        // Fetch student hiring requests - BULLETPROOF VERSION
        try {
          const hiringRes = await getStudentHiringRequests(studentId);
          console.log("=== STUDENT HIRING REQUESTS DEBUG ===");
          console.log("API Response:", hiringRes);
          console.log("Data length:", hiringRes.data?.data?.length || 0);
          
          // Multiple fallback strategies
          let hiringData = [];
          
          // Strategy 1: Try standard format
          if (hiringRes.data?.data && Array.isArray(hiringRes.data.data)) {
            hiringData = hiringRes.data.data;
          }
          // Strategy 2: Try direct data array
          else if (hiringRes.data && Array.isArray(hiringRes.data)) {
            hiringData = hiringRes.data;
          }
          // Strategy 3: Try response.data directly
          else if (Array.isArray(hiringRes)) {
            hiringData = hiringRes;
          }
          
          console.log("Final hiring data:", hiringData);
          console.log("Final hiring count:", hiringData.length);
          setHiringRequests(hiringData);
        } catch (error) {
          console.error("Hiring requests fetch failed:", error);
          setHiringRequests([]); // Always set to array to prevent crashes
        }
      } catch (err) {
        console.error(err);
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

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteRequest(serviceId);
      setServices(prev => prev.filter(service => service.id !== serviceId));
    } catch (err) {
      console.error("Delete service failed:", err.response || err);
      alert("Failed to delete service. Please try again.");
    }
  };

  const handleEditService = (serviceId) => {
    navigate(`/EditRequestPage/${serviceId}`);
  };

  const handleEditApplication = (application) => {
    setSelectedApplication(application);
    setShowEditModal(true);
  };

  const handleUpdateApplication = (updatedApplication) => {
    setApplications(prev => 
      prev.map(app => app.id === updatedApplication.id ? updatedApplication : app)
    );
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

  if (loading || !student) {
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
                  {student.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="profile-text">
                  <h2>{student.full_name}</h2>
                  <p>
                    {student.university}
                    <br />
                    {student.city}
                    <br />
                    {student.email}
                    <br />
                    {student.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="last">
              <a href={`/edit-student/${studentId}`} className="edit-btn">
                Edit
              </a>

              <button
                onClick={() => handleDelete(student.id)}
                className="edit-btn"
                style={{ backgroundColor: "red" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="stcards">
        <div className="bar1">
          <div className="ele">
            <p>
              Active Requests
              <br />
              <br />
              {services.filter((s) => s.status?.toLowerCase() === "active" || s.status?.toLowerCase() === "open").length}
            </p>
          </div>

          <div className="ele">
            <p>
              Total Requests
              <br />
              <br />
              {services.length}
            </p>
          </div>

          <div className="ele">
            <p>
              Inactive Requests
              <br />
              <br />
              {services.filter((s) => s.status?.toLowerCase() === "inactive" || s.status?.toLowerCase() === "closed").length}
            </p>
          </div>
        </div>
      </section>

      <section className="mservices">
        <div className="bar">
          <button 
            onClick={() => setActiveTab('services')}
            className={`al ${activeTab === 'services' ? 'actform' : 'choose'}`}
            style={{ border: 'none', outline: 'none' }}
          >
            <b>My services</b>
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

        {/* SERVICES SECTION */}
        {activeTab === 'services' && (
          <div className="jobs-c">
            <div className="posted-sev">
              <h2>My Posted Services</h2>
              <a href="/PostRequest" className="add-service-btn">
                + Post New Service
              </a>
            </div>

            {services.length === 0 && <p>No services posted yet.</p>}

            {services.map((service) => (
              <div className="job-c" key={service.id}>
                <div className="job-info">
                  <div className="job-title">
                    <h3>{service.title}</h3>
                    <span
                      className={`status ${
                        String(service.status || "").toLowerCase() === "active" || String(service.status || "").toLowerCase() === "open" ? "act" : "filled"
                      }`}
                    >
                      {String(service.status || "").toLowerCase() === "open" ? "Active" : 
                       String(service.status || "").toLowerCase() === "active" ? "Active" :
                       String(service.status || "").toLowerCase() === "inactive" ? "Inactive" :
                       String(service.status || "").toLowerCase() === "closed" ? "Closed" :
                       String(service.status || "").charAt(0).toUpperCase() + String(service.status || "").slice(1)}
                    </span>
                  </div>
                  <p className="job-category">{service.category}</p>
                  <div className="job-meta">
                    <span>City: {service.city}</span>
                    <span>Pay: {service.pay}</span>
                  </div>
                  <div className="job-meta">
                    <span>Posted: {new Date(service.created_at).toLocaleDateString()}</span>
                    <span>Availability: {service.availability}</span>
                  </div>
                  <div className="job-actions">
                    <button 
                      onClick={() => handleEditService(service.id)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* APPLICATIONS SECTION */}
        {activeTab === 'applications' && (
          <div className="jobs-c">
            <div className="posted-sev">
              <h2>My Applications</h2>
              <a href="/BrowseJobs" className="add-service-btn">
                Browse Jobs
              </a>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <h3>No applications yet</h3>
                <p>When you apply to jobs, they will appear here.</p>
              </div>
            ) : (
              <div>
                {applications.map((application) => (
                  <div className="application-card" key={application.id} style={{
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
                          {application.job?.title || 'Job Position'}
                        </h3>
                        <p style={{ margin: '5px 0', color: '#6b7280' }}>
                          {application.job?.company || 'Company'}
                        </p>
                      </div>
                      <span className={`status ${application.status}`} style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        backgroundColor: application.status === 'accepted' ? '#10b981' : 
                                         application.status === 'rejected' ? '#ef4444' : '#f59e0b',
                        color: '#fff'
                      }}>
                        {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                      </span>
                    </div>

                    <div className="app-details" style={{ display: 'grid', gap: '10px' }}>
                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Company</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          {application.job?.employer?.company || 'Company not specified'}
                        </p>
                      </div>

                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Job Details</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          {application.job?.description || 'No description available'}
                        </p>
                      </div>

                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Your Experience</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          {application.experience || 'No experience provided'}
                        </p>
                      </div>

                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Your Message</h4>
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          {application.message || 'No message provided'}
                        </p>
                      </div>
                    </div>

                    <div className="app-meta" style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                        <span>📅 Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                        <span style={{ marginLeft: '15px' }}>💰 {application.job?.pay_range || 'Salary not specified'}</span>
                      </div>
                      <div>
                        <button 
                          onClick={() => handleEditApplication(application)}
                          className="edit-btn"
                          style={{ marginRight: '10px', fontSize: '0.85rem', padding: '5px 12px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteApplication(application.id)}
                          className="edit-btn"
                          style={{ backgroundColor: '#ef4444', fontSize: '0.85rem', padding: '5px 12px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                <p>When employers want to hire you, their requests will appear here.</p>
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
                        {request?.service_title || request?.service?.title || request?.service_title || 'Service Request'}
                      </h3>
                      <p style={{ margin: '5px 0', color: '#6b7280' }}>
                        Employer: {request?.employer_name || request?.employer?.company || request?.employer?.full_name || 'Company Name'}
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
                      New Request
                    </span>
                  </div>

                  <div className="app-details" style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Employer Information</h4>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Name: {request?.employer_name || request?.employer?.full_name || 'N/A'}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Company: {request?.employer?.company || 'N/A'}
                      </p>
                      <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                        Email: {request?.employer_email || request?.employer?.email || 'N/A'}
                      </p>
                      {request?.employer_phone && (
                        <p style={{ margin: '0', fontSize: '0.85rem', color: '#6b7280' }}>
                          Phone: {request.employer_phone}
                        </p>
                      )}
                    </div>
                    
                    {request?.message && (
                      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#374151' }}>Message from Employer</h4>
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
                        Requested: {request?.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}
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
                      <span>📅 Received: {request?.created_at ? new Date(request.created_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => window.location.href = `mailto:${request?.employer_email || request?.employer?.email || '#'}`}
                        className="edit-btn"
                        style={{ fontSize: '0.85rem', padding: '5px 12px' }}
                      >
                        Contact Employer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {showEditModal && (
        <EditApplicationModal
          onClose={() => setShowEditModal(false)}
          application={selectedApplication}
          onUpdate={handleUpdateApplication}
        />
      )}

      <Footer />
    </>
  );
}
