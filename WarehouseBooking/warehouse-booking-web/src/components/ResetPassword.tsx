import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [validLink, setValidLink] = useState(true);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setValidLink(false);
      setMessage('Invalid password reset link. Please request a new one.');
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid reset link');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await authApi.resetPassword({
        email,
        token,
        newPassword: password
      });

      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Password reset successfully!');
        // Redirect to homepage after 3 seconds
        setTimeout(() => navigate('/'), 3000);
      } else {
        setStatus('error');
        setMessage(response.message || 'Failed to reset password');
      }
    } catch (error: unknown) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to reset password. The link may have expired.'
      );
    }
  };

  if (!validLink) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="error-icon">✕</div>
          <h2>Invalid Link</h2>
          <p className="error-message">{message}</p>
          <button onClick={() => navigate('/forgot-password')} className="btn-primary">
            Request New Reset Link
          </button>
          <button onClick={() => navigate('/')} className="btn-outline">
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>
        <p className="subtitle">Enter your new password below</p>

        {status === 'success' ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Password Reset Successful!</h3>
            <p>{message}</p>
            <p className="redirect-message">Redirecting you to homepage...</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go to Homepage Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reset-password-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={6}
                disabled={status === 'loading'}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                minLength={6}
                disabled={status === 'loading'}
              />
            </div>

            {status === 'error' && (
              <div className="error-message">
                <span className="error-icon">⚠</span>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .reset-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .reset-password-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .reset-password-card h2 {
          font-size: 28px;
          color: #1f2937;
          margin-bottom: 10px;
          text-align: center;
        }

        .subtitle {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 30px;
          text-align: center;
        }

        .reset-password-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-group input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .error-icon {
          font-size: 18px;
          width: 60px;
          height: 60px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin: 0 auto 20px;
        }

        .success-message {
          text-align: center;
        }

        .success-icon {
          width: 60px;
          height: 60px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin: 0 auto 20px;
        }

        .success-message h3 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 10px;
        }

        .success-message p {
          color: #6b7280;
          margin-bottom: 10px;
          line-height: 1.6;
        }

        .redirect-message {
          font-size: 14px;
          color: #9ca3af;
          font-style: italic;
          margin-bottom: 20px !important;
        }

        .btn-primary, .btn-outline {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #e5e7eb;
          color: #6b7280;
        }

        .btn-outline:hover {
          border-color: #667eea;
          color: #667eea;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
