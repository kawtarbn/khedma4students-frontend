import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RatingForm from "../components/RatingForm";

export default function RatingPage() {
  return (
    <>
      <Header />
      <main className="main-rating">
        <div className="rating-container">
          <div className="rating-header">
            <h1>Leave a Rating</h1>
            <p>Share your experience with the community</p>
          </div>

          <div className="rating-form-container">
            <RatingForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
