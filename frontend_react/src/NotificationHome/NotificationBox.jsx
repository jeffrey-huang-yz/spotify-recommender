import React, {useEffect} from 'react';
import './NotificationBox.scss'
const NotificationBox = ({ visible, text }) => {
  useEffect(() => {
    // Handle any side effects or state updates based on the changes in visible prop
  }, [visible]);

  return (
    <>
      {visible && <div className={`home-notification ${visible ? 'visible' : ''}`}>{text}</div>}
    </>
  );
};

export default NotificationBox;
