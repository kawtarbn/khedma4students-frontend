import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";

import "./styles/responsive.css";

import { autoClearCache } from "./utils/clearAllCache";

// Auto-clear cache on app load
autoClearCache();



/* Public pages */

import Home from "./pages/Home";

import PublicHome from "./pages/PublicHome";

import StudentServices from "./pages/StudentServices";

import JobDetails from "./pages/JobDetails";





/* Student pages */

import Sign from "./pages/Sign";

import Login from "./pages/Login";

import StudentsCRUD from "./pages/StudentsCRUD";

import EditStudentProfile from "./pages/EditStudentProfile";

import Stdashboard1 from "./pages/stdashboard1";

import Stdashboard2 from "./pages/stdashboard2";



/* Employer pages */

import SignEmp from "./pages/signemp";

import EmpLogin from "./pages/emplogin";

import EmpDash1 from "./pages/empdash1";

import EmpDash2 from "./pages/empdash2";

import EditEmployerProfile from "./pages/EditEmployerProfile";



/* Job / Request pages */

import PostJob from "./pages/PostJob";

import PostRequest from "./pages/PostRequest";

import Edit1 from "./pages/Edit1";

import EditRequestPage from "./pages/EditRequestPage";

import Ratings from "./pages/Ratings";



/* Password Reset & Email Verification pages */
import StudentForgotPassword from "./pages/StudentForgotPassword";
import EmployerForgotPassword from "./pages/EmployerForgotPassword";
import StudentResetPassword from "./pages/StudentResetPassword";
import EmployerResetPassword from "./pages/EmployerResetPassword";
import StudentEmailVerification from "./pages/StudentEmailVerification";
import EmployerEmailVerification from "./pages/EmployerEmailVerification";

/* Other */

import Jobs from "./pages/Jobs";

import JobDetailsPage from "./pages/JobDetailsPage";

import Contact from "./pages/Contact";

import Notifications from "./pages/Notifications";

import NotFound from "./pages/NotFound";



/* Auth checks */

const isStudentLoggedIn = () => !!localStorage.getItem("studentId");

const isEmployerLoggedIn = () => !!localStorage.getItem("employerId");



/* Protected routes */

const StudentPrivateRoute = ({ children }) =>

  isStudentLoggedIn() ? children : <Navigate to="/" />;



const EmployerPrivateRoute = ({ children }) =>

  isEmployerLoggedIn() ? children : <Navigate to="/emplogin" />;



export default function App() {

  return (

    <Router>

      <Routes>

        {/* Public */}

        <Route path="/" element={<Home />} />

        <Route path="/Home" element={<PublicHome />} />

        <Route path="/StudentServices" element={<StudentServices />} />
        <Route path="/JobDetails/:id" element={<JobDetails />} />



        {/* Student */}
        <Route path="/sign" element={<Sign />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<StudentForgotPassword />} />
        <Route path="/reset-password" element={<StudentResetPassword />} />
        <Route path="/verify-email" element={<StudentEmailVerification />} />
        <Route
          path="/stdashboard1"
          element={

            <StudentPrivateRoute>

              <Stdashboard1 />

            </StudentPrivateRoute>

          }

        />

        <Route

          path="/stdashboard2"

          element={

            <StudentPrivateRoute>

              <Stdashboard2 />

            </StudentPrivateRoute>

          }

        />

        <Route

          path="/edit-student/:id"

          element={

            <StudentPrivateRoute>

              <EditStudentProfile />

            </StudentPrivateRoute>

          }
        />

        {/* Employer */}
        <Route path="/signemp" element={<SignEmp />} />
        <Route path="/emplogin" element={<EmpLogin />} />
        <Route path="/employer-forgot-password" element={<EmployerForgotPassword />} />
        <Route path="/employer-reset-password" element={<EmployerResetPassword />} />
        <Route path="/employer-verify-email" element={<EmployerEmailVerification />} />

        <Route
          path="/empdash1"
          element={

            <EmployerPrivateRoute>

              <EmpDash1 />

            </EmployerPrivateRoute>

          }

        />

        <Route

          path="/empdash2"

          element={

            <EmployerPrivateRoute>

              <EmpDash2 />

            </EmployerPrivateRoute>

          }

        />

        <Route

          path="/edit-employer"

          element={

            <EmployerPrivateRoute>

              <EditEmployerProfile />

            </EmployerPrivateRoute>

          }

        />



        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:id" element={<JobDetailsPage />} />

        <Route path="/Contact" element={<Contact />} />

        <Route path="/Notifications" element={<Notifications />} />



        {/* Jobs & Requests */}

        <Route path="/PostJob" element={<PostJob />} />

        <Route path="/PostRequest" element={<PostRequest />} />

        <Route path="/Edit1/:id" element={<Edit1 />} />

        <Route path="/EditRequestPage/:id" element={<EditRequestPage />} />



        {/* Admin/CRUD */}

        <Route path="/students-crud" element={<StudentsCRUD />} />

        <Route path="/Ratings" element={<Ratings />} />

      



        {/* 404 */}

        <Route path="*" element={<NotFound />} />

      </Routes>

    </Router>

  );

}

