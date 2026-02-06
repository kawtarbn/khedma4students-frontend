// Test script to debug the reset password API call
// Run this in browser console on the reset page

import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Test the exact API call
const testResetPassword = async () => {
    try {
        console.log("🔍 Testing reset password API call...");
        
        const response = await axios.post(`${API_URL}/reset-password`, {
            email: "kawtarbenabdelmoumene@gmail.com",
            verification_code: "904083",
            password: "newpassword123",
            password_confirmation: "newpassword123"
        });
        
        console.log("✅ SUCCESS:", response.data);
    } catch (error) {
        console.log("❌ ERROR:", error.response?.data);
        console.log("🔍 Status:", error.response?.status);
        console.log("🔍 Full error:", error);
    }
};

// Run the test
testResetPassword();
