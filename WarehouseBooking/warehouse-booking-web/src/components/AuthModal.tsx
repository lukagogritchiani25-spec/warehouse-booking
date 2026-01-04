import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal = ({ onClose }: AuthModalProps) => {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
        onClose();
      } else {
        await register({
          email,
          password,
          firstName,
          lastName,
          phoneNumber: phoneNumber || undefined
        });
        setRegistrationSuccess(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('auth.authFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    onClose();
    navigate('/forgot-password');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {registrationSuccess ? (
            <div className="success-message-container">
              <div className="success-icon-large">✓</div>
              <h3>{t('auth.registrationSuccess')}</h3>
              <p>
                {t('auth.verificationEmailSent')} <strong>{email}</strong>
              </p>
              <p className="info-text">
                {t('auth.checkInbox')}
              </p>
              <button onClick={onClose} className="btn-primary">
                {t('auth.gotIt')}
              </button>
              <style>{`
                .success-message-container {
                  text-align: center;
                  padding: 20px;
                }
                .success-icon-large {
                  width: 80px;
                  height: 80px;
                  background: #10b981;
                  color: white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 48px;
                  margin: 0 auto 20px;
                }
                .success-message-container h3 {
                  font-size: 24px;
                  color: #1f2937;
                  margin-bottom: 15px;
                }
                .success-message-container p {
                  color: #6b7280;
                  margin-bottom: 15px;
                  line-height: 1.6;
                }
                .info-text {
                  font-size: 14px;
                  color: #9ca3af;
                  margin-bottom: 25px !important;
                }
                .forgot-password-link {
                  text-align: center;
                  margin-top: 15px;
                }
              `}</style>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="auth-form">
                {mode === 'register' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="firstName">{t('auth.firstName')}</label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="John"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">{t('auth.lastName')}</label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Doe"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label htmlFor="email">{t('auth.email')}</label>
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
                    <label htmlFor="phoneNumber">{t('auth.phoneNumber')}</label>
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
                  <label htmlFor="password">{t('auth.password')}</label>
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
                  {loading ? t('auth.pleaseWait') : mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}
                </button>

                {mode === 'login' && (
                  <div className="forgot-password-link">
                    <button onClick={handleForgotPassword} className="link-button">
                      {t('auth.forgotPassword')}
                    </button>
                  </div>
                )}
              </form>

              <div className="auth-switch">
                {mode === 'login' ? (
                  <p>
                    {t('auth.dontHaveAccount')}{' '}
                    <button onClick={() => setMode('register')} className="link-button">
                      {t('auth.signUp')}
                    </button>
                  </p>
                ) : (
                  <p>
                    {t('auth.alreadyHaveAccount')}{' '}
                    <button onClick={() => setMode('login')} className="link-button">
                      {t('auth.signIn')}
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
