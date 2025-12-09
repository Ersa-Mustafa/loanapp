import { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye, Check, X, Clock, BarChart3, TrendingUp, AlertCircle, DollarSign, CreditCard, FileText, User, Sun, Moon} from 'lucide-react';
import { toast } from 'react-toastify';

function EmployeeHome() {
    const [applications, setApplications] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        pending: 0,
        inProgress: 0,
        approved: 0,
        rejected: 0,
        total: 0
    });
    const [user, setUser] = useState({ name: '', loginTime: '' });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [applicationsPerPage] = useState(5);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('isDarkMode');
        return saved ? JSON.parse(saved) : false;
    });
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    };

    useEffect(() => {
       const error = sessionStorage.getItem('errorMessage');
       if (error) {
          toast.error(error);
          sessionStorage.removeItem('errorMessage');
       }
    }, []);

    useEffect(() => {
        fetchProfileAndLoans();
    }, [navigate]);

    // Pagination calculations
    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);
    const totalPages = Math.ceil(applications.length / applicationsPerPage);

    const fetchProfileAndLoans = async () => {
        try {
            const profileRes = await api.get('/client/profile');
            const { user: userInfo, lastLoginTime } = profileRes.data;
            const backendRole = userInfo.role || '';
            console.log(backendRole);
            if (backendRole != 'employee') {
               navigate(-1, { state: { errorMessage: "Ju nuk keni një rol të tillë." } });
               return;
            }
            setUser({
                name: userInfo.username || 'Punonjës',
                loginTime: lastLoginTime
                    ? new Date(lastLoginTime).toLocaleString()
                    : '-'
            });

            const loansRes = await api.get('/employee/loans');
            setApplications(loansRes.data);

            // Calculate summary stats from applications data
            const stats = loansRes.data.reduce((acc, app) => {
                acc.total++;
                switch (app.status.toLowerCase()) {
                    case 'applied':
                        acc.pending++;
                        break;
                    case 'evaluation':
                        acc.inProgress++;
                        break;
                    case 'approved':
                        acc.approved++;
                        break;
                    case 'rejected':
                        acc.rejected++;
                        break;
                }
                return acc;
            }, { pending: 0, inProgress: 0, approved: 0, rejected: 0, total: 0 });

            setSummaryStats(stats);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error("Sesioni ka skaduar ose nuk jeni i autorizuar. Ju lutemi hyni përsëri.");
                localStorage.clear();
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await api.get('/employee/loans');
            setApplications(res.data);

            // Recalculate summary stats
            const stats = res.data.reduce((acc, app) => {
                acc.total++;
                switch (app.status.toLowerCase()) {
                    case 'applied':
                        acc.pending++;
                        break;
                    case 'evaluation':
                        acc.inProgress++;
                        break;
                    case 'approved':
                        acc.approved++;
                        break;
                    case 'rejected':
                        acc.rejected++;
                        break;
                }
                return acc;
            }, { pending: 0, inProgress: 0, approved: 0, rejected: 0, total: 0 });

            setSummaryStats(stats);
        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                toast.error("Sesioni ka skaduar ose nuk jeni i autorizuar. Ju lutemi hyni përsëri.");
                localStorage.clear();
                navigate('/');
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.post(`/employee/loans/${id}/approve`);
            await fetchApplications(); // Refresh data
            toast.success("Aplikimi për kredi u aprovua me sukses!");
        } catch (err) {
            toast.error("Aplikimi për kredi nuk mund të aprovohej. Ju lutemi provoni përsëri.");
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/employee/loans/${id}/reject`);
            await fetchApplications(); // Refresh data
            toast.success("Aplikimi për kredi u refuzua me sukses!");
        } catch (err) {
            toast.error("Aplikimi për kredi nuk mund të refuzohej. Ju lutemi provoni përsëri.");
        }
    };

    const handleEvaluate = async (id) => {
        try {
            await api.post(`/employee/loans/${id}/evaluate`);
            await fetchApplications(); // Refresh data
            toast.success("Kërkesa për kredi u vendos për vlerësim.");
        } catch (err) {
            toast.error("Aplikimi për kredi nuk mund të fillonte vlerësimin. Ju lutemi provoni përsëri.");
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/employee/loans/${id}`);
    };

    const handleLogout = async () => {
        try {
            if (user.loginTime && user.loginTime !== '-') {
                const parsedDate = new Date(localStorage.getItem("loginTime"));
                const isoString = parsedDate.toISOString();

                await api.post('/client/logout', { loginTime: isoString });
            }
        } catch (err) {
            console.warn('Logout time save failed', err);
        } finally {
            localStorage.clear();
            navigate('/employee_login');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved': return { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' };
            case 'applied': return { color: '#2563eb', backgroundColor: '#eff6ff', borderColor: '#93c5fd' };
            case 'under review': return { color: '#d97706', backgroundColor: '#fffbeb', borderColor: '#fcd34d' };
            case 'evaluation': return { color: '#d97706', backgroundColor: '#fffbeb', borderColor: '#fcd34d' };
            case 'rejected': return { color: '#dc2626', backgroundColor: '#fef2f2', borderColor: '#fca5a5' };
            default: return { color: '#4b5563', backgroundColor: '#f9fafb', borderColor: '#d1d5db' };
        }
    };

    const getLoanTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'personal': return <User size={16} />;
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
        borderBottom: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(229, 231, 235, 0.5)',
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(249, 250, 251, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const thStyle = {
        padding: '0.75rem 1.5rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: isDarkMode ? '#9ca3af' : '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(248, 250, 252, 0.7)'
    };

    const tdStyle = {
        padding: '1rem 1.5rem',
        fontSize: '0.875rem',
        borderBottom: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(226, 232, 240, 0.5)',
        color: isDarkMode ? '#f9fafb' : '#1e293b'
    };

    const actionButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.375rem 0.75rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.75rem',
        fontWeight: '500',
        transition: 'all 0.15s',
        marginRight: '0.5rem'
    };

    const approveButtonStyle = {
        ...actionButtonStyle,
        color: '#059669',
        backgroundColor: '#ecfdf5',
        border: '1px solid #76db7a'
    };

    const rejectButtonStyle = {
        ...actionButtonStyle,
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        border: '1px solid #fca5a5'
    };

    const evaluateButtonStyle = {
        ...actionButtonStyle,
        color: '#d97706',
        backgroundColor: '#fffbeb',
        border: '1px solid #fcd34d'
    };

    const viewButtonStyle = {
        ...actionButtonStyle,
        color: '#2563eb',
        backgroundColor: '#eff6ff',
        border: '1px solid #93c5fd'
    };

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(248, 250, 252, 0.5)',
        borderTop: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(226, 232, 240, 0.5)'
    };

    const paginationButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white',
        border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        color: isDarkMode ? '#f9fafb' : '#475569'
    };

    const paginationButtonDisabledStyle = {
        ...paginationButtonStyle,
        opacity: 0.5,
        cursor: 'not-allowed'
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

    const emptyStateStyle = {
        padding: '3rem',
        textAlign: 'center'
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

            .mobile-logo-section .logo-image {
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
                            Duke ngarkuar panelin e punonjësit
                        </h3>
                        <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280', margin: 0 }}>
                            Duke marrë aplikimet për kredi...
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
                                    className="logo-image"
                                />
                            </div>
                            <div style={welcomeSectionStyle}>
                                <h2 style={titleStyle} className="mobile-title">Përshëndetje, {user.name}</h2>
                                <p style={subtitleStyle} className="mobile-subtitle">Paneli i Punonjësit të Bankës</p>
                            </div>
                        </div>

                        {/* Navigation Menu */}
                        <div style={navStyle} className="mobile-nav">
                            <button
                                onClick={() => navigate('/employee/reports')}
                                style={navButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white'}
                            >
                                <FileText size={16} />
                                <span>Raporte</span>
                            </button>

                            <button
                                onClick={() => navigate('/employee/profile')}
                                style={navButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f9fafb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white'}
                            >
                                <User size={16} />
                                <span>Profili</span>
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

               <main style={mainStyle} className="mobile-main-padding">
                   {/* Summary Statistics */}
                   <div style={statsGridStyle} className="mobile-stats-grid">
                       <div
                           style={statCardStyle}
                           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                       >
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <div>
                                   <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#64748b', margin: '0 0 0.5rem 0' }}>
                                       Aplikime në pritje
                                   </p>
                                   <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>
                                       {summaryStats.pending}
                                   </p>
                               </div>
                               <div style={{
                                   width: '48px',
                                   height: '48px',
                                   backgroundColor: isDarkMode ? 'rgba(124, 58, 237, 0.2)' : '#f3f4f6',
                                   borderRadius: '8px',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center'
                               }}>
                                   <Clock size={24} color="#7c3aed" />
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
                                   <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#64748b', margin: '0 0 0.5rem 0' }}>
                                       Në proces vlerësimi
                                   </p>
                                   <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706', margin: 0 }}>
                                       {summaryStats.inProgress}
                                   </p>
                               </div>
                               <div style={{
                                   width: '48px',
                                   height: '48px',
                                   backgroundColor: isDarkMode ? 'rgba(217, 119, 6, 0.2)' : '#fffbeb',
                                   borderRadius: '8px',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center'
                               }}>
                                   <AlertCircle size={24} color="#d97706" />
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
                                   <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#64748b', margin: '0 0 0.5rem 0' }}>
                                       Aprovuar
                                   </p>
                                   <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                                       {summaryStats.approved}
                                   </p>
                               </div>
                               <div style={{
                                   width: '48px',
                                   height: '48px',
                                   backgroundColor: isDarkMode ? 'rgba(5, 150, 105, 0.2)' : '#ecfdf5',
                                   borderRadius: '8px',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center'
                               }}>
                                   <Check size={24} color="#059669" />
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
                                   <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#64748b', margin: '0 0 0.5rem 0' }}>
                                       Refuzuar
                                   </p>
                                   <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                                       {summaryStats.rejected}
                                   </p>
                               </div>
                               <div style={{
                                   width: '48px',
                                   height: '48px',
                                   backgroundColor: isDarkMode ? 'rgba(220, 38, 38, 0.2)' : '#fef2f2',
                                   borderRadius: '8px',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center'
                               }}>
                                   <X size={24} color="#dc2626" />
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Loan Applications Table */}
                   <section style={sectionStyle}>
                       <div style={sectionHeaderStyle}>
                           <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#1e293b', margin: 0 }}>
                               Menaxhimi i Aplikimeve për Kredi
                           </h3>
                           <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>
                               {applications.length} aplikime në total
                           </div>
                       </div>

                       {applications.length === 0 ? (
                           <div style={emptyStateStyle}>
                               <div style={{
                                   width: '96px',
                                   height: '96px',
                                   backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : '#f1f5f9',
                                   borderRadius: '50%',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   margin: '0 auto 1rem auto'
                               }}>
                                   <FileText size={48} color={isDarkMode ? '#9ca3af' : '#64748b'} />
                               </div>
                               <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#1e293b', margin: '0 0 0.5rem 0' }}>
                                   Asnjë aplikim për kredi nuk u gjet
                               </h3>
                               <p style={{ color: isDarkMode ? '#9ca3af' : '#64748b', margin: 0 }}>
                                   Aplikimet do të shfaqen këtu sapo të dorëzohen nga klientët
                               </p>
                           </div>
                       ) : (
                           <>
                               <div style={{ overflowX: 'auto' }} className="mobile-table-container">
                                   <table style={tableStyle}>
                                       <thead>
                                       <tr>
                                           <th style={thStyle}>ID e Aplikimit</th>
                                           <th style={thStyle}>Emri i Klientit</th>
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
                                               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.5)'}
                                               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                           >
                                               <td style={tdStyle}>
                                                   <div style={{ display: 'flex', alignItems: 'center' }}>
                                                       <div style={{
                                                           width: '32px',
                                                           height: '32px',
                                                           background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
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
                                                   <div style={{ fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#1e293b' }}>
                                                       {(app.firstName + " " + app.lastName) || 'N/A'}
                                                   </div>
                                               </td>
                                               <td style={tdStyle}>
                                                   <div style={{ fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#1e293b' }}>
                                                       {app.requestedAmount} {app.currency || 'N/A'}
                                                   </div>
                                               </td>
                                               <td style={tdStyle}>
                                                   <div style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#d1d5db' : '#475569' }}>
                                                       <Clock size={16} style={{ marginRight: '0.25rem' }} />
                                                       {app.durationMonths} muaj
                                                   </div>
                                               </td>
                                               <td style={tdStyle}>
                                                   <div style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#d1d5db' : '#475569' }}>
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
                                                   <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                                       <button
                                                           onClick={() => handleViewDetails(app.id)}
                                                           style={viewButtonStyle}
                                                           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                                           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                       >
                                                           <Eye size={14} />
                                                           <span>Shiko</span>
                                                       </button>

                                                       {app.status?.toLowerCase() === 'applied' && (
                                                           <>
                                                               <button
                                                                   onClick={() => handleEvaluate(app.id)}
                                                                   style={evaluateButtonStyle}
                                                                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
                                                                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
                                                               >
                                                                   <AlertCircle size={14} />
                                                                   <span>Vlerëso</span>
                                                               </button>
                                                               <button
                                                                   onClick={() => handleApprove(app.id)}
                                                                   style={approveButtonStyle}
                                                                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1fae5'}
                                                                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                                                               >
                                                                   <Check size={14} />
                                                                   <span>Aprovo</span>
                                                               </button>
                                                               <button
                                                                   onClick={() => handleReject(app.id)}
                                                                   style={rejectButtonStyle}
                                                                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                               >
                                                                   <X size={14} />
                                                                   <span>Refuzo</span>
                                                               </button>
                                                           </>
                                                       )}

                                                       {app.status?.toLowerCase() === 'evaluation' && (
                                                           <>
                                                               <button
                                                                   onClick={() => handleApprove(app.id)}
                                                                   style={approveButtonStyle}
                                                                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1fae5'}
                                                                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
                                                               >
                                                                   <Check size={14} />
                                                                   <span>Aprovo</span>
                                                               </button>
                                                               <button
                                                                   onClick={() => handleReject(app.id)}
                                                                   style={rejectButtonStyle}
                                                                   onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                                   onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                               >
                                                                   <X size={14} />
                                                                   <span>Refuzo</span>
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

                               {/* Pagination Controls */}
                               {totalPages > 1 && (
                                   <div style={paginationStyle}>
                                       <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>
                                           Duke treguar {indexOfFirstApplication + 1}-{Math.min(indexOfLastApplication, applications.length)} nga {applications.length} aplikime
                                       </div>

                                       <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                           <button
                                               onClick={() => handlePageChange(currentPage - 1)}
                                               disabled={currentPage === 1}
                                               style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
                                               onMouseEnter={(e) => {
                                                   if (currentPage !== 1) {
                                                       e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f8fafc';
                                                   }
                                               }}
                                               onMouseLeave={(e) => {
                                                   if (currentPage !== 1) {
                                                       e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white';
                                                   }
                                               }}
                                           >
                                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                   <polyline points="15,18 9,12 15,6"></polyline>
                                               </svg>
                                               <span>Para</span>
                                           </button>

                                           {/* Page Numbers */}
                                           <div style={{ display: 'flex', gap: '0.25rem' }}>
                                               {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                                   let pageNum;
                                                   if (totalPages <= 5) {
                                                       pageNum = i + 1;
                                                   } else if (currentPage <= 3) {
                                                       pageNum = i + 1;
                                                   } else if (currentPage >= totalPages - 2) {
                                                       pageNum = totalPages - 4 + i;
                                                   } else {
                                                       pageNum = currentPage - 2 + i;
                                                   }

                                                   const isActive = pageNum === currentPage;

                                                   return (
                                                       <button
                                                           key={pageNum}
                                                           onClick={() => handlePageChange(pageNum)}
                                                           style={{
                                                               ...paginationButtonStyle,
                                                               backgroundColor: isActive ? '#1e40af' : (isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white'),
                                                               color: isActive ? 'white' : (isDarkMode ? '#f9fafb' : '#475569'),
                                                               borderColor: isActive ? '#1e40af' : (isDarkMode ? 'rgba(75, 85, 99, 0.5)' : '#cbd5e1'),
                                                               minWidth: '40px',
                                                               justifyContent: 'center'
                                                           }}
                                                           onMouseEnter={(e) => {
                                                               if (!isActive) {
                                                                   e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f8fafc';
                                                               }
                                                           }}
                                                           onMouseLeave={(e) => {
                                                               if (!isActive) {
                                                                   e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white';
                                                               }
                                                           }}
                                                       >
                                                           {pageNum}
                                                       </button>
                                                   );
                                               })}
                                           </div>

                                           <button
                                               onClick={() => handlePageChange(currentPage + 1)}
                                               disabled={currentPage === totalPages}
                                               style={currentPage === totalPages ? paginationButtonDisabledStyle : paginationButtonStyle}
                                               onMouseEnter={(e) => {
                                                   if (currentPage !== totalPages) {
                                                       e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(75, 85, 99, 0.8)' : '#f8fafc';
                                                   }
                                               }}
                                               onMouseLeave={(e) => {
                                                   if (currentPage !== totalPages) {
                                                       e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white';
                                                   }
                                               }}
                                           >
                                               <span>Pas</span>
                                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                   <polyline points="9,18 15,12 9,6"></polyline>
                                               </svg>
                                           </button>
                                       </div>
                                   </div>
                               )}
                           </>
                       )}
                   </section>
                   {/* Footer */}
                   <footer style={footerStyle} className="mobile-footer">
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <Clock size={16} />
                           <span>Hyrja e fundit: {user.loginTime}</span>
                       </div>
                       <div style={{ color: isDarkMode ? '#6b7280' : '#94a3b8' }}>
                           © 2025 Sistemi i Menaxhimit të Kredive BKT
                       </div>
                   </footer>
               </main>
            </div>
        </>
    );
}

export default EmployeeHome;