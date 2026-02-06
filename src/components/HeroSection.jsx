import React from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="home">
      <div className="welcome"  style={{ backgroundImage: "url('/media/background.jpg')" }}>
        <h1>Turn your potential into purpose</h1>

        <p>
          Don't wait for opportunity <br />
          make it happen with Khedma4Student
        </p>

        <div className="add">
          <Link to="/PostJob" className="addjob" id="addjob">
            Post a Job
          </Link>

          <Link to="/PostRequest" className="addrequest" id="addrequest">
            Add a Request
          </Link>

          {/* <Link  to="/edit1"  className="addrequest">edit job </Link> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
