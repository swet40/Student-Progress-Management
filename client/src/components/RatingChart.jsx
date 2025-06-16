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

    function RatingChart({ ratingHistory, title = "Rating Progression" }) {
    if (!ratingHistory || ratingHistory.length === 0) {
        return (
        <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center'
        }}>
            <h3>{title}</h3>
            <p>No rating history available</p>
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
            }
        },
        tooltip: {
            mode: 'index',
            intersect: false,
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
            text: 'Date'
            },
            grid: {
            display: false
            }
        },
        y: {
            display: true,
            title: {
            display: true,
            text: 'Rating'
            },
            beginAtZero: false,
            grid: {
            color: 'rgba(0, 0, 0, 0.1)'
            }
        }
        },
        elements: {
        point: {
            hoverBackgroundColor: 'rgb(99, 102, 241)',
            hoverBorderColor: 'white',
            hoverBorderWidth: 2
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
        <Line data={data} options={options} />
        </div>
    );
}

export default RatingChart;