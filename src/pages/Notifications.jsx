import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotificationCard from "../components/NotificationCard";
import { LoadingSpinner, ErrorMessage } from "../components/Common";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = localStorage.getItem("studentId");
  const employerId = localStorage.getItem("employerId");
  const userType = studentId ? "student" : employerId ? "employer" : null;
  const userId = studentId || employerId;

  useEffect(() => {
    if (!userType || !userId) {
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications`;
        
        // Fetch notifications based on user type
        const response = await fetch(`${apiUrl}?${userType}_id=${userId}`);
        const data = await response.json();
        
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } catch (err) {
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userType, userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications/${id}/mark-read`, {
        method: 'PUT',
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications/${id}`, {
        method: 'DELETE',
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/notifications/mark-all-read?${userType}_id=${userId}`, {
        method: 'PUT',
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Header />
      <main className="notifications-main">
        <div className="notifications-container">
          <div className="notifications-header">
            <div className="header-content">
              <img src="/media/bell.png" alt="bell" className="bell-icon" />
              <h1>Notifications</h1>
            </div>
            {unreadCount > 0 && (
              <div className="unread-actions">
                <span className="unread-count">{unreadCount} unread</span>
                <button
                  className="mark-all-read-btn"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          <div className="notifications-content">
            {!userType || !userId ? (
              <div className="auth-message">
                <p>Please log in to view your notifications.</p>
              </div>
            ) : loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <img src="/media/bell.png" alt="no notifications" className="empty-icon" />
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div className="notifications-list">
                {notifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    notification={item}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
