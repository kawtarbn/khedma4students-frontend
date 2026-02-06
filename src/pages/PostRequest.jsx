import React from "react";
import { Link } from "react-router-dom"; 
import PostRequestSection from "../components/PostRequestSection";
import Tips2Section from "../components/Tips2Section";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Header from "../components/Header";


const PostRequest = () => {
  return (
    <main>
      {/* Go Back Home Link */}
      <Header />
      <Link to="/" className="go-back-home">
        ← Go back Home
      </Link>

      <section className="req">
        <PostRequestSection />
        <Tips2Section />
        <HowItWorks />
      </section>
      <Footer />
    </main>
  );
};

export default PostRequest;
