import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await authApi.forgotPassword({ email });
      if (response.success) {
        setStatus('success');
        setMessage(response.message || 'Password reset instructions sent to your email');
      } else {
        setStatus('error');
        setMessage(response.message || 'Failed to send reset email');
      }
    } catch (error: unknown) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back
        </button>

        <h2>Forgot Password?</h2>
        <p className="subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {status === 'success' ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h3>Check Your Email</h3>
            <p>{message}</p>
            <p className="info-text">
              If you don't see the email, check your spam folder.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Back to Homepage
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
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
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .forgot-password-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          max-width: 450px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 16px;
          cursor: pointer;
          padding: 8px;
          transition: color 0.3s;
        }

        .back-button:hover {
          color: #667eea;
        }

        .forgot-password-card h2 {
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
          line-height: 1.6;
        }

        .forgot-password-form {
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

        .info-text {
          font-size: 14px;
          color: #9ca3af;
          margin-bottom: 20px !important;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
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
      `}</style>
    </div>
  );
};

export default ForgotPassword;
