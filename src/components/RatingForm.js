import React, { useState } from "react";
import { reviewAPI } from "../services/api";

export default function RatingForm({ onSuccess }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rating || !review.trim()) {
      setError("Please provide a rating and a review.");
      return;
    }

    const userName = localStorage.getItem("full_name");
    
    console.log("=== RATING FORM DEBUG ===");
    console.log("User name from localStorage:", userName);
    console.log("All localStorage keys:", Object.keys(localStorage));
    console.log("Role:", localStorage.getItem("role"));
    console.log("Student ID:", localStorage.getItem("studentId"));
    console.log("Employer ID:", localStorage.getItem("employerId"));
    
    if (!userName) {
      setError("You must be logged in to submit a review.");
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewAPI.create({
        rating,
        review,
        user_name: userName,
      });
      setSuccess("Review submitted successfully!");
      setRating(0);
      setReview("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rating-form" onSubmit={handleSubmit}>
      <div className="rating-stars">
        <label className="rating-label">Your Rating</label>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              className="star-button"
              onClick={() => setRating(num)}
              aria-label={`Rate ${num} stars`}
            >
              <span className={`star ${rating >= num ? 'active' : ''}`}>
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="review">Your Review</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Tell us about your experience..."
          rows="5"
          className="review-textarea"
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button 
        type="submit" 
        className="submit-button"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
