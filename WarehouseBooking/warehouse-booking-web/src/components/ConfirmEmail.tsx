import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid confirmation link. Please check your email and try again.');
        return;
      }

      try {
        const response = await authApi.confirmEmail({ token, email });
        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Email confirmed successfully!');
          // Redirect to login after 3 seconds
          setTimeout(() => navigate('/'), 3000);
        } else {
          setStatus('error');
          setMessage(response.message || 'Email confirmation failed');
        }
      } catch (error: unknown) {
        setStatus('error');
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('Email confirmation failed. The link may have expired.');
        }
      }
    };

    confirmEmail();
  }, [token, email, navigate]);

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    try {
      const response = await authApi.resendConfirmation({ email });
      if (response.success) {
        setMessage('Confirmation email sent! Please check your inbox.');
      } else {
        setMessage(response.message || 'Failed to resend confirmation email');
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="confirm-email-container">
      <div className="confirm-email-card">
        {status === 'loading' && (
          <>
            <div className="spinner"></div>
            <h2>Confirming your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Email Confirmed!</h2>
            <p>{message}</p>
            <p className="redirect-message">Redirecting you to homepage...</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Go to Homepage Now
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <h2>Confirmation Failed</h2>
            <p className="error-message">{message}</p>
            {email && (
              <div className="resend-section">
                <p>Need a new confirmation link?</p>
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="btn-secondary"
                >
                  {resending ? 'Sending...' : 'Resend Confirmation Email'}
                </button>
              </div>
            )}
            <button onClick={() => navigate('/')} className="btn-outline">
              Back to Homepage
            </button>
          </>
        )}
      </div>

      <style>{`
        .confirm-email-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .confirm-email-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .success-icon, .error-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          margin: 0 auto 20px;
          font-weight: bold;
        }

        .success-icon {
          background: #10b981;
          color: white;
        }

        .error-icon {
          background: #ef4444;
          color: white;
        }

        .confirm-email-card h2 {
          font-size: 28px;
          color: #1f2937;
          margin-bottom: 15px;
        }

        .confirm-email-card p {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .error-message {
          color: #ef4444;
          font-weight: 500;
        }

        .redirect-message {
          font-size: 14px;
          color: #9ca3af;
          font-style: italic;
        }

        .resend-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }

        .resend-section p {
          margin-bottom: 15px;
          font-size: 14px;
        }

        .btn-primary, .btn-secondary, .btn-outline {
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          width: 100%;
          margin-top: 10px;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background: #5568d3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #10b981;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #059669;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

export default ConfirmEmail;
