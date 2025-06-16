import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { studentAPI } from '../services/api';

function StudentForm() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: '',
        emailRemindersEnabled: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Modal states
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Load student data if editing
    useEffect(() => {
        if (isEdit) {
            fetchStudent();
        }
    }, [id, isEdit]);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getStudent(id);
            setFormData({
                name: response.data.name || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                codeforcesHandle: response.data.codeforcesHandle || '',
                emailRemindersEnabled: response.data.emailRemindersEnabled ?? true
            });
            setError(null);
        } catch (err) {
            setError('Failed to load student data');
            console.error('Error fetching student:', err);
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (message) => {
        setModalMessage(message);
        setShowSuccessModal(true);
    };

    const showError = (message) => {
        setModalMessage(message);
        setShowErrorModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email address is required');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!formData.codeforcesHandle.trim()) {
            setError('Codeforces handle is required');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^\d{10,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number (10-15 digits)');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (isEdit) {
                await studentAPI.updateStudent(id, formData);
                showSuccess('Student updated successfully!');
            } else {
                await studentAPI.createStudent(formData);
                showSuccess('Student created successfully!');
            }
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to save student';
            showError(errorMessage);
            console.error('Error saving student:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        navigate('/students');
    };

    const handleCancel = () => {
        navigate('/students');
    };

    // Modal Component
    const Modal = ({ show, onClose, children, title }) => {
        if (!show) return null;

        const modalOverlayStyles = {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        };

        const modalContentStyles = {
            backgroundColor: theme.card.background,
            padding: '30px',
            borderRadius: '12px',
            border: `1px solid ${theme.border.primary}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            minWidth: '400px',
            maxWidth: '500px',
            position: 'relative'
        };

        return (
            <div style={modalOverlayStyles} onClick={onClose}>
                <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
                    {title && (
                        <h3 style={{ 
                            margin: '0 0 20px 0', 
                            color: theme.text.primary,
                            fontSize: '1.2rem',
                            fontWeight: '600'
                        }}>
                            {title}
                        </h3>
                    )}
                    {children}
                </div>
            </div>
        );
    };

    // Theme-aware styles
    const containerStyles = {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
        minHeight: '100vh'
    };

    const headerStyles = {
        marginBottom: '30px'
    };

    const backLinkStyles = {
        color: theme.button.primary.background,
        textDecoration: 'none',
        marginBottom: '10px',
        display: 'inline-block',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'color 0.2s ease'
    };

    const titleStyles = {
        color: theme.text.primary,
        margin: '0',
        fontSize: '1.8rem',
        fontWeight: '600'
    };

    const formStyles = {
        backgroundColor: theme.card.background,
        padding: '30px',
        borderRadius: '8px',
        border: `1px solid ${theme.border.primary}`,
        boxShadow: theme.card.shadow || '0 2px 4px rgba(0, 0, 0, 0.1)'
    };

    const labelStyles = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: theme.text.primary,
        fontSize: '14px'
    };

    const inputStyles = {
        width: '100%',
        padding: '12px',
        border: `1px solid ${theme.border.primary}`,
        borderRadius: '6px',
        fontSize: '16px',
        backgroundColor: theme.card.background,
        color: theme.text.primary,
        transition: 'border-color 0.2s ease',
        boxSizing: 'border-box'
    };

    const checkboxContainerStyles = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        color: theme.text.primary
    };

    const checkboxStyles = {
        marginRight: '10px',
        width: '16px',
        height: '16px'
    };

    const buttonStyles = {
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        minWidth: '120px'
    };

    const primaryButtonStyles = {
        ...buttonStyles,
        backgroundColor: loading ? theme.button.secondary.background : theme.button.primary.background,
        color: loading ? theme.button.secondary.text : theme.button.primary.text,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1
    };

    const secondaryButtonStyles = {
        ...buttonStyles,
        backgroundColor: theme.button.secondary.background,
        color: theme.button.secondary.text
    };

    const modalButtonStyles = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        minWidth: '80px'
    };

    const errorStyles = {
        color: theme.button.danger.background,
        backgroundColor: theme.button.danger.background + '20',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '14px',
        border: `1px solid ${theme.button.danger.background}30`
    };

    const helpTextStyles = {
        color: theme.text.secondary,
        fontSize: '14px',
        marginTop: '4px'
    };

    const loadingStyles = {
        textAlign: 'center',
        padding: '60px',
        backgroundColor: theme.background.primary,
        color: theme.text.primary
    };

    if (loading && isEdit && !formData.name) {
        return (
            <div style={loadingStyles}>
                <div className="loading" style={{ margin: '0 auto 20px' }}></div>
                <p>Loading student data...</p>
            </div>
        );
    }

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <Link 
                    to="/students" 
                    style={backLinkStyles}
                    onMouseEnter={(e) => {
                        e.target.style.color = theme.button.primary.hover;
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = theme.button.primary.background;
                    }}
                >
                    ← Back to Students
                </Link>
                <h2 style={titleStyles}>
                    {isEdit ? 'Edit Student' : 'Add New Student'}
                </h2>
            </div>
            
            {error && (
                <div style={errorStyles}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={formStyles}>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>
                        Full Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={inputStyles}
                        placeholder="Enter student's full name"
                        onFocus={(e) => {
                            e.target.style.borderColor = theme.button.primary.background;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = theme.border.primary;
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={inputStyles}
                        placeholder="student@example.com"
                        onFocus={(e) => {
                            e.target.style.borderColor = theme.button.primary.background;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = theme.border.primary;
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={inputStyles}
                        placeholder="1234567890"
                        onFocus={(e) => {
                            e.target.style.borderColor = theme.button.primary.background;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = theme.border.primary;
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyles}>
                        Codeforces Handle *
                    </label>
                    <input
                        type="text"
                        name="codeforcesHandle"
                        value={formData.codeforcesHandle}
                        onChange={handleChange}
                        required
                        style={inputStyles}
                        placeholder="username123"
                        onFocus={(e) => {
                            e.target.style.borderColor = theme.button.primary.background;
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = theme.border.primary;
                        }}
                    />
                    <div style={helpTextStyles}>
                        The username used on Codeforces platform
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={checkboxContainerStyles}>
                        <input
                            type="checkbox"
                            name="emailRemindersEnabled"
                            checked={formData.emailRemindersEnabled}
                            onChange={handleChange}
                            style={checkboxStyles}
                        />
                        Enable email reminders for contests
                    </label>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={secondaryButtonStyles}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = theme.button.secondary.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = theme.button.secondary.background;
                        }}
                    >
                        Cancel
                    </button>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        style={primaryButtonStyles}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = theme.button.primary.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = theme.button.primary.background;
                            }
                        }}
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student')}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onClose={handleSuccessModalClose}
                title="Success"
            >
                <div style={{ textAlign: 'center' }}>
                    {/* <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div> */}
                    <p style={{ color: theme.text.primary, marginBottom: '20px', lineHeight: '1.5' }}>
                        {modalMessage}
                    </p>
                    <button
                        onClick={handleSuccessModalClose}
                        style={{
                            ...modalButtonStyles,
                            backgroundColor: theme.button.primary.background,
                            color: theme.button.primary.text
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = theme.button.primary.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = theme.button.primary.background;
                        }}
                    >
                        OK
                    </button>
                </div>
            </Modal>

            {/* Error Modal */}
            <Modal
                show={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                title="Error"
            >
                <div style={{ textAlign: 'center' }}>
                    {/* <div style={{ fontSize: '3rem', marginBottom: '15px' }}>❌</div> */}
                    <p style={{ color: theme.text.primary, marginBottom: '20px', lineHeight: '1.5' }}>
                        {modalMessage}
                    </p>
                    <button
                        onClick={() => setShowErrorModal(false)}
                        style={{
                            ...modalButtonStyles,
                            backgroundColor: theme.button.danger.background,
                            color: theme.button.danger.text
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = theme.button.danger.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = theme.button.danger.background;
                        }}
                    >
                        OK
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default StudentForm;