import ReasonCard from "./ReasonCard";
import React from "react";

const WhyUsSection = () => {
  return (
    <section className="why_us">
      <h2>Why Choose Khedma4Students?</h2>
      <p>The platform built for students, by students</p>

      <div className="reasons">
        <ReasonCard
          img="/media/magnifying-glass.png"
          title="Easy Search & Filter"
          text={"Find jobs quickly by category,<br> location, or keywords"}
          className="reason-B"
        />

        <ReasonCard
          img="/media/team.png"
          title="Two-Way Posting"
          text={"Both employers and students<br> can post jobs and services"}
          className="reason-V"
        />

        <ReasonCard
          img="/media/star.png"
          title="Rating & Reviews"
          text={"Build trust with a transparent<br> rating system"}
          className="reason-B"
        />

        <ReasonCard
          img="/media/verified.png"
          title="Safe & Reliable"
          text={"Verified users and secure<br> communication"}
          className="reason-V"
        />
      </div>
    </section>
  );
};

export default WhyUsSection;
