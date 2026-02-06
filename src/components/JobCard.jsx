import React from "react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
      <div className="job-c">
        <div className="job-info">
          <div className="job-title">
            <h3>{job.title}</h3>
          </div>
          <p className="job-category">{job.category}</p>
          <div className="job-meta">
            <span>{job.city}</span>
          </div>
          <div className="job-author">
            <span>👤 {job.employer?.company_name || job.employer?.full_name || 'Employer'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
