FlixDB Monorepo
FlixDB is a full-stack movie database application in a monorepo structure. This repository includes both the backend (NestJS) and frontend (React) components to provide a complete solution for movie exploration, upload, and management. The application supports JWT authentication, Google OAuth, and Cloudinary for image uploads.
Table of Contents
- Features
- Tech Stack
- Project Structure
- Getting Started
- Prerequisites
- Installation
- Environment Variables
- Scripts
- Usage
- Testing
- Deployment
- License
Features
- Responsive UI: Built with React and Material-UI, optimized for both mobile and desktop.
- User Authentication: JWT and Google OAuth2.
- Movie Management: Users can upload and manage movie data, including images.
- Theme Support: Dark and light mode with persistent user preference.
- API Integration: Secure backend API with NestJS, TypeORM, and PostgreSQL.
Tech Stack
- Frontend: React, Material-UI, NextUI
- Backend: NestJS, TypeORM
- Database: PostgreSQL
- Cloud Storage: Google Cloud Storage and Cloudinary
- Authentication: JWT and Google OAuth2
- Testing: Jest, Testing Library, Supertest
Project Structure
The project uses a monorepo layout with two main workspaces:

flix-monorepo/
├── backend/        # NestJS backend API and services
├── flixdb/         # React frontend for the movie database
└── package.json    # Root package.json with shared dependencies and workspace configuration
Getting Started
Prerequisites
- Node.js and npm (v14 or later)
- PostgreSQL: Database for storing app data
- Google Cloud & Cloudinary Accounts: For Google OAuth and image uploads
Installation
Clone the repository:

   git clone https://github.com/yourusername/flix-monorepo.git
   cd flix-monorepo
Install dependencies for the entire monorepo:

   npm install
Set up the backend by navigating to the backend directory:

   cd backend
   npm install
Set up the frontend by navigating to the flixdb directory:

   cd ../flixdb
   npm install
Environment Variables
Configure environment variables in .env files within each workspace:

Backend (backend/.env):
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

Frontend (flixdb/.env):
REACT_APP_GOOGLE_CLIENT_ID=<your-google-client-id>
REACT_APP_API_URL=http://localhost:3001
Scripts
Scripts can be run from the root or within each workspace:

Root Scripts:
- Install dependencies: npm install
- Lint all workspaces: npm run lint

Backend (backend workspace) Scripts:
- Start (Dev): npm run start:dev
- Build: npm run build
- Lint: npm run lint
- Test: npm run test

Frontend (flixdb workspace) Scripts:
- Start: npm start
- Build: npm run build
- Lint: npm run lint
- Test: npm run test
Usage
Backend: From the backend directory, start the backend server:

   npm run start:dev

Access backend APIs at http://localhost:3001.

Frontend: From the flixdb directory, start the frontend:

   npm start

Access the application at http://localhost:3000.
Testing
Backend Testing:

   npm run test

Frontend Testing:

   npm run test
Deployment
Build both frontend and backend:

   cd backend
   npm run build

   cd ../flixdb
   npm run build

Deploy each to your hosting service with environment variables configured as shown above.
License
This project is licensed under UNLICENSED.
