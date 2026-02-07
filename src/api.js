import axios from "axios";

const API_URL = 'https://khedma4students-backend.onrender.com/api';

// ------------------- STUDENTS -------------------
export const getStudents = () => axios.get(`${API_URL}/students`);
export const getStudentById = (id) => axios.get(`${API_URL}/students/${id}`);
export const createStudent = (data) => axios.post(`${API_URL}/students`, data);
export const updateStudent = (id, data) => axios.put(`${API_URL}/students/${id}`, data);
export const deleteStudent = (id) => axios.delete(`${API_URL}/students/${id}`);
export const loginStudent = (email, password) =>
  axios.post(`${API_URL}/student-login`, { email, password });
export const getStudentServices = (id) => axios.get(`${API_URL}/students/${id}/services`);
export const getStudentApplications = (id) => axios.get(`${API_URL}/students/${id}/applications`);
export const getStudentHiringRequests = (id) => axios.get(`${API_URL}/hiring-requests/student/${id}`);
export const getStudentServiceApplications = (studentId) =>
  axios.get(`${API_URL}/students/${studentId}/service-applications`);

// ------------------- EMPLOYER -------------------
export const createEmployer = (data) =>
  axios.post(`${API_URL}/employers`, data);
export const loginEmployer = (email, password) =>
  axios.post(`${API_URL}/employer-login`, { email, password });
export const getEmployerById = (id) => axios.get(`${API_URL}/employers/${id}`);
export const getEmployerJobs = (id) => axios.get(`${API_URL}/employers/${id}/jobs`);
export const getEmployerApplications = (id) =>
  axios.get(`${API_URL}/employers/${id}/applications`);
export const getEmployerHiringRequests = (id) => axios.get(`${API_URL}/hiring-requests/employer/${id}`);
export const updateEmployerProfile = (id, data) =>
  axios.put(`${API_URL}/employers/${id}`, data);
export const deleteEmployer = (id) =>
  axios.delete(`${API_URL}/employers/${id}`);

// ------------------- JOBS -------------------
export const createJob = (data) => axios.post(`${API_URL}/jobs`, data);
export const updateJob = (id, data) => axios.put(`${API_URL}/jobs/${id}`, data);
export const deleteJob = (id) => axios.delete(`${API_URL}/jobs/${id}`);
export const getJobs = () => axios.get(`${API_URL}/jobs`);
export const getJobById = (id) => axios.get(`${API_URL}/jobs/${id}`);

// ------------------- SERVICES -------------------
export const getServices = () => axios.get(`${API_URL}/services`);
export const getServiceById = (id) => axios.get(`${API_URL}/services/${id}`);

// ------------------- REQUESTS -------------------
const handleAxiosError = (error) => {
  if (error.response) {
    console.error("Server responded with:", error.response.data);
    console.error("Status code:", error.response.status);
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error setting up request:", error.message);
  }
  throw error;
};

export const getRequests = async () => {
  try {
    return await axios.get(`${API_URL}/requests`);
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getRequestById = async (id) => {
  try {
    return await axios.get(`${API_URL}/requests/${id}`);
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createRequest = async (data) => {
  try {
    return await axios.post(`${API_URL}/requests`, data);
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateRequest = async (id, data) => {
  try {
    return await axios.put(`${API_URL}/requests/${id}`, data);
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteRequest = async (id) => {
  try {
    return await axios.delete(`${API_URL}/requests/${id}`);
  } catch (error) {
    handleAxiosError(error);
  }
};

// ------------------- NOTIFICATIONS -------------------
export const getNotifications = (userType, userId) =>
  axios.get(`${API_URL}/notifications`, { params: { user_type: userType, user_id: userId } });

export const markNotificationAsRead = (id, userType, userId) =>
  axios.put(`${API_URL}/notifications/${id}/read`, null, {
    params: { user_type: userType, user_id: userId },
  });

export const markAllNotificationsAsRead = (userType, userId) =>
  axios.put(`${API_URL}/notifications/read-all`, null, {
    params: { user_type: userType, user_id: userId },
  });

export const deleteNotification = (id, userType, userId) =>
  axios.delete(`${API_URL}/notifications/${id}`, {
    params: { user_type: userType, user_id: userId },
  });

// ------------------- CONTACT -------------------
export const submitContactForm = (data) =>
  axios.post(`${API_URL}/contact`, data);

// ------------------- REVIEWS -------------------
export const getReviews = () => axios.get(`${API_URL}/reviews`);
export const createReview = (data) => axios.post(`${API_URL}/reviews`, data);

// ------------------- PASSWORD RESET -------------------
export const studentForgotPassword = (email) =>
  axios.post(`${API_URL}/forgot-password`, { email });

export const studentResetPassword = (email, token, password, password_confirmation) =>
  axios.post(`${API_URL}/reset-password`, { email, token, password, password_confirmation });

export const studentResetPasswordWithCode = (email, verification_code, password, password_confirmation) =>
  axios.post(`${API_URL}/reset-password`, { email, verification_code, password, password_confirmation });

export const studentVerifyEmail = (token) =>
  axios.post(`${API_URL}/verify-email`, { token });

export const studentVerifyEmailWithCode = (email, verification_code) =>
  axios.post(`${API_URL}/verify-email`, { email, verification_code });

export const studentResendVerification = (email) =>
  axios.post(`${API_URL}/resend-verification`, { email });

export const employerForgotPassword = (email) =>
  axios.post(`${API_URL}/employer-forgot-password`, { email });

export const employerResetPassword = (email, token, password, password_confirmation) =>
  axios.post(`${API_URL}/employer-reset-password`, { email, token, password, password_confirmation });

export const employerResetPasswordWithCode = (email, verification_code, password, password_confirmation) =>
  axios.post(`${API_URL}/employer-reset-password`, { email, verification_code, password, password_confirmation });

export const employerVerifyEmail = (token) =>
  axios.post(`${API_URL}/employer-verify-email`, { token });

export const employerVerifyEmailWithCode = (email, verification_code) =>
  axios.post(`${API_URL}/employer-verify-email`, { email, verification_code });

export const employerResendVerification = (email) =>
  axios.post(`${API_URL}/employer-resend-verification`, { email });
