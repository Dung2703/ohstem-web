import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.scss';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Please enter username, email and password.');
      return;
    }
    setError('');
    alert('Register successful!');
  };

  return (
    <div className="register">
      <div className="register__container">
        <h1 className="register__title">Sign Up</h1>
        <form className="register__form" onSubmit={handleSubmit}>
          <div className="register__form-group">
            <label className="register__form-label">Username</label>
            <input
              type="text"
              className="register__form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="register__form-group">
            <label className="register__form-label">Email</label>
            <input
              type="email"
              className="register__form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="register__form-group">
            <label className="register__form-label">Password</label>
            <input
              type="password"
              className="register__form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className="register__error">{error}</div>}
          <button type="submit" className="register__submit">Sign Up</button>
        </form>
        <div className="register__footer">
          <span>Already have an account?</span>
          <Link to="/login" className="register__link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 