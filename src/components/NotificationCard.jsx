import React from "react";

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}) {
  const handleMarkRead = (e) => {
    e.preventDefault();
    if (notification.id && onMarkAsRead && !notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (notification.id && onDelete) {
      onDelete(notification.id);
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "Just now";
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      application_received: "/media/briefcase.png",
      new_message: "/media/message.png",
      new_rating: "/media/star (1).png",
      job_expiring: "/media/exclamation.png",
      application_accepted: "/media/briefcase.png",
      rating_reminder: "/media/star (1).png",
      default: "/media/bell.png",
    };
    return iconMap[type] || iconMap.default;
  };

  return (
    <div className={`notification-card ${!notification.is_read ? 'unread' : ''}`}>
      <div className="notification-content">
        <div className="notification-header">
          <img 
            src={getNotificationIcon(notification.type)} 
            alt={notification.type || "notification"} 
            className="notification-icon"
          />
          <div className="notification-info">
            <h3 className="notification-title">{notification.title}</h3>
            <span className="notification-time">{formatTimeAgo(notification.created_at)}</span>
          </div>
          {!notification.is_read && <div className="unread-indicator" />}
        </div>
        
        <p className="notification-description">{notification.description}</p>
        
        {(onMarkAsRead || onDelete) && (
          <div className="notification-actions">
            {onMarkAsRead && !notification.is_read && (
              <button
                type="button"
                className="action-btn mark-read-btn"
                onClick={handleMarkRead}
                title="Mark as read"
                aria-label="Mark as read"
              >
                <img src="/media/read (1).png" alt="mark read" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="action-btn delete-btn"
                onClick={handleDelete}
                title="Delete"
                aria-label="Delete"
              >
                <img src="/media/delete.png" alt="delete" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

