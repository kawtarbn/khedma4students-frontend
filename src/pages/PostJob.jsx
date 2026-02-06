import React from "react";
import { Link } from "react-router-dom";
import PostJobSection from "../components/PostJobSection";
import TipsSection from "../components/TipsSection";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PostJob = () => {
  return (
    <main>
    <Header />
      
      <Link to="/" className="go-back-home">
        ← Go back Home
      </Link>

      <PostJobSection />
      <TipsSection />
      <Footer />
    </main>
  );
};

export default PostJob;
