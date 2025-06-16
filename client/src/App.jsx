import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import Home from './components/Home';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentProfile from './components/StudentProfile';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  const appStyles = {
    backgroundColor: theme.background.primary,
    color: theme.text.primary,
    minHeight: '100vh',
  };

  const navStyles = {
    padding: '20px 40px',
    backgroundColor: theme.button.primary.background,
    color: theme.button.primary.text,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  const navContainerStyles = {
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const logoStyles = {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0,
    color: 'white'
  };

  const navLinksStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '30px'
  };

  const navLinkStyles = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    padding: '8px 16px',
    borderRadius: '6px'
  };

  const themeButtonStyles = {
    padding: '8px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)'
  };

  const mainContentStyles = {
    backgroundColor: theme.background.primary,
    minHeight: 'calc(100vh - 80px)' // Account for nav height
  };

  return (
    <div style={appStyles}>
      <nav style={navStyles}>
        <div style={navContainerStyles}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={logoStyles}>Student Progress Manager</h1>
          </Link>
          <div style={navLinksStyles}>
            <Link 
              to="/" 
              style={navLinkStyles}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Home
            </Link>
            <Link 
              to="/students" 
              style={navLinkStyles}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Students
            </Link>
            <Link 
              to="/admin" 
              style={navLinkStyles}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Admin
            </Link>
            <button 
              onClick={toggleTheme}
              style={themeButtonStyles}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      <main style={mainContentStyles}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm />} />
          <Route path="/students/profile/:id" element={<StudentProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;