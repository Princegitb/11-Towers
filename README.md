# 🏢 11 Towers - Residential Management Portal

A premium, full-stack residential society management web application designed for **"11 Towers"** society. It enables seamless communication, administration, and resource monitoring for residents and administrative staff.

---

## 📄 Short Description (under 100 words)
**11 Towers** is a premium full-stack residential management web portal featuring an interactive 3D representation of the society. Built with React, Express, MongoDB, and Tailwind CSS, it offers role-based access for residents and admins. Residents can easily file and track maintenance complaints, view community galleries, and check water schedules. Admins gain access to a powerful dashboard to resolve complaints, publish notices, customize water supply timings, and manage gallery uploads via Cloudinary. The platform delivers a modern, glassmorphic user experience with fluid animations and real-time state synchronization.

---

## ✨ Features

### 👤 Resident Dashboard
- **Interactive 3D View**: Beautiful 3D society representation powered by React Three Fiber.
- **Maintenance Ticketing**: File complaints with descriptions, category tagging, and real-time status tracking.
- **Water Schedules**: Keep track of water availability, including real-time visual alerts.
- **Notice Board**: Read society announcements instantly.
- **Community Gallery**: Browse high-quality images uploaded by administration.

### 🔑 Admin Control Panel
- **Complaint Management**: View, filter, update status (Pending/In Progress/Resolved), and resolve maintenance tickets.
- **Notice Board Editor**: Author, edit, and publish notices to all residents.
- **Water Schedule Manager**: Dynamically set start/end timings for water supply.
- **Gallery Manager**: Upload, crop, and delete images using Cloudinary integration.

---

## 🛠 Tech Stack

### Frontend
- **Framework & Build Tools:** React 19, Vite, React Router v7
- **Styling & Motion:** Tailwind CSS v4, Framer Motion (for smooth glassmorphism transitions)
- **State Management:** Zustand (with localStorage persistence)
- **3D Graphics:** React Three Fiber, React Three Drei, Three.js
- **API Client:** Axios

### Backend
- **Server Environment:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Media Storage:** Multer & Cloudinary

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB database (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the repository and install dependencies
```bash
# Install root (Frontend) dependencies
npm install

# Install Backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the Application

#### Run Backend Server:
```bash
cd backend
npm run dev
```

#### Run Frontend Client (in a new terminal):
```bash
npm run dev
```

The frontend will run at `http://localhost:5173` (or the port indicated by Vite) and will proxy API requests to the backend.

---

## 📁 Project Structure

```
├── backend/                # Express server, MongoDB models, routes, Cloudinary config
│   ├── config/             # Cloudinary & DB configuration
│   ├── middleware/         # Auth & upload middleware
│   ├── models/             # Mongoose schemas (User, Complaint, Image, Notice, WaterSchedule)
│   ├── routes/             # API endpoints (/auth, /complaints, /images, /schedules)
│   └── server.js           # Server entry point
├── src/                    # React frontend application
│   ├── components/         # Reusable UI components (GlassCard, Building3D, Navbar)
│   ├── pages/              # Router pages (Landing, Login, Admin Dashboard, Resident Dashboard)
│   ├── store/              # Zustand global state stores
│   └── utils/              # API Client helpers
└── package.json            # Frontend configuration & dependencies
```
