import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';

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

  return (
    <div style={appStyles}>
      <nav style={{
        padding: '20px',
        backgroundColor: theme.button.primary.background,
        color: theme.button.primary.text
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Student Progress Manager</h1>
          <div>
            <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Home</Link>
            <Link to="/students" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Students</Link>
            <Link to="/admin" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Admin</Link>
            <button 
              onClick={toggleTheme}
              style={{
                marginLeft: '20px',
                padding: '5px 10px',
                backgroundColor: theme.button.secondary.background,
                color: theme.button.secondary.text,
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/new" element={<StudentForm />} />
          <Route path="/students/edit/:id" element={<StudentForm />} />
          <Route path="/students/profile/:id" element={<StudentProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

function Home() {
  const { theme } = useTheme();

  return (
    <div>
      <h2>Welcome to Student Progress Manager</h2>
      <p>Manage your students' Codeforces progress and track their achievements.</p><br />
      <Link to="/students" style={{ 
        padding: '10px 20px',
        backgroundColor: theme.button.primary.background,
        color: theme.button.primary.text,
        textDecoration: 'none',
        borderRadius: '5px'
      }}>
        View All Students
      </Link>
    </div>
  );
}

export default App;
