import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Callback from './components/Callback/Callback'; 
import SearchResults from './components/SearchResults';
import GoogleAuth from './components/GoogleAuth';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" component={<GoogleAuth />} exact />
        <Route path="/Login" component={<Login />} exact/>
        <Route path="/Home" component={<Home />} exact/>
        <Route path="/callback" component={<Callback />} exact/> 
  
      </Routes>
    </Router>
      

  );
};

export default App;
