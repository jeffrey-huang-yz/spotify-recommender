import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider, { Range } from 'rc-slider';
import "rc-slider/assets/index.css";
import './Popup.scss';
import { IoMdClose } from "react-icons/io";

const Popup = ({
  onClose,
  min,
  max,
  userMin,
  userMax,
  targetValue,
  buttonId,
  id
}) => {
  const [sliderValues, setSliderValues] = useState([userMin, userMax]);
  const [targetValues, setTargetValue] = useState(targetValue);
  const [userId, setUserId] = useState(id);
  const [forceUpdateFlag, setForceUpdateFlag] = useState(false); // New state variable

  useEffect(() => {
    setSliderValues([userMin, userMax]);
    setTargetValue(targetValue);
    setUserId(id);

  }, [userMin, userMax, targetValue, id]);

  const handleSliderChange = (newUserMin, newUserMax) => {
    setSliderValues(newUserMin, newUserMax);
    console.log('sliderValues:', sliderValues);
  };

  const handleTargetValueChange = value => {
    setTargetValue(value);
  };

  const handleSave = async () => {
    const updatedButtonData = {
      userMin: sliderValues[0],
      userMax: sliderValues[1],
      targetValue: targetValues,
    };
  
    try {
      const response = await axios.put(`https://diskovery.onrender.com/googleusers/${id}/${buttonId}`, updatedButtonData, { withCredentials: true });
  
      if (response.status === 200) {
        console.log('User updated successfully');
        setSliderValues([sliderValues[0], sliderValues[1]]);
        setTargetValue(targetValues);
        setForceUpdateFlag(prev => !prev); // Toggle the flag to trigger re-render
      } else {
        console.error('Error updating user:', response.data.error);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{buttonId}</h2>
          <IoMdClose size="30px" onClick={onClose} className='close-button' style={{ marginBottom: '10px' }}/>
        </div>
        <div>
          <Slider range
            min={min}
            max={max}
            step={0.01}
            value={sliderValues}
            onChange={handleSliderChange}
          />
          <div className='slider-value-text-container'>
            <div>
              <span>Min: {sliderValues[0]}</span>
            </div>
            <div>
              <span>Max: {sliderValues[1]}</span>
            </div>
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
          <div className='target-text'>
            <span>Target Value: {targetValues}</span>
          </div>
          <button onClick={handleSave} className='save-button'>Save</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
