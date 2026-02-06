import React from "react";
import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <div className="card1">
      <div className="li">
        <div className="Title">
          <h3>{service.title}</h3>
        </div>
        <div className="b">
          <h3>Student</h3>
        </div>
      </div>

      <div className="info-line">
        <div className="cityn">
          <img src="/media/location.png" alt="location" />
          <h4>{service.city}</h4>
        </div>
      </div>

      <p style={{ 
        display: '-webkit-box',
        WebkitLineClamp: '3',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.4',
        maxHeight: '4.2em' // 3 lines * 1.4 line-height
      }}>
        {service.description}
      </p>
      <h4 className="categoryn">{service.category}</h4>
      <div className="availabilityn">Available: {service.availability || "Flexible"}</div>
      <hr />
      <div className="footer-card">
        <h4>{service.pay ? `Pay: ${service.pay}` : ""}</h4>
        <Link to={`/JobDetails/${service.id}`}>
          <button className="button" type="button">View Details</button>
        </Link>
      </div>
    </div>
  );
}
