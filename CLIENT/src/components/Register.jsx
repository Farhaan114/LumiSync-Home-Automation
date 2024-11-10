import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateUser = (input) => {
    // Regex for username
    const regex = /^[a-zA-Z0-9._-]{3,}$/; // Minimum 3 characters long
    return regex.test(input);
  };

  const validatePw = (input) => {
    // Regex for password
    const regex = /^[a-zA-Z0-9._-]{8,}$/; // Minimum 8 characters long
    return regex.test(input);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate username and password
    if (!validateUser(username)) {
      toast.error('Username must be at least 3 characters long and can include letters, numbers, and ._- only.');
      return;
    }

    if (!validatePw(password)) {
      toast.error('Password must be at least 8 characters long and can include letters, numbers, and ._- only.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        username,
        password,
      });
      toast.success(response.data.message);
      setUsername('');
      setPassword('');
      
      setTimeout(() => {
        navigate('/')
      }, 2000); 
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error); 
      } else {
        toast.error('An error occurred. Please try again later.'); 
      }
    }
  };

  return (
    
    <div className='form-container'>
        <ToastContainer />
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        
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
        <button type="submit">Register</button>
      </form>
      <a href='/'>Already have an account? Login here.</a>
      
    </div>
  );
};

export default Register;
