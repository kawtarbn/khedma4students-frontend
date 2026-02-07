import React, { useEffect, useState } from "react";
import { reviewAPI } from "../services/api";

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4); // show 4 initially
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewAPI.getAll()
      .then(res => {
        console.log('Reviews API response:', res.data);
        const reviewsData = res.data || [];
        console.log('Processed reviews data:', reviewsData);
        console.log('Is array?', Array.isArray(reviewsData));
        console.log('Array length:', reviewsData.length);
        setStories(reviewsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setStories([]); // Set empty array on error
        setLoading(false);
      });
  }, []); // Empty dependency array - run only once on mount

  // Hide a card locally (temporary)
  const handleHide = (id) => {
    setStories(prev => prev.filter(story => story.id !== id));
  };

  // Show more / Show less
  const toggleShowMore = () => {
    if (visibleCount >= stories.length) {
      setVisibleCount(4); // collapse back
    } else {
      setVisibleCount(stories.length); // show all
    }
  };

  return (
    <section className="success-stories" style={{ 
      padding: "60px 20px", 
      background: "#f8f9fa"
    }}>
      {/* Only show section if there are stories */}
      {Array.isArray(stories) && stories.length > 0 && (
        <>
          <h2 style={{ 
            textAlign: "center", 
            marginBottom: "40px",
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#2c3e50",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            position: "relative"
          }}>
            Recent Reviews & Ratings
            <span style={{
              display: "block",
              fontSize: "1rem",
              fontWeight: "400",
              color: "#7f8c8d",
              marginTop: "10px"
            }}>
              Latest feedback from our community
            </span>
          </h2>
          <div className="stories-container" style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center"
          }}>
            {stories.slice(0, visibleCount).map(review => (
              <div key={review.id} className="story-card" style={{
                flex: "1 1 280px",
                maxWidth: "320px",
                background: "#ffffff",
                borderRadius: "16px",
                padding: "25px",
                boxShadow: "0 8px 25px rgba(37, 99, 235, 0.15)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                border: "1px solid rgba(37, 99, 235, 0.1)"
              }}>
                {/* Top accent bar */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #2563EB 0%, #125EFA 50%, #00A641 100%)"
                }} />
                
                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px"
                  }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "#fff"
                    }}>
                      {review.user_name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ 
                        margin: "0 0 5px 0", 
                        color: "#2c3e50",
                        fontSize: "1.1rem",
                        fontWeight: "600"
                      }}>{review.user_name}</h4>
                      <p style={{ 
                        margin: 0, 
                        color: "#6c757d", 
                        fontSize: "0.9rem",
                        fontStyle: "italic"
                      }}>Verified User</p>
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "15px"
                  }}>
                    <span style={{ 
                      color: "#ffc107", 
                      fontSize: "1.2rem",
                      marginRight: "8px"
                    }}>{'⭐'.repeat(Math.round(parseFloat(review.rating) || 0))}</span>
                    <span style={{ 
                      color: "#2c3e50", 
                      fontSize: "0.95rem",
                      fontWeight: "500"
                    }}>{review.rating}/5</span>
                  </div>

                  <p style={{ 
                    margin: "0 0 15px 0", 
                    color: "#495057",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    flex: 1
                  }}>{review.review}</p>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{
                      background: "#2563EB",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "500"
                    }}>
                      Recent Review
                    </span>
                    <span style={{
                      color: "#28a745",
                      fontSize: "0.8rem",
                      fontWeight: "500"
                    }}>
                      Verified ✓
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More / Show Less Button */}
          {stories.length > 4 && (
            <div style={{ textAlign: "center", marginTop: "30px" }}>
              <button
                onClick={toggleShowMore}
                style={{
                  padding: "12px 30px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563EB",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
                }}
              >
                {visibleCount >= stories.length ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Show nothing when no reviews exist */}
      {(!Array.isArray(stories) || stories.length === 0) && !loading && (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#6c757d"
        }}>
          <h3 style={{
            fontSize: "1.5rem",
            color: "#2c3e50",
            marginBottom: "20px"
          }}>
            No Reviews Yet
          </h3>
          <p style={{
            fontSize: "1.1rem",
            lineHeight: "1.6",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Be the first to share your experience! Our community is growing and we'd love to hear your feedback.
          </p>
        </div>
      )}
    </section>
  );
};

export default SuccessStories;
