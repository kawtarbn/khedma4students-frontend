import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const [role, setRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Sync role state with localStorage (role, or infer from studentId/employerId)
  const updateRole = () => {
    const r = localStorage.getItem("role");
    if (r) {
      setRole(r);
      return;
    }
    if (localStorage.getItem("studentId")) {
      setRole("student");
      return;
    }
    if (localStorage.getItem("employerId")) {
      setRole("employer");
      return;
    }
    setRole(null);
  };

  useEffect(() => {
    updateRole();
    window.addEventListener("storage", updateRole);
    window.addEventListener("auth-change", updateRole);
    return () => {
      window.removeEventListener("storage", updateRole);
      window.removeEventListener("auth-change", updateRole);
    };
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [userMenuOpen]);

  // Logout function
  function logoutUser() {
    localStorage.removeItem("role");
    localStorage.removeItem("studentId");
    localStorage.removeItem("employerId");

    setRole(null);
    setUserMenuOpen(false);
    navigate("/");
  }

  return (
    <header className="header1">
      {/* Logo */}
      <div className="logo">
        <NavLink to="/Home">
          <img src="/media/logo.png" className="imgl" alt="logo" />
        </NavLink>
      </div>

      {/* Hamburger menu - Fixed with better styling */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`hamburger-icon ${menuOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`nav1 ${menuOpen ? "show" : ""}`}>
        <NavLink
          to="/Home"
          className={({ isActive }) => `ak ${isActive ? "active" : "hov"}`}
          onClick={() => setMenuOpen(false)}
        >
          <b>Home</b>
        </NavLink>

        <NavLink
          to="/jobs"
          className={({ isActive }) => `ak ${isActive ? "active" : "hov"}`}
          onClick={() => setMenuOpen(false)}
        >
          <b>Jobs</b>
        </NavLink>

        <NavLink
          to="/StudentServices"
          className={({ isActive }) => `ak ${isActive ? "active" : "hov"}`}
          onClick={() => setMenuOpen(false)}
        >
          <b>Student Services</b>
        </NavLink>

        {(role === "student" || role === "employer") && (
          <NavLink
            to="/Ratings"
            className={({ isActive }) => `ak ${isActive ? "active" : "hov"}`}
            onClick={() => setMenuOpen(false)}
          >
            <b>Ratings</b>
          </NavLink>
        )}

        <NavLink
          to="/Contact"
          className={({ isActive }) => `ak ${isActive ? "active" : "hov"}`}
          onClick={() => setMenuOpen(false)}
        >
          <b>Contact Us</b>
        </NavLink>

        <div className="line"></div>

        {/* Logged-in users */}
        {(role === "student" || role === "employer") && (
          <>
            <NavLink to="/Notifications" onClick={() => setMenuOpen(false)}>
              <img
                style={{ width: "20px", height: "20px" }}
                src="/media/notification-bell.png"
                alt="notification"
              />
            </NavLink>

            <div className="user-wrapper" onClick={(e) => e.stopPropagation()}>
              <img
                src="/media/user1.png"
                className="user-icon"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                alt="user"
              />

              {userMenuOpen && (
                <div className="correctmenu">
                  <div className="signed-as">
                    {role === "student"
                      ? "Signed in as Student"
                      : "Signed in as Employer"}
                  </div>

                  <NavLink
                    to={role === "student" ? "/stdashboard1" : "/empdash1"}
                    className="menu-link"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setMenuOpen(false);
                    }}
                  >
                    ▦ Dashboard
                  </NavLink>

                  <button onClick={logoutUser} className="menu-link logout">
                    ↩ Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Not logged-in users */}
        {!role && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => `ak ${isActive ? "active" : "hov"}`}
              onClick={() => setMenuOpen(false)}
            >
              <b>Login</b>
            </NavLink>

            <NavLink
              to="/sign"
              className={({ isActive }) => `ak ${isActive ? "active" : "hov"}`}
              onClick={() => setMenuOpen(false)}
            >
              <b>Sign Up</b>
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
