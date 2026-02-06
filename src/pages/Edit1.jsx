import React from "react";
import EditJobForm from "../components/EditJobForm";
import { useNavigate } from "react-router-dom";

export default function Edit1() {
  const navigate = useNavigate();

  const sampleJob = {
    title: "Test Job",
    description: "This is a sample job description",
    category: "Freelance & Digital Work",
    city: "Algiers",
    contactEmail: "test@example.com",
    contactPhone: "123456789",
    status: "Active",
  };

  const handleSave = (updatedJob) => {
    console.log("Saved Job:", updatedJob);
    // Navigate back to home or jobs page
    navigate("/");
  };

  const handleCancel = () => {
    console.log("Edit Cancelled");
    navigate("/");
  };

  return <EditJobForm job={sampleJob} onSave={handleSave} onCancel={handleCancel} />;
}
