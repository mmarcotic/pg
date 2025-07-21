import React from 'react';

const NotificationComponent = ({visible, message, color}) => {
  return (
    <div style={{backgroundColor: color}}className={`notification ${visible ? 'show' : ''}`}>
      {message}
    </div>
  );
}

export default NotificationComponent;