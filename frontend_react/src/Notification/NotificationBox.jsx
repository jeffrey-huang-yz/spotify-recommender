import React from 'react';
import './NotificationBox.scss'
const NotificationBox = ({ visible, text }) => {

  return (
    <>
      {visible && <div className={`notification-box ${visible ? 'visible' : '' }`}>{text}</div>}
    </>
  );
};

export default NotificationBox;
