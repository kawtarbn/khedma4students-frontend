import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ApplyModal from "../components/ApplyModal";
import { getJobById } from "../api";

export default function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [open, setOpen] = useState(false);

  const isStudent = !!localStorage.getItem("studentId");
  const isEmployer = !!localStorage.getItem("employerId");
  const userRole = isStudent ? "student" : isEmployer ? "employer" : "guest";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle application submission
  const handleSubmitApplication = (newApplication) => {
    console.log("New application received:", newApplication);
    // You could also update local state or show a success message
    alert("Application submitted successfully!");
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    getJobById(id)
      .then(res => setJob(res.data))
      .catch(() => setError("Job not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Header /><main className="loading-page"><p>Loading...</p></main><Footer /></>;
  if (error || !job) return <><Header /><main className="loading-page"><p>{error || "Job not found"}</p><Link to="/jobs" className="a">← Back to Jobs</Link></main><Footer /></>;

  return (
    <>
      <Header />

      <div className="X">
        <div className="S">
          <Link to="/jobs" className="a">
            <h3 className="h3d">← Back to listings</h3>
          </Link>

          <div className="homem2">
            <div className="text1">
              <h3>{job.title}</h3>
              <h5 className="btnm">Posted by Employer</h5>
            </div>

            <div className="job-info">
              <span className="info-item">📍 {job.city}</span>
            </div>

            <h3>Job Description</h3>
            <p>{job.description}</p>

            <h3>Category</h3>
            <h5 className="b">{job.category}</h5>
          </div>
        </div>

        <div className="card">
          <h3>Contact Information</h3>
          <p className="email2">{job.contactEmail}</p>

          {userRole === "guest" && (
            <button className="login-btnn" disabled>
              Login to Continue
            </button>
          )}

          {userRole === "student" && (
            <div className="wrapper">
              <button className="apply-btn" onClick={() => setOpen(true)}>
                Apply Now
              </button>
            </div>
          )}
        </div>
      </div>

      {open && <ApplyModal onClose={() => setOpen(false)} job={job} onSubmitApplication={handleSubmitApplication} />}
      <Footer />
    </>
  );
}
