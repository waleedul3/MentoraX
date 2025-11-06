# 🎓 MentoraX - Learn. Code. Grow.

A complete MERN stack EdTech platform with real-time mentorship, gamified learning, and certificate generation.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (already configured)
- Git

### Easy Setup (Windows)
```bash
# 1. Clone the repository
git clone <repository-url>
cd mentorax

# 2. Run the startup script
start.bat
```

### Manual Setup
```bash
# 1. Install server dependencies
cd server
npm install

# 2. Install client dependencies  
cd ../client
npm install

# 3. Start backend (Terminal 1)
cd server
npm run dev

# 4. Start frontend (Terminal 2)
cd client
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Health**: http://localhost:4000/health

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mentorax.com | admin123 |
| Mentor | john@mentorax.com | mentor123 |
| Student | alice@mentorax.com | student123 |

## 🎯 Features

- **JWT Authentication** with role-based access
- **Course Management** with video lessons
- **Interactive Quizzes** with auto-scoring
- **Certificate Generation** with QR verification
- **Real-time Chat** with mentors
- **Payment Integration** with Razorpay
- **Mentor Payment System** with admin approval
- **Gamification** with XP points and achievements

## 🛠️ Tech Stack

- **Frontend**: React.js, Redux Toolkit, Tailwind CSS
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB Atlas
- **Authentication**: JWT
- **Payments**: Razorpay

## 📁 Project Structure

```
mentorax/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── slices/         # Redux slices
│   │   └── services/       # API services
│   └── .env               # Client environment variables
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── .env              # Server environment variables
├── start.bat              # Quick start script
└── README.md
```

## 🔧 Environment Variables

All environment variables are pre-configured in the `.env` files:

- **Server**: Database, JWT, Email, Payment gateway
- **Client**: API URL, Razorpay key

## 🚀 Deployment

The application is ready for deployment with Docker support:

```bash
docker-compose up -d
```

## 📝 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ by the MentoraX Team**