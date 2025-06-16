import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { studentAPI } from '../services/api';

function Home() {
    const { theme } = useTheme();
    const [stats, setStats] = useState({
        totalStudents: 0,
        activeStudents: 0,
        avgRating: 0,
        topPerformer: null
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        
        // Check if mobile on mount and resize
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Replace with actual API calls
            const response = await studentAPI.getDashboardStats();
            setStats(response.data.stats || stats);
            setRecentActivity(response.data.recentActivity || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Mock data for demonstration
            setStats({
                totalStudents: 156,
                activeStudents: 142,
                avgRating: 1247,
                topPerformer: { name: 'Alex Chen', rating: 1856, handle: 'alexc_codes' }
            });
            setRecentActivity([
                { type: 'rating_update', student: 'Sarah Wilson', message: 'Rating increased to 1456', time: '2 hours ago' },
                { type: 'new_student', student: 'Mike Johnson', message: 'New student added', time: '5 hours ago' },
                { type: 'contest', student: 'Emma Davis', message: 'Participated in Codeforces Round #912', time: '1 day ago' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Theme-aware styles with mobile responsiveness
    const containerStyles = {
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
        minHeight: '100vh',
        padding: '0'
    };

    const heroSectionStyles = {
        background: `linear-gradient(135deg, ${theme.button.primary.background} 0%, ${theme.button.primary.hover || theme.button.primary.background} 100%)`,
        padding: isMobile ? '60px 20px' : '80px 40px',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
    };

    const heroContentStyles = {
        maxWidth: isMobile ? 'none' : '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        width: isMobile ? '100%' : 'auto'
    };

    const heroTitleStyles = {
        fontSize: isMobile ? '2.5rem' : '3.5rem',
        fontWeight: '700',
        marginBottom: '20px',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        lineHeight: '1.2'
    };

    const heroSubtitleStyles = {
        fontSize: isMobile ? '1.1rem' : '1.3rem',
        marginBottom: '40px',
        opacity: 0.9,
        lineHeight: '1.6',
        padding: isMobile ? '0 10px' : '0'
    };

    const ctaButtonStyles = {
        padding: isMobile ? '12px 24px' : '15px 30px',
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: '600',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: '2px solid white',
        borderRadius: '50px',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)'
    };

    const mainContentStyles = {
        maxWidth: isMobile ? 'none' : '1200px',
        margin: '0 auto',
        padding: isMobile ? '40px 20px' : '60px 20px',
        width: isMobile ? '100%' : 'auto'
    };

    const statsGridStyles = {
        display: 'grid',
        gridTemplateColumns: isMobile 
            ? 'repeat(2, 1fr)' 
            : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: isMobile ? '12px' : '30px',
        marginBottom: isMobile ? '40px' : '60px'
    };

    const statCardStyles = {
        backgroundColor: theme.card.background,
        padding: isMobile ? '16px 12px' : '30px',
        borderRadius: isMobile ? '12px' : '16px',
        border: `1px solid ${theme.border.primary}`,
        boxShadow: theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        minHeight: isMobile ? '100px' : 'auto'
    };

    const statNumberStyles = {
        fontSize: isMobile ? '1.6rem' : '2.5rem',
        fontWeight: '700',
        marginBottom: isMobile ? '5px' : '10px',
        color: theme.button.primary.background,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        lineHeight: '1.2'
    };

    const statLabelStyles = {
        color: theme.text.secondary,
        fontSize: isMobile ? '11px' : '16px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        lineHeight: isMobile ? '1.3' : '1.4'
    };

    const sectionTitleStyles = {
        fontSize: isMobile ? '1.6rem' : '2rem',
        fontWeight: '600',
        marginBottom: isMobile ? '20px' : '30px',
        color: theme.text.primary,
        textAlign: 'center'
    };

    const featuresGridStyles = {
        display: 'grid',
        gridTemplateColumns: isMobile 
            ? '1fr' 
            : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '20px' : '30px',
        marginBottom: isMobile ? '40px' : '60px'
    };

    const featureCardStyles = {
        backgroundColor: theme.card.background,
        padding: isMobile ? '30px 20px' : '40px 30px',
        borderRadius: '16px',
        border: `1px solid ${theme.border.primary}`,
        boxShadow: theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
        textAlign: 'center'
    };

    const featureIconStyles = {
        fontSize: isMobile ? '2.5rem' : '3rem',
        marginBottom: '20px',
        display: 'block'
    };

    const featureTitleStyles = {
        fontSize: isMobile ? '1.2rem' : '1.3rem',
        fontWeight: '600',
        marginBottom: '15px',
        color: theme.text.primary
    };

    const featureDescStyles = {
        color: theme.text.secondary,
        lineHeight: '1.6',
        fontSize: isMobile ? '14px' : '16px'
    };

    const activitySectionStyles = {
        backgroundColor: theme.card.background,
        border: `1px solid ${theme.border.primary}`,
        borderRadius: '16px',
        padding: isMobile ? '20px' : '30px',
        boxShadow: theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)'
    };

    const activityItemStyles = {
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '12px 0' : '15px 0',
        borderBottom: `1px solid ${theme.border.primary}`,
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left',
        gap: isMobile ? '10px' : '0'
    };

    const activityIconStyles = {
        width: isMobile ? '35px' : '40px',
        height: isMobile ? '35px' : '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: isMobile ? '0' : '15px',
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: '600',
        flexShrink: 0
    };

    const activityContentStyles = {
        flex: 1,
        minWidth: 0, // Allows text to truncate properly
        width: isMobile ? '100%' : 'auto'
    };

    const activityStudentStyles = {
        fontWeight: '600',
        color: theme.text.primary,
        marginBottom: '4px',
        fontSize: isMobile ? '15px' : '16px'
    };

    const activityMessageStyles = {
        color: theme.text.secondary,
        fontSize: isMobile ? '13px' : '14px',
        wordBreak: 'break-word'
    };

    const activityTimeStyles = {
        color: theme.text.secondary,
        fontSize: '12px',
        flexShrink: 0,
        marginTop: isMobile ? '5px' : '0'
    };

    const getActivityIcon = (type) => {
        switch(type) {
            case 'rating_update': return { icon: '📈', bg: theme.button.success.background };
            case 'new_student': return { icon: '👤', bg: theme.button.primary.background };
            case 'contest': return { icon: '🏆', bg: theme.button.warning.background };
            default: return { icon: '📝', bg: theme.button.secondary.background };
        }
    };

    const quickActionStyles = {
        display: 'flex',
        gap: isMobile ? '15px' : '20px',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '40px',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center'
    };

    const actionButtonStyles = {
        padding: isMobile ? '14px 24px' : '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: isMobile ? '15px' : '16px',
        fontWeight: '500',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: isMobile ? '100%' : 'auto',
        maxWidth: isMobile ? '300px' : 'none',
        textAlign: 'center'
    };

    const topPerformerCardStyles = {
        ...statCardStyles,
        gridColumn: isMobile ? 'span 2' : 'auto'
    };

    if (loading) {
        return (
            <div style={{ ...containerStyles, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loading" style={{ margin: '0 auto 20px' }}></div>
            </div>
        );
    }

    return (
        <div style={containerStyles}>
            {/* Hero Section */}
            <section style={heroSectionStyles}>
                <div style={heroContentStyles}>
                    <h1 style={heroTitleStyles}>Student Progress Manager</h1>
                    <p style={heroSubtitleStyles}>
                        Track, analyze, and boost your students' competitive programming journey with comprehensive Codeforces integration and real-time progress monitoring.
                    </p>
                    <Link 
                        to="/students" 
                        style={ctaButtonStyles}
                        onMouseEnter={(e) => {
                            if (!isMobile) {
                                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isMobile) {
                                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }
                        }}
                    >
                        View All Students
                    </Link>
                </div>
                
                {/* Floating Elements - Hidden on mobile for better performance */}
                {!isMobile && (
                    <>
                        <div style={{
                            position: 'absolute',
                            top: '20%',
                            left: '10%',
                            fontSize: '2rem',
                            opacity: 0.1,
                            animation: 'float 6s ease-in-out infinite'
                        }}>💻</div>
                        <div style={{
                            position: 'absolute',
                            bottom: '30%',
                            right: '15%',
                            fontSize: '1.5rem',
                            opacity: 0.1,
                            animation: 'float 4s ease-in-out infinite reverse'
                        }}>📊</div>
                    </>
                )}
            </section>

            {/* Main Content */}
            <main style={mainContentStyles}>
                {/* Statistics Cards */}
                <section style={{ marginBottom: isMobile ? '40px' : '60px' }}>
                    <h2 style={sectionTitleStyles}>Dashboard Overview</h2>
                    <div style={statsGridStyles}>
                        <div 
                            style={statCardStyles}
                            onMouseEnter={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                        >
                            <div style={statNumberStyles}>{stats.totalStudents}</div>
                            <div style={statLabelStyles}>Total Students</div>
                        </div>

                        <div 
                            style={statCardStyles}
                            onMouseEnter={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                        >
                            <div style={statNumberStyles}>{stats.activeStudents}</div>
                            <div style={statLabelStyles}>Active Students</div>
                        </div>

                        <div 
                            style={statCardStyles}
                            onMouseEnter={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                        >
                            <div style={statNumberStyles}>{stats.avgRating}</div>
                            <div style={statLabelStyles}>Average Rating</div>
                        </div>

                        {stats.topPerformer && (
                            <div 
                                style={{
                                    ...statCardStyles,
                                    gridColumn: isMobile ? 'span 2' : 'auto'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isMobile) {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isMobile) {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
                                    }
                                }}
                            >
                                <div style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', marginBottom: '8px' }}>🏆</div>
                                <div style={{ 
                                    fontSize: isMobile ? '14px' : '1.2rem', 
                                    fontWeight: '600', 
                                    color: theme.text.primary, 
                                    marginBottom: '4px',
                                    lineHeight: '1.3'
                                }}>
                                    {stats.topPerformer.name}
                                </div>
                                <div style={{ 
                                    color: theme.button.warning.background, 
                                    fontWeight: '600',
                                    fontSize: isMobile ? '13px' : '16px',
                                    marginBottom: isMobile ? '4px' : '6px'
                                }}>
                                    {stats.topPerformer.rating} Rating
                                </div>
                                <div style={statLabelStyles}>Top Performer</div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Features Section */}
                <section style={{ marginBottom: isMobile ? '40px' : '60px' }}>
                    <h2 style={sectionTitleStyles}>Key Features</h2>
                    <div style={featuresGridStyles}>
                        <div 
                            style={featureCardStyles}
                            onMouseEnter={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                        >
                            <span style={featureIconStyles}>📈</span>
                            <h3 style={featureTitleStyles}>Real-time Rating Tracking</h3>
                            <p style={featureDescStyles}>
                                Automatically sync and track student ratings from Codeforces with live updates and historical progress charts.
                            </p>
                        </div>

                        <div 
                            style={featureCardStyles}
                            onMouseEnter={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <span style={featureIconStyles}>🏆</span>
                            <h3 style={featureTitleStyles}>Contest Analytics</h3>
                            <p style={featureDescStyles}>
                                Detailed contest performance analysis with ranking trends, problem-solving patterns, and improvement insights.
                            </p>
                        </div>

                        <div 
                            style={featureCardStyles}
                            onMouseEnter={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isMobile) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = theme.card.shadow || '0 4px 12px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                        >
                            <span style={featureIconStyles}>⚙️</span>
                            <h3 style={featureTitleStyles}>Automated Sync</h3>
                            <p style={featureDescStyles}>
                                Schedule automatic data synchronization with customizable intervals to keep student progress up-to-date.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Recent Activity */}
                <section>
                    <h2 style={sectionTitleStyles}>Recent Activity</h2>
                    <div style={activitySectionStyles}>
                        {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
                            const { icon, bg } = getActivityIcon(activity.type);
                            return (
                                <div 
                                    key={index} 
                                    style={{
                                        ...activityItemStyles,
                                        borderBottom: index === recentActivity.length - 1 ? 'none' : `1px solid ${theme.border.primary}`
                                    }}
                                >
                                    <div style={{ ...activityIconStyles, backgroundColor: bg, color: 'white' }}>
                                        {icon}
                                    </div>
                                    <div style={activityContentStyles}>
                                        <div style={activityStudentStyles}>
                                            {activity.student}
                                        </div>
                                        <div style={activityMessageStyles}>
                                            {activity.message}
                                        </div>
                                    </div>
                                    <div style={activityTimeStyles}>
                                        {activity.time}
                                    </div>
                                </div>
                            );
                        }) : (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: isMobile ? '30px 20px' : '40px', 
                                color: theme.text.secondary 
                            }}>
                                No recent activity to display
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Actions */}
                <div style={quickActionStyles}>
                    <Link 
                        to="/students/new" 
                        style={{
                            ...actionButtonStyles,
                            backgroundColor: theme.button.primary.background,
                            color: theme.button.primary.text
                        }}
                        onMouseEnter={(e) => {
                            if (!isMobile) {
                                e.target.style.backgroundColor = theme.button.primary.hover;
                                e.target.style.transform = 'translateY(-2px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isMobile) {
                                e.target.style.backgroundColor = theme.button.primary.background;
                                e.target.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        Add New Student
                    </Link>
                    
                    <Link 
                        to="/admin" 
                        style={{
                            ...actionButtonStyles,
                            backgroundColor: theme.button.warning.background,
                            color: theme.button.warning.text
                        }}
                        onMouseEnter={(e) => {
                            if (!isMobile) {
                                e.target.style.backgroundColor = theme.button.warning.hover;
                                e.target.style.transform = 'translateY(-2px)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isMobile) {
                                e.target.style.backgroundColor = theme.button.warning.background;
                                e.target.style.transform = 'translateY(0)';
                            }
                        }}
                    >
                        Admin Dashboard
                    </Link>
                </div>
            </main>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @media (max-width: 480px) {
                    .stats-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default Home;