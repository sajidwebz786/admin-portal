import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill admin credentials for easy testing
    setFormData({
      email: 'admin@freshgrupo.com',
      password: 'Welcome@919',
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);
      const response = await authService.login(formData.email, formData.password);
      console.log('Login response:', response);

      if (response.token && response.user) {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        window.location.href = '/';
      } else {
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already authenticated
  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          <img
            src="/logo.png"
            alt="Fresh Grupo Logo"
            style={{ width: '200px', height: 'auto' }}
          />
          <br />
          <span style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>
            Admin Portal
          </span>
        </div>

        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>

            {error && (
              <div className="alert alert-danger alert-dismissible">
                <button
                  type="button"
                  className="close"
                  onClick={() => setError('')}
                >
                  ×
                </button>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-block"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt mr-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-3 text-center">
              <small className="text-muted">
                <i className="fas fa-info-circle mr-1"></i>
                Default Admin: admin@freshgrupo.com / Welcome@919
              </small>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-box {
          width: 400px;
        }
        .login-logo img {
          /* Logo shows in original colors */
        }
      `}</style>
    </div>
  );
};

export default Login;