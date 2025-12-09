import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Lock, LogIn, Moon, Sun } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("isDarkMode");
        return saved !== null ? saved === "true" : false;
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleDarkMode = () => {
       const newDarkMode = !isDarkMode;
       setIsDarkMode(newDarkMode);
       localStorage.setItem("isDarkMode", newDarkMode.toString());
   };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post('/auth/login_client', credentials);
            const { token, username, role } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            const now = new Date();
            const loginTime = now.getFullYear() + '-' +
                String(now.getMonth() + 1).padStart(2, '0') + '-' +
                String(now.getDate()).padStart(2, '0') + 'T' +
                String(now.getHours()).padStart(2, '0') + ':' +
                String(now.getMinutes()).padStart(2, '0') + ':' +
                String(now.getSeconds()).padStart(2, '0');
            localStorage.setItem("loginTime", loginTime);

            if (role === 'client') navigate('/client/home');
            else toast.error("Roli i përdoruesit i panjohur");
        } catch (err) {
            toast.error("Kredencialet e hyrjes janë të pavlefshme");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role === 'client') {
            navigate('/client/home');
        }
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

    const loginCardStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(6px)',
        borderRadius: '16px',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '3rem 2.5rem 2rem 2.5rem',
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
        transition: 'color 0.3s ease'
    };

    const forgotPasswordStyle = {
        textAlign: "left",
        fontSize: '0.875rem',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        transition: 'color 0.3s ease'
    };

    return (
        <div style={containerStyle}>
            <button
                onClick={toggleDarkMode}
                style={darkModeToggleStyle}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div style={loginCardStyle}>
                <div style={logoContainerStyle}>
                    <div style={logoStyle}>
                      <img src="images/download.png" style={{ width: 320, height: 100 }} />
                    </div>
                    <h2 style={titleStyle}>Mirë se erdhët!</h2>
                    <p style={subtitleStyle}>Hyni në llogarinë tuaj të menaxhimit të kredive</p>
                </div>

                <form onSubmit={handleLogin} style={formStyle}>
                    <div style={inputGroupStyle}>
                        <div style={iconStyle}>
                            <User size={16} />
                        </div>
                        <input
                            name="username"
                            placeholder="Emri i përdoruesit"
                            value={credentials.username}
                            onChange={handleChange}
                            required
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
                            name="password"
                            type="password"
                            placeholder="Fjalëkalimi"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, {
                                borderColor: isDarkMode ? '#374151' : '#d1d5db',
                                boxShadow: 'none'
                            })}
                        />
                    </div>

                    <button
                        type="submit"
                        style={buttonStyle}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        <LogIn size={16} />
                        <span>Hyr</span>
                    </button>
                </form>

                <div style={forgotPasswordStyle}>
                    <p>
                        <a
                            href="/forgot_password"
                            style={linkAnchorStyle}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                        >
                            Keni harruar fjalëkalimin?
                        </a>
                    </p>
                </div>

                <p style={linkStyle}>
                    Nuk keni një llogari?{' '}
                    <a
                        href="/register"
                        style={linkAnchorStyle}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        Regjistrohuni këtu
                    </a>
                </p>

                <p style={linkStyle}>
                    Jeni punonjës?{' '}
                    <a
                        href="/employee_login"
                        style={linkAnchorStyle}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        Hyni këtu
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;