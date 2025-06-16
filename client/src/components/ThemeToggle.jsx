import React from 'react';
import { useTheme } from '../context/ThemeContext';

    const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
        onClick={toggleTheme}
        style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            color: isDarkMode ? '#fbbf24' : '#f59e0b',
            width: '36px',
            height: '36px'
        }}
        onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        }}
        title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
        {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggle;