import React from "react";
import EditRequestForm from "../components/EditRequestForm";
import { useNavigate } from "react-router-dom";

export default function EditRequestPage() {
  const navigate = useNavigate();

  const sampleRequest = {
    id: 1, // use real request ID
    title: "Looking for a math tutor",
    category: "Tutoring & education",
    city: "Algiers",
    description: "I need help in Algebra and Calculus",
    pay: "5000 DZD/hour",
    availability: "Mon-Fri 2PM-6PM",
  };

  const handleSave = (updated) => {
    console.log("Saved Request:", updated);
    navigate("/requests"); // redirect to list page
  };

  const handleCancel = () => {
    console.log("Edit cancelled");
    navigate("/stdashboard1"); // redirect to student dashboard
  };

  return <EditRequestForm request={sampleRequest} onSave={handleSave} onCancel={handleCancel} />;
}
