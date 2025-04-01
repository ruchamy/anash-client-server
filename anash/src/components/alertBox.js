import React from "react";
import "./alertBox.css";

const AlertBox = ({ message, showCancel = false, onClose }) => {
  const handleConfirm = () => {
    onClose(true); // המשתמש לחץ "אישור"
  };

  const handleCancel = () => {
    onClose(false); // המשתמש לחץ "ביטול"
  };

  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <p className="alert-message">{message}</p>
        <div className="alert-buttons">
          <button className="confirm-button" onClick={handleConfirm}>
            אישור
          </button>
          {showCancel && (
            <button className="cancel-button" onClick={handleCancel}>
              ביטול
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
