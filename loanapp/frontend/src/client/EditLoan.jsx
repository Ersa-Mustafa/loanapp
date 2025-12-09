import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, MapPin, GraduationCap, Heart, DollarSign, Calendar, Briefcase, Plus, Trash2, Save, Mail, Phone, Moon, Sun } from 'lucide-react';
import api from './api/axios';
import { toast } from 'react-toastify';

function EditLoan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        fatherName: '',
        birthDate: '',
        birthPlace: '',
        email: '',
        phoneNumber: '',
        educationLevel: '',
        maritalStatus: '',
        requestedAmount: '',
        currency: '',
        durationMonths: '',
        loanType: ''
    });

    const [incomes, setIncomes] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("isDarkMode");
        return saved !== null ? saved === "true" : false;
    });

    useEffect(() => {
       const error = sessionStorage.getItem('errorMessage');
       if (error) {
          toast.error(error);
          sessionStorage.removeItem('errorMessage');
       }
    }, []);

    useEffect(() => {
        loadLoan();
    }, []);

    const loadLoan = async () => {
        try {
            const res = await api.get(`/client/loans/${id}`);
            const data = res.data;
            const backendRole = data.role || '';
            if (backendRole !== 'client') {
               sessionStorage.setItem('errorMessage', "Ju nuk keni një rol të tillë.");
               navigate(-1);
            }
            if (data.status != 'Applied') {
               sessionStorage.setItem('errorMessage', "Aplikimi nuk mund të modifikohet.");
               navigate(-1);
            }
            setForm({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                fatherName: data.fatherName || '',
                birthDate: data.birthDate || '',
                birthPlace: data.birthPlace || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                educationLevel: data.educationLevel || '',
                maritalStatus: data.maritalStatus || '',
                requestedAmount: data.requestedAmount || '',
                currency: data.currency || '',
                durationMonths: data.durationMonths || '',
                loanType: data.loanType || ''
            });
            if (data.incomes) setIncomes(data.incomes);
        } catch (err) {
            toast.error('Ngarkimi i të dhënave dështoi.');
        }
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem("isDarkMode", newDarkMode.toString());
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleIncomeChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...incomes];
        updated[index][name] = value;
        setIncomes(updated);
    };

    const addIncome = () => {
        setIncomes([...incomes, { incomeType: '', amount: '', currency: '', since: '' }]);
    };

    const removeIncome = (index) => {
        const updated = incomes.filter((_, i) => i !== index);
        setIncomes(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/client/loans/${id}`, {
                ...form,
                incomes: incomes
            });
            toast.success("Kredia u përditësua!");
            navigate('/client/home');
        } catch (err) {
            toast.error("Përditësimi dështoi.");
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: isDarkMode
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'all 0.3s ease'
    };

    const darkModeToggleStyle = {
        position: 'fixed',
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
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
    };

    const headerStyle = {
        backgroundColor: isDarkMode
            ? 'rgba(31, 41, 55, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: isDarkMode
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        transition: 'all 0.3s ease'
    };

    const headerContentStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
    };

    const logoSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flex: '1',
        minWidth: '0'
    };

    const logoStyle = {
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const titleSectionStyle = {
        flex: '1',
        minWidth: '0'
    };

    // Update the titleStyle and subtitleStyle
    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: isDarkMode ? '#f9fafb' : '#111827',
        margin: 0,
        transition: 'color 0.3s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    const subtitleStyle = {
        fontSize: '0.875rem',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        margin: 0,
        transition: 'color 0.3s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    };

    const backButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white',
        border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid #d1d5db',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: isDarkMode ? '#f9fafb' : '#374151',
        whiteSpace: 'nowrap',
        flexShrink: 0
    };

    const mainStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem'
    };

    const formStyle = {
        backgroundColor: isDarkMode
            ? 'rgba(31, 41, 55, 0.7)'
            : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: isDarkMode
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: isDarkMode
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    };

    const sectionHeaderStyle = {
        padding: '1.5rem',
        borderBottom: isDarkMode
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(229, 231, 235, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'all 0.3s ease'
    };

    const sectionContentStyle = {
        padding: '1.5rem'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.5rem'
    };

    const inputGroupStyle = {
        marginBottom: '1rem'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: isDarkMode ? '#f9fafb' : '#374151',
        marginBottom: '0.5rem',
        transition: 'color 0.3s ease'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: isDarkMode ? '1px solid #374151' : '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '0.875rem',
        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.8)',
        color: isDarkMode ? '#f9fafb' : '#111827',
        transition: 'all 0.2s',
        boxSizing: 'border-box'
    };

    const selectStyle = {
        ...inputStyle,
        appearance: 'none',
        backgroundImage: isDarkMode
            ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23f9fafb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
            : `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em',
        paddingRight: '2.5rem'
    };

    const incomeCardStyle = {
        backgroundColor: isDarkMode
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(249, 250, 251, 0.8)',
        border: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(229, 231, 235, 0.5)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
        position: 'relative',
        transition: 'all 0.3s ease'
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        background: isDarkMode
            ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
            : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white'
    };

    const secondaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: isDarkMode
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        color: isDarkMode ? '#f9fafb' : '#374151',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #d1d5db'
    };

    const dangerButtonStyle = {
        ...buttonStyle,
        backgroundColor: isDarkMode ? 'rgba(127, 29, 29, 0.8)' : '#fef2f2',
        color: '#dc2626',
        border: isDarkMode ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fca5a5',
        padding: '0.5rem',
        position: 'absolute',
        top: '1rem',
        right: '1rem'
    };

    const sectionTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: isDarkMode ? '#f9fafb' : '#111827',
        margin: 0,
        transition: 'color 0.3s ease'
    };

    const incomeTitleStyle = {
        fontSize: '1rem',
        fontWeight: '500',
        color: isDarkMode ? '#f9fafb' : '#374151',
        margin: '0 0 1rem 0',
        transition: 'color 0.3s ease'
    };

    const emptyStateStyle = {
        textAlign: 'center',
        padding: '2rem',
        color: isDarkMode ? '#9ca3af' : '#6b7280'
    };

    const keyframes = `
        /* Mobile responsive styles */
        @media (max-width: 768px) {
            .mobile-header-content {
                flex-direction: column;
                gap: 1rem;
                align-items: stretch;
            }

            .mobile-logo-section {
                justify-content: center;
                text-align: center;
            }

            .mobile-logo-section img {
                width: 200px !important;
                height: 55px !important;
            }

            .mobile-title {
                font-size: 1.125rem !important;
                text-align: center;
                white-space: normal !important;
            }

            .mobile-subtitle {
                text-align: center;
                white-space: normal !important;
            }

            .mobile-back-button {
                align-self: center;
                justify-content: center;
                padding: 0.75rem 1rem !important;
            }

            .mobile-main-padding {
                padding: 1.5rem 1rem !important;
            }

            .mobile-grid {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
            }
        }

        @media (max-width: 480px) {
            .mobile-main-padding {
                padding: 1rem 0.5rem !important;
            }

            .mobile-back-button span {
                font-size: 0.8rem;
            }

            .mobile-card-padding {
                padding: 1rem !important;
            }

            .mobile-section-content {
                padding: 1rem !important;
            }
        }
    `;

    const getFieldIcon = (fieldName) => {
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
            case 'fatherName': return <User  size={16} />;
            case 'birthDate': return <Calendar size={16} />;
            case 'birthPlace': return <MapPin size={16} />;
            case 'email': return <Mail size={16} />;
            case 'phoneNumber': return <Phone size={16} />;
            case 'educationLevel': return <GraduationCap size={16} />;
            case 'maritalStatus': return <Heart size={16} />;
            case 'requestedAmount': return <DollarSign size={16} />;
            case 'currency': return <DollarSign size={16} />;
            case 'durationMonths': return <Calendar size={16} />;
            case 'loanType': return <CreditCard size={16} />;
            default: return <User  size={16} />;
        }
    };

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    style={darkModeToggleStyle}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Header */}
                <header style={headerStyle}>
                    <div style={headerContentStyle} className="mobile-header-content">
                        <div style={logoSectionStyle} className="mobile-logo-section">
                            <div style={logoStyle}>
                                <img
                                    src="../../../images/download.png"
                                    alt="Logo"
                                    style={{ width: 265, height: 80 }}
                                />
                            </div>
                            <div style={titleSectionStyle}>
                                <h2 style={titleStyle} className="mobile-title">Modifiko Aplikimin tënd për Kredi</h2>
                                <p style={subtitleStyle} className="mobile-subtitle">Modifiko detajet e aplikimit tënd për kredi</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/client/home')}
                            style={{
                                ...backButtonStyle,
                                transition: 'background-color 0.2s ease'
                            }}
                            className="mobile-back-button"
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white'}
                        >
                            <ArrowLeft size={16} />
                            <span>Kthehu te Faqja Kryesore</span>
                        </button>
                    </div>
                </header>
                <main style={mainStyle}>
                    <form onSubmit={handleSubmit}>
                        {/* Personal Information Section */}
                        <div style={formStyle}>
                            <div style={sectionHeaderStyle}>
                                <User  size={20} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                                <h3 style={sectionTitleStyle}>
                                    Detaje Personale
                                </h3>
                            </div>
                            <div style={sectionContentStyle}>
                                <div style={gridStyle}>
                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('firstName')}
                                                Emri
                                            </div>
                                        </label>
                                        <input
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosi emrin tuaj"
                                            disabled
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('lastName')}
                                                Mbiemri
                                            </div>
                                        </label>
                                        <input
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosni mbiemrin tuaj"
                                            disabled
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('fatherName')}
                                                Atësia
                                            </div>
                                        </label>
                                        <input
                                            name="fatherName"
                                            value={form.fatherName}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosni atësinë tuaj"
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('birthDate')}
                                                Ditëlindja
                                            </div>
                                        </label>
                                        <input
                                            name="birthDate"
                                            type="date"
                                            value={form.birthDate}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('birthPlace')}
                                                Vendlindja
                                            </div>
                                        </label>
                                        <input
                                            name="birthPlace"
                                            value={form.birthPlace}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosni vendlindjen tuaj"
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('email')}
                                                Adresa e email-it
                                            </div>
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosni adresën tuaj të email-it"
                                            disabled
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('phoneNumber')}
                                                Numër telefoni
                                            </div>
                                        </label>
                                        <input
                                            name="phoneNumber"
                                            type="tel"
                                            value={form.phoneNumber}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosni numrin tuaj të telefonit"
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('educationLevel')}
                                                Niveli i edukimit
                                            </div>
                                        </label>
                                        <select
                                            name="educationLevel"
                                            value={form.educationLevel}
                                            onChange={handleFormChange}
                                            style={selectStyle}
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        >
                                            <option value="Pa Arsim">Pa Arsim</option>
                                            <option value="Arsim Fillor">Arsim Fillor</option>
                                            <option value="Shkolle e Mesme">Shkolle e Mesme</option>
                                            <option value="Arsim i Larte">Arsim i Larte</option>
                                            <option value="Doktorature">Doktorature</option>
                                        </select>
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('maritalStatus')}
                                                Gjendja civile
                                            </div>
                                        </label>
                                        <select
                                            name="maritalStatus"
                                            value={form.maritalStatus}
                                            onChange={handleFormChange}
                                            style={selectStyle}
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        >
                                            <option value="Beqar">Beqar</option>
                                            <option value="I Martuar">I Martuar</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Loan Details Section */}
                        <div style={{ ...formStyle, marginTop: '2rem' }}>
                            <div style={sectionHeaderStyle}>
                                <CreditCard size={20} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                                <h3 style={sectionTitleStyle}>
                                    Detajet e Kredisë
                                </h3>
                            </div>
                            <div style={sectionContentStyle}>
                                <div style={gridStyle}>
                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('requestedAmount')}
                                                Vlera e kërkuar
                                            </div>
                                        </label>
                                        <input
                                            name="requestedAmount"
                                            type="number"
                                            value={form.requestedAmount}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosni vlerën e kërkuar"
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('currency')}
                                                Monedha
                                            </div>
                                        </label>
                                        <select
                                            name="currency"
                                            value={form.currency}
                                            onChange={handleFormChange}
                                            style={selectStyle}
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        >
                                            <option value="EUR">EUR</option>
                                            <option value="ALL">ALL</option>
                                        </select>
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('durationMonths')}
                                                Kohëzgjatja (Muaj)
                                            </div>
                                        </label>
                                        <input
                                            name="durationMonths"
                                            type="number"
                                            value={form.durationMonths}
                                            onChange={handleFormChange}
                                            style={inputStyle}
                                            placeholder="Vendosni kohëzgjatjen e kredisë tuaj"
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getFieldIcon('loanType')}
                                                Lloji i kredisë
                                            </div>
                                        </label>
                                        <select
                                            name="loanType"
                                            value={form.loanType}
                                            onChange={handleFormChange}
                                            style={selectStyle}
                                            required
                                            onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                            onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                        >
                                            <option value="Kredi personale">Kredi personale</option>
                                            <option value="Kredi per shtepi">Kredi per shtepi</option>
                                            <option value="Kredi per makine">Kredi per makine</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Income Information Section */}
                        <div style={{ ...formStyle, marginTop: '2rem' }}>
                            <div style={sectionHeaderStyle}>
                                <Briefcase size={20} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                                <h3 style={sectionTitleStyle}>
                                    Detaje mbi të Ardhurat
                                </h3>
                                <button
                                    type="button"
                                    onClick={addIncome}
                                    style={{
                                        ...backButtonStyle,
                                        marginLeft: 'auto',
                                        padding: '0.5rem 1rem',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f9fafb'}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white'}
                                  >
                                    <Plus size={16} />
                                    <span>Shto burim të ardhurash</span>
                                </button>
                            </div>
                            <div style={sectionContentStyle}>
                                {incomes.length === 0 ? (
                                    <div style={emptyStateStyle}>
                                        <Briefcase size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                        <p>Nuk gjendet asnjë burim të ardhurash. Kliko "Shto të ardhura" për të filluar.</p>
                                    </div>
                                ) : (
                                    incomes.map((income, index) => (
                                        <div key={index} style={incomeCardStyle}>
                                            {incomes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeIncome(index)}
                                                    style={{
                                                        ...dangerButtonStyle,
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(100, 20, 20, 0.9)' : '#fee2e2'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(127, 29, 29, 0.8)' : '#fef2f2'}
                                                   >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            <h4 style={{
                                                fontSize: '1rem',
                                                fontWeight: '500',
                                                color: isDarkMode ? '#D1D5DB' : '#374151',
                                                margin: '0 0 1rem 0'
                                            }}>
                                                E ardhura {index + 1}
                                            </h4>
                                            <div style={gridStyle}>
                                                <div style={inputGroupStyle}>
                                                    <label style={labelStyle}>Lloji i të ardhurës</label>
                                                    <select
                                                        name="incomeType"
                                                        value={income.incomeType || ''}
                                                        onChange={(e) => handleIncomeChange(index, e)}
                                                        style={selectStyle}
                                                        required
                                                        onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                                        onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                                    >
                                                        <option value="Paga">Paga</option>
                                                        <option value="Qera">Qera</option>
                                                        <option value="Biznesi">Biznesi</option>
                                                    </select>
                                                </div>
                                                <div style={inputGroupStyle}>
                                                    <label style={labelStyle}>Vlera e të ardhurës</label>
                                                    <input
                                                        name="amount"
                                                        type="number"
                                                        value={income.amount || ""}
                                                        onChange={(e) => handleIncomeChange(index, e)}
                                                        style={inputStyle}
                                                        placeholder="Vendosni vlerën mujore të të ardhurës"
                                                        required
                                                        onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                                        onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                                    />
                                                </div>
                                                <div style={inputGroupStyle}>
                                                    <label style={labelStyle}>Monedha</label>
                                                    <select
                                                        name="currency"
                                                        value={income.currency || ''}
                                                        onChange={(e) => handleIncomeChange(index, e)}
                                                        style={selectStyle}
                                                        required
                                                        onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                                        onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                                    >
                                                        <option value="ALL">ALL</option>
                                                        <option value="EUR">EUR</option>
                                                    </select>
                                                </div>
                                                <div style={inputGroupStyle}>
                                                    <label style={labelStyle}>Që prej</label>
                                                    <input
                                                        name="since"
                                                        type="date"
                                                        value={income.since || ''}
                                                        onChange={(e) => handleIncomeChange(index, e)}
                                                        style={inputStyle}
                                                        placeholder="e.g., 2025-06-30"
                                                        required
                                                        onFocus={(e) => e.target.style.borderColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                                        onBlur={(e) => e.target.style.borderColor = isDarkMode ? '#374151' : '#d1d5db'}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <button
                                type="submit"
                                style={{
                                    ...primaryButtonStyle,
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    transition: 'transform 0.2s ease' // Add transition
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Save size={20} />
                                <span>Përditëso Aplikimin</span>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}

export default EditLoan;