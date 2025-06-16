import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { studentAPI } from '../services/api';
import RatingChart from './RatingChart';
import ProblemDistributionChart from './ProblemDistributionChart';
import SubmissionHeatmap from './SubmissionHeatmap';

function StudentProfile() {
    const { theme } = useTheme();
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter states
    const [contestFilter, setContestFilter] = useState('90'); // 30, 90, 365 days
    const [problemFilter, setProblemFilter] = useState('30'); // 7, 30, 90 days
    
    // Data states
    const [contestData, setContestData] = useState(null);
    const [problemData, setProblemData] = useState(null);

    useEffect(() => {
        fetchStudentData();
    }, [id]);

    useEffect(() => {
        if (student) {
            fetchContestHistory();
            fetchProblemData();
        }
    }, [contestFilter, problemFilter, student]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);
            await fetchProfileData();
            setError(null);
        } catch (err) {
            setError('Failed to fetch student data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileData = async () => {
        try {
            const response = await studentAPI.getStudentProfile(id, contestFilter, problemFilter);
            console.log('Profile data received:', response.data);
            
            setStudent(response.data.student);
            setContestData(response.data.contestData);
            setProblemData(response.data.problemData);
        } catch (err) {
            console.error('Error fetching profile data:', err);
            throw err;
        }
    };

    const fetchContestHistory = async () => {
        if (!student) return;
        try {
            const response = await studentAPI.getStudentProfile(id, contestFilter, problemFilter);
            setContestData(response.data.contestData);
        } catch (err) {
            console.error('Error fetching contest data:', err);
        }
    };

    const fetchProblemData = async () => {
        if (!student) return;
        try {
            const response = await studentAPI.getStudentProfile(id, contestFilter, problemFilter);
            setProblemData(response.data.problemData);
        } catch (err) {
            console.error('Error fetching problem data:', err);
        }
    };

    const generateMockHeatmap = () => {
        const data = [];
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                count: Math.floor(Math.random() * 5) // 0-4 submissions per day
            });
        }
        return data.reverse();
    };

    // Theme-aware styles
    const containerStyles = {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
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
        transition: 'color 0.2s ease'
    };

    const titleStyles = {
        margin: '0 0 10px 0',
        color: theme.text.primary,
        fontSize: '2rem',
        fontWeight: '700'
    };

    const infoRowStyles = {
        display: 'flex',
        gap: '20px',
        color: theme.text.secondary,
        flexWrap: 'wrap',
        fontSize: '14px'
    };

    const sectionHeaderStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    };

    const sectionTitleStyles = {
        color: theme.text.primary,
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: '600'
    };

    const selectStyles = {
        padding: '8px 12px',
        border: `1px solid ${theme.border.primary}`,
        borderRadius: '6px',
        backgroundColor: theme.card.background,
        color: theme.text.primary,
        fontSize: '14px'
    };

    const labelStyles = {
        marginRight: '10px',
        color: theme.text.primary,
        fontWeight: '500'
    };

    const tableContainerStyles = {
        backgroundColor: theme.card.background,
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: theme.card.shadow || '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: `1px solid ${theme.border.primary}`
    };

    const tableHeaderStyles = {
        padding: '15px',
        margin: 0,
        backgroundColor: theme.background.secondary,
        color: theme.text.primary,
        fontSize: '1.1rem',
        fontWeight: '600'
    };

    const tableStyles = {
        width: '100%',
        borderCollapse: 'collapse'
    };

    const tableHeadStyles = {
        backgroundColor: theme.background.secondary
    };

    const tableHeaderCellStyles = {
        padding: '12px',
        textAlign: 'left',
        color: theme.text.primary,
        fontWeight: '600',
        borderBottom: `1px solid ${theme.border.primary}`
    };

    const tableCellStyles = {
        padding: '12px',
        borderBottom: `1px solid ${theme.border.primary}`,
        color: theme.text.primary
    };

    const emptyStateStyles = {
        padding: '40px',
        textAlign: 'center',
        color: theme.text.secondary,
        fontStyle: 'italic'
    };

    const cardGridStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
    };

    const cardStyles = {
        backgroundColor: theme.card.background,
        padding: '20px',
        borderRadius: '8px',
        border: `1px solid ${theme.border.primary}`,
        boxShadow: theme.card.shadow || '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    const cardTitleStyles = {
        margin: '0 0 10px 0',
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: theme.text.primary // Fixed: use theme text color instead of hardcoded colors
    };

    const cardValueStyles = {
        margin: '0',
        fontSize: '24px',
        fontWeight: '700',
        color: theme.text.primary
    };

    const cardSubtextStyles = {
        margin: '5px 0 0 0',
        color: theme.text.secondary,
        fontSize: '14px'
    };

    const cardLinkStyles = {
        fontSize: '12px', 
        color: theme.button.primary.background,
        textDecoration: 'none',
        fontWeight: '500'
    };

    const chartGridStyles = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
    };

    const loadingStyles = {
        textAlign: 'center',
        padding: '60px',
        backgroundColor: theme.background.primary,
        color: theme.text.primary
    };

    // Enhanced hover effects for cards
    const handleCardHover = (e, isEntering) => {
        if (isEntering) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = theme.card.shadow 
                ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                : '0 4px 12px rgba(0, 0, 0, 0.15)';
        } else {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = theme.card.shadow || '0 2px 4px rgba(0, 0, 0, 0.1)';
        }
    };

    if (loading) return (
        <div style={loadingStyles}>
            <div className="loading" style={{ margin: '0 auto 20px' }}></div>
            <p>Loading student profile...</p>
        </div>
    );

    if (error) return (
        <div style={{ ...loadingStyles, color: theme.button.danger.background }}>
            Error: {error}
        </div>
    );

    if (!student) return (
        <div style={{ ...loadingStyles, color: theme.text.secondary }}>
            Student not found
        </div>
    );

    return (
        <div style={containerStyles}>
            {/* Header */}
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
                <h1 style={titleStyles}>{student.name}</h1>
                <div style={infoRowStyles}>
                    <span><i class="fa-solid fa-envelope"></i> &nbsp; {student.email}</span>
                    <span><i class="fa-solid fa-mobile-screen"></i> &nbsp; {student.phone}</span>
                    <span><i class="fa-solid fa-laptop"></i> &nbsp; {student.codeforcesHandle}</span>
                    <span style={{ color: theme.button.success.background }}>
                        📊 Current: {student.currentRating ?? 'Not set'}
                    </span>
                    <span style={{ color: theme.button.danger.background }}>
                        🏆 Max: {student.maxRating ?? 'Not set'}
                    </span>
                </div>
            </div>

            {/* Contest History Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={sectionHeaderStyles}>
                    <h2 style={sectionTitleStyles}>Contest History</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={labelStyles}>Filter: </label>
                        <select 
                            value={contestFilter}
                            onChange={(e) => setContestFilter(e.target.value)}
                            style={selectStyles}
                        >
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="365">Last 365 days</option>
                        </select>
                    </div>
                </div>

                {/* Rating Graph */}
                <div style={{ marginBottom: '20px' }}>
                    <RatingChart 
                        ratingHistory={contestData?.ratingHistory} 
                        title={`Rating Progression (Last ${contestFilter} days)`}
                    />
                </div>

                {/* Contest List */}
                <div style={tableContainerStyles}>
                    <h3 style={tableHeaderStyles}>Recent Contests</h3>
                    <table style={tableStyles}>
                        <thead style={tableHeadStyles}>
                            <tr>
                                <th style={tableHeaderCellStyles}>Contest</th>
                                <th style={{ ...tableHeaderCellStyles, textAlign: 'center' }}>Date</th>
                                <th style={{ ...tableHeaderCellStyles, textAlign: 'center' }}>Rank</th>
                                <th style={{ ...tableHeaderCellStyles, textAlign: 'center' }}>Rating Change</th>
                                <th style={{ ...tableHeaderCellStyles, textAlign: 'center' }}>Problems Solved</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contestData?.contests?.length > 0 ? contestData.contests.map((contest) => (
                                <tr 
                                    key={contest.id}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = theme.background.secondary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <td style={tableCellStyles}>{contest.name}</td>
                                    <td style={{ ...tableCellStyles, textAlign: 'center' }}>{contest.date}</td>
                                    <td style={{ ...tableCellStyles, textAlign: 'center' }}>{contest.rank}</td>
                                    <td style={{ 
                                        ...tableCellStyles,
                                        textAlign: 'center',
                                        color: contest.ratingChange >= 0 ? theme.button.success.background : theme.button.danger.background,
                                        fontWeight: '600'
                                    }}>
                                        {contest.ratingChange >= 0 ? '+' : ''}{contest.ratingChange}
                                    </td>
                                    <td style={{ ...tableCellStyles, textAlign: 'center' }}>
                                        {contest.problemsSolved || 'N/A'}/{contest.totalProblems || 'N/A'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={emptyStateStyles}>
                                        No contest data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Problem Solving Data Section */}
            <div>
                <div style={sectionHeaderStyles}>
                    <h2 style={sectionTitleStyles}>Problem Solving Data</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <label style={labelStyles}>Filter: </label>
                        <select 
                            value={problemFilter}
                            onChange={(e) => setProblemFilter(e.target.value)}
                            style={selectStyles}
                        >
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                        </select>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div style={cardGridStyles}>
                    <div 
                        style={cardStyles}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                    >
                        <h4 style={cardTitleStyles}>
                            Most Difficult Problem
                        </h4>
                        <p style={cardValueStyles}>
                            {problemData?.mostDifficultProblem?.name || 'No problems solved'}
                        </p>
                        <p style={cardSubtextStyles}>
                            Rating: {problemData?.mostDifficultProblem?.rating || 'N/A'}
                        </p>
                        {problemData?.mostDifficultProblem?.url && (
                            <a 
                                href={problemData.mostDifficultProblem.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={cardLinkStyles}
                                onMouseEnter={(e) => {
                                    e.target.style.color = theme.button.primary.hover;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = theme.button.primary.background;
                                }}
                            >
                                View Problem →
                            </a>
                        )}
                    </div>

                    <div 
                        style={cardStyles}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                    >
                        <h4 style={cardTitleStyles}>
                            Total Problems Solved
                        </h4>
                        <p style={cardValueStyles}>{problemData?.totalSolved || 0}</p>
                    </div>

                    <div 
                        style={cardStyles}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                    >
                        <h4 style={cardTitleStyles}>
                            Average Rating
                        </h4>
                        <p style={cardValueStyles}>{problemData?.averageRating || 0}</p>
                    </div>

                    <div 
                        style={cardStyles}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                    >
                        <h4 style={cardTitleStyles}>
                            Problems per Day
                        </h4>
                        <p style={cardValueStyles}>{problemData?.averagePerDay || 0}</p>
                    </div>
                </div>

                {/* Charts */}
                <div style={chartGridStyles}>
                    <ProblemDistributionChart 
                        ratingDistribution={problemData?.ratingDistribution}
                        title={`Problems by Rating (Last ${problemFilter} days)`}
                    />
                    <SubmissionHeatmap 
                        submissionData={problemData?.submissionHeatmap}
                        title={`Submission Activity (Last ${problemFilter} days)`}
                    />
                </div>
            </div>
        </div>
    );
}

export default StudentProfile;