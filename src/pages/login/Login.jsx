import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../global-components/Button/Button';
import Input from '../../global-components/Input/Input';
import BrandLogo from '../../global-components/BrandLogo/BrandLogo';
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
      await login({ email, password });
    } catch (err) {
      if (!err.response || err.response.status === 404 || err.response.status >= 500) {
        setError('The server is currently unavailable.');
      } else {
        const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-container">
      <section className="login-card-layout" aria-label="WPS sign in">
        <div className="login-form-panel">
          <div className="login-form-brand">
            <BrandLogo size="sm" />
            <span className="login-secure-label">Secure workspace</span>
          </div>

          <div className="login-form-header">
            <span className="login-eyebrow">Warehouse Production System</span>
            <h1 className="form-title">Welcome back</h1>
            <p className="form-subtitle">Sign in to manage your warehouse operations.</p>
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
              autoComplete="email"
              required
            />

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              required
              rightElement={(
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              )}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              className="login-submit-btn"
            >
              Sign In to Terminal
            </Button>
          </form>

          <div className="login-footer">
            <p>© 2026 WPS (Warehouse Production System).</p>
          </div>
        </div>

        <aside className="login-visual-panel">
          <div className="visual-overlay" />
          <div className="visual-content">
            <BrandLogo size="lg" variant="inverse" />
            <div className="visual-message">
              <span className="visual-kicker">Operations, connected</span>
              <h2>Keep every<br />movement in sync.</h2>
              <p>One calm workspace for production, inventory, and delivery teams.</p>
            </div>
            <div className="visual-status">
              <span className="visual-status-dot" />
              <span>Warehouse network ready</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Login;
