# Student-Alumni Interconnection System (SAI)

A full-stack web application that connects students with alumni for networking, mentorship, job opportunities, and knowledge sharing.

## Features

### Student Features
- ✅ Register and Login
- ✅ Update Profile (education, skills, interests)
- ✅ Search and Connect with Alumni
- ✅ Join Discussion Forums
- ✅ Request Mentorship from Alumni
- ✅ View Events and Job/Internship Opportunities
- ✅ Participate in Webinars

### Alumni Features
- ✅ Register and Login
- ✅ Update Profile (company, role, experience)
- ✅ Search and Connect with Students
- ✅ Join Discussion Forums
- ✅ Provide Mentorship to Students
- ✅ Post Job/Internship Opportunities
- ✅ Post Events
- ✅ Participate in Webinars
- ✅ Organize Webinars

### Admin Features
- ✅ User Management (approve, block, delete users)
- ✅ Event and Job Management
- ✅ Monitor Discussion Forums
- ✅ Manage Webinars

## Tech Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (Student, Alumni, Admin)

## Project Structure

```
SAI/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/              # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── jobController.js
│   │   ├── eventController.js
│   │   ├── mentorshipController.js
│   │   ├── webinarController.js
│   │   └── discussionController.js
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── models/                   # Sequelize models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Alumni.js
│   │   ├── Admin.js
│   │   ├── Job.js
│   │   ├── Event.js
│   │   ├── Mentorship.js
│   │   ├── Webinar.js
│   │   ├── Discussion.js
│   │   └── Connection.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── jobs.js
│   │   ├── events.js
│   │   ├── mentorships.js
│   │   ├── webinars.js
│   │   └── discussions.js
│   ├── scripts/
│   │   └── seed.js               # Database seeder
│   ├── server.js                 # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/               # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Mentorships.jsx
│   │   │   ├── Webinars.jsx
│   │   │   ├── Discussions.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Database Schema

### Core Tables
- **Users**: Base user information (email, password, role, etc.)
- **Students**: Student-specific profile data
- **Alumni**: Alumni-specific profile data
- **Admins**: Admin-specific data

### Feature Tables
- **Jobs**: Job/internship postings
- **Events**: Event listings
- **Mentorships**: Mentorship requests and relationships
- **Webinars**: Webinar information
- **Discussions**: Forum discussions
- **Connections**: User-to-user connections

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=sai_database
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE sai_database;
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:5000`

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```
   
   This will create sample users and data. Login credentials:
   - Admin: `admin@sai.com` / `admin123`
   - Student: `student1@sai.com` / `student123`
   - Alumni: `alumni1@sai.com` / `alumni123`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `PUT /api/users/:id` - Update user (Protected)
- `GET /api/users/search` - Search users (Protected)
- `POST /api/users/:id/connect` - Connect with user (Protected)
- `PUT /api/users/:id/approve` - Approve user (Admin only)
- `PUT /api/users/:id/block` - Block/unblock user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Jobs
- `GET /api/jobs` - Get all jobs (Protected)
- `GET /api/jobs/:id` - Get job by ID (Protected)
- `POST /api/jobs` - Create job (Alumni/Admin only)
- `PUT /api/jobs/:id` - Update job (Protected)
- `DELETE /api/jobs/:id` - Delete job (Protected)

### Events
- `GET /api/events` - Get all events (Protected)
- `GET /api/events/:id` - Get event by ID (Protected)
- `POST /api/events` - Create event (Alumni/Admin only)
- `PUT /api/events/:id` - Update event (Protected)
- `DELETE /api/events/:id` - Delete event (Protected)

### Mentorships
- `GET /api/mentorships` - Get mentorships (Protected)
- `GET /api/mentorships/:id` - Get mentorship by ID (Protected)
- `POST /api/mentorships` - Request mentorship (Student only)
- `PUT /api/mentorships/:id` - Update mentorship status (Protected)

### Webinars
- `GET /api/webinars` - Get all webinars (Protected)
- `GET /api/webinars/:id` - Get webinar by ID (Protected)
- `POST /api/webinars` - Create webinar (Alumni/Admin only)
- `PUT /api/webinars/:id` - Update webinar (Protected)
- `DELETE /api/webinars/:id` - Delete webinar (Protected)

### Discussions
- `GET /api/discussions` - Get all discussions (Protected)
- `GET /api/discussions/:id` - Get discussion by ID (Protected)
- `POST /api/discussions` - Create discussion (Protected)
- `PUT /api/discussions/:id` - Update discussion (Protected)
- `DELETE /api/discussions/:id` - Delete discussion (Protected)
- `PUT /api/discussions/:id/pin` - Pin/unpin discussion (Admin only)
- `PUT /api/discussions/:id/lock` - Lock/unlock discussion (Admin only)

## Usage Guide

### For Students
1. Register with role "student"
2. Complete your profile with education and skills
3. Search for alumni mentors
4. Request mentorship from available alumni
5. Browse and apply to job opportunities
6. Join events and webinars
7. Participate in discussion forums

### For Alumni
1. Register with role "alumni"
2. Complete your profile with company and experience
3. Set availability for mentorship
4. Post job opportunities
5. Create and manage events
6. Organize webinars
7. Accept mentorship requests from students

### For Admins
1. Login with admin credentials
2. Approve pending user registrations
3. Manage users (block, delete)
4. Monitor discussions and content
5. Manage all system content

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation
- SQL injection protection (Sequelize ORM)

## Development

### Backend Development
- Uses nodemon for auto-restart during development
- Sequelize ORM for database operations
- Express middleware for authentication and validation

### Frontend Development
- Vite for fast development and building
- React Router for navigation
- Context API for state management
- Axios for API calls

## Production Deployment

1. Set environment variables in production
2. Use a strong JWT_SECRET
3. Enable HTTPS
4. Configure CORS properly
5. Use environment-specific database credentials
6. Build frontend: `npm run build` in frontend directory
7. Serve static files from backend or use a CDN

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue on the repository.
