import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../global-components/Button/Button';
import Input from '../../global-components/Input/Input';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      // Real authentication logic
      await login({ email, password });
    } catch (err) {
      // Extract backend error message if available
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card-layout">
        {/* Left Side: Warehouse Theme Visual Panel */}
        <div className="login-visual-panel">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <h1 className="visual-title">WPS</h1>
            <p className="visual-subtitle">Warehouse Production System</p>

          </div>
          <img
            src="/warehouse_bg.png"
            alt="Warehouse Production System Background"
            className="warehouse-visual-image"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <h2 className="form-title">Sign In</h2>
            <p className="form-subtitle">Access your production node console</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error-alert" role="alert">
                {error}
              </div>
            )}

            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder="operator@wps.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              rightElement={
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In to Terminal
            </Button>
          </form>

          <div className="login-footer">
            <p>© 2026 WPS Logistics Tech Group. Authorized Personnel Only.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
