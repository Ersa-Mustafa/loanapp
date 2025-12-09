import React, { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Edit, Save, ArrowLeft, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { toast } from 'react-toastify';

function EditProfile() {
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("isDarkMode");
        return saved !== null ? saved === "true" : false;
    });
    const navigate = useNavigate();

    useEffect(() => {
    const error = sessionStorage.getItem('errorMessage');
       if (error) {
          toast.error(error);
          sessionStorage.removeItem('errorMessage');
       }
    }, []);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        // Apply background to body
        const bgImage = isDarkMode ? 'images/bkt.jpg' : 'images/bkt.jpg';
        const bgOverlay = isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)';

        document.body.style.background = `linear-gradient(${bgOverlay}, ${bgOverlay}), url("${bgImage}") center/cover no-repeat fixed`;
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.minHeight = '100vh';

        // Also apply to html element for better coverage
        document.documentElement.style.background = `linear-gradient(${bgOverlay}, ${bgOverlay}), url("${bgImage}") center/cover no-repeat fixed`;
        document.documentElement.style.minHeight = '100vh';
    }, [isDarkMode]);

    const loadProfile = async () => {
        try {
            const res = await api.get('/client/profile');
            const userData = res.data.user || {};
            const backendRole = userData.role || '';
            if (backendRole !== 'client') {
               navigate(-1, { state: { errorMessage: "Ju nuk keni një rol të tillë." } });
               return;
            }
            setForm({
                name: userData.firstName || '',
                surname: userData.lastName || '',
                email: userData.email || '',
                username: userData.username || '',
                password: ''
            });
        } catch (err) {
            toast.error("Profili nuk u ngarkua dot.");
        } finally {
          setLoading(false);
      }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem("isDarkMode", newDarkMode.toString());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const isEmptyOrWhitespace = (value) => !value || String(value).trim() === "";

        if (isEmptyOrWhitespace(form.name) ||
            isEmptyOrWhitespace(form.surname) ||
            isEmptyOrWhitespace(form.email)) {
            alert("Ju lutem plotësoni të gjitha fushat e nevojshme.");
            return;
        }

        // Optional: Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            toast.error("Ju lutem shkruani një adresë emaili të vlefshme.");
            return;
        }

        try {
            const updateData = {
                firstName: form.name,
                lastName: form.surname,
                email: form.email,
            };
            // Include password only if user entered something
            if (form.password.trim() !== '') {
                updateData.password = form.password;
            }
            await api.put('/client/profile/update', updateData);
            toast.success("Profili i përditësua me sukses!");
            navigate('/client/home');
        } catch (err) {
            toast.error("Përditësimi dështoi.");
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
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
        zIndex: 10
    };

    const profileCardStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        transition: 'all 0.3s ease'
    };

    const backButtonStyle = {
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
        padding: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
        color: isDarkMode ? '#ffffff' : '#6b7280'
    };

    const logoContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem',
        marginTop: '1rem'
    };

    const logoStyle = {
        width: '64px',
        height: '75px',
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
        transition: 'color 0.3s ease'
    };

    const formStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    };

    const inputRowStyle = {
        display: 'flex',
        gap: '1rem'
    };

    const inputGroupStyle = {
        position: 'relative',
        flex: 1
    };

    const inputWrapperStyle = {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
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

    const inputDisabledStyle = {
        ...inputStyle,
        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.8)',
        color: isDarkMode ? '#6b7280' : '#9ca3af',
        cursor: 'not-allowed'
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
        pointerEvents: 'none',
        zIndex: 1
    };

    const toggleButtonStyle = {
        position: 'absolute',
        right: '0.75rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: isDarkMode ? '#9ca3af' : '#9ca3af',
        padding: '0.25rem',
        zIndex: 2
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

    const labelStyle = {
        fontSize: '0.75rem',
        fontWeight: '500',
        color: isDarkMode ? '#d1d5db' : '#374151',
        marginBottom: '0.5rem',
        display: 'block',
        transition: 'color 0.3s ease'
    };

    const loadingOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(248, 250, 252, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
    };

    const loadingContentStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)'
    };

    const spinnerStyle = {
        width: '48px',
        height: '48px',
        border: isDarkMode ? '4px solid #374151' : '4px solid #e5e7eb',
        borderTop: isDarkMode ? '4px solid #3b82f6' : '4px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem auto'
    };

    const keyframes = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

    if (loading) {
        return (
            <>
                <style>{keyframes}</style>
                <div style={loadingOverlayStyle}>
                    <div style={loadingContentStyle}>
                        <div style={spinnerStyle}></div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', margin: '0 0 0.5rem 0' }}>
                            Duke ngarkuar profilin
                        </h3>
                        <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', margin: 0 }}>
                            Duke marrë detajet e profilit tuaj...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                <button
                    onClick={toggleDarkMode}
                    style={darkModeToggleStyle}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div style={profileCardStyle}>
                    <button
                        style={backButtonStyle}
                        onClick={() => navigate('/client/home')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.6)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <ArrowLeft size={16} />
                    </button>

                    <div style={logoContainerStyle}>
                        <div style={logoStyle}>
                          <img src="../images/download.png" style={{ width: 320, height: 100 }} />
                        </div>
                        <h2 style={titleStyle}>Modifiko Profilin</h2>
                        <p style={subtitleStyle}>Përditëso të dhënat e tua personale</p>
                    </div>

                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={inputRowStyle}>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Emri</label>
                                <div style={inputWrapperStyle}>
                                    <div style={iconStyle}>
                                        <User size={16} />
                                    </div>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Emri"
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

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Mbiemri</label>
                                <div style={inputWrapperStyle}>
                                    <div style={iconStyle}>
                                        <User size={16} />
                                    </div>
                                    <input
                                        name="surname"
                                        value={form.surname}
                                        onChange={handleChange}
                                        placeholder="Mbiemri"
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
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Adresa e email-it</label>
                            <div style={inputWrapperStyle}>
                                <div style={iconStyle}>
                                    <Mail size={16} />
                                </div>
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Adresa e email-it"
                                    type="email"
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

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Emri i përdoruesit (I pamodifikueshëm)</label>
                            <div style={inputWrapperStyle}>
                                <div style={iconStyle}>
                                    <User size={16} />
                                </div>
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Emri i përdoruesit"
                                    disabled
                                    style={inputDisabledStyle}
                                />
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Fjalëkalimi i ri (Lëre bosh për të mbajtur vlerën aktuale)</label>
                            <div style={inputWrapperStyle}>
                                <div style={iconStyle}>
                                    <Lock size={16} />
                                </div>
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Fjalëkalimi i ri"
                                    type={showPassword ? "text" : "password"}
                                    style={{...inputStyle, paddingRight: '3rem'}}
                                    onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                                    onBlur={(e) => Object.assign(e.target.style, {
                                        borderColor: isDarkMode ? '#374151' : '#d1d5db',
                                        boxShadow: 'none'
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={toggleButtonStyle}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={buttonStyle}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Save size={16} />
                            <span>Ruaj Ndryshimet</span>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditProfile;