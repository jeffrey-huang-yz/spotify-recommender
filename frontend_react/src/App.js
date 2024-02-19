import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Callback from './components/Callback/Callback'; 
import SearchResults from './components/SearchResults';
import GoogleAuth from './components/GoogleAuth';

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<GoogleAuth />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="/home" element={<Home />} exact />
        <Route path="/callback" element={<Callback />} exact /> 
      </Routes>
 
      

  );
};

export default App;
