import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cronAPI } from '../services/api';

function AdminDashboard() {
    const { theme } = useTheme();
    const [cronStatus, setCronStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [schedules, setSchedules] = useState({});
    const [customSchedule, setCustomSchedule] = useState('');
    const [lastSyncResult, setLastSyncResult] = useState(null);

    useEffect(() => {
        fetchCronStatus();
        fetchSchedules();
        
        // Refresh status every 30 seconds
        const interval = setInterval(fetchCronStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchCronStatus = async () => {
        try {
            const response = await cronAPI.getStatus();
            setCronStatus(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cron status:', error);
            setLoading(false);
        }
    };

    const fetchSchedules = async () => {
        try {
            const response = await cronAPI.getSchedules();
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleStartCron = async (schedule) => {
        try {
            await cronAPI.start(schedule);
            await fetchCronStatus();
            alert('Cron job started successfully!');
        } catch (error) {
            alert('Failed to start cron job: ' + error.response?.data?.message);
        }
    };

    const handleStopCron = async () => {
        try {
            await cronAPI.stop();
            await fetchCronStatus();
            alert('Cron job stopped successfully!');
        } catch (error) {
            alert('Failed to stop cron job: ' + error.response?.data?.message);
        }
    };

    const handleManualSync = async () => {
        if (window.confirm('Start manual sync? This may take several minutes.')) {
            try {
                setSyncing(true);
                const response = await cronAPI.manualSync();
                setLastSyncResult(response.data);
                await fetchCronStatus();
                alert(`Manual sync completed! ${response.data.successful} successful, ${response.data.failed} failed`);
            } catch (error) {
                alert('Manual sync failed: ' + error.response?.data?.message);
            } finally {
                setSyncing(false);
            }
        }
    };

    const handleUpdateSchedule = async () => {
        if (!customSchedule.trim()) {
            alert('Please enter a cron schedule');
            return;
        }

        try {
            await cronAPI.updateSchedule(customSchedule);
            await fetchCronStatus();
            setCustomSchedule('');
            alert('Schedule updated successfully!');
        } catch (error) {
            alert('Failed to update schedule: ' + error.response?.data?.message);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleString();
    };

    const getStatusColor = (isRunning) => {
        return isRunning ? '#16a34a' : '#dc2626';
    };

    // Theme-aware styles
    const containerStyles = {
        backgroundColor: theme.background.primary,
        color: theme.text.primary,
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
    };

    const titleStyles = {
        marginBottom: '30px',
        color: theme.text.primary,
        fontSize: '1.8rem',
        fontWeight: '600'
    };

    const cardStyles = {
        backgroundColor: theme.card.background,
        padding: '25px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: `1px solid ${theme.border.primary}`,
        boxShadow: theme.card.shadow || '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
    };

    const sectionTitleStyles = {
        margin: '0 0 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: theme.text.primary,
        fontSize: '1.3rem',
        fontWeight: '600'
    };

    const codeBlockStyles = {
        margin: '5px 0',
        fontFamily: 'monospace',
        backgroundColor: theme.background.secondary,
        color: theme.text.primary,
        padding: '8px',
        borderRadius: '4px',
        border: `1px solid ${theme.border.primary}`
    };

    const infoTextStyles = {
        margin: '5px 0',
        color: theme.text.secondary
    };

    const buttonStyles = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'all 0.2s ease'
    };

    const buttonPrimaryStyles = {
        ...buttonStyles,
        backgroundColor: theme.button.primary.background,
        color: theme.button.primary.text
    };

    const buttonDangerStyles = {
        ...buttonStyles,
        backgroundColor: theme.button.danger.background,
        color: theme.button.danger.text
    };

    const buttonWarningStyles = {
        ...buttonStyles,
        backgroundColor: theme.button.warning.background,
        color: theme.button.warning.text
    };

    const buttonSecondaryStyles = {
        ...buttonStyles,
        backgroundColor: theme.button.secondary.background,
        color: theme.button.secondary.text
    };

    const buttonDisabledStyles = {
        ...buttonStyles,
        backgroundColor: theme.button.secondary.background,
        color: theme.button.secondary.text,
        cursor: 'not-allowed',
        opacity: 0.6
    };

    const quickScheduleButtonStyles = {
        padding: '12px',
        backgroundColor: theme.background.secondary,
        border: `1px solid ${theme.border.primary}`,
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'left',
        color: theme.text.primary,
        transition: 'all 0.2s ease',
        width: '100%'
    };

    const inputStyles = {
        padding: '10px',
        border: `1px solid ${theme.border.primary}`,
        borderRadius: '5px',
        fontFamily: 'monospace',
        minWidth: '250px',
        backgroundColor: theme.card.background,
        color: theme.text.primary
    };

    const smallTextStyles = {
        color: theme.text.secondary,
        marginTop: '8px',
        display: 'block',
        fontSize: '0.9rem'
    };

    const statsCardStyles = {
        textAlign: 'center',
        padding: '15px',
        borderRadius: '8px'
    };

    const successCardStyles = {
        ...statsCardStyles,
        backgroundColor: theme.button.success.background,
        color: theme.button.success.text,
        opacity: 0.9
    };

    const errorCardStyles = {
        ...statsCardStyles,
        backgroundColor: theme.button.danger.background,
        color: theme.button.danger.text,
        opacity: 0.9
    };

    const warningCardStyles = {
        ...statsCardStyles,
        backgroundColor: theme.button.warning.background,
        color: theme.button.warning.text,
        opacity: 0.9
    };

    const infoCardStyles = {
        ...statsCardStyles,
        backgroundColor: theme.button.primary.background,
        color: theme.button.primary.text,
        opacity: 0.9
    };

    const listContainerStyles = {
        backgroundColor: theme.background.secondary,
        padding: '15px',
        borderRadius: '8px',
        border: `1px solid ${theme.border.primary}`
    };

    if (loading) return (
        <div style={{ ...containerStyles, textAlign: 'center', padding: '60px' }}>
            <div className="loading" style={{ margin: '0 auto 20px' }}></div>
            <p style={{ color: theme.text.secondary }}>Loading admin dashboard...</p>
        </div>
    );

    return (
        <div style={containerStyles}>
            <h1 style={titleStyles}>Admin Dashboard</h1>

            {/* Cron Job Status Card */}
            <div style={cardStyles}>
                <h2 style={sectionTitleStyles}>
                    <span>Cron Job Status</span>
                    <span style={{ 
                        backgroundColor: getStatusColor(cronStatus?.isRunning),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                    }}>
                        {cronStatus?.isRunning ? 'RUNNING' : 'STOPPED'}
                    </span>
                </h2>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '25px'
                }}>
                    <div>
                        <strong>Current Schedule:</strong>
                        <p style={codeBlockStyles}>
                            {cronStatus?.currentSchedule || 'Not set'}
                        </p>
                    </div>
                    <div>
                        <strong>Last Run:</strong>
                        <p style={infoTextStyles}>{formatDate(cronStatus?.lastRunTime)}</p>
                    </div>
                    <div>
                        <strong>Next Run:</strong>
                        <p style={infoTextStyles}>{formatDate(cronStatus?.nextRunTime)}</p>
                    </div>
                    <div>
                        <strong>Sync Status:</strong>
                        <p style={{ 
                            margin: '5px 0', 
                            color: cronStatus?.syncInProgress ? theme.button.warning.background : theme.text.secondary
                        }}>
                            {cronStatus?.syncInProgress ? 'In Progress...' : 'Idle'}
                        </p>
                    </div>
                </div>

                {/* Control Buttons */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {cronStatus?.isRunning ? (
                        <button
                            onClick={handleStopCron}
                            style={buttonDangerStyles}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = theme.button.danger.hover;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = theme.button.danger.background;
                            }}
                        >
                            Stop Cron Job
                        </button>
                    ) : (
                        <button
                            onClick={() => handleStartCron()}
                            style={buttonPrimaryStyles}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = theme.button.primary.hover;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = theme.button.primary.background;
                            }}
                        >
                            Start Cron Job
                        </button>
                    )}
                    
                    <button
                        onClick={handleManualSync}
                        disabled={syncing || cronStatus?.syncInProgress}
                        style={syncing || cronStatus?.syncInProgress ? buttonDisabledStyles : buttonWarningStyles}
                        onMouseEnter={(e) => {
                            if (!syncing && !cronStatus?.syncInProgress) {
                                e.target.style.backgroundColor = theme.button.warning.hover;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!syncing && !cronStatus?.syncInProgress) {
                                e.target.style.backgroundColor = theme.button.warning.background;
                            }
                        }}
                    >
                        {syncing ? 'Syncing...' : 'Manual Sync'}
                    </button>

                    <button
                        onClick={fetchCronStatus}
                        style={buttonSecondaryStyles}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = theme.button.secondary.hover;
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = theme.button.secondary.background;
                        }}
                    >
                        Refresh Status
                    </button>
                </div>
            </div>

            {/* Schedule Management */}
            <div style={cardStyles}>
                <h2 style={sectionTitleStyles}>Schedule Management</h2>

                {/* Preset Schedules */}
                <div style={{ marginBottom: '25px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: theme.text.primary }}>Quick Schedules</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        {Object.entries(schedules).map(([name, schedule]) => (
                            <button
                                key={name}
                                onClick={() => handleStartCron(schedule)}
                                style={quickScheduleButtonStyles}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = theme.background.tertiary;
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = theme.background.secondary;
                                }}
                            >
                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                    {name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </div>
                                <div style={{ fontSize: '12px', color: theme.text.secondary, fontFamily: 'monospace' }}>
                                    {schedule}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Schedule */}
                <div>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: theme.text.primary }}>Custom Schedule</h3>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            placeholder="Enter cron expression (e.g., 0 3 * * *)"
                            value={customSchedule}
                            onChange={(e) => setCustomSchedule(e.target.value)}
                            style={inputStyles}
                        />
                        <button
                            onClick={handleUpdateSchedule}
                            style={buttonPrimaryStyles}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = theme.button.primary.hover;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = theme.button.primary.background;
                            }}
                        >
                            Update Schedule
                        </button>
                    </div>
                    <small style={smallTextStyles}>
                        Cron format: minute hour day month dayOfWeek (e.g., "0 2 * * *" = daily at 2 AM)
                    </small>
                </div>
            </div>

            {/* Last Sync Results */}
            {lastSyncResult && (
                <div style={cardStyles}>
                    <h2 style={sectionTitleStyles}>Last Sync Results</h2>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '15px',
                        marginBottom: '20px'
                    }}>
                        <div style={successCardStyles}>
                            <div style={{ fontSize: '24px', fontWeight: '600' }}>
                                {lastSyncResult.successful || 0}
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.8 }}>Successful</div>
                        </div>
                        <div style={errorCardStyles}>
                            <div style={{ fontSize: '24px', fontWeight: '600' }}>
                                {lastSyncResult.failed || 0}
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.8 }}>Failed</div>
                        </div>
                        <div style={warningCardStyles}>
                            <div style={{ fontSize: '24px', fontWeight: '600' }}>
                                {lastSyncResult.inactiveStudents?.length || 0}
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.8 }}>Inactive Students</div>
                        </div>
                        <div style={infoCardStyles}>
                            <div style={{ fontSize: '24px', fontWeight: '600' }}>
                                {lastSyncResult.duration?.toFixed(1) || 0}s
                            </div>
                            <div style={{ fontSize: '14px', opacity: 0.8 }}>Duration</div>
                        </div>
                    </div>

                    {/* Inactive Students List */}
                    {lastSyncResult.inactiveStudents && lastSyncResult.inactiveStudents.length > 0 && (
                        <div>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: theme.button.warning.background }}>
                                ⚠️ Inactive Students (No submissions in 7 days)
                            </h3>
                            <div style={listContainerStyles}>
                                {lastSyncResult.inactiveStudents.map((student, index) => (
                                    <div key={index} style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        padding: '8px 0',
                                        borderBottom: index < lastSyncResult.inactiveStudents.length - 1 
                                            ? `1px solid ${theme.border.primary}` 
                                            : 'none'
                                    }}>
                                        <span style={{ fontWeight: '600' }}>{student.name}</span>
                                        <span style={{ color: theme.text.secondary }}>@{student.handle}</span>
                                        <span style={{ fontSize: '14px', color: theme.text.secondary }}>{student.email}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error Details */}
                    {lastSyncResult.errors && lastSyncResult.errors.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: theme.button.danger.background }}>
                                ❌ Sync Errors
                            </h3>
                            <div style={listContainerStyles}>
                                {lastSyncResult.errors.map((error, index) => (
                                    <div key={index} style={{ 
                                        padding: '8px 0',
                                        borderBottom: index < lastSyncResult.errors.length - 1 
                                            ? `1px solid ${theme.border.primary}` 
                                            : 'none'
                                    }}>
                                        <strong>{error.student}</strong> (@{error.handle}): {error.error}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;