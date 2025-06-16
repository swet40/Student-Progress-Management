const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const codeforcesService = require('../services/codeforcesService');
const cronService = require('../services/cronService');
const emailService = require('../services/emailService');

// Get all students
    router.get('/', async (req, res) => {
    console.log('Getting all students');
    
    try {
        const students = await Student.find({}).sort({ createdAt: -1 });
        console.log(`Found ${students.length} students`);
        res.json(students);
    } catch (error) {
        console.log(' Get students error:', error);
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
    });

    // Get single student
    router.get('/:id', async (req, res) => {
    console.log('Getting student:', req.params.id);
    
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
        return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.log('Get student error:', error);
        res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
    });

    // Create new student
    router.post('/', async (req, res) => {
    console.log('Creating new student:', req.body);
    
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        console.log('Student created:', savedStudent._id);
        res.status(201).json(savedStudent);
    } catch (error) {
        console.log('Create student error:', error);
        res.status(400).json({ message: 'Error creating student', error: error.message });
    }
    });

    // Update student
    router.put('/:id', async (req, res) => {
    console.log('Updating student:', req.params.id);
    
    try {
        const student = await Student.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
        );
        
        if (!student) {
        return res.status(404).json({ message: 'Student not found' });
        }
        
        console.log('Student updated:', student._id);
        res.json(student);
    } catch (error) {
        console.log('Update student error:', error);
        res.status(400).json({ message: 'Error updating student', error: error.message });
    }
    });

    // Delete student
    router.delete('/:id', async (req, res) => {
    console.log('Deleting student:', req.params.id);
    
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
        return res.status(404).json({ message: 'Student not found' });
        }
        console.log('Student deleted:', req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.log('Delete student error:', error);
        res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
    });

    // Update student rating from Codeforces
    router.put('/:id/update-rating', async (req, res) => {
    console.log('Updating rating for student:', req.params.id);
    
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
        return res.status(404).json({ message: 'Student not found' });
        }

        const ratingUpdate = await codeforcesService.updateStudentRating(student);
        
        if (ratingUpdate) {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            ratingUpdate,
            { new: true }
        );
        
        res.json({
            message: 'Rating updated successfully',
            student: updatedStudent
        });
        } else {
        res.status(400).json({ 
            message: 'Failed to fetch rating from Codeforces. Please check the handle.' 
        });
        }
    } catch (error) {
        console.log('Update rating error:', error);
        res.status(500).json({ 
        message: 'Error updating rating', 
        error: error.message 
        });
    }
    });

    // Bulk update all student ratings
    router.post('/update-all-ratings', async (req, res) => {
    console.log('Bulk updating all student ratings');
    
    try {
        const students = await Student.find({});
        const results = [];
        
        for (const student of students) {
        const ratingUpdate = await codeforcesService.updateStudentRating(student);
        
        if (ratingUpdate) {
            await Student.findByIdAndUpdate(student._id, ratingUpdate);
            results.push({ 
            studentId: student._id, 
            name: student.name, 
            status: 'success',
            ...ratingUpdate 
            });
        } else {
            results.push({ 
            studentId: student._id, 
            name: student.name, 
            status: 'failed' 
            });
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        res.json({
        message: 'Bulk update completed',
        results
        });
    } catch (error) {
        console.log('Bulk update error:', error);
        res.status(500).json({ 
        message: 'Error updating ratings', 
        error: error.message 
        });
    }
    });

    // Export CSV
    router.get('/export/csv', async (req, res) => {
    console.log('Exporting students to CSV');
    
    try {
        const students = await Student.find({});
        
        // Create CSV content
        const csvHeader = 'Name,Email,Phone,Codeforces Handle,Current Rating,Max Rating,Email Reminders,Created At\n';
        const csvContent = students.map(student => {
        return `"${student.name}","${student.email}","${student.phone}","${student.codeforcesHandle}","${student.currentRating || ''}","${student.maxRating || ''}","${student.emailRemindersEnabled}","${student.createdAt}"`;
        }).join('\n');
        
        const csv = csvHeader + csvContent;
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="students.csv"');
        res.send(csv);
        
        console.log('CSV exported successfully');
    } catch (error) {
        console.log('CSV export error:', error);
        res.status(500).json({ message: 'Error exporting CSV', error: error.message });
    }
});


// Get student profile data (contests + problems)
router.get('/:id/profile', async (req, res) => {
    console.log('Getting profile data for student:', req.params.id);
    
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
        return res.status(404).json({ message: 'Student not found' });
        }

        const contestDays = parseInt(req.query.contestDays) || 90;
        const problemDays = parseInt(req.query.problemDays) || 30;

        const profileData = await codeforcesService.getComprehensiveUserData(
        student.codeforcesHandle, 
        contestDays, 
        problemDays
        );

        if (profileData) {
        res.json({
            student,
            ...profileData
        });
        } else {
        res.status(400).json({ 
            message: 'Failed to fetch Codeforces data. Please check the handle.' 
        });
        }
    } catch (error) {
        console.log('Profile data error:', error);
        res.status(500).json({ 
        message: 'Error fetching profile data', 
        error: error.message 
        });
    }
});

// Get cron job status
    router.get('/cron/status', (req, res) => {
    try {
        const status = cronService.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: 'Error getting cron status', error: error.message });
    }
    });

    // Start cron job
    router.post('/cron/start', (req, res) => {
    try {
        const { schedule } = req.body;
        const result = cronService.start(schedule);
        
        if (result) {
        res.json({ 
            message: 'Cron job started successfully',
            status: cronService.getStatus()
        });
        } else {
        res.status(400).json({ message: 'Failed to start cron job' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error starting cron job', error: error.message });
    }
    });

    // Stop cron job
    router.post('/cron/stop', (req, res) => {
    try {
        cronService.stop();
        res.json({ 
        message: 'Cron job stopped successfully',
        status: cronService.getStatus()
        });
    } catch (error) {
        res.status(500).json({ message: 'Error stopping cron job', error: error.message });
    }
    });

    // Manual sync
    router.post('/cron/sync', async (req, res) => {
    try {
        const result = await cronService.manualSync();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error during manual sync', error: error.message });
    }
    });

    // Update cron schedule
    router.put('/cron/schedule', (req, res) => {
    try {
        const { schedule } = req.body;
        const result = cronService.updateSchedule(schedule);
        
        if (result) {
        res.json({ 
            message: 'Cron schedule updated successfully',
            status: cronService.getStatus()
        });
        } else {
        res.status(400).json({ message: 'Failed to update cron schedule' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating cron schedule', error: error.message });
    }
    });

        // Get common schedules
        router.get('/cron/schedules', (req, res) => {
        try {
            const schedules = cronService.constructor.getCommonSchedules();
            res.json(schedules);
        } catch (error) {
            res.status(500).json({ message: 'Error getting schedules', error: error.message });
        }
        });

        router.get('/email/status', (req, res) => {
    try {
        const status = emailService.getStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: 'Error getting email status', error: error.message });
    }
    });

    // Send test email
    router.post('/email/test', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
        return res.status(400).json({ message: 'Email address required' });
        }

        const result = await emailService.sendTestEmail(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error sending test email', error: error.message });
    }
    });

    // Toggle email reminders for student
    router.put('/:id/email-toggle', async (req, res) => {
    try {
        const { id } = req.params;
        const { enabled } = req.body;

        const student = await Student.findByIdAndUpdate(
        id, 
        { emailRemindersEnabled: enabled },
        { new: true }
        );

        if (!student) {
        return res.status(404).json({ message: 'Student not found' });
        }

        res.json({ 
        message: `Email reminders ${enabled ? 'enabled' : 'disabled'} for ${student.name}`,
        student 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating email settings', error: error.message });
    }
    });

    // Send manual reminder to specific student
    router.post('/:id/send-reminder', async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);

        if (!student) {
        return res.status(404).json({ message: 'Student not found' });
        }

        const result = await emailService.sendReminderEmail(student);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error sending reminder', error: error.message });
    }
    });

module.exports = router;