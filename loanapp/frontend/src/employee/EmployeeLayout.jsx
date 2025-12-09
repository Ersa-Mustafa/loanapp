

// import React, { useState, useEffect } from 'react';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { LogOut, FileText, User, Sun, Moon } from 'lucide-react';
// import api from './api/axios';
// import { toast } from 'react-toastify';

// function EmployeeLayout() {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem('isDarkMode');
//     return saved ? JSON.parse(saved) : false;
//   });
//   const [user, setUser] = useState({ name: '' });
//   const navigate = useNavigate();

//   const toggleDarkMode = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     localStorage.setItem('isDarkMode', JSON.stringify(newMode));
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const profileRes = await api.get('/client/profile');
//       const { user: userInfo } = profileRes.data;
//       if (userInfo.role !== 'employee' && userInfo.role !== 'bank_employee') {
//         navigate('/');
//         return;
//       }
//       setUser({ name: userInfo.username || 'Punonjës' });
//     } catch (err) {
//       toast.error("Nuk mund të ngarkohet profili i punonjësit.");
//       navigate('/');
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await api.post('/client/logout');
//     } catch {}
//     localStorage.clear();
//     navigate('/employee_login');
//   };

//   const navButtonStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '0.5rem',
//     padding: '0.5rem 0.75rem',
//     backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.8)' : 'white',
//     border: isDarkMode ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid #d1d5db',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontSize: '0.875rem',
//     textDecoration: 'none',
//     color: isDarkMode ? '#f9fafb' : '#374151',
//     whiteSpace: 'nowrap',
//     transition: 'background-color 0.2s'
//   };

//   const logoutButtonStyle = {
//     ...navButtonStyle,
//     color: isDarkMode ? '#f87171' : '#dc2626',
//     borderColor: isDarkMode ? 'rgba(248, 113, 113, 0.3)' : '#fca5a5'
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: isDarkMode
//         ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
//         : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
//       fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//       color: isDarkMode ? '#f9fafb' : '#111827',
//       transition: 'all 0.3s ease'
//     }}>
//       {/* Header */}
//       <header style={{
//         backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
//         backdropFilter: 'blur(12px)',
//         borderBottom: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(0, 0, 0, 0.1)',
//         position: 'sticky',
//         top: 0,
//         zIndex: 100,
//         padding: '1rem',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//           <img src="../images/download.png" alt="Logo" style={{ width: 180, height: 60 }} />
//           <h2 style={{ margin: 0 }}>Përshëndetje, {user.name}</h2>
//         </div>

//         <div style={{ display: 'flex', gap: '0.5rem' }}>
//           <Link to="/employee/reports" style={navButtonStyle}>
//             <FileText size={16} /> Raporte
//           </Link>
//           <Link to="/employee/profile" style={navButtonStyle}>
//             <User size={16} /> Profili
//           </Link>
//           <button onClick={handleLogout} style={logoutButtonStyle}>
//             <LogOut size={16} /> Dil
//           </button>
//           <button onClick={toggleDarkMode} style={navButtonStyle}>
//             {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
//           </button>
//         </div>
//       </header>

//       {/* Content */}
//       <main style={{ padding: '1rem' }}>
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default EmployeeLayout;

import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, FileText, User, Sun, Moon } from 'lucide-react';
import api from './api/axios';
import { toast } from 'react-toastify';

function EmployeeLayout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [user, setUser] = useState({ name: '' });
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('isDarkMode', JSON.stringify(newMode));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileRes = await api.get('/client/profile');
      const { user: userInfo } = profileRes.data;
      if (userInfo.role !== 'employee' && userInfo.role !== 'bank_employee') {
        navigate('/');
        return;
      }
      setUser({ name: userInfo.username || 'Punonjës' });
    } catch (err) {
      toast.error("Nuk mund të ngarkohet profili i punonjësit.");
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/client/logout');
    } catch {}
    localStorage.clear();
    navigate('/employee_login');
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
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: isDarkMode ? '#f9fafb' : '#374151',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s'
  };

  const logoutButtonStyle = {
    ...navButtonStyle,
    color: isDarkMode ? '#f87171' : '#dc2626',
    borderColor: isDarkMode ? 'rgba(248, 113, 113, 0.3)' : '#fca5a5'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: isDarkMode
        ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: isDarkMode ? '#f9fafb' : '#111827',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: isDarkMode ? '1px solid rgba(55, 65, 81, 0.5)' : '1px solid rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="../images/download.png" alt="Logo" style={{ width: 180, height: 60 }} />
          <h2 style={{ margin: 0 }}>Përshëndetje, {user.name}</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/employee/reports" style={navButtonStyle}>
            <FileText size={16} /> Raporte
          </Link>
          <Link to="/employee/editprofile" style={navButtonStyle}>
            <User size={16} /> Profili
          </Link>
          <Link to="/employee/employeehome" style={navButtonStyle}>
            <FileText size={16} /> Home
          </Link>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            <LogOut size={16} /> Dil
          </button>
          <button onClick={toggleDarkMode} style={navButtonStyle}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default EmployeeLayout;
