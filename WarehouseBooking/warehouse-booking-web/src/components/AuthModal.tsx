import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal = ({ onClose }: AuthModalProps) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password, fullName, phoneNumber: phoneNumber || undefined });
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary btn-block" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="link-button">
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="link-button">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
