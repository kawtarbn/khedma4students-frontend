import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <span className="badge">Employer</span>

      <h3>{job.title}</h3>

      <p className="location">
        📍 {job.city}
      </p>

      <p className="desc">{job.description}</p>

      <div className="tags">{job.category}</div>

      <hr />

      <div className="L">
        <span className="author">👤 {job.employer?.company_name || job.employer?.full_name || 'Employer'}</span>
        <Link to={`/jobs/${job.id}`} className="btn">
          View Details
        </Link>
      </div>
    </div>
  );
}
