import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

    export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
    };

    export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme preference from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode');
        if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
        } else {
        // Default to user's system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
        }
    }, []);

    // Apply theme to document body and save to localStorage
    useEffect(() => {
        document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    // Theme-aware styles object
    const theme = {
        // Background colors
        background: {
        primary: isDarkMode ? '#1a1a1a' : '#ffffff',
        secondary: isDarkMode ? '#2d2d2d' : '#f8f9fa',
        tertiary: isDarkMode ? '#3a3a3a' : '#e9ecef'
        },
        
        // Text colors
        text: {
        primary: isDarkMode ? '#ffffff' : '#212529',
        secondary: isDarkMode ? '#b8b8b8' : '#6c757d',
        tertiary: isDarkMode ? '#8a8a8a' : '#495057'
        },
        
        // Border colors
        border: {
        primary: isDarkMode ? '#404040' : '#dee2e6',
        secondary: isDarkMode ? '#555555' : '#e9ecef'
        },
        
        // Button colors
        button: {
        primary: {
            background: isDarkMode ? '#0d7bf7' : '#007bff',
            text: '#ffffff',
            hover: isDarkMode ? '#0056cc' : '#0056b3'
        },
        secondary: {
            background: isDarkMode ? '#404040' : '#6c757d',
            text: '#ffffff',
            hover: isDarkMode ? '#555555' : '#545b62'
        },
        danger: {
            background: isDarkMode ? '#dc2626' : '#dc3545',
            text: '#ffffff',
            hover: isDarkMode ? '#b91c1c' : '#c82333'
        },
        success: {
            background: isDarkMode ? '#16a34a' : '#28a745',
            text: '#ffffff',
            hover: isDarkMode ? '#15803d' : '#218838'
        },
        warning: {
            background: isDarkMode ? '#f59e0b' : '#ffc107',
            text: isDarkMode ? '#ffffff' : '#212529',
            hover: isDarkMode ? '#d97706' : '#e0a800'
        }
        },
        
        // Card/container colors
        card: {
        background: isDarkMode ? '#2d2d2d' : '#ffffff',
        shadow: isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        
        // Input colors
        input: {
        background: isDarkMode ? '#3a3a3a' : '#ffffff',
        border: isDarkMode ? '#555555' : '#ced4da',
        focus: isDarkMode ? '#0d7bf7' : '#007bff'
        },
        
        // Status colors
        status: {
        running: isDarkMode ? '#16a34a' : '#28a745',
        stopped: isDarkMode ? '#dc2626' : '#dc3545',
        warning: isDarkMode ? '#f59e0b' : '#ffc107',
        info: isDarkMode ? '#3b82f6' : '#17a2b8'
        },
        
        // Chart colors (for better visibility in dark mode)
        chart: {
        primary: isDarkMode ? '#60a5fa' : '#007bff',
        secondary: isDarkMode ? '#34d399' : '#28a745',
        tertiary: isDarkMode ? '#f59e0b' : '#ffc107',
        quaternary: isDarkMode ? '#f87171' : '#dc3545'
        }
    };

    const value = {
        isDarkMode,
        toggleTheme,
        theme
    };

    return (
        <ThemeContext.Provider value={value}>
        {children}
        </ThemeContext.Provider>
    );
    };

    // Global CSS variables for theme (to be added to index.css)
    export const getGlobalThemeStyles = () => `
    .light-theme {
        --bg-primary: #ffffff;
        --bg-secondary: #f8f9fa;
        --bg-tertiary: #e9ecef;
        --text-primary: #212529;
        --text-secondary: #6c757d;
        --border-primary: #dee2e6;
        --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .dark-theme {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --bg-tertiary: #3a3a3a;
        --text-primary: #ffffff;
        --text-secondary: #b8b8b8;
        --border-primary: #404040;
        --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
    `;