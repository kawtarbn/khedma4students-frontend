import { Link } from "react-router-dom";
import React from "react";
const ReasonCard = ({ img, title, text, className }) => {
  return (
    <div className="reason">
      <img src={img} alt={title} className={className} />
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

export default ReasonCard;
