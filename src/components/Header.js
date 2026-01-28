import React, { useState, useEffect } from 'react';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }

    // Load sidebar state from localStorage
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    setIsSidebarCollapsed(sidebarCollapsed);
    if (sidebarCollapsed) {
      document.body.classList.add('sidebar-collapse');
    }

    // Load user data from localStorage
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        setUser(JSON.parse(adminUser));
      } catch (error) {
        console.error('Error parsing adminUser from localStorage:', error);
      }
    }
  }, []);

  const handleToggleSidebar = () => {
    const newCollapsedState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', newCollapsedState.toString());

    if (newCollapsedState) {
      document.body.classList.add('sidebar-collapse');
    } else {
      document.body.classList.remove('sidebar-collapse');
    }
  };

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            className="nav-link"
            data-widget="pushmenu"
            onClick={handleToggleSidebar}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <i className="fas fa-bars"></i>
          </button>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <a href="#" className="nav-link">
            Home
          </a>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-bell"></i>
            <span className="badge badge-warning navbar-badge">0</span>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-item dropdown-header">0 Notifications</span>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <i className="fas fa-envelope mr-2"></i> No new messages
            </a>
          </div>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleToggleDarkMode();
            }}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </a>
        </li>

        <li className="nav-item">
          <span className="nav-link">
            <img
              src="/logo.png"
              className="user-image elevation-2"
              alt="User Avatar"
              style={{ width: '30px', height: 'auto', marginRight: '8px' }}
            />
            <span className="d-none d-md-inline" style={{ marginRight: '15px' }}>
              {user ? user.name || user.email || 'Admin' : 'Admin'}
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={(e) => {
                e.preventDefault();
                if (window.confirm('Are you sure you want to logout?')) {
                  localStorage.removeItem('adminToken');
                  localStorage.removeItem('adminUser');
                  window.location.href = '/login';
                }
              }}
              style={{ border: 'none', background: 'transparent', color: '#6c757d' }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Header;