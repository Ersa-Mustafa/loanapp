import React, { useState, useEffect } from "react";
import { Mail, Lock, Shield, CheckCircle, ArrowLeft, RefreshCw, Moon, Sun } from 'lucide-react';
import api from '../api/axios';

export default function ForgotPassword() {
  const [step, setStep] = useState("request"); // 'request', 'verify', 'reset', or 'done'
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isDarkMode, setIsDarkMode] = useState(() => {
          const saved = localStorage.getItem("isDarkMode");
          return saved !== null ? saved === "true" : false;
      });

  const toggleDarkMode = () => {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      localStorage.setItem("isDarkMode", newDarkMode.toString());
  };

  useEffect(() => {
    let timer;
    if (step === "verify" && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown, step]);

  useEffect(() => {
    // Apply background to body
    const bgImage = isDarkMode ? 'images/bkt-new.png' : 'images/bkt-new.png';
    const bgOverlay = isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)';

    document.body.style.background = `linear-gradient(${bgOverlay}, ${bgOverlay}), url("${bgImage}") center/cover no-repeat fixed`;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.minHeight = '100vh';

    // Also apply to html element for better coverage
    document.documentElement.style.background = `linear-gradient(${bgOverlay}, ${bgOverlay}), url("${bgImage}") center/cover no-repeat fixed`;
    document.documentElement.style.minHeight = '100vh';
  }, [isDarkMode]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      await api.post("/auth/request-reset-code", {
        email: email.trim().toLowerCase(),
      });
      setStep("verify");
      setCountdown(15);
    } catch (error) {
      setMessage(error.response?.data || "Ndonji një gabim në dërgimin e kodit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      await api.post("/auth/verify-reset-code", {
        email,
        code: code.replace(/\s+/g, ""),
      });
      setMessage("Kodi u verifikua me sukses!");
      setStep("reset");
    } catch (error) {
      setMessage(error.response?.data || "Verifikimi dështoi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Fjalëkalimet nuk përputhen.");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Fjalëkalimi duhet të jetë të paktën 6 karaktere.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        code: code.replace(/\s+/g, ""),
        newPassword,
      });
      setMessage("Fjalëkalimi u ndryshua me sukses!");
      setStep("done");
    } catch (error) {
      setMessage(error.response?.data || "Ndryshimi i fjalëkalimit dështoi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await api.post("/auth/request-reset-code", {
        email: email.trim().toLowerCase(),
      });
      setMessage("Kodi u ridërgua me sukses.");
      setCountdown(15);
    } catch (error) {
      setMessage(error.response?.data || "Kodi nuk u ridërgua dot.");
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  };

  const darkModeToggleStyle = {
    position: 'absolute',
    top: '1.5rem',
    right: '1.5rem',
    padding: '0.5rem',
    background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: isDarkMode ? '#ffffff' : '#374151',
    boxShadow: isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const cardStyle = {
    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: isDarkMode
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    transition: 'all 0.3s ease'
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem'
  };

  const logoStyle = {
      width: '100px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      marginTop: '0.5rem',
      transition: 'all 0.3s ease'
  };

  const successIconStyle = {
    width: '64px',
    height: '64px',
    background: isDarkMode
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    transition: 'all 0.3s ease'
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: isDarkMode ? '#f9fafb' : '#111827',
    margin: '0 0 0.5rem 0',
    textAlign: 'center',
    transition: 'color 0.3s ease'
  };

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    margin: 0,
    textAlign: 'center',
    lineHeight: '1.5',
    transition: 'color 0.3s ease'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const inputGroupStyle = {
    position: 'relative'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 3rem',
    border: isDarkMode ? '1px solid #374151' : '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.5)',
    color: isDarkMode ? '#f9fafb' : '#111827',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    borderColor: isDarkMode ? '#3b82f6' : '#2563eb',
    boxShadow: isDarkMode
      ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
      : '0 0 0 3px rgba(37, 99, 235, 0.1)'
  };

  const iconStyle = {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: isDarkMode ? '#9ca3af' : '#9ca3af',
    pointerEvents: 'none'
  };

  const buttonStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      background: isDarkMode
          ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
          : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '0.5rem'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    color: isDarkMode ? '#f9fafb' : '#374151',
    border: isDarkMode ? '1px solid #4b5563' : '1px solid #d1d5db'
  };

  const messageStyle = {
    padding: '0.75rem',
    borderRadius: '8px',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginTop: '1rem',
    backgroundColor: message.includes('successfully') || message.includes('sent') ?
      (isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)') :
      (isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'),
    color: message.includes('successfully') || message.includes('sent') ?
      (isDarkMode ? '#34d399' : '#059669') :
      (isDarkMode ? '#f87171' : '#dc2626'),
    border: `1px solid ${message.includes('successfully') || message.includes('sent') ?
      (isDarkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)') :
      (isDarkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')}`
  };

  const linkStyle = {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    marginTop: '1.5rem',
    transition: 'color 0.3s ease'
  };

  const linkAnchorStyle = {
    color: isDarkMode ? '#60a5fa' : '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  };

  const countdownStyle = {
    fontSize: '0.875rem',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    marginTop: '1rem',
    transition: 'color 0.3s ease'
  };

  const progressStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '0.5rem'
  };

  const progressStepStyle = (isActive, isCompleted) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isCompleted ? '#10b981' :
                    isActive ? (isDarkMode ? '#3b82f6' : '#2563eb') :
                    (isDarkMode ? '#4b5563' : '#d1d5db'),
    transition: 'all 0.3s ease'
  });

  const getStepIcon = () => {
    switch (step) {
      case 'request':
        return <Mail size={32} color="white" />;
      case 'verify':
        return <Shield size={32} color="white" />;
      case 'reset':
        return <Lock size={32} color="white" />;
      case 'done':
        return <CheckCircle size={32} color="white" />;
      default:
        return <Mail size={32} color="white" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'request':
        return 'Keni harruar fjalëkalimin?';
      case 'verify':
        return 'Shkruani kodin 6-shifror';
      case 'reset':
        return 'Vendosni fjalëkalimin e ri';
      case 'done':
        return 'Fjalëkalimi u ndryshua me sukses!';
      default:
        return 'Keni harruar fjalëkalimin?';
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 'request':
        return 'Vendosni adresën tuaj të email-it dhe do ju dërgojmë një kod 6-shifror.';
      case 'verify':
        return `Ju kemi dërguar një kod 6-shifror në adresën ${email}`;
      case 'reset':
        return 'Shkruani fjalëkalimin e ri më poshtë';
      case 'done':
        return 'Fjalëkalimi juaj u ndryshua me sukses!';
      default:
        return '';
    }
  };

  const SpinAnimation = () => (
    <style>
      {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}
    </style>
  );

  return (
    <div style={containerStyle}>
      <SpinAnimation />
      <button
        onClick={toggleDarkMode}
        style={darkModeToggleStyle}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div style={cardStyle}>
        <div style={logoContainerStyle}>
          <div style={logoStyle}>
            <img src="images/download.png" alt="Credit Card" style={{ width: 320, height: 100 }} />
          </div>
          <h2 style={titleStyle}>{getStepTitle()}</h2>
          <p style={subtitleStyle}>{getStepSubtitle()}</p>
        </div>

        {/* Progress indicator */}
        {step !== 'done' && (
          <div style={progressStyle}>
            <div style={progressStepStyle(step === 'request', ['verify', 'reset', 'done'].includes(step))} />
            <div style={progressStepStyle(step === 'verify', ['reset', 'done'].includes(step))} />
            <div style={progressStepStyle(step === 'reset', step === 'done')} />
          </div>
        )}

        {step === "request" && (
          <div style={formStyle}>
            <div style={inputGroupStyle}>
              <div style={iconStyle}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                required
                placeholder="Vendosni adresën tuaj të email-it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, {
                  borderColor: isDarkMode ? '#374151' : '#d1d5db',
                  boxShadow: 'none'
                })}
              />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleSendCode}
              style={buttonStyle}
              onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Duke u dërguar...</span>
                </>
              ) : (
                <>
                  <Mail size={16} />
                  <span>Dërgo kodin 6-shifror</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === "verify" && (
          <div style={formStyle}>
            <div style={inputGroupStyle}>
              <div style={iconStyle}>
                <Shield size={16} />
              </div>
              <input
                type="text"
                required
                placeholder="Shkruani kodin 6-shifror"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, {
                  borderColor: isDarkMode ? '#374151' : '#d1d5db',
                  boxShadow: 'none'
                })}
              />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleVerifyCode}
              style={buttonStyle}
              onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Duke verifikuar...</span>
                </>
              ) : (
                <>
                  <Shield size={16} />
                  <span>Verifiko kodin 6-shifror</span>
                </>
              )}
            </button>

            <div style={countdownStyle}>
              {countdown > 0 ? (
                <p>Ridërgo kodin në {countdown}s</p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  style={secondaryButtonStyle}
                  onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-1px)')}
                  onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
                >
                  <RefreshCw size={16} />
                  <span>Ridërgo kodin</span>
                </button>
              )}
            </div>
          </div>
        )}

        {step === "reset" && (
          <div style={formStyle}>
            <div style={inputGroupStyle}>
              <div style={iconStyle}>
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                placeholder="Vendos fjalëkalimin e ri"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, {
                  borderColor: isDarkMode ? '#374151' : '#d1d5db',
                  boxShadow: 'none'
                })}
              />
            </div>

            <div style={inputGroupStyle}>
              <div style={iconStyle}>
                <Lock size={16} />
              </div>
              <input
                type="password"
                required
                placeholder="Konfirmo fjalëkalimin e ri"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, {
                  borderColor: isDarkMode ? '#374151' : '#d1d5db',
                  boxShadow: 'none'
                })}
              />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleResetPassword}
              style={buttonStyle}
              onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Duke u ndryshuar...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Ndrysho fjalëkalimin</span>
                </>
              )}
            </button>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
              <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <p style={{
                color: isDarkMode ? '#d1d5db' : '#374151',
                fontSize: '1rem',
                margin: 0,
                transition: 'color 0.3s ease'
              }}>
                Tani mund të identifikoheni me fjalëkalimin tuaj të ri
              </p>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              style={buttonStyle}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <ArrowLeft size={16} />
              <span>Kthehu te hyrja</span>
            </button>
          </div>
        )}

        {message && (
          <div style={messageStyle}>
            {message}
          </div>
        )}

        {step !== 'done' && (
          <p style={linkStyle}>
            A e mbani mend fjalëkalimin tuaj?{' '}
            <a
              href="/"
              style={linkAnchorStyle}
              onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
            >
              Hyni këtu
            </a>
          </p>
        )}
      </div>
    </div>
  );
}