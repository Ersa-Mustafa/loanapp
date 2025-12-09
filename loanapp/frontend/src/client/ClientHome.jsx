import { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import {LogOut, Plus, Edit2, Trash2, CreditCard, Clock, DollarSign, TrendingUp, User, Eye, Moon, Sun} from 'lucide-react';
import { toast } from 'react-toastify';

function ClientHome() {
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState({ name: '', loginTime: '' });
    const [loading, setLoading] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem("isDarkMode");
        return saved !== null ? saved === "true" : false;
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplications = applications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(applications.length / itemsPerPage);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentPage(1);
    }, [applications]);

    useEffect(() => {
       const error = sessionStorage.getItem('errorMessage');
       if (error) {
          toast.error(error);
          sessionStorage.removeItem('errorMessage');
       }
    }, []);

    useEffect(() => {
        const fetchProfileAndLoans = async () => {
            try {
                const profileRes = await api.get('/client/profile');
                const { user, lastLoginTime } = profileRes.data;
                const backendRole = user.role || '';
                if (backendRole !== 'client') {
                   navigate(-1, { state: { errorMessage: "Ju nuk keni një rol të tillë." } });
                   return;
                }
                setUser({
                    name: user.username,
                    loginTime: lastLoginTime
                        ? new Date(lastLoginTime).toLocaleString()
                        : '-'
                });

                const loansRes = await api.get('/client/loans');
                setApplications(loansRes.data);
            } catch (err) {
                console.error('Error loading data:', err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    toast.error('Sesioni ka skaduar ose nuk jeni i autorizuar. Ju lutemi hyni përsëri.');
                    localStorage.clear();
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileAndLoans();
    }, [navigate]);

    const fetchApplications = async () => {
        try {
            const res = await api.get('/client/loans');
            setApplications(res.data);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                toast.error('Sesioni ka skaduar ose nuk jeni i autorizuar. Ju lutemi hyni përsëri.');
                localStorage.clear();
                navigate('/');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/client/loans/${id}`);
            await fetchApplications(); // Refresh list
        } catch (err) {
            toast.error('Aplikimi nuk u fshi dot.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/client/loans/${id}`);
    };

    const handleViewDetails = (id) => {
        navigate(`/client/loans/${id}/readonly`);
    };

    const handleLogout = async () => {
        try {
            if (user.loginTime && user.loginTime !== '-') {
                // Parse the localized string back to Date, then to ISO string
                const parsedDate = new Date(localStorage.getItem("loginTime"));
                const isoString = parsedDate.toISOString();  // this is ISO 8601 format

                await api.post('/client/logout', { loginTime: isoString });
            }
        } catch (err) {
            toast.error('Ruajtja e kohës së daljes dështoi', err);
        } finally {
            localStorage.clear();
            navigate('/');
        }
    };

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem("isDarkMode", newDarkMode.toString());
    };

    const getStatusColor = (status) => {
        const colors = {
            'approved': isDarkMode
                ? { color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }
                : { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' },
            'applied': isDarkMode
                ? { color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }
                : { color: '#2563eb', backgroundColor: '#eff6ff', borderColor: '#93c5fd' },
            'under review': isDarkMode
                ? { color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }
                : { color: '#d97706', backgroundColor: '#fffbeb', borderColor: '#fcd34d' },
            'rejected': isDarkMode
                ? { color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }
                : { color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fca5a5' }
        };
        return colors[status.toLowerCase()] || (isDarkMode
            ? { color: '#9ca3af', backgroundColor: 'rgba(156, 163, 175, 0.1)', borderColor: 'rgba(156, 163, 175, 0.3)' }
            : { color: '#4b5563', backgroundColor: '#f9fafb', borderColor: '#d1d5db' });
    };

    const getLoanTypeIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'personal': return <CreditCard size={16} />;
            case 'auto': return <TrendingUp size={16} />;
            case 'home': return <DollarSign size={16} />;
            default: return <CreditCard size={16} />;
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        background: isDarkMode
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: isDarkMode ? '#f9fafb' : '#111827',
        transition: 'all 0.3s ease'
    };

    const darkModeToggleStyle = {
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        padding: '0.5rem',
        background: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        color: isDarkMode ? '#f9fafb' : '#374151',
        boxShadow: isDarkMode
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
    };

    const headerStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'all 0.3s ease'
    };

    const headerContentStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 1rem 1rem 1rem',
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

    const welcomeSectionStyle = {
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

    const navStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexShrink: 0,
        flexWrap: 'wrap'
    };

    const navButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white',
        border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid #d1d5db',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: isDarkMode ? '#f9fafb' : '#374151',
        whiteSpace: 'nowrap'
    };

    const primaryButtonStyle = {
        ...navButtonStyle,
        backgroundColor: isDarkMode ? '#3b82f6' : '#2563eb',
        borderColor: isDarkMode ? '#3b82f6' : '#2563eb',
        color: 'white'
    };

    const logoutButtonStyle = {
        ...navButtonStyle,
        color: isDarkMode ? '#f87171' : '#dc2626',
        borderColor: isDarkMode ? 'rgba(248, 113, 113, 0.3)' : '#fca5a5'
    };

    const mainStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 1rem'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    };

    const statCardStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: isDarkMode
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        cursor: 'pointer'
    };

    const sectionStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: isDarkMode
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
    };

    const sectionHeaderStyle = {
        padding: '1.5rem',
        borderBottom: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const thStyle = {
        padding: '0.75rem 1rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 0.5)',
        transition: 'all 0.3s ease'
    };

    const tdStyle = {
        padding: '1rem',
        whiteSpace: 'nowrap',
        fontSize: '0.875rem',
        color: isDarkMode ? '#f9fafb' : '#111827',
        transition: 'color 0.3s ease'
    };

    const rowStyle = {
        borderBottom: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)',
        transition: 'background-color 0.15s'
    };

    const actionButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        transition: 'all 0.15s'
    };

    const editButtonStyle = {
        ...actionButtonStyle,
        color: isDarkMode ? '#60a5fa' : '#2563eb',
        backgroundColor: 'transparent'
    };

    const deleteButtonStyle = {
        ...actionButtonStyle,
        color: isDarkMode ? '#f87171' : '#dc2626',
        backgroundColor: 'transparent'
    };

    const viewButtonStyle = {
        ...actionButtonStyle,
        color: isDarkMode ? '#60a5fa' : '#2563eb',
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
        border: isDarkMode ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid #93c5fd'
    };

    const emptyStateStyle = {
        padding: '3rem 1rem',
        textAlign: 'center'
    };

    const footerStyle = {
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: isDarkMode ? '1px solid rgba(55, 65, 81, 0.3)' : '1px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: isDarkMode ? '#9ca3af' : '#6b7280',
        transition: 'all 0.3s ease',
        gap: '1rem',
        flexWrap: 'wrap'
    };

    // Loading styles
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
        backdropFilter: 'blur(4px)',
        transition: 'all 0.3s ease'
    };

    const loadingContentStyle = {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: isDarkMode
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        border: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(255, 255, 255, 0.5)',
        transition: 'all 0.3s ease'
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
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        /* Mobile responsive styles */
        @media (max-width: 768px) {
            .mobile-nav {
                flex-direction: column;
                align-items: stretch;
                gap: 0.5rem;
            }

            .mobile-nav button {
                justify-content: center;
                padding: 0.75rem 1rem;
            }

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
            }

            .mobile-subtitle {
                text-align: center;
            }

            .mobile-table-container {
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }

            .mobile-footer {
                flex-direction: column;
                gap: 0.5rem;
                text-align: center;
            }
        }

        @media (max-width: 480px) {
            .mobile-stats-grid {
                grid-template-columns: 1fr !important;
            }

            .mobile-nav button span {
                display: none;
            }

            .mobile-main-padding {
                padding: 1rem 0.5rem !important;
            }
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
                            Duke ngarkuar faqen kryesore
                        </h3>
                        <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', margin: 0 }}>
                            Duke marrë aplikimet tuaja për kredi...
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
                                    src="../images/download.png"
                                    alt="Logo"
                                    style={{ width: 265, height: 80 }}
                                />
                            </div>
                            <div style={welcomeSectionStyle}>
                                <h2 style={titleStyle} className="mobile-title">Përshëndetje, {user.name}</h2>
                                <p style={subtitleStyle} className="mobile-subtitle">Menaxhoni aplikimet tuaja për kredi</p>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div style={navStyle} className="mobile-nav">
                            <button
                                onClick={() => navigate('/client/apply')}
                                style={primaryButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2563eb' : '#1d4ed8'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                            >
                                <Plus size={16} />
                                <span>Apliko për kredi</span>
                            </button>

                            <button
                                onClick={() => navigate('/client/profile')}
                                style={navButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white'}
                            >
                                <User size={16} />
                                <span>Modifiko profilin</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                style={logoutButtonStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2';
                                    e.currentTarget.style.borderColor = isDarkMode ? 'rgba(239, 68, 68, 0.5)' : '#f87171';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white';
                                    e.currentTarget.style.borderColor = isDarkMode ? 'rgba(248, 113, 113, 0.3)' : '#fca5a5';
                                }}
                            >
                                <LogOut size={16} />
                                <span>Dil</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main style={mainStyle}>
                    {/* Stats Cards */}
                    <div style={statsGridStyle}>
                        <div
                            style={statCardStyle}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#6b7280', margin: '0 0 0.5rem 0' }}>
                                        Aplikimet Totale
                                    </p>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: isDarkMode ? '#f9fafb' : '#111827', margin: 0 }}>
                                        {applications.length}
                                    </p>
                                </div>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <CreditCard size={24} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                                </div>
                            </div>
                        </div>

                        <div
                            style={statCardStyle}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#6b7280', margin: '0 0 0.5rem 0' }}>
                                        Aplikimet e Pranuara
                                    </p>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: isDarkMode ? '#10b981' : '#059669', margin: 0 }}>
                                        {applications.filter(app => app.status.toLowerCase() === 'approved').length}
                                    </p>
                                </div>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#dcfce7',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <TrendingUp size={24} color={isDarkMode ? '#10b981' : '#059669'} />
                                </div>
                            </div>
                        </div>

                        <div
                            style={statCardStyle}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#6b7280', margin: '0 0 0.5rem 0' }}>
                                        Vlera Totale
                                    </p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: isDarkMode ? '#a78bfa' : '#7c3aed', margin: 0 }}>
                                      €{applications
                                        .filter(app => app.currency === 'EUR')
                                        .reduce((sum, app) => sum + app.requestedAmount, 0)
                                        .toLocaleString()} &&nbsp;
                                      {applications
                                        .filter(app => app.currency === 'ALL')
                                        .reduce((sum, app) => sum + app.requestedAmount, 0)
                                        .toLocaleString('sq-AL')} ALL
                                    </p>
                                </div>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: isDarkMode ? 'rgba(167, 139, 250, 0.2)' : '#ede9fe',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <DollarSign size={24} color={isDarkMode ? '#a78bfa' : '#7c3aed'} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Applications Section */}
                        <section style={sectionStyle}>
                            <div style={sectionHeaderStyle}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', margin: 0, transition: 'color 0.3s ease' }}>
                                    Aplikimet tuaja për kredi
                                </h3>
                            </div>

                            {applications.length === 0 ? (
                                <div style={emptyStateStyle}>
                                    <div style={{
                                        width: '96px',
                                        height: '96px',
                                        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f3f4f6',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem auto',
                                        transition: 'background-color 0.3s ease'
                                    }}>
                                        <CreditCard size={48} color="#9ca3af" />
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#111827', margin: '0 0 0.5rem 0', transition: 'color 0.3s ease' }}>
                                        Ju nuk keni bërë akoma një aplikim për kredi.
                                    </h3>
                                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', margin: '0 0 1.5rem 0', transition: 'color 0.3s ease' }}>
                                        Fillo sot rrugëtimin tënd drejt marrjes së kredive
                                    </p>
                                    <button
                                        onClick={() => navigate('/client/apply')}
                                        style={{
                                            ...primaryButtonStyle,
                                            padding: '0.75rem 1.5rem',
                                            fontSize: '1rem'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#2563eb' : '#1d4ed8'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#3b82f6' : '#2563eb'}
                                    >
                                        <Plus size={20} />
                                        <span>Apliko për kredinë tënde të parë</span>
                                    </button>
                                </div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={tableStyle}>
                                        <thead>
                                        <tr>
                                            <th style={thStyle}>ID e Aplikimit</th>
                                            <th style={thStyle}>Shuma</th>
                                            <th style={thStyle}>Kohëzgjatja</th>
                                            <th style={thStyle}>Lloji</th>
                                            <th style={thStyle}>Statusi</th>
                                            <th style={thStyle}>Veprime</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentApplications.map((app) => (
                                            <tr
                                                key={app.id}
                                                style={rowStyle}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(249, 250, 251, 0.3)'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginRight: '0.75rem',
                                                            color: 'white',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '500'
                                                        }}>
                                                            {app.id}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#111827', transition: 'color 0.3s ease' }}>
                                                        {app.requestedAmount} {app.currency}
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#d1d5db' : '#374151', transition: 'color 0.3s ease' }}>
                                                        <Clock size={16} style={{ marginRight: '0.25rem' }} />
                                                        {app.durationMonths} months
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#d1d5db' : '#374151', transition: 'color 0.3s ease' }}>
                                                        {getLoanTypeIcon(app.loanType)}
                                                        <span style={{ marginLeft: '0.5rem' }}>{app.loanType}</span>
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                        <span style={{
                                                            ...getStatusColor(app.status),
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '500',
                                                            border: '1px solid'
                                                        }}>
                                                            {app.status}
                                                        </span>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleViewDetails(app.id)}
                                                            style={viewButtonStyle}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.2)' : '#dbeafe'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'}
                                                        >
                                                            <Eye size={14} />
                                                            <span>Shiko</span>
                                                        </button>

                                                        {app.status === 'Applied' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEdit(app.id)}
                                                                    style={editButtonStyle}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    <Edit2 size={16} />
                                                                    <span>Modifiko</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(app.id)}
                                                                    style={deleteButtonStyle}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                                >
                                                                    <Trash2 size={16} />
                                                                    <span>Fshi</span>
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                style={{
                                    marginRight: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                    color: isDarkMode ? '#f9fafb' : '#111827',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === 1 ? 0.5 : 1
                                }}
                            >
                                Para
                            </button>

                            <span style={{ margin: '0 1rem' }}>
                                Faqja {currentPage} nga {totalPages}
                            </span>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    backgroundColor: isDarkMode ? '#374151' : '#e5e7eb',
                                    color: isDarkMode ? '#f9fafb' : '#111827',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: currentPage === totalPages ? 0.5 : 1
                                }}
                            >
                                Pas
                            </button>
                        </div>

                        {/* Footer */}
                        <footer style={footerStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} />
                                <span>Hyrja e fundit: {user.loginTime}</span>
                            </div>
                            <div style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af', transition: 'color 0.3s ease' }}>
                                © 2025 Sistemi i Menaxhimit të Kredive BKT
                            </div>
                        </footer>
                </main>
            </div>
        </>
    );
}

export default ClientHome;