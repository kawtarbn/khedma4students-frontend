import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import CategoriesSection from "../components/CategoriesSection";
import WhyUsSection from "../components/WhyUsSection";
import StartSection from "../components/StartSection";
import SuccessStories from "../components/SuccessStories";

const PublicHome = () => {
  return (
    <main>
      <Header />
      <HeroSection />
      <CategoriesSection />
      <WhyUsSection />
      <StartSection />
      <SuccessStories />
      <Footer />
    </main>
  );
};

export default PublicHome;
