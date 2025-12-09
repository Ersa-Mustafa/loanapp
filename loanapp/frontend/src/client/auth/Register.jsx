import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, User, Lock, Mail, UserPlus, ArrowLeft, Moon, Sun } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
            const saved = localStorage.getItem("isDarkMode");
            return saved !== null ? saved === "true" : false;
        });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem("isDarkMode", newDarkMode.toString());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/auth/register', formData);
            toast.success('Regjistrimi u krye me sukses! Tani mund të hyni.');
            navigate('/');
        } catch (error) {
            if(error.response?.status === 400){
                toast.error(error.response.data);
            }
            toast.error("Ndodhi një gabim. Ju lutemi provoni përsëri më vonë.")
        }
    };

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

    const registerCardStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(6px)',
        borderRadius: '16px',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '450px',
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
        gap: '1.25rem'
    };

    const inputRowStyle = {
        display: 'flex',
        gap: '1rem'
    };

    const inputGroupStyle = {
        position: 'relative',
        flex: 1
    };

    const inputGroupFullStyle = {
        position: 'relative',
        width: '100%'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem 0.75rem 3rem',
        border: isDarkMode ? '1px solid #374151' : '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '0.875rem',
        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.7)',
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
        color: isDarkMode ? '#9ca3af' : '#6b7280',
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

    const backButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        border: isDarkMode ? '1px solid #374151' : '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textDecoration: 'none',
        marginBottom: '1.5rem',
        width: '120px'
    };

    return (
        <div style={containerStyle}>
            <button
                onClick={toggleDarkMode}
                style={darkModeToggleStyle}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div style={registerCardStyle}>
                <a
                    href="/"
                    style={backButtonStyle}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
                        e.target.style.color = isDarkMode ? '#f3f4f6' : '#374151';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Kthehu te hyrja</span>
                </a>

                <div style={logoContainerStyle}>
                    <div style={logoStyle}>
                      <img src="images/download.png" alt="Credit Card" style={{ width: 320, height: 100 }} />
                    </div>
                    <h2 style={titleStyle}>Krijo llogari</h2>
                    <p style={subtitleStyle}>Bashkohuni me platformën tonë të menaxhimit të kredive!</p>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputRowStyle}>
                        <div style={inputGroupStyle}>
                            <div style={iconStyle}>
                                <User size={16} />
                            </div>
                            <input
                                name="firstName"
                                placeholder="Emri"
                                value={formData.firstName}
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
                                <User size={16} />
                            </div>
                            <input
                                name="lastName"
                                placeholder="Mbiemri"
                                value={formData.lastName}
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
                    </div>

                    <div style={inputGroupFullStyle}>
                        <div style={iconStyle}>
                            <Mail size={16} />
                        </div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Adresa e email-it"
                            value={formData.email}
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

                    <div style={inputGroupFullStyle}>
                        <div style={iconStyle}>
                            <User size={16} />
                        </div>
                        <input
                            name="username"
                            placeholder="Emri i përdoruesit"
                            value={formData.username}
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

                    <div style={inputGroupFullStyle}>
                        <div style={iconStyle}>
                            <Lock size={16} />
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Fjalëkalimi"
                            value={formData.password}
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
                        <UserPlus size={16} />
                        <span>Krijo llogarinë</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;