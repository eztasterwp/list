import React, { useEffect } from 'react';
import './Notification.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Устанавливаем время на 2 секунды

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification">
      <div className="notification-content">
        <FontAwesomeIcon icon={faCheckCircle} className="notification-icon success" />
        <span className="notification-text">{message}</span>
        <FontAwesomeIcon icon={faTimes} className="notification-close" onClick={onClose} />
      </div>
    </div>
  );
}

export default Notification;
