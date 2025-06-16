import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { studentAPI } from '../services/api';

function StudentList() {
    const { theme } = useTheme();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [exporting, setExporting] = useState(false);
    
    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getAllStudents();
            setStudents(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch students');
            console.error('Error fetching students:', err);
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

    const handleDeleteClick = (student) => {
        setSelectedStudent(student);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setIsProcessing(true);
            await studentAPI.deleteStudent(selectedStudent._id);
            setStudents(students.filter(student => student._id !== selectedStudent._id));
            setShowDeleteModal(false);
            showSuccess('Student deleted successfully!');
        } catch (err) {
            setShowDeleteModal(false);
            showError('Failed to delete student. Please try again.');
            console.error('Error deleting student:', err);
        } finally {
            setIsProcessing(false);
            setSelectedStudent(null);
        }
    };

    const handleExportCSV = async () => {
        try {
            setExporting(true);
            const response = await studentAPI.exportCSV();
            
            // Create blob and download
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            showSuccess('CSV exported successfully!');
        } catch (err) {
            showError('Failed to export CSV. Please try again.');
            console.error('Error exporting CSV:', err);
        } finally {
            setExporting(false);
        }
    };

    const handleUpdateRatingClick = (student) => {
        setSelectedStudent(student);
        setShowUpdateModal(true);
    };

    const handleUpdateRatingConfirm = async () => {
        try {
            setIsProcessing(true);
            const response = await studentAPI.updateStudentRating(selectedStudent._id);
            
            console.log('Full API response:', response);
            console.log('Response data:', response.data);
            
            // Check if student data exists in response
            if (response.data && response.data.student) {
                const updatedStudent = response.data.student;
                console.log('Updated student:', updatedStudent);

                setStudents(prevStudents => 
                    prevStudents.map(student => 
                        student._id === selectedStudent._id ? updatedStudent : student
                    )
                );
            } else {
                // If no student data in response, refetch all students
                console.log('No student data in response, refetching all students');
                fetchStudents();
            }
            
            setShowUpdateModal(false);
            showSuccess('Rating updated successfully!');
        } catch (err) {
            setShowUpdateModal(false);
            showError('Failed to update rating. Please try again.');
            console.error('Error updating rating:', err);
        } finally {
            setIsProcessing(false);
            setSelectedStudent(null);
        }
    };

    const handleBulkUpdateClick = () => {
        setShowBulkUpdateModal(true);
    };

    const handleBulkUpdateConfirm = async () => {
        try {
            setIsProcessing(true);
            setLoading(true);
            await studentAPI.updateAllRatings();
            fetchStudents();
            setShowBulkUpdateModal(false);
            showSuccess('All ratings updated successfully!');
        } catch (err) {
            setShowBulkUpdateModal(false);
            showError('Failed to update ratings. Please try again.');
            console.error('Error updating ratings:', err);
        } finally {
            setIsProcessing(false);
            setLoading(false);
        }
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
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
        padding: '20px'
    };

    const headerStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    };

    const titleStyles = {
        color: theme.text.primary,
        margin: 0,
        fontSize: '1.8rem',
        fontWeight: '600'
    };

    const buttonGroupStyles = {
        display: 'flex',
        gap: '10px'
    };

    const buttonStyles = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease'
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

    const primaryButtonStyles = {
        ...modalButtonStyles,
        backgroundColor: theme.button.primary.background,
        color: theme.button.primary.text
    };

    const dangerButtonStyles = {
        ...modalButtonStyles,
        backgroundColor: theme.button.danger.background,
        color: theme.button.danger.text
    };

    const secondaryButtonStyles = {
        ...modalButtonStyles,
        backgroundColor: theme.button.secondary.background,
        color: theme.button.secondary.text
    };

    const updateAllButtonStyles = {
        ...buttonStyles,
        backgroundColor: loading ? theme.button.secondary.background : theme.button.warning.background,
        color: theme.button.warning.text,
        cursor: loading || students.length === 0 ? 'not-allowed' : 'pointer'
    };

    const exportButtonStyles = {
        ...buttonStyles,
        backgroundColor: exporting ? theme.button.secondary.background : theme.button.success.background,
        color: theme.button.success.text,
        cursor: exporting || students.length === 0 ? 'not-allowed' : 'pointer'
    };

    const addButtonStyles = {
        ...buttonStyles,
        backgroundColor: theme.button.primary.background,
        color: theme.button.primary.text,
        display: 'inline-block'
    };

    const tableContainerStyles = {
        backgroundColor: theme.card.background,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: theme.card.shadow,
        border: `1px solid ${theme.border.primary}`
    };

    const tableStyles = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const headerRowStyles = {
        backgroundColor: theme.background.secondary,
        borderBottom: `2px solid ${theme.border.primary}`
    };

    const headerCellStyles = {
        padding: '12px 15px',
        textAlign: 'left',
        fontWeight: '600',
        color: theme.text.primary
    };

    const getRowStyles = (index) => ({
        borderBottom: `1px solid ${theme.border.primary}`,
        backgroundColor: index % 2 === 0 ? theme.card.background : theme.background.secondary,
        transition: 'background-color 0.2s ease'
    });

    const cellStyles = {
        padding: '12px 15px',
        color: theme.text.primary
    };

    const actionButtonStyles = {
        padding: '4px 8px',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        textDecoration: 'none',
        fontSize: '12px',
        fontWeight: '500'
    };

    const emptyStateStyles = {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: theme.card.background,
        borderRadius: '8px',
        border: `1px solid ${theme.border.primary}`
    };

    if (loading) return (
        <div style={{ ...containerStyles, textAlign: 'center', padding: '60px' }}>
            <div className="loading" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: theme.text.secondary }}>Loading students...</p>
        </div>
    );

    if (error) return (
        <div style={{ ...containerStyles, textAlign: 'center', padding: '60px' }}>
            <div style={{ color: theme.button.danger.background, fontSize: '18px' }}>
                Error: {error}
            </div>
        </div>
    );

    return (
        <div style={containerStyles}>
            <div style={headerStyles}>
                <h2 style={titleStyles}>All Students ({students.length})</h2>
                <div style={buttonGroupStyles}>
                    <button
                        onClick={handleBulkUpdateClick}
                        disabled={loading || students.length === 0}
                        style={updateAllButtonStyles}
                        onMouseEnter={(e) => {
                            if (!loading && students.length > 0) {
                                e.target.style.backgroundColor = theme.button.warning.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading && students.length > 0) {
                                e.target.style.backgroundColor = theme.button.warning.background;
                            }
                        }}
                    >
                        Update All Ratings
                    </button>
                    <button
                        onClick={handleExportCSV}
                        disabled={exporting || students.length === 0}
                        style={exportButtonStyles}
                        onMouseEnter={(e) => {
                            if (!exporting && students.length > 0) {
                                e.target.style.backgroundColor = theme.button.success.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!exporting && students.length > 0) {
                                e.target.style.backgroundColor = theme.button.success.background;
                            }
                        }}
                    >
                        {exporting ? 'Exporting...' : 'Export CSV'}
                    </button>
                    <Link 
                        to="/students/new" 
                        style={addButtonStyles}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = theme.button.primary.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = theme.button.primary.background;
                        }}
                    >
                        Add New Student
                    </Link>
                </div>
            </div>

            {students.length === 0 ? (
                <div style={emptyStateStyles}>
                    <h3 style={{ color: theme.text.primary, marginBottom: '10px' }}>No students found</h3>
                    <p style={{ color: theme.text.secondary, marginBottom: '20px' }}>Start by adding your first student!</p>
                    <Link 
                        to="/students/new" 
                        style={addButtonStyles}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = theme.button.primary.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = theme.button.primary.background;
                        }}
                    >
                        Add Student
                    </Link>
                </div>
            ) : (
                <div style={tableContainerStyles}>
                    <table style={tableStyles}>
                        <thead>
                            <tr style={headerRowStyles}>
                                <th style={headerCellStyles}>Name</th>
                                <th style={headerCellStyles}>Email</th>
                                <th style={headerCellStyles}>Phone</th>
                                <th style={headerCellStyles}>CF Handle</th>
                                <th style={{ ...headerCellStyles, textAlign: 'center' }}>Current Rating</th>
                                <th style={{ ...headerCellStyles, textAlign: 'center' }}>Max Rating</th>
                                <th style={{ ...headerCellStyles, textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr 
                                    key={student._id} 
                                    style={getRowStyles(index)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.background.tertiary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = index % 2 === 0 ? theme.card.background : theme.background.secondary;
                                    }}
                                >
                                    <td style={{ ...cellStyles, fontWeight: '500' }}>{student.name}</td>
                                    <td style={cellStyles}>{student.email}</td>
                                    <td style={cellStyles}>{student.phone}</td>
                                    <td style={{ 
                                        ...cellStyles, 
                                        fontFamily: 'monospace', 
                                        color: theme.button.primary.background,
                                        fontWeight: '500'
                                    }}>
                                        {student.codeforcesHandle}
                                    </td>
                                    <td style={{ 
                                        ...cellStyles,
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        color: student.currentRating > 0 ? theme.button.success.background : theme.text.secondary
                                    }}>
                                        {student.currentRating ?? 'Not set'}
                                    </td>
                                    <td style={{ 
                                        ...cellStyles,
                                        textAlign: 'center',
                                        fontWeight: '600',
                                        color: student.maxRating > 0 ? theme.button.danger.background : theme.text.secondary
                                    }}>
                                        {student.maxRating ?? 'Not set'}
                                    </td>
                                    <td style={{ ...cellStyles, textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <Link 
                                                to={`/students/edit/${student._id}`} 
                                                style={{ 
                                                    ...actionButtonStyles,
                                                    backgroundColor: theme.button.success.background,
                                                    color: theme.button.success.text
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = theme.button.success.hover;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = theme.button.success.background;
                                                }}
                                            >
                                                Edit
                                            </Link>
                                            <Link 
                                                to={`/students/profile/${student._id}`}
                                                style={{ 
                                                    ...actionButtonStyles,
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
                                                Details
                                            </Link>
                                            <button 
                                                onClick={() => handleUpdateRatingClick(student)} 
                                                style={{ 
                                                    ...actionButtonStyles,
                                                    backgroundColor: theme.button.warning.background,
                                                    color: theme.button.warning.text
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = theme.button.warning.hover;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = theme.button.warning.background;
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(student)} 
                                                style={{ 
                                                    ...actionButtonStyles,
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
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => !isProcessing && setShowDeleteModal(false)}
                title="Confirm Delete"
            >
                <p style={{ color: theme.text.primary, marginBottom: '20px', lineHeight: '1.5' }}>
                    Are you sure you want to delete <strong>{selectedStudent?.name}</strong>? 
                    This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => setShowDeleteModal(false)}
                        disabled={isProcessing}
                        style={secondaryButtonStyles}
                        onMouseEnter={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.secondary.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.secondary.background;
                            }
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteConfirm}
                        disabled={isProcessing}
                        style={{
                            ...dangerButtonStyles,
                            opacity: isProcessing ? 0.6 : 1,
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.danger.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.danger.background;
                            }
                        }}
                    >
                        {isProcessing ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </Modal>

            {/* Update Rating Confirmation Modal */}
            <Modal
                show={showUpdateModal}
                onClose={() => !isProcessing && setShowUpdateModal(false)}
                title="Update Rating"
            >
                <p style={{ color: theme.text.primary, marginBottom: '20px', lineHeight: '1.5' }}>
                    Update rating for <strong>{selectedStudent?.name}</strong> from Codeforces?
                    This will fetch the latest rating data.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => setShowUpdateModal(false)}
                        disabled={isProcessing}
                        style={secondaryButtonStyles}
                        onMouseEnter={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.secondary.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.secondary.background;
                            }
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdateRatingConfirm}
                        disabled={isProcessing}
                        style={{
                            ...primaryButtonStyles,
                            opacity: isProcessing ? 0.6 : 1,
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.primary.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.primary.background;
                            }
                        }}
                    >
                        {isProcessing ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </Modal>

            {/* Bulk Update Confirmation Modal */}
            <Modal
                show={showBulkUpdateModal}
                onClose={() => !isProcessing && setShowBulkUpdateModal(false)}
                title="Update All Ratings"
            >
                <p style={{ color: theme.text.primary, marginBottom: '20px', lineHeight: '1.5' }}>
                    Update ratings for all students? This may take a while as it fetches 
                    the latest data from Codeforces for each student.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => setShowBulkUpdateModal(false)}
                        disabled={isProcessing}
                        style={secondaryButtonStyles}
                        onMouseEnter={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.secondary.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.secondary.background;
                            }
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBulkUpdateConfirm}
                        disabled={isProcessing}
                        style={{
                            ...primaryButtonStyles,
                            opacity: isProcessing ? 0.6 : 1,
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.primary.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isProcessing) {
                                e.target.style.backgroundColor = theme.button.primary.background;
                            }
                        }}
                    >
                        {isProcessing ? 'Updating...' : 'Update All'}
                    </button>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal
                show={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Success"
            >
                <div style={{ textAlign: 'center' }}>
                    {/* <div style={{ fontSize: '3rem', marginBottom: '15px' }}>✅</div> */}
                    <p style={{ color: theme.text.primary, marginBottom: '20px', lineHeight: '1.5' }}>
                        {modalMessage}
                    </p>
                    <button
                        onClick={() => setShowSuccessModal(false)}
                        style={primaryButtonStyles}
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
                        style={dangerButtonStyles}
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

export default StudentList;