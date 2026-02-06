import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import WhyUsSection from "../components/WhyUsSection";
import StartSection from "../components/StartSection";
import SuccessStories from "../components/SuccessStories";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const employerId = localStorage.getItem("employerId");

    // Redirect based on login status
    if (studentId) {
      navigate("/stdashboard1");
    } else if (employerId) {
      navigate("/empdash1");
    }
    // If no one is logged in, show home page
  }, []); // Empty dependency array - only run once

  return (
    <main>
      <Header />
      <HeroSection />
      <CategoriesSection />
      <WhyUsSection />
      <SuccessStories />
      <StartSection />
      <Footer />
    </main>
  );
};

export default Home;
