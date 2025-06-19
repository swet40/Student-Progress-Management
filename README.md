# Student Progress Management System

A comprehensive MERN stack application for tracking and analyzing competitive programming students' progress on Codeforces. Features automated data synchronization, real-time analytics, and intelligent inactivity detection.

## Key Features

- Student Management : Complete CRUD operations with CSV export functionality
- Real-time Analytics : Interactive charts for contest history and problem-solving statistics
- Automated Sync : Daily Codeforces data synchronization with customizable scheduling
- Smart Notifications : Automatic email alerts for inactive students (7+ days)
- Responsive Design : Mobile-first design with dark/light theme toggle

## Tech Stack

**Frontend:**
- React.js 18+ with Hooks and Context API
- Chart.js for data visualization
- CSS3 with CSS Grid & Flexbox
- Responsive design (Mobile-first)

**Backend:**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- Node-cron for scheduled tasks
- Nodemailer for email notifications

**External APIs:**
- Codeforces API for student data

## Quick Start

### Prerequisites
```bash
Node.js (v16 or higher)
MongoDB (v5 or higher)
npm or yarn package manager
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/swet40/Student-Progress-Management.git
cd student-progress-management
```

2. **Backend Setup**
```bash
cd server
npm install
cp .env.example .env
# Configure your environment variables in .env
npm run dev
```

3. **Frontend Setup**
```bash
cd ../client
npm install
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173/
- Backend API: http://localhost:5000

### Environment Variables
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/student_progress?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

[Demo Video](https://www.youtube.com/watch?v=of81xyCHBtU)

**Demo Highlights:**
- Student table management with real-time operations
- Interactive analytics with filtering options
- Admin dashboard with sync controls
- Mobile responsiveness demonstration
- Theme toggle functionality

## Core Functionality

### Student Management
- Add, edit, delete students with form validation
- Sortable table with search and pagination
- CSV export for complete dataset
- Real-time Codeforces handle validation
- Last sync timestamp display

### Analytics & Reporting
- Contest history with 30/90/365-day filters
- Rating progression charts
- Problem-solving statistics (7/30/90-day filters)
- Submission heatmap calendar view
- Problem difficulty distribution charts

### Automated System
- Daily Codeforces data synchronization (configurable time)
- Manual sync with progress tracking
- Inactivity detection (7+ days without submissions)
- Automatic email reminders with tracking
- Individual email preferences

### User Experience
- Fully responsive design (mobile, tablet, desktop)
- Dark/light theme toggle with persistence
- Loading states and error handling
- Professional confirmation modals
- Smooth animations and transitions


## Testing

```bash
# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Run integration tests
npm run test:integration
```


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**⭐ If you found this project helpful, please consider giving it a star!**