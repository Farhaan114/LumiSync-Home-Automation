import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      // Assuming response data contains both token and userId
      const { token, userId } = response.data;

      if (token && userId) {
        // Store token and userId in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        
        // Display success message and navigate after a short delay
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/iot'); 
        }, 2000); 
      } else {
        toast.error('Login failed! Please check your credentials.'); 
      }
    } catch (error) {
      console.error(error); 
      toast.error('Invalid Credentials!'); 
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <button type="submit">Login</button>
      </form>
      <a href='/register'>
        New User? Register here.
      </a>
      <ToastContainer />
    </div>
  );
};

export default Login;
