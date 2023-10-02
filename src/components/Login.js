import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './Login.css';
import { useStateContext } from './contexts/ContextProvider';

const Login = () => {

  const navigate = useNavigate();
  
  const {
    setIsLoggedIn,
    userData,
    setUserData
  } = useStateContext();


  const [cred, setCred] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCred({ ...cred, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ ...userData, username: cred.username });
    console.log(cred)
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              id='username'
              name='username'
              value={cred.username}
              onChange={handleChange}
              placeholder='Enter your username'
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              id='password'
              name='password'
              value={cred.password}
              onChange={handleChange}
              placeholder='Enter your password'
              required
            />
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
