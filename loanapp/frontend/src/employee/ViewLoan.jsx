import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, MapPin, GraduationCap, Heart, DollarSign, Calendar, Briefcase, Eye, Moon, Sun } from 'lucide-react';
import api from './api/axios';
import { toast } from 'react-toastify';

function ViewLoan() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loanData, setLoanData] = useState({
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
    const [loading, setLoading] = useState(true);
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
            const res = await api.get(`/employee/loans/${id}`);
            const data = res.data;
            const backendRole = data.role || '';
            setLoanData({
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
            setLoading(false);
        } catch (err) {
            toast.error("Ngarkimi i të dhënave dështoi.");
            setLoading(false);
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: isDarkMode
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'all 0.3s ease'
    };

    const darkModeToggleStyle = {
        position: 'fixed',
        top: '1rem',
        right: '1rem',
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

    const cardStyle = {
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
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(229, 231, 235, 0.5)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    };

    const sectionContentStyle = {
        padding: '1.5rem'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
    };

    const fieldStyle = {
        marginBottom: '1.5rem'
    };

    const labelStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: isDarkMode ? '#d1d5db' : '#374151',
        marginBottom: '0.5rem',
        transition: 'color 0.3s ease'
    };

    const valueStyle = {
        padding: '0.75rem 1rem',
        backgroundColor: isDarkMode
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(249, 250, 251, 0.8)',
        border: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(229, 231, 235, 0.5)',
        borderRadius: '8px',
        fontSize: '0.875rem',
        color: isDarkMode ? '#f9fafb' : '#111827',
        fontWeight: '500',
        transition: 'all 0.3s ease'
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
        transition: 'all 0.3s ease'
    };

    const getFieldIcon = (fieldName) => {
        switch (fieldName) {
            case 'birthDate': return <Calendar size={16} />;
            case 'birthPlace': return <MapPin size={16} />;
            case 'address': return <MapPin size={16} />;
            case 'educationLevel': return <GraduationCap size={16} />;
            case 'maritalStatus': return <Heart size={16} />;
            case 'requestedAmount': return <DollarSign size={16} />;
            case 'currency': return <DollarSign size={16} />;
            case 'durationMonths': return <Calendar size={16} />;
            case 'loanType': return <CreditCard size={16} />;
            default: return <User size={16} />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Add responsive styles
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

    if (loading) {
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
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                        <div style={{ textAlign: 'center', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                            <CreditCard size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                            <p>Duke ngarkuar detajet e kredisë...</p>
                        </div>
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
                                <h2 style={titleStyle} className="mobile-title">Detajet e Aplikimit për Kredi</h2>
                                <p style={subtitleStyle} className="mobile-subtitle">Shiko detajet e aplikimit tënd për kredi</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/employee/home')}
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

                <main style={mainStyle} className="mobile-main-padding">
                    {/* Personal Information Section */}
                    <div style={cardStyle}>
                        <div style={sectionHeaderStyle} className="mobile-card-padding">
                            <User size={20} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', margin: 0 }}>
                                Detaje Personale
                            </h3>
                        </div>
                        <div style={sectionContentStyle} className="mobile-section-content">
                            <div style={gridStyle} className="mobile-grid">
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('firstName')}
                                        Emri
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.firstName}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('lastName')}
                                        Mbiemri
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.lastName}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('fatherName')}
                                        Atësia
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.fatherName}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('birthDate')}
                                        Ditëlindja
                                    </label>
                                    <div style={valueStyle}>
                                        {formatDate(loanData.birthDate)}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('birthPlace')}
                                        Vendlindja
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.birthPlace || 'I paspecifikuar'}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('email')}
                                        Adresa e email-it
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.email || 'I paspecifikuar'}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('phoneNumber')}
                                        Numër telefoni
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.phoneNumber || 'I paspecifikuar'}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('educationLevel')}
                                        Niveli i edukimit
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.educationLevel || 'I paspecifikuar'}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('maritalStatus')}
                                        Gjendja civile
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.maritalStatus || 'I paspecifikuar'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loan Details Section */}
                    <div style={{ ...cardStyle, marginTop: '2rem' }}>
                        <div style={sectionHeaderStyle} className="mobile-card-padding">
                            <CreditCard size={20} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', margin: 0 }}>
                                Detajet e Kredisë
                            </h3>
                        </div>
                        <div style={sectionContentStyle} className="mobile-section-content">
                            <div style={gridStyle} className="mobile-grid">
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('requestedAmount')}
                                        Vlera e kërkuar
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.requestedAmount}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('currency')}
                                        Monedha
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.currency || 'I paspecifikuar'}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('durationMonths')}
                                        Kohëzgjatja
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.durationMonths ? `${loanData.durationMonths} months` : 'I paspecifikuar'}
                                    </div>
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>
                                        {getFieldIcon('loanType')}
                                        Lloji i kredisë
                                    </label>
                                    <div style={valueStyle}>
                                        {loanData.loanType || 'I paspecifikuar'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Income Information Section */}
                    <div style={{ ...cardStyle, marginTop: '2rem' }}>
                        <div style={sectionHeaderStyle} className="mobile-card-padding">
                            <Briefcase size={20} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', margin: 0 }}>
                                Detaje mbi të Ardhurat
                            </h3>
                        </div>
                        <div style={sectionContentStyle} className="mobile-section-content">
                            {incomes.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                                    <Briefcase size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
                                    <p>Nuk gjendet asnjë burim të ardhurash.</p>
                                </div>
                            ) : (
                                incomes.map((income, index) => (
                                    <div key={index} style={incomeCardStyle}>
                                        <h4 style={{
                                            fontSize: '1rem',
                                            fontWeight: '500',
                                            color: isDarkMode ? '#d1d5db' : '#374151',
                                            margin: '0 0 1rem 0'
                                        }}>
                                            E ardhura {index + 1}
                                        </h4>
                                        <div style={gridStyle} className="mobile-grid">
                                            <div style={fieldStyle}>
                                                <label style={labelStyle}>Lloji i të ardhurës</label>
                                                <div style={valueStyle}>
                                                    {income.incomeType || 'I paspecifikuar'}
                                                </div>
                                            </div>
                                            <div style={fieldStyle}>
                                                <label style={labelStyle}>Vlera mujore e të ardhurës</label>
                                                <div style={valueStyle}>
                                                    {income.amount}
                                                </div>
                                            </div>
                                            <div style={fieldStyle}>
                                                <label style={labelStyle}>Monedha</label>
                                                <div style={valueStyle}>
                                                    {income.currency || 'E paspecifikuar'}
                                                </div>
                                            </div>
                                            <div style={fieldStyle}>
                                                <label style={labelStyle}>Që prej</label>
                                                <div style={valueStyle}>
                                                    {income.since || 'E paspecifikuar'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ViewLoan;