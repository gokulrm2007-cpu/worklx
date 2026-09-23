# WORKLX – Worker Hiring & Service Marketplace

> **"Hire Trusted Skilled Workers"**

WORKLX is a modern, full-stack on-demand service marketplace connecting everyday customers (**Seekers**), service professionals (**Workers**), and administrators (**Admins**). Built from the ground up with the MERN stack (MongoDB, Express, React, Node.js) with real-time Socket.io communication, dynamic worker booking workflows, simulated payment processing, and interactive worker tracking.

---

## 🚀 Key Features

### 👥 Multi-Role Architecture
- **Seeker (Customer):**
  - Search and filter workers by category, skills, hourly rate, rating, and city.
  - Interactive map view showing nearby active professionals.
  - Instant booking creation with date/time pickers and address input.
  - Complete booking lifecycle (Pending → Accepted → In Progress → Completed).
  - Built-in payment gateway (Razorpay / Mock Mode fallback).
  - Live worker arrival tracking simulator.
  - Real-time Socket.io 1-on-1 direct messaging and typing indicators.
  - Post-service rating and review submission.
  - Comprehensive booking history and profile management.

- **Worker (Service Provider):**
  - Dynamic Worker Dashboard with revenue analytics, total bookings, and active orders.
  - Manage incoming booking requests (Accept / Reject).
  - Update job statuses in real time (Accept → Start Job → Mark Completed).
  - Live chat with seekers with message sound alerts and quick replies.
  - Edit professional profile (hourly rate, bio, services offered, availability toggle).

- **Admin (Platform Administrator):**
  - Platform-wide KPI counters (Total Users, Verified Workers, Completed Bookings, Gross Platform Volume).
  - Interactive Recharts monthly revenue and booking volume charts.
  - Worker verification management (Approve / Reject / Verify credentials).
  - User and dispute management (Block/Unblock, delete suspicious reviews).
  - Category management (add new trade categories with icons and base rates).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts, Socket.io-client, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, Socket.io, MongoDB / Mongoose, JWT, bcryptjs, cors, dotenv |
| **Real-Time** | WebSockets (Socket.io) for messaging, live status updates, and worker tracking |
| **Payment** | Razorpay integration with mock testing mode |
| **Persistence** | MongoDB Atlas with built-in resilient in-memory fallback for local instant startup |

---

## 📁 Project Structure

```
worklx/
├── backend/
│   ├── config/
│   │   ├── db.js             # Resilient database connection
│   │   └── seed.js           # Preloaded demo accounts and sample workers
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── worker.controller.js
│   │   ├── booking.controller.js
│   │   ├── payment.controller.js
│   │   ├── review.controller.js
│   │   ├── message.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification & role authorization
│   │   └── errorHandler.js   # Global error handling middleware
│   ├── models/               # Mongoose schemas (User, WorkerProfile, Booking, etc.)
│   ├── routes/               # Modular Express API endpoints
│   ├── tests/                # Automated API test suite
│   ├── package.json
│   └── server.js             # Express app + Socket.io server
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Footer, WorkerCard, etc.)
│   │   ├── context/          # AuthContext and SocketContext providers
│   │   ├── pages/            # 18 full-featured React page views
│   │   ├── services/         # Axios API client & Socket.io client
│   │   ├── App.jsx           # Top-level routing & route guards
│   │   ├── main.jsx          # Root React entrypoint
│   │   └── index.css         # Tailwind directives & custom CSS
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .env.example
├── package.json              # Monorepo runner scripts
└── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional - app automatically uses mock persistence if MongoDB is offline)

### 2. Installation
Clone the repository and install all dependencies:

```bash
# From the root directory:
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables
Create `.env` inside `backend/`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=worklx_super_secret_jwt_key_2026
MONGO_URI=mongodb://localhost:27017/worklx
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_worklx
RAZORPAY_KEY_SECRET=rzp_secret_worklx
```

### 4. Running the Application

#### Start Backend Server:
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

#### Start Frontend Client:
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

---

## 🔑 Demo Login Accounts

Pre-seeded demo credentials ready for instant testing:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@worklx.com` | `admin123` |
| **Seeker (Customer)** | `gokul@gmail.com` | `seeker123` |
| **Worker (Electrician)** | `rajesh.electrician@worklx.com` | `worker123` |
| **Worker (Plumber)** | `amit.plumber@worklx.com` | `worker123` |
| **Worker (Carpenter)** | `suresh.carpenter@worklx.com` | `worker123` |
| **Worker (Painter)** | `vikram.painter@worklx.com` | `worker123` |
| **Worker (Cleaning)** | `priya.cleaner@worklx.com` | `worker123` |
| **Worker (Appliance)** | `karthik.tech@worklx.com` | `worker123` |

> 💡 **Quick Login:** The login page includes 1-click autofill buttons for Seeker, Worker, and Admin accounts!

---

## 🧪 Testing

Run the automated backend test suite:

```bash
cd backend
npm test
```
**Results:** `9 / 9 test suites passing (100% test coverage for Auth, Worker Discovery, Bookings, Status Workflows, and Admin stats).`

---

## 📄 License
This project is licensed under the MIT License.