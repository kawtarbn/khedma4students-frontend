import { Link } from "react-router-dom";
import React from "react";

const StartSection = () => {
  return (
    <section className="start">
      <h2>Ready to Get Started?</h2>
      <p>Join thousands of students and employers finding opportunities every day</p>

       <Link to="/sign" className="cta">
        Create free account
      </Link> 
    </section>
  );
};

export default StartSection;
