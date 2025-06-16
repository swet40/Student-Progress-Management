const nodemailer = require('nodemailer');
const Student = require('../models/student');

    class EmailService {
    constructor() {
        this.transporter = null;
        this.isConfigured = false;
        this.setupTransporter();
    }

    // Setup email transporter (using Gmail as example)
    setupTransporter() {
        try {
        // Check if email credentials are provided
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com') {
            console.log('📧 Email credentials not configured, running in demo mode');
            this.isConfigured = false;
            return;
        }

        // For development, use environment variables
        this.transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
            user: emailUser,
            pass: emailPass
            }
        });

        this.isConfigured = true;
        console.log('📧 Email service configured successfully');
        } catch (error) {
        console.error('❌ Email service configuration failed:', error.message);
        this.isConfigured = false;
        }
    }

    // Send reminder email to inactive student
    async sendReminderEmail(student) {
        if (!this.isConfigured) {
        console.log('📧 Email service not configured - DEMO MODE: Would send email to', student.name);
        
        // In demo mode, still update the student's reminder count for testing
        await Student.findByIdAndUpdate(student._id, {
            $inc: { reminderEmailCount: 1 },
            lastReminderSent: new Date()
        });

        return { success: true, demo: true, message: 'Demo mode - email logged but not sent' };
        }

        try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: student.email,
            subject: '🚀 Time to get back to coding!',
            html: this.generateReminderEmailHTML(student)
        };

        const result = await this.transporter.sendMail(mailOptions);
        
        // Update student's reminder count and timestamp
        await Student.findByIdAndUpdate(student._id, {
            $inc: { reminderEmailCount: 1 },
            lastReminderSent: new Date()
        });

        console.log(`📧 Reminder email sent to ${student.name} (${student.email})`);
        return { success: true, messageId: result.messageId };

        } catch (error) {
        console.error(`❌ Failed to send email to ${student.name}:`, error.message);
        return { success: false, error: error.message };
        }
    }

    // Generate HTML email template
    generateReminderEmailHTML(student) {
        const reminderCount = student.reminderEmailCount || 0;
        const daysSinceLastReminder = student.lastReminderSent ? 
        Math.floor((Date.now() - new Date(student.lastReminderSent)) / (1000 * 60 * 60 * 24)) : 'first time';

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                .cta-button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
                .emoji { font-size: 24px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="emoji">🚀</div>
                    <h1>Hey ${student.name}!</h1>
                    <p>We miss seeing your coding submissions!</p>
                </div>
                
                <div class="content">
                    <p>Hi <strong>${student.name}</strong>,</p>
                    
                    <p>We noticed you haven't made any submissions on Codeforces in the last 7 days. 
                    Don't let your coding momentum slow down! 💪</p>
                    
                    <div class="stats">
                        <h3>📊 Your Current Stats:</h3>
                        <ul>
                            <li><strong>Codeforces Handle:</strong> ${student.codeforcesHandle}</li>
                            <li><strong>Current Rating:</strong> ${student.currentRating || 'Not set'}</li>
                            <li><strong>Max Rating:</strong> ${student.maxRating || 'Not set'}</li>
                            <li><strong>Problems Solved:</strong> ${student.problemStats?.totalSolved || 0}</li>
                        </ul>
                    </div>

                    <p><strong>Why consistent practice matters:</strong></p>
                    <ul>
                        <li>🧠 Keeps your problem-solving skills sharp</li>
                        <li>📈 Helps maintain and improve your rating</li>
                        <li>💼 Prepares you for technical interviews</li>
                        <li>🏆 Builds confidence for contests</li>
                    </ul>

                    <div style="text-align: center;">
                        <a href="https://codeforces.com/problemset" class="cta-button">
                            Start Solving Problems 🎯
                        </a>
                    </div>

                    <p><strong>Quick suggestions to get back on track:</strong></p>
                    <ul>
                        <li>🎯 Solve 1-2 problems today to restart your streak</li>
                        <li>📚 Try problems around your current rating level</li>
                        <li>⏰ Set aside 30 minutes daily for practice</li>
                        <li>🏅 Participate in upcoming contests</li>
                    </ul>

                    <div class="stats">
                        <p><strong>💡 Pro Tip:</strong> Even solving one problem a day can make a huge difference in maintaining your skills!</p>
                    </div>

                    <p>We believe in you and can't wait to see your progress! 🌟</p>
                    
                    <p>Happy Coding!<br>
                    <strong>Student Progress Management Team</strong></p>

                    <div class="footer">
                        <p><small>This is reminder #${reminderCount + 1} ${daysSinceLastReminder !== 'first time' ? `(last sent ${daysSinceLastReminder} days ago)` : '(first reminder)'}.</small></p>
                        <p><small>Don't want to receive these reminders? Contact your instructor to disable them.</small></p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // Send bulk reminder emails to all inactive students
    async sendBulkReminderEmails(inactiveStudents) {
        console.log(`📧 Sending reminder emails to ${inactiveStudents.length} inactive students...`);
        
        const results = {
        total: inactiveStudents.length,
        sent: 0,
        failed: 0,
        skipped: 0,
        errors: []
        };

        for (const studentData of inactiveStudents) {
        try {
            // Get full student object from database
            const student = await Student.findById(studentData.id);
            
            if (!student) {
            results.failed++;
            results.errors.push({ student: studentData.name, error: 'Student not found' });
            continue;
            }

            // Check if emails are enabled for this student
            if (!student.emailRemindersEnabled) {
            console.log(`📧 Emails disabled for ${student.name}, skipping...`);
            results.skipped++;
            continue;
            }

            // Check if we sent an email recently (don't spam)
            const lastReminderDate = student.lastReminderSent;
            if (lastReminderDate) {
            const daysSinceLastReminder = Math.floor((Date.now() - new Date(lastReminderDate)) / (1000 * 60 * 60 * 24));
            if (daysSinceLastReminder < 3) { // Don't send more than once every 3 days
                console.log(`📧 Email sent to ${student.name} recently (${daysSinceLastReminder} days ago), skipping...`);
                results.skipped++;
                continue;
            }
            }

            // Send the email
            const emailResult = await this.sendReminderEmail(student);
            
            if (emailResult.success) {
            results.sent++;
            if (emailResult.demo) {
                console.log(`📧 DEMO: Would send email to ${student.name}`);
            }
            } else {
            results.failed++;
            results.errors.push({ 
                student: student.name, 
                error: emailResult.error 
            });
            }

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`❌ Error processing email for ${studentData.name}:`, error.message);
            results.failed++;
            results.errors.push({ 
            student: studentData.name, 
            error: error.message 
            });
        }
        }

        console.log(`📧 Email sending completed: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`);
        return results;
    }

    // Send test email
    async sendTestEmail(recipientEmail) {
        if (!this.isConfigured) {
        return { success: false, error: 'Email service not configured' };
        }

        try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: recipientEmail,
            subject: '✅ Email Service Test',
            html: `
            <h2>Email Service Test</h2>
            <p>This is a test email to verify that the email service is working correctly.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p>If you received this email, the email service is configured properly! 🎉</p>
            `
        };

        const result = await this.transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };

        } catch (error) {
        return { success: false, error: error.message };
        }
    }

    // Get email service status
    getStatus() {
        return {
        isConfigured: this.isConfigured,
        service: 'Gmail',
        lastCheck: new Date()
        };
    }
}

module.exports = new EmailService();