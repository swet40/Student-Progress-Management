const axios = require('axios');

    class CodeforcesService {
    constructor() {
        this.baseURL = 'https://codeforces.com/api';
    }

    // Existing method - update student rating
    async updateStudentRating(student) {
        try {
        if (!student.codeforcesHandle) {
            return null;
        }

        const response = await axios.get(`${this.baseURL}/user.info`, {
            params: { handles: student.codeforcesHandle }
        });

        if (response.data.status === 'OK' && response.data.result.length > 0) {
            const userInfo = response.data.result[0];
            return {
            currentRating: userInfo.rating || 0,
            maxRating: userInfo.maxRating || 0,
            lastUpdated: new Date()
            };
        }
        return null;
        } catch (error) {
        console.error('Error fetching Codeforces rating:', error.message);
        return null;
        }
    }

    // NEW: Get user's contest history
    async getUserContests(handle, daysFilter = 90) {
        try {
        const response = await axios.get(`${this.baseURL}/user.rating`, {
            params: { handle }
        });

        if (response.data.status === 'OK') {
            const contests = response.data.result;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysFilter);

            // Filter contests by date
            const filteredContests = contests.filter(contest => {
            const contestDate = new Date(contest.ratingUpdateTimeSeconds * 1000);
            return contestDate >= cutoffDate;
            });

            // Format contest data
            const formattedContests = filteredContests.map(contest => ({
            id: contest.contestId,
            name: contest.contestName,
            date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0],
            rank: contest.rank,
            oldRating: contest.oldRating,
            newRating: contest.newRating,
            ratingChange: contest.newRating - contest.oldRating
            }));

            // Create rating history for graph
            const ratingHistory = filteredContests.map(contest => ({
            date: new Date(contest.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0],
            rating: contest.newRating
            }));

            return {
            contests: formattedContests.reverse(), // Most recent first
            ratingHistory: ratingHistory.reverse()
            };
        }
        return null;
        } catch (error) {
        console.error('Error fetching contest history:', error.message);
        return null;
        }
    }

    // NEW: Get user's submission data
    async getUserSubmissions(handle, daysFilter = 30) {
        try {
        const response = await axios.get(`${this.baseURL}/user.status`, {
            params: { 
            handle,
            from: 1,
            count: 10000 // Large number to get all recent submissions
            }
        });

        if (response.data.status === 'OK') {
            const submissions = response.data.result;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysFilter);

            // Filter submissions by date and accepted only
            const recentSubmissions = submissions.filter(sub => {
            const submissionDate = new Date(sub.creationTimeSeconds * 1000);
            return submissionDate >= cutoffDate;
            });

            const acceptedSubmissions = recentSubmissions.filter(sub => 
            sub.verdict === 'OK'
            );

            // Get unique problems solved
            const uniqueProblems = new Map();
            acceptedSubmissions.forEach(sub => {
            const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
            if (!uniqueProblems.has(problemKey)) {
                uniqueProblems.set(problemKey, {
                name: sub.problem.name,
                rating: sub.problem.rating || 0,
                tags: sub.problem.tags || [],
                contestId: sub.problem.contestId,
                index: sub.problem.index,
                solvedAt: new Date(sub.creationTimeSeconds * 1000)
                });
            }
            });

            const problemsArray = Array.from(uniqueProblems.values());

            // Calculate statistics
            const totalSolved = problemsArray.length;
            const averageRating = totalSolved > 0 ? 
            Math.round(problemsArray.reduce((sum, p) => sum + (p.rating || 0), 0) / totalSolved) : 0;
            const averagePerDay = totalSolved / daysFilter;

            // Most difficult problem
            const mostDifficultProblem = problemsArray.reduce((max, current) => 
            (current.rating || 0) > (max.rating || 0) ? current : max, 
            { rating: 0, name: 'None' }
            );

            // Rating distribution
            const ratingBuckets = {
            '800-900': 0, '900-1000': 0, '1000-1100': 0, '1100-1200': 0,
            '1200-1300': 0, '1300-1400': 0, '1400-1500': 0, '1500-1600': 0,
            '1600-1700': 0, '1700-1800': 0, '1800+': 0
            };

            problemsArray.forEach(problem => {
            const rating = problem.rating || 0;
            if (rating >= 1800) ratingBuckets['1800+']++;
            else if (rating >= 1700) ratingBuckets['1700-1800']++;
            else if (rating >= 1600) ratingBuckets['1600-1700']++;
            else if (rating >= 1500) ratingBuckets['1500-1600']++;
            else if (rating >= 1400) ratingBuckets['1400-1500']++;
            else if (rating >= 1300) ratingBuckets['1300-1400']++;
            else if (rating >= 1200) ratingBuckets['1200-1300']++;
            else if (rating >= 1100) ratingBuckets['1100-1200']++;
            else if (rating >= 1000) ratingBuckets['1000-1100']++;
            else if (rating >= 900) ratingBuckets['900-1000']++;
            else ratingBuckets['800-900']++;
            });

            const ratingDistribution = Object.entries(ratingBuckets).map(([range, count]) => ({
            range,
            count
            }));

            // Submission heatmap data
            const submissionHeatmap = this.generateSubmissionHeatmap(recentSubmissions, daysFilter);

            return {
            totalSolved,
            averageRating,
            averagePerDay: Math.round(averagePerDay * 10) / 10,
            mostDifficultProblem: {
                name: mostDifficultProblem.name,
                rating: mostDifficultProblem.rating,
                url: `https://codeforces.com/problemset/problem/${mostDifficultProblem.contestId}/${mostDifficultProblem.index}`
            },
            ratingDistribution,
            submissionHeatmap,
            problems: problemsArray.slice(0, 50) // Return recent 50 problems
            };
        }
        return null;
        } catch (error) {
        console.error('Error fetching submission data:', error.message);
        return null;
        }
    }

    // Helper method to generate submission heatmap
    generateSubmissionHeatmap(submissions, days) {
        const heatmapData = [];
        const today = new Date();
        
        // Initialize all days with 0 submissions
        for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        heatmapData.push({
            date: date.toISOString().split('T')[0],
            count: 0
        });
        }

        // Count submissions per day
        submissions.forEach(sub => {
        const submissionDate = new Date(sub.creationTimeSeconds * 1000);
        const dateStr = submissionDate.toISOString().split('T')[0];
        const dayData = heatmapData.find(d => d.date === dateStr);
        if (dayData) {
            dayData.count++;
        }
        });

        return heatmapData.reverse(); // Oldest first
    }

    // NEW: Get comprehensive user data
    async getComprehensiveUserData(handle, contestDays = 90, problemDays = 30) {
        try {
        const [contestData, problemData] = await Promise.all([
            this.getUserContests(handle, contestDays),
            this.getUserSubmissions(handle, problemDays)
        ]);

        return {
            contestData,
            problemData,
            lastUpdated: new Date()
        };
        } catch (error) {
        console.error('Error fetching comprehensive user data:', error.message);
        return null;
        }
    }
}

module.exports = new CodeforcesService();