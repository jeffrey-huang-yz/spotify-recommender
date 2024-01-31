// Popup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Popup.scss';

const Popup = ({ onClose, onRangeChange, initialMinValue, initialMaxValue, buttonId, userId }) => {
  const [minValue, setMinValue] = useState(initialMinValue);
  const [maxValue, setMaxValue] = useState(initialMaxValue);
  const [targetValue, setTargetValue] = useState((initialMinValue + initialMaxValue) / 2);

  const handleRangeChange = (event) => {
    const min = parseInt(event.target.value.split(',')[0], 10);
    const max = parseInt(event.target.value.split(',')[1], 10);
    const target = Math.min(Math.max(targetValue, min), max); // Ensure target is within the range

    setMinValue(min);
    setMaxValue(max);
    setTargetValue(target);
    onRangeChange({ min, max, target });

    axios.put(`/api/update-button/${userId}/${buttonId}`, { min, max, target })
    .then(response => {
      console.log('Button updated successfully');
    })
    .catch(error => {
      console.error('Error updating button:', error);
    });
  };

  const handleInputChange = (event) => {
    const min = parseInt(event.target.value.split(',')[0], 10);
    const max = parseInt(event.target.value.split(',')[1], 10);
    const target = Math.min(Math.max(targetValue, min), max); // Ensure target is within the range

    setMinValue(min);
    setMaxValue(max);
    setTargetValue(target);
    onRangeChange({ min, max, target });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <button className="popup-close-button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="popup-body">
          <label>
            Range: {minValue} - {maxValue}
            <input
              type="range"
              min={0}
              max={100}
              value={`${minValue},${maxValue}`}
              onChange={handleRangeChange}
            />
            <div className="target-dot" style={{ left: `${(targetValue - minValue) / (maxValue - minValue) * 100}%` }}></div>
          </label>
          <br />
          <label>
            Type Range:
            <input
              type="text"
              value={`${minValue},${maxValue}`}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Popup;
