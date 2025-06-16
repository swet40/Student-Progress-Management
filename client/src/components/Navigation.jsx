import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Navigation.css';

    const Navigation = () => {
    return (
        <nav className="navbar">
        <div className="nav-container">
            <Link to="/" className="nav-logo">
            Student Progress Manager
            </Link>
            <div className="nav-links">
            <Link to="/students" className="nav-link">
                All Students
            </Link>
            <Link to="/students/new" className="nav-link btn-primary">
                Add Student
            </Link>
            </div>
        </div>
        </nav>
    );
};

export default Navigation;