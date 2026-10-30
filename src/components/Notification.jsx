
import React from 'react';

const NotificationComponent = ({ visible, message, color }) => {
  return (
    <div
      className={`notification ${visible ? 'show' : ''}`}
      style={{ '--notification-color': color }}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      {message}
    </div>
  );
};

export default NotificationComponent;
