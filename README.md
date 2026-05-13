# Mini YouTube - Cloud-Based Video Streaming Platform

A full-stack video streaming platform built with React, Node.js, MongoDB, and AWS.

## Features
- **User Authentication**: Secure JWT-based login and registration.
- **Video Upload**: Directly to AWS S3 using Multer.
- **Video Streaming**: Responsive player with metadata.
- **Search**: Real-time search for videos.
- **Modern UI**: Premium dark-mode design inspired by YouTube.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB Atlas.
- **Cloud Storage**: AWS S3.
- **DevOps**: Docker, Docker Compose.

## Setup Instructions

### Prerequisites
- Node.js & npm
- Docker & Docker Compose
- AWS Account (S3 Bucket)
- MongoDB Atlas Account

### 1. Backend Setup
1. Navigate to `backend/`.
2. Create a `.env` file based on `.env.example`.
3. Fill in your MongoDB connection string and AWS credentials.
4. Run `npm install` and `npm start`.

### 2. Frontend Setup
1. Navigate to `frontend/`.
2. Run `npm install` and `npm run dev`.

### 3. Docker Deployment
1. Ensure your `.env` file in the root or backend is ready.
2. Run `docker-compose up --build`.
3. The app will be available at `http://localhost`.

## Architecture
`React Frontend` -> `Node.js Backend` -> `MongoDB Atlas`
`Video Uploads` -> `AWS S3` -> `CloudFront CDN`
