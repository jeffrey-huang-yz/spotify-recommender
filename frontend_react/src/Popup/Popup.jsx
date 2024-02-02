import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider, { Range } from 'rc-slider';
import "rc-slider/assets/index.css";
import './Popup.scss';
const Popup = ({
  onClose,
  min,
  max,
  userMin,
  userMax,
  targetValue,
  buttonId,
  userId
}) => {
  const [sliderValues, setSliderValues] = useState([userMin, userMax]);
  const [targetValues, setTargetValue] = useState(targetValue);
  const [defaultValues, setDefaultValues] = useState([userMin, userMax]);

  useEffect(() => {
    setSliderValues([userMin, userMax]);
    setTargetValue(targetValue);
    setDefaultValues([userMin, userMax]);
  }, [userMin, userMax, targetValue]);

  const handleSliderChange = values => {
    setSliderValues(values);
  };

  const handleTargetValueChange = value => {
    setTargetValue(value);
  };

  const handleSave = () => {
    // Save the updated values to the server
    const updatedButtonData = {
      userMin: sliderValues[0],
      userMax: sliderValues[1],
      targetValues,
    };

    axios
      .put(`http://localhost:3001/update-button/${userId}/${buttonId}`, updatedButtonData)
      .then((response) => {
        console.log('Button updated successfully');
      })
      .catch((error) => {
        console.error('Error updating button:', error);
      });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <button className="popup-close-button" onClick={onClose}>
            Close
          </button>
        </div>
        <div>
          <Slider range
            min={min}
            max={max}
            step={0.01}
            value={sliderValues}
            onChange={handleSliderChange}
            defaultValue={defaultValues}
          />
          <div>
            <span>User Min: {sliderValues[0]}</span>
            <span>User Max: {sliderValues[1]}</span>
          </div>
        </div>
        <div>
          <Slider
            min={min}
            max={max}
            step={0.01}
            value={targetValues}
            onChange={handleTargetValueChange}
          />
          <div>
            <span>Target Value: {targetValues}</span>
          </div>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
