import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.scss';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    alert('Login successful!');
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Sign In</h1>
        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form-group">
            <label className="login__form-label">Username</label>
            <input
              type="text"
              className="login__form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="login__form-group">
            <label className="login__form-label">Password</label>
            <input
              type="password"
              className="login__form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="login__error">{error}</div>}
          <button type="submit" className="login__submit">Sign In</button>
        </form>
        <div className="login__footer">
          <span>Don't have an account?</span>
          <Link to="/register" className="login__link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 