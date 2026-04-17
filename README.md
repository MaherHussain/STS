# STS (Shift Tracking System)

## Overview
STS is a comprehensive workforce management platform designed to streamline shift tracking and employee management. It features role-based access control, multiple pay types (Hourly and Revenue-based), and mobile-responsive UI for seamless on-the-go usage.

## Tech Stack

### Frontend
- **React** (v18)
- **Vite** for fast development
- **TypeScript** for type safety
- **Tailwind CSS** for modern, responsive styling
- **React Icons**

### Backend
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JWT (JSON Web Tokens)** for secure authentication
- **Cloudinary** for image proof storage

### Testing
- **Playwright** for End-to-End (E2E) testing
- **Vitest** for unit testing (configured)

## Core Features
- 👥 **Role-Based Access**: Specialized dashboards for Admins and Employees.
- 💰 **Flexible Pay Types**: Support for `HOURLY` pay and `REVENUE` share models.
- 🕒 **Shift Management**: Simplified shift logging with template support for recurring schedules.
- 📱 **Mobile First**: Fully responsive header and forms, optimized for mobile devices.
- 📸 **Evidence-Based Logs**: Ability to upload and view image proofs for each shift logged.
- 📈 **Admin Dashboard**: Comprehensive overview of employee logs and earnings.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (Local or Atlas)
- Cloudinary account for media storage

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MaherHussain/STS.git
   cd STS
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the following:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   # CLOUDINARY_CLOUD_NAME=...
   # CLOUDINARY_API_KEY=...
   # CLOUDINARY_API_SECRET=...
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend/vite-project
   npm install
   npm run dev
   ```

## Development Workflow
- **Develop**: Work on the `develop` branch.
- **Main**: The `main` branch is used for production releases.
- **Pull Requests**: Ensure all tests pass before merging into `main`.

## Deployment
The application is ready to be hosted on platforms like **Render**.

---
*Created with ❤️ for STS workforce management.*
