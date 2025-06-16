import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function RatingChart({ ratingHistory, title = "Rating Progression", theme }) {
    // Fallback theme for when theme prop is not provided
    const defaultTheme = {
        background: { primary: '#ffffff' },
        card: { background: '#ffffff', shadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
        text: { primary: '#000000', secondary: '#6b7280' },
        border: { primary: '#e5e7eb' }
    };

    const currentTheme = theme || defaultTheme;

    if (!ratingHistory || ratingHistory.length === 0) {
        return (
            <div style={{ 
                backgroundColor: currentTheme.card.background,
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                border: `1px solid ${currentTheme.border.primary}`,
                boxShadow: currentTheme.card.shadow
            }}>
                <h3 style={{ 
                    color: currentTheme.text.primary,
                    margin: '0 0 10px 0'
                }}>
                    {title}
                </h3>
                <p style={{ 
                    color: currentTheme.text.secondary,
                    margin: 0
                }}>
                    No rating history available
                </p>
            </div>
        );
    }

    const data = {
        labels: ratingHistory.map(entry => 
            new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
        datasets: [
            {
                label: 'Rating',
                data: ratingHistory.map(entry => entry.rating),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.1
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
                },
                color: currentTheme.text.primary // Theme-aware title color
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: currentTheme.card.background,
                titleColor: currentTheme.text.primary,
                bodyColor: currentTheme.text.primary,
                borderColor: currentTheme.border.primary,
                borderWidth: 1,
                callbacks: {
                    title: function(context) {
                        const dataIndex = context[0].dataIndex;
                        const fullDate = new Date(ratingHistory[dataIndex].date);
                        return fullDate.toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        });
                    },
                    label: function(context) {
                        return `Rating: ${context.parsed.y}`;
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Date',
                    color: currentTheme.text.primary // Theme-aware axis title
                },
                ticks: {
                    color: currentTheme.text.secondary // Theme-aware tick labels
                },
                grid: {
                    display: false
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Rating',
                    color: currentTheme.text.primary // Theme-aware axis title
                },
                ticks: {
                    color: currentTheme.text.secondary // Theme-aware tick labels
                },
                beginAtZero: false,
                grid: {
                    color: currentTheme.text.secondary + '20' // Semi-transparent grid lines
                }
            }
        },
        elements: {
            point: {
                hoverBackgroundColor: 'rgb(99, 102, 241)',
                hoverBorderColor: currentTheme.card.background,
                hoverBorderWidth: 2
            }
        }
    };

    return (
        <div style={{ 
            backgroundColor: currentTheme.card.background,
            padding: '20px',
            borderRadius: '8px',
            border: `1px solid ${currentTheme.border.primary}`,
            boxShadow: currentTheme.card.shadow
        }}>
            <Line data={data} options={options} />
        </div>
    );
}

export default RatingChart;