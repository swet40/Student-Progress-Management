import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

    export const studentAPI = {
    getAllStudents: () => api.get('/students'),
    getStudent: (id) => api.get(`/students/${id}`),
    createStudent: (studentData) => api.post('/students', studentData),
    updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
    deleteStudent: (id) => api.delete(`/students/${id}`),
    exportCSV: () => api.get('/students/export/csv', { responseType: 'blob' }),

    // Codeforces rating updates
    updateStudentRating: (id) => api.put(`/students/${id}/update-rating`),
    updateAllRatings: () => api.post('/students/update-all-ratings'),

    // Add this to your studentAPI object
    getStudentProfile: (id, contestDays = 90, problemDays = 30) => 
    api.get(`/students/${id}/profile?contestDays=${contestDays}&problemDays=${problemDays}`),
    };

    export const cronAPI = {
    getStatus: () => api.get('/students/cron/status'),
    start: (schedule) => api.post('/students/cron/start', { schedule }),
    stop: () => api.post('/students/cron/stop'),
    manualSync: () => api.post('/students/cron/sync'),
    updateSchedule: (schedule) => api.put('/students/cron/schedule', { schedule }),
    getSchedules: () => api.get('/students/cron/schedules')
    };

    

export default api;