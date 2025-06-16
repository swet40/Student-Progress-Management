const cron = require('node-cron');
const cronParser = require('cron-parser');
const Student = require('../models/student');
const codeforcesService = require('./codeforcesService');
const emailService = require('./emailService');

    class CronService {
    constructor() {
        this.cronJob = null;
        this.isRunning = false;
        this.defaultSchedule = '0 2 * * *'; // 2 AM daily
        this.currentSchedule = this.defaultSchedule;
        this.lastRunTime = null;
        this.nextRunTime = null;
        this.syncInProgress = false;
    }

    // Start the cron job
    start(schedule = this.defaultSchedule) {
        try {
        // Stop existing job if running
        this.stop();

        // Validate cron expression
        if (!cron.validate(schedule)) {
            throw new Error('Invalid cron expression');
        }

        this.currentSchedule = schedule;

        // Create and start the cron job
        this.cronJob = cron.schedule(schedule, async () => {
            console.log('🕐 Cron job started: Syncing Codeforces data...');
            await this.syncAllStudentsData();
        }, {
            scheduled: false, // Don't start immediately
            timezone: "UTC"
        });

        this.cronJob.start();
        this.isRunning = true;
        this.updateNextRunTime();

        console.log(`✅ Cron job started with schedule: ${schedule}`);
        console.log(`📅 Next run time: ${this.nextRunTime}`);
        
        return true;
        } catch (error) {
        console.error('❌ Error starting cron job:', error.message);
        return false;
        }
    }

    // Stop the cron job
    stop() {
        if (this.cronJob) {
        this.cronJob.stop();
        this.cronJob.destroy();
        this.cronJob = null;
        }
        this.isRunning = false;
        this.nextRunTime = null;
        console.log('🛑 Cron job stopped');
    }

    // Manually trigger sync
    async manualSync() {
        if (this.syncInProgress) {
        console.log('⏳ Sync already in progress...');
        return { success: false, message: 'Sync already in progress' };
        }

        console.log('🔄 Manual sync triggered...');
        const result = await this.syncAllStudentsData();
        return result;
    }

    // Main sync function
    async syncAllStudentsData() {
        if (this.syncInProgress) {
        console.log('⏳ Sync already in progress, skipping...');
        return { success: false, message: 'Sync already in progress' };
        }

        this.syncInProgress = true;
        this.lastRunTime = new Date();
        const startTime = Date.now();

        try {
        console.log('📊 Starting bulk sync of all student data...');
        
        // Get all students with Codeforces handles
        const students = await Student.find({ 
            codeforcesHandle: { $exists: true, $ne: '' } 
        });

        console.log(`👥 Found ${students.length} students to sync`);

        const results = {
            total: students.length,
            successful: 0,
            failed: 0,
            errors: [],
            inactiveStudents: []
        };

        // Process each student
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            console.log(`🔄 Syncing ${i + 1}/${students.length}: ${student.name} (${student.codeforcesHandle})`);

            try {
            // Get comprehensive data (rating + contest + problem data)
            const data = await codeforcesService.getComprehensiveUserData(
                student.codeforcesHandle, 
                365, // Get 1 year of contest data
                90   // Get 90 days of problem data
            );

            if (data && data.contestData && data.problemData) {
                // Update student with new data
                const updateData = {
                // Basic rating info
                currentRating: data.contestData.ratingHistory.length > 0 ? 
                    data.contestData.ratingHistory[data.contestData.ratingHistory.length - 1].rating : 0,
                maxRating: Math.max(...data.contestData.ratingHistory.map(r => r.rating), 0),
                
                // Store comprehensive data
                contestHistory: data.contestData.contests,
                ratingHistory: data.contestData.ratingHistory,
                problemStats: data.problemData,
                
                // Update timestamps
                lastUpdated: new Date(),
                lastSyncTime: new Date()
                };

                await Student.findByIdAndUpdate(student._id, updateData);

                // Check for inactivity (no submissions in last 7 days)
                const recentSubmissions = data.problemData.submissionHeatmap
                .slice(-7)
                .reduce((sum, day) => sum + day.count, 0);

                if (recentSubmissions === 0) {
                results.inactiveStudents.push({
                    id: student._id,
                    name: student.name,
                    email: student.email,
                    handle: student.codeforcesHandle
                });
                }

                results.successful++;
                console.log(`✅ Successfully synced ${student.name}`);
            } else {
                throw new Error('No data received from Codeforces API');
            }
            } catch (error) {
            console.error(`❌ Failed to sync ${student.name}:`, error.message);
            results.failed++;
            results.errors.push({
                student: student.name,
                handle: student.codeforcesHandle,
                error: error.message
            });
            }

            // Add delay to avoid rate limiting (1 second between requests)
            if (i < students.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        const duration = (Date.now() - startTime) / 1000;
        console.log(`🎉 Sync completed in ${duration.toFixed(2)}s`);
        console.log(`📈 Results: ${results.successful} successful, ${results.failed} failed`);
        console.log(`⚠️  Inactive students: ${results.inactiveStudents.length}`);

        // Send email reminders to inactive students
        if (results.inactiveStudents.length > 0) {
            console.log('📧 Sending reminder emails to inactive students...');
            const emailResults = await emailService.sendBulkReminderEmails(results.inactiveStudents);
            results.emailResults = emailResults;
            console.log(`📧 Email results: ${emailResults.sent} sent, ${emailResults.failed} failed, ${emailResults.skipped} skipped`);
        }

        this.updateNextRunTime();
        return { success: true, ...results, duration };

        } catch (error) {
        console.error('💥 Critical error during sync:', error);
        return { 
            success: false, 
            message: error.message,
            duration: (Date.now() - startTime) / 1000
        };
        } finally {
        this.syncInProgress = false;
        }
    }

    // Update next run time
    updateNextRunTime() {
        if (this.isRunning && this.cronJob) {
        // Calculate next execution time based on cron expression
        try {
            const interval = cronParser.parseExpression(this.currentSchedule);
            this.nextRunTime = interval.next().toDate();
        } catch (error) {
            console.error('Error calculating next run time:', error);
            this.nextRunTime = null;
        }
        }
    }

    // Get status
    getStatus() {
        return {
        isRunning: this.isRunning,
        currentSchedule: this.currentSchedule,
        lastRunTime: this.lastRunTime,
        nextRunTime: this.nextRunTime,
        syncInProgress: this.syncInProgress
        };
    }

    // Update schedule
    updateSchedule(newSchedule) {
        if (!cron.validate(newSchedule)) {
        throw new Error('Invalid cron expression');
        }

        this.stop();
        return this.start(newSchedule);
    }

    // Get common cron expressions
    static getCommonSchedules() {
        return {
        'every_hour': '0 * * * *',
        'every_2_hours': '0 */2 * * *',
        'every_6_hours': '0 */6 * * *',
        'daily_2am': '0 2 * * *',
        'daily_midnight': '0 0 * * *',
        'twice_daily': '0 0,12 * * *',
        'weekly': '0 2 * * 0'
        };
    }
}

module.exports = new CronService();