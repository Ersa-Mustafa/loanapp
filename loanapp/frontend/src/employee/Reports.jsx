import { useEffect, useState } from 'react';
import api from './api/axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, BarChart3, TrendingUp, DollarSign, CreditCard, FileText, User, ChevronLeft, ChevronRight, PieChart as HeaderPieChart, Download, Calendar, Filter, RefreshCw, ArrowUp, ArrowDown, Minus, Sun, Moon } from 'lucide-react';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

function Reports() {
    const [reports, setReports] = useState([]);
    const [summaryStats, setSummaryStats] = useState({
        totalApplications: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalPending: 0,
        approvalRate: 0,
        averageAmount: 0,
        totalVolume: 0
    });
    const [user, setUser] = useState({ name: '', loginTime: '' });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('month');
    const [reportType, setReportType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(5);
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('isDarkMode');
        return saved ? JSON.parse(saved) : false;
    });

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('isDarkMode', JSON.stringify(newMode));
    };

    useEffect(() => {
        fetchReportsData();
    }, [dateRange, reportType]);

    // Pagination calculations
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(reports.length / reportsPerPage);

    const fetchReportsData = async () => {
        try {
            setLoading(true);

            // Fetch user profile
            const profileRes = await api.get('/client/profile');
            const { user: userInfo, lastLoginTime } = profileRes.data;
            setUser({
                name: userInfo.username || 'Punonjës',
                loginTime: lastLoginTime ? new Date(lastLoginTime).toLocaleString() : '-'
            });

            // Fetch loan applications for reports
            const loansRes = await api.get('/employee/loans');
            const applications = loansRes.data;

            // Filter applications based on date range and type
           const filteredApplications = filterApplications(applications, dateRange, reportType);

           // Sort by ID (descending)
           const sortedApplications = filteredApplications.sort((a, b) => b.id - a.id);

           setReports(sortedApplications);

            // Calculate summary statistics
            const stats = calculateSummaryStats(filteredApplications);
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

    const filterApplications = (applications, dateRange, reportType) => {
        let filtered = [...applications];

        if (dateRange !== 'all') {
            const now = new Date();
            const startDate = new Date();

            switch (dateRange) {
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    startDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    startDate.setMonth(now.getMonth() - 1);
            }

            filtered = filtered.filter(app => {
                const appDate = new Date(app.createdAt);
                return appDate >= startDate;
            });
        }

        if (reportType !== 'all') {
            filtered = filtered.filter(app => app.status?.toLowerCase() === reportType);
        }

        return filtered;
    };

    const calculateSummaryStats = (applications) => {
        const total = applications.length;
        const approved = applications.filter(app => app.status?.toLowerCase() === 'approved').length;
        const rejected = applications.filter(app => app.status?.toLowerCase() === 'rejected').length;
        const pending = applications.filter(app =>
            app.status?.toLowerCase() === 'applied' ||
            app.status?.toLowerCase() === 'evaluation'
        ).length;

        const approvalRate = total > 0 ? (approved / total * 100).toFixed(1) : 0;
        const totalVolume = applications.reduce((sum, app) => {
          const amount = parseFloat(app.requestedAmount) || 0;
          const adjustedAmount = app.currency === "EUR" ? amount * 100 : amount;
          return sum + adjustedAmount;
        }, 0);

        const averageAmount = total > 0 ? (totalVolume / total).toFixed(2) : 0;

        return {
            totalApplications: total,
            totalApproved: approved,
            totalRejected: rejected,
            totalPending: pending,
            approvalRate: parseFloat(approvalRate),
            averageAmount: parseFloat(averageAmount),
            totalVolume: totalVolume
        };
    };

    const handleLogout = async () => {
        try {
            if (user.loginTime && user.loginTime !== '-') {
                const parsedDate = new Date(localStorage.getItem("loginTime"));
                const isoString = parsedDate.toISOString();
                await api.post('/employee/logout', { loginTime: isoString });
            }
        } catch (err) {
            console.warn('Logout time save failed', err);
        } finally {
            localStorage.clear();
            navigate('/');
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleExportReport = () => {
        // Export functionality
        const csvContent = generateCSVReport();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `loan_reports_${dateRange}_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generateCSVReport = () => {
        const headers = ['ID e Aplikimit', 'Emri i Klientit', 'Shuma', 'Kohëzgjatja', 'Lloji', 'Statusi', 'Data'];
        const rows = reports.map(app => [
            app.id,
            app.firstName + " " + app.lastName || app.username || 'N/A',
            `${app.requestedAmount} ${app.currency || 'N/A'}`,
            `${app.durationMonths} muaj`,
            app.loanType,
            app.status,
            new Date(app.createdAt).toLocaleDateString()
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return { color: '#059669', backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' };
            case 'applied': return { color: '#2563eb', backgroundColor: '#eff6ff', borderColor: '#93c5fd' };
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

    const getChangeIcon = (value) => {
        if (value > 0) return <ArrowUp size={16} color="#059669" />;
        if (value < 0) return <ArrowDown size={16} color="#dc2626" />;
        return <Minus size={16} color="#64748b" />;
    };

    const prepareChartData = (applications) => {
        // Monthly trends data
        const monthlyData = {};
        const last6Months = [];
        const now = new Date();

        // Generate last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            last6Months.push({ key: monthKey, name: monthName });
            monthlyData[monthKey] = { name: monthName, applications: 0, approved: 0, rejected: 0, volume: 0 };
        }

        // Process applications
        applications.forEach(app => {
            const appDate = new Date(app.createdAt);
            const monthKey = appDate.toISOString().slice(0, 7);

            if (monthlyData[monthKey]) {
                monthlyData[monthKey].applications++;
                const rawAmount = parseFloat(app.requestedAmount) || 0;
                const amount = app.currency === 'EUR' ? rawAmount * 100 : rawAmount;
                monthlyData[monthKey].volume += amount;

                if (app.status?.toLowerCase() === 'approved') {
                    monthlyData[monthKey].approved++;
                } else if (app.status?.toLowerCase() === 'rejected') {
                    monthlyData[monthKey].rejected++;
                }
            }
        });

        const trendsData = last6Months.map(month => monthlyData[month.key]);

        // Status distribution data
        const statusData = [
            { name: 'Aprovuar', value: applications.filter(app => app.status?.toLowerCase() === 'approved').length, color: '#059669' },
            { name: 'Refuzuar', value: applications.filter(app => app.status?.toLowerCase() === 'rejected').length, color: '#dc2626' },
            { name: 'Në pritje', value: applications.filter(app => app.status?.toLowerCase() === 'applied' || app.status?.toLowerCase() === 'evaluation').length, color: '#d97706' }
        ];

        // Loan type distribution
        const loanTypeData = {};
        applications.forEach(app => {
            const type = app.loanType || 'Other';
            loanTypeData[type] = (loanTypeData[type] || 0) + 1;
        });

        const typeDistribution = Object.entries(loanTypeData).map(([name, value]) => ({ name, value }));

        // Amount ranges
        const amountRanges = {
            '0-20,000 ALL': 0,
            '20,000-100,000 ALL': 0,
            '100,000-300,000 ALL': 0,
            '300,000-1,000,000 ALL': 0,
            '1,000,000+ ALL': 0
        };

        applications.forEach(app => {
            const rawAmount = parseFloat(app.requestedAmount) || 0;
            const amount = app.currency === 'EUR' ? rawAmount * 100 : rawAmount;

            if (amount <= 20000) amountRanges['0-20,000 ALL']++;
            else if (amount <= 100000) amountRanges['20,000-100,000 ALL']++;
            else if (amount <= 300000) amountRanges['100,000-300,000 ALL']++;
            else if (amount <= 1000000) amountRanges['300,000-1,000,000 ALL']++;
            else amountRanges['1,000,000+ ALL']++;
        });

        const amountRangeData = Object.entries(amountRanges).map(([name, value]) => ({ name, value }));

        return {
            trendsData,
            statusData,
            typeDistribution,
            amountRangeData
        };
    };

    // Dynamic styles based on dark mode
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
        padding: '0.5rem 1rem',
        backgroundColor: isDarkMode ? '#374151' : 'white',
        border: isDarkMode ? '1px solid #4b5563' : '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        textDecoration: 'none',
        color: isDarkMode ? '#f9fafb' : '#475569'
    };

    const logoutButtonStyle = {
        ...navButtonStyle,
        color: isDarkMode ? '#f87171' : '#dc2626',
        borderColor: isDarkMode ? 'rgba(248, 113, 113, 0.3)' : '#fca5a5'
    };

    const mainStyle = {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem'
    };

    const statsGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
    };

    const statCardStyle = {
        backgroundColor: isDarkMode
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        padding: '1.5rem',
        border: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.6)'
            : '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: isDarkMode
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s'
    };

    const sectionStyle = {
        backgroundColor: isDarkMode
            ? 'rgba(55, 65, 81, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderRadius: '16px',
        border: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.6)'
            : '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: isDarkMode
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: '2rem'
    };

    const sectionHeaderStyle = {
        padding: '1.5rem',
        borderBottom: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(226, 232, 240, 0.5)',
        backgroundColor: isDarkMode
            ? 'rgba(31, 41, 55, 0.5)'
            : 'rgba(248, 250, 252, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const filtersStyle = {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
    };

    const selectStyle = {
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        border: isDarkMode ? '1px solid #4b5563' : '1px solid #cbd5e1',
        backgroundColor: isDarkMode ? '#374151' : 'white',
        color: isDarkMode ? '#f9fafb' : '#1f2937',
        fontSize: '0.875rem',
        cursor: 'pointer'
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
        backgroundColor: isDarkMode
            ? 'rgba(31, 41, 55, 0.7)'
            : 'rgba(248, 250, 252, 0.7)'
    };

    const tdStyle = {
        padding: '1rem 1.5rem',
        fontSize: '0.875rem',
        borderBottom: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(226, 232, 240, 0.5)',
        color: isDarkMode ? '#f3f4f6' : '#1f2937'
    };

    const paginationStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        backgroundColor: isDarkMode
            ? 'rgba(31, 41, 55, 0.5)'
            : 'rgba(248, 250, 252, 0.5)',
        borderTop: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(226, 232, 240, 0.5)'
    };

    const paginationButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: isDarkMode ? '#374151' : 'white',
        border: isDarkMode ? '1px solid #4b5563' : '1px solid #cbd5e1',
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
        borderTop: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.4)'
            : '1px solid rgba(226, 232, 240, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
        color: isDarkMode ? '#9ca3af' : '#64748b'
    };

    const emptyStateStyle = {
        padding: '3rem',
        textAlign: 'center'
    };

    const loadingStyle = {
        width: '48px',
        height: '48px',
        border: isDarkMode ? '4px solid #374151' : '4px solid #e2e8f0',
        borderTop: isDarkMode ? '4px solid #3b82f6' : '4px solid #1e40af',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
    };

    const exportButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#059669',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s'
    };

    const chartContentStyle = {
        backgroundColor: isDarkMode
            ? 'rgba(31, 41, 55, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: isDarkMode
            ? '1px solid rgba(75, 85, 99, 0.5)'
            : '1px solid rgba(226, 232, 240, 0.5)'
    };

    const chartTitleStyle = {
        fontSize: '1rem',
        fontWeight: '600',
        color: isDarkMode ? '#f9fafb' : '#1e293b',
        margin: '0 0 1rem 0'
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
            <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={loadingStyle}></div>
                    <div style={{ fontSize: '1.5rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>Loading Reports...</div>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
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
                                    src="../images/download.png"
                                    alt="Logo"
                                    style={{ width: 265, height: 80 }}
                                    className="logo-image"
                                />
                            </div>
                            <div style={welcomeSectionStyle}>
                                <h2 style={titleStyle} className="mobile-title">Raporte & Analiza</h2>
                                <p style={subtitleStyle} className="mobile-subtitle">Raporte të detajuara mbi aplikimet për kredi</p>
                            </div>
                        </div>

                        <nav style={navStyle} className="mobile-nav">
                            <button
                                onClick={() => navigate('/employee/home')}
                                style={navButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : 'white'}
                            >
                                <BarChart3 size={16} />
                                <span>Faqja Kryesore</span>
                            </button>

                            <button
                                onClick={() => navigate('/employee/profile')}
                                style={navButtonStyle}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : 'white'}
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
                        </nav>
                    </div>
                </header>

                <main style={mainStyle}>
                    {/* Summary Statistics */}
                    <div style={statsGridStyle}>
                        <div
                            style={statCardStyle}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: isDarkMode ? '#9ca3af' : '#64748b', margin: '0 0 0.5rem 0' }}>
                                        Aplikimet Totale
                                    </p>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
                                        {summaryStats.totalApplications}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                        {getChangeIcon(5)}
                                        <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>krahasuar me periudhën e kaluar</span>
                                    </div>
                                </div>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    backgroundColor: isDarkMode ? 'rgba(30, 64, 175, 0.2)' : '#eff6ff',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={24} color="#1e40af" />
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
                                        Përqindja e Aprovimit
                                    </p>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>
                                        {summaryStats.approvalRate}%
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                        {getChangeIcon(2.5)}
                                        <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>krahasuar me periudhën e kaluar</span>
                                    </div>
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
                                    <TrendingUp size={24} color="#059669" />
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
                                        Vlera mesatare e kredisë
                                    </p>
                                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>
                                        {summaryStats.averageAmount.toLocaleString()} ALL
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                        {getChangeIcon(2.5)}
                                        <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>krahasuar me periudhën e kaluar</span>
                                    </div>
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
                                    <DollarSign size={24} color="#7c3aed" />
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
                                        Shuma Totale
                                    </p>
                                    <p style={{ fontSize: '1.9rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
                                        {summaryStats.totalVolume.toLocaleString()} ALL
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                                        {getChangeIcon(8.3)}
                                        <span style={{ fontSize: '0.75rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>krahasuar me periudhën e kaluar</span>
                                    </div>
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
                                    <BarChart3 size={24} color="#dc2626" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Analytics */}
                    <section style={sectionStyle}>
                        <div style={sectionHeaderStyle}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#1e293b', margin: 0 }}>
                                Paneli i Analizave dhe Grafikëve
                            </h3>
                        </div>

                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>

                                {/* Monthly Trends Chart */}
                                <div style={{
                                    backgroundColor: isDarkMode
                                        ? 'rgba(31, 41, 55, 0.8)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: isDarkMode
                                        ? '1px solid rgba(75, 85, 99, 0.5)'
                                        : '1px solid rgba(226, 232, 240, 0.5)'
                                }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Tendencat Mujore të Aplikimeve
                                    </h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <AreaChart data={prepareChartData(reports).trendsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                                                }}
                                            />
                                            <Legend />
                                            <Area
                                                type="monotone"
                                                dataKey="applications"
                                                stroke="#1e40af"
                                                fill="#1e40af"
                                                fillOpacity={0.1}
                                                name="Aplikime Totale"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="approved"
                                                stroke="#059669"
                                                fill="#059669"
                                                fillOpacity={0.1}
                                                name="Të Aprovuara"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Status Distribution Pie Chart */}
                                <div style={{
                                    backgroundColor: isDarkMode
                                        ? 'rgba(31, 41, 55, 0.8)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: isDarkMode
                                        ? '1px solid rgba(75, 85, 99, 0.5)'
                                        : '1px solid rgba(226, 232, 240, 0.5)'
                                }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Shpërndarja e Statusit të Aplikimeve
                                    </h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={prepareChartData(reports).statusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {prepareChartData(reports).statusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                iconType="circle"
                                                formatter={(value, entry) => (
                                                    <span style={{ color: isDarkMode ? '#f9fafb' : entry.color, fontSize: '14px' }}>
                                                        {value}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Loan Type Distribution */}
                                <div style={{
                                    backgroundColor: isDarkMode
                                        ? 'rgba(31, 41, 55, 0.8)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: isDarkMode
                                        ? '1px solid rgba(75, 85, 99, 0.5)'
                                        : '1px solid rgba(226, 232, 240, 0.5)'
                                }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Shpërndarja sipas Llojit të Kredisë
                                    </h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={prepareChartData(reports).typeDistribution}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                                                }}
                                            />
                                            <Bar dataKey="value" fill="#7c3aed" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Amount Range Distribution */}
                                <div style={{
                                    backgroundColor: isDarkMode
                                        ? 'rgba(31, 41, 55, 0.8)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: isDarkMode
                                        ? '1px solid rgba(75, 85, 99, 0.5)'
                                        : '1px solid rgba(226, 232, 240, 0.5)'
                                }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Intervalet e Shumës së Aplikimeve për Kredi
                                    </h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={prepareChartData(reports).amountRangeData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 9, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                                                }}
                                            />
                                            <Bar dataKey="value" fill="#0ea5e9" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Volume Trends */}
                                <div style={{
                                    backgroundColor: isDarkMode
                                        ? 'rgba(31, 41, 55, 0.8)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    border: isDarkMode
                                        ? '1px solid rgba(75, 85, 99, 0.5)'
                                        : '1px solid rgba(226, 232, 240, 0.5)',
                                    gridColumn: 'span 2'
                                }}>
                                    <h4 style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: isDarkMode ? '#f9fafb' : '#1e293b',
                                        margin: '0 0 1rem 0'
                                    }}>
                                        Tendencat Mujore të Shumës Totale të Aplikimeve për Kredi
                                    </h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={prepareChartData(reports).trendsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e2e8f0'} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: isDarkMode ? '#9ca3af' : '#374151' }}
                                                axisLine={{ stroke: isDarkMode ? '#4b5563' : '#d1d5db' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                                                    border: isDarkMode ? '1px solid #4b5563' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    color: isDarkMode ? '#f9fafb' : '#1f2937'
                                                }}
                                                formatter={(value) => [`${value.toLocaleString()} ALL`, 'Shuma']}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="volume"
                                                stroke="#dc2626"
                                                strokeWidth={3}
                                                name="Shuma totale në ALL"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Filters and Controls */}
                    <section style={sectionStyle}>
                        <div style={sectionHeaderStyle}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#1e293b', margin: 0 }}>
                                Filterat e Raporteve
                            </h3>
                            <div style={filtersStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} color={isDarkMode ? '#9ca3af' : '#64748b'} />
                                    <select
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option value="week">Javën e Kaluar</option>
                                        <option value="month">Muajin e Kaluar</option>
                                        <option value="quarter">Tremujorin e Kaluar</option>
                                        <option value="year">Vitin e Kaluar</option>
                                        <option value="all">Të gjitha</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Filter size={16} color={isDarkMode ? '#9ca3af' : '#64748b'} />
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        style={selectStyle}
                                    >
                                        <option value="all">Të gjitha aplikmet</option>
                                        <option value="applied">Aplikuar (Në pritje)</option>
                                        <option value="evaluation">Në proces vlerësimi</option>
                                        <option value="approved">Aprovuar</option>
                                        <option value="rejected">Refuzuar</option>
                                    </select>
                                </div>

                                <button
                                    onClick={fetchReportsData}
                                    style={navButtonStyle}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#4b5563' : '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : 'white'}
                                >
                                    <RefreshCw size={16} />
                                    <span>Rifresko</span>
                                </button>

                                <button
                                    onClick={handleExportReport}
                                    style={exportButtonStyle}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                >
                                    <Download size={16} />
                                    <span>Eksporto CSV</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Reports Table */}
                    <section style={sectionStyle}>
                        <div style={sectionHeaderStyle}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: isDarkMode ? '#f9fafb' : '#1e293b', margin: 0 }}>
                                Raporte të detajuara
                            </h3>
                            <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#9ca3af' : '#64748b' }}>
                                {reports.length} aplikime u gjetën
                            </div>
                        </div>

                        {reports.length === 0 ? (
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
                                    <HeaderPieChart size={48} color={isDarkMode ? '#9ca3af' : '#64748b'} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: isDarkMode ? '#f9fafb' : '#1e293b', margin: '0 0 0.5rem 0' }}>
                                    Asnjë aplikim nuk u gjet
                                </h3>
                                <p style={{ color: isDarkMode ? '#9ca3af' : '#64748b', margin: 0 }}>
                                    Provoni të rregulloni filtrat për të parë më shumë rezultate
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={tableStyle}>
                                        <thead>
                                        <tr style={{ backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.7)' : 'rgba(248, 250, 252, 0.7)' }}>
                                            <th style={thStyle}>ID e Aplikimit</th>
                                            <th style={thStyle}>Emri i Klientit</th>
                                            <th style={thStyle}>Shuma</th>
                                            <th style={thStyle}>Kohëzgjatja</th>
                                            <th style={thStyle}>Lloji</th>
                                            <th style={thStyle}>Statusi</th>
                                            <th style={thStyle}>Data</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {currentReports.map((app) => (
                                            <tr key={app.id} style={{
                                                backgroundColor: 'transparent',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(248, 250, 252, 0.5)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <td style={tdStyle}>{app.id}</td>
                                                <td style={tdStyle}>{(app.firstName + " " + app.lastName) || 'N/A'}</td>
                                                <td style={tdStyle}>{`${app.requestedAmount} ${app.currency || 'N/A'}`}</td>
                                                <td style={tdStyle}>{`${app.durationMonths} muaj`}</td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#f3f4f6' : '#1f2937' }}>
                                                        {getLoanTypeIcon(app.loanType)}
                                                        <span style={{ marginLeft: '0.5rem' }}>{app.loanType}</span>
                                                    </div>
                                                </td>
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        color: getStatusColor(app.status).color,
                                                        backgroundColor: getStatusColor(app.status).backgroundColor,
                                                        border: `1px solid ${getStatusColor(app.status).borderColor}`,
                                                        borderRadius: '8px',
                                                        padding: '0.25rem 0.5rem',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                                <td style={tdStyle}>{new Date(app.applicationDate || app.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                <div style={paginationStyle}>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        style={currentPage === 1 ? paginationButtonDisabledStyle : paginationButtonStyle}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                        <span>Para</span>
                                    </button>
                                    <div>
                                        Faqja {currentPage} nga {totalPages}
                                    </div>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        style={currentPage === totalPages ? paginationButtonDisabledStyle : paginationButtonStyle}
                                        disabled={currentPage === totalPages}
                                    >
                                        <span>Pas</span>
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                    {/* Footer */}
                    <footer style={footerStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} />
                            <span>Hyrja e fundit: {user.loginTime}</span>
                        </div>
                        <div style={{ color: '#94a3b8' }}>
                            © 2025 Sistemi i Menaxhimit të Kredive BKT
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}

export default Reports;