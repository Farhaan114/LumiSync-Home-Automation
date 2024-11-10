// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Iot from './components/Iot'; // Import Iot component

// Private route component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />; // Redirect to login if no token
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login page at root path */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
        <Route path="/iot" element={<PrivateRoute><Iot /></PrivateRoute>} /> {/* Protected Iot route */}
      </Routes>
    </Router>
  );
};

export default App;
