import React, { useState } from 'react';
import { X, Lock, User, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { authService } from '../api/mediaService';

export default function AuthModal({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await authService.login({ username, password });
        onAuthSuccess(res.token, res.user);
      } else {
        const res = await authService.register({ username, email, password });
        onAuthSuccess(res.token, res.user);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === 'string') setError(data);
        else if (data.error) setError(data.error);
        else if (data.username) setError(`Username: ${data.username.join(' ')}`);
        else if (data.password) setError(`Password: ${data.password.join(' ')}`);
        else setError('Authentication failed. Please check your credentials.');
      } else {
        setError('Network error. Make sure the backend server is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authService.login({ username: 'demo', password: 'demo1234' });
      onAuthSuccess(res.token, res.user);
      onClose();
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Could not log in as demo user. Try creating a new account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <h2 className="modal-title">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="modal-subtitle">
              {mode === 'login'
                ? 'Sign in to access your synchronized movie watchlist'
                : 'Join CineTrack to track movies, TV shows, and ratings'}
            </p>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Demo Login Option */}
        <div className="demo-login-banner">
          <div className="demo-text">
            <Sparkles size={16} className="demo-star" />
            <span>Want to test immediately?</span>
          </div>
          <button
            type="button"
            className="btn-demo-quick"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            ⚡ 1-Click Demo Login
          </button>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="auth-username">
              <User size={13} /> Username
            </label>
            <input
              id="auth-username"
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">
                <Mail size={13} /> Email Address (Optional)
              </label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">
              <Lock size={13} /> Password
            </label>
            <input
              id="auth-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn-auth-submit"
              disabled={isLoading}
            >
              {isLoading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Watchlist'
                : 'Create Free Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
