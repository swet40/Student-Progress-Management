import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentAPI } from '../services/api';

    function StudentForm() {
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
        } catch (err) {
        setError('Failed to load student data');
        console.error('Error fetching student:', err);
        } finally {
        setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.codeforcesHandle) {
        setError('Please fill in all required fields');
        return;
        }

        try {
        setLoading(true);
        setError(null);

        if (isEdit) {
            await studentAPI.updateStudent(id, formData);
            alert('Student updated successfully!');
        } else {
            await studentAPI.createStudent(formData);
            alert('Student created successfully!');
        }
        
        navigate('/students');
        } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to save student';
        setError(errorMessage);
        console.error('Error saving student:', err);
        } finally {
        setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/students');
    };

    if (loading && isEdit) {
        return <div>Loading student data...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
        
        {error && (
            <div style={{ 
            color: 'red', 
            backgroundColor: '#fee2e2', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
            }}>
            {error}
            </div>
        )}

        <form onSubmit={handleSubmit} style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '8px', 
            border: '1px solid #ddd' 
        }}>
            
            <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Full Name *
            </label>
            <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '16px'
                }}
                placeholder="Enter student's full name"
            />
            </div>

            <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email Address *
            </label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '16px'
                }}
                placeholder="student@example.com"
            />
            </div>

            <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone Number *
            </label>
            <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '16px'
                }}
                placeholder="1234567890"
            />
            </div>

            <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Codeforces Handle *
            </label>
            <input
                type="text"
                name="codeforcesHandle"
                value={formData.codeforcesHandle}
                onChange={handleChange}
                required
                style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                fontSize: '16px'
                }}
                placeholder="username123"
            />
            <small style={{ color: '#666', fontSize: '14px' }}>
                The username used on Codeforces platform
            </small>
            </div>

            <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>
                <input
                type="checkbox"
                name="emailRemindersEnabled"
                checked={formData.emailRemindersEnabled}
                onChange={handleChange}
                style={{ marginRight: '10px' }}
                />
                Enable email reminders for contests
            </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
                type="button"
                onClick={handleCancel}
                style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
                }}
            >
                Cancel
            </button>
            
            <button
                type="submit"
                disabled={loading}
                style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
                }}
            >
                {loading ? 'Saving...' : (isEdit ? 'Update Student' : 'Add Student')}
            </button>
            </div>
        </form>
        </div>
    );
}

export default StudentForm;