import React, { useEffect } from 'react';
import './GoogleAuth.scss';
const GoogleAuth = () => {
  const handleLogin = async (event) => {
    console.log('clicked login')
    event.preventDefault(); 
    try{
      window.location.href = 'https://diskovery.onrender.com/auth/google';
    }catch(error){
      console.error(error);
    }
  };
  return (
    <div>
      
      <div id="signals">
        <span class="signal s1"></span>
        <span class="signal s2"></span>
        <span class="signal s3"></span>
        <span class="signal s4"></span>
      </div>
      <h1 className='title'>
        <span className="purple-text">disk</span>overy
      </h1>
      <p>
      Welcome to diskovery! This website helps you discover new music based on your specific preferences. 
      <br></br>Step 1: Log in with your Google account so we can start saving your preferences.
      </p>
      <div className="google-sign-in-button" onClick={handleLogin}>
        <img
          src="https://developers.google.com/static/identity/images/branding_guideline_sample_dk_rd_lg.svg"
          alt="Sign in with Google"
        />
      </div>
    </div>
  )
}

export default GoogleAuth