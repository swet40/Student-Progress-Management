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

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await studentAPI.deleteStudent(id);
                setStudents(students.filter(student => student._id !== id));
                alert('Student deleted successfully!');
            } catch (err) {
                alert('Failed to delete student');
                console.error('Error deleting student:', err);
            }
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
            
            alert('CSV exported successfully!');
        } catch (err) {
            alert('Failed to export CSV');
            console.error('Error exporting CSV:', err);
        } finally {
            setExporting(false);
        }
    };

    const handleUpdateRating = async (studentId, name) => {
        if (window.confirm(`Update rating for ${name} from Codeforces?`)) {
            try {
                const response = await studentAPI.updateStudentRating(studentId);
                
                console.log('Full API response:', response);
                console.log('Response data:', response.data);
                
                alert('Rating updated successfully!');
                
                // Check if student data exists in response
                if (response.data && response.data.student) {
                    const updatedStudent = response.data.student;
                    console.log('Updated student:', updatedStudent);

                    setStudents(prevStudents => 
                        prevStudents.map(student => 
                            student._id === studentId ? updatedStudent : student
                        )
                    );
                } else {
                    // If no student data in response, refetch all students
                    console.log('No student data in response, refetching all students');
                    fetchStudents();
                }
            } catch (err) {
                alert('Failed to update rating');
                console.error('Error updating rating:', err);
            }
        }
    };

    const handleBulkUpdateRatings = async () => {
        if (window.confirm('Update ratings for all students? This may take a while.')) {
            try {
                setLoading(true);
                await studentAPI.updateAllRatings();
                alert('All ratings updated successfully!');
                fetchStudents();
            } catch (err) {
                alert('Failed to update ratings');
                console.error('Error updating ratings:', err);
            } finally {
                setLoading(false);
            }
        }
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
                        onClick={handleBulkUpdateRatings}
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
                                                onClick={() => handleUpdateRating(student._id, student.name)} 
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
                                                onClick={() => handleDelete(student._id, student.name)} 
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
        </div>
    );
}

export default StudentList;