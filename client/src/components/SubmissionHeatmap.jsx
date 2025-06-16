import React from 'react';

    function SubmissionHeatmap({ submissionData, title = "Submission Activity" }) {
    if (!submissionData || submissionData.length === 0) {
        return (
        <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center'
        }}>
            <h3>{title}</h3>
            <p>No submission data available</p>
        </div>
        );
    }

    // Get intensity color based on submission count
    const getIntensity = (count) => {
        if (count === 0) return '#ebedf0';
        if (count <= 2) return '#9be9a8';
        if (count <= 4) return '#40c463';
        if (count <= 6) return '#30a14e';
        return '#216e39';
    };

    // Group data by weeks
    const weeksData = [];
    for (let i = 0; i < submissionData.length; i += 7) {
        weeksData.push(submissionData.slice(i, i + 7));
    }

    // Get day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate total submissions
    const totalSubmissions = submissionData.reduce((sum, day) => sum + day.count, 0);
    const avgSubmissions = (totalSubmissions / submissionData.length).toFixed(1);

    return (
        <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
        }}>
        <div style={{ marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
            {title}
            </h3>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
            <span>{totalSubmissions} submissions in the last {submissionData.length} days</span>
            <span style={{ marginLeft: '15px' }}>Average: {avgSubmissions} per day</span>
            </div>
        </div>

        {/* Heatmap Grid */}
        <div style={{ 
            display: 'flex',
            gap: '3px',
            overflowX: 'auto',
            paddingBottom: '10px'
        }}>
            {/* Day labels */}
            <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
            paddingRight: '10px',
            fontSize: '12px',
            color: '#6b7280'
            }}>
            <div style={{ height: '15px' }}></div>
            {dayNames.map((day, index) => (
                <div key={day} style={{ 
                height: '15px',
                display: 'flex',
                alignItems: 'center',
                visibility: index % 2 === 1 ? 'visible' : 'hidden'
                }}>
                {day}
                </div>
            ))}
            </div>

            {/* Heatmap columns */}
            {weeksData.map((week, weekIndex) => (
            <div key={weekIndex} style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
            }}>
                {/* Month label (show for first week of month) */}
                <div style={{ 
                height: '15px',
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center'
                }}>
                {weekIndex === 0 || new Date(week[0]?.date).getDate() <= 7 ? 
                    new Date(week[0]?.date).toLocaleDateString('en-US', { month: 'short' }) : ''
                }
                </div>
                
                {/* Week days */}
                {week.map((day, dayIndex) => {
                if (!day) return <div key={dayIndex} style={{ width: '15px', height: '15px' }}></div>;
                
                return (
                    <div
                    key={day.date}
                    title={`${day.date}: ${day.count} submissions`}
                    style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: getIntensity(day.count),
                        border: '1px solid rgba(27,31,35,0.06)',
                        borderRadius: '2px',
                        cursor: 'pointer'
                    }}
                    />
                );
                })}
            </div>
            ))}
        </div>

        {/* Legend */}
        <div style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: '15px',
            fontSize: '12px',
            color: '#6b7280',
            gap: '10px'
        }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: '3px' }}>
            {[0, 1, 3, 5, 7].map(count => (
                <div
                key={count}
                style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: getIntensity(count),
                    border: '1px solid rgba(27,31,35,0.06)',
                    borderRadius: '2px'
                }}
                />
            ))}
            </div>
            <span>More</span>
        </div>
        </div>
    );
}

export default SubmissionHeatmap;