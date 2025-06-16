import React from 'react';
    import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    } from 'chart.js';
    import { Bar } from 'react-chartjs-2';

    ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
    );

    function ProblemDistributionChart({ ratingDistribution, title = "Problems by Rating Range" }) {
    if (!ratingDistribution || ratingDistribution.length === 0) {
        return (
        <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center'
        }}>
            <h3>{title}</h3>
            <p>No problem data available</p>
        </div>
        );
    }

    // Filter out empty categories and sort by rating range
    const filteredData = ratingDistribution.filter(item => item.count > 0);

    const data = {
        labels: filteredData.map(item => item.range),
        datasets: [
        {
            label: 'Problems Solved',
            data: filteredData.map(item => item.count),
            backgroundColor: [
            'rgba(34, 197, 94, 0.8)',   // Green
            'rgba(59, 130, 246, 0.8)',  // Blue
            'rgba(147, 51, 234, 0.8)',  // Purple
            'rgba(236, 72, 153, 0.8)',  // Pink
            'rgba(245, 158, 11, 0.8)',  // Yellow
            'rgba(239, 68, 68, 0.8)',   // Red
            'rgba(156, 163, 175, 0.8)', // Gray
            'rgba(20, 184, 166, 0.8)',  // Teal
            'rgba(168, 85, 247, 0.8)',  // Violet
            'rgba(251, 146, 60, 0.8)',  // Orange
            'rgba(132, 204, 22, 0.8)',  // Lime
            ],
            borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(147, 51, 234, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(156, 163, 175, 1)',
            'rgba(20, 184, 166, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(251, 146, 60, 1)',
            'rgba(132, 204, 22, 1)',
            ],
            borderWidth: 2,
            borderRadius: 4,
            borderSkipped: false,
        }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: title,
            font: {
            size: 16,
            weight: 'bold'
            }
        },
        tooltip: {
            callbacks: {
            label: function(context) {
                const total = filteredData.reduce((sum, item) => sum + item.count, 0);
                const percentage = total > 0 ? Math.round((context.parsed.y / total) * 100) : 0;
                return `${context.parsed.y} problems (${percentage}%)`;
            }
            }
        }
        },
        scales: {
        x: {
            display: true,
            title: {
            display: true,
            text: 'Rating Range'
            },
            grid: {
            display: false
            }
        },
        y: {
            display: true,
            title: {
            display: true,
            text: 'Number of Problems'
            },
            beginAtZero: true,
            grid: {
            color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
            stepSize: 1
            }
        }
        },
        elements: {
        bar: {
            borderWidth: 2,
        }
        }
    };

    return (
        <div style={{ 
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
        }}>
        <Bar data={data} options={options} />
        </div>
    );
}

export default ProblemDistributionChart;