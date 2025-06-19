import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                background: 'none',
                border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
                cursor: 'pointer',
                fontSize: '18px',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                width: '40px',
                height: '40px',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1) rotate(15deg)';
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
                e.target.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotate(0deg)';
                e.target.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
                e.target.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
            }}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <span 
                style={{
                    display: 'inline-block',
                    transition: 'all 0.3s ease',
                    fontSize: '20px',
                    lineHeight: '1',
                    transform: isDarkMode ? 'rotate(0deg)' : 'rotate(180deg)',
                    filter: isDarkMode ? 'brightness(1.2)' : 'brightness(0.9)',
                    textShadow: isDarkMode ? '0 0 8px rgba(251, 191, 36, 0.5)' : '0 0 8px rgba(59, 130, 246, 0.5)'
                }}
                role="img"
                aria-label={isDarkMode ? 'Sun' : 'Moon'}
            >
                {isDarkMode ? '☀️' : '🌙'}
            </span>
        </button>
    );
};

export default ThemeToggle;