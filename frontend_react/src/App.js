import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Callback from './components/Callback/Callback'; 
import SearchResults from './components/SearchResults';
import GoogleAuth from './components/GoogleAuth';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GoogleAuth />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/callback" element={<Callback />} /> 
  
      </Routes>
    </Router>
  );
};

export default App;
