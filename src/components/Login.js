import React, { useState } from 'react';
import './Login.css';

const Login = () => {
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
    console.log(cred)
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
