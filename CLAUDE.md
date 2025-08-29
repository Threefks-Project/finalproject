# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack municipal civic issue reporting system for Biratnagar municipality featuring:
- React/TypeScript frontend with Vite and shadcn/ui components
- Node.js/Express backend with MySQL database
- AI-powered image classification using ONNX models
- Real-time issue reporting with geolocation and urgency scoring
- Admin dashboard for issue management

## Architecture

### Frontend (FronEnd/)
- **Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Key Features**: 
  - Multi-language support (i18next)
  - Real-time camera capture and image processing
  - Interactive maps with Leaflet
  - Client-side ONNX model inference
  - Responsive admin dashboard

### Backend (BackEnd/)
- **Stack**: Node.js + Express + MySQL
- **Key Features**:
  - REST API for issue reporting and management
  - ONNX model inference for size detection
  - Intelligent urgency scoring algorithm
  - File upload handling with Multer
  - Reverse geocoding with OpenStreetMap

## Common Development Commands

### Frontend Development
```bash
cd FronEnd
npm run dev          # Start development server on port 8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd BackEnd
node server.js       # Start backend server on port 3000
```

### Database Setup
- MySQL database named `municipality`
- Tables: `pothole_reports`, `garbage_reports`, `others_reports`
- Database configuration in `BackEnd/db.js`

## Key Components and Systems

### Issue Reporting Flow
1. User captures/uploads image via `CameraCapture.tsx`
2. Client-side AI classification using ONNX model in `AIClassification.tsx`
3. Location selection via `LocationPicker.tsx` with Leaflet maps
4. Backend processes image, calculates urgency score, and stores in MySQL
5. Reports displayed in admin dashboard with priority sorting

### Urgency Scoring Algorithm (BackEnd/routes/reportRoutes.js)
- **Location Type (40%)**: Highway/main roads get higher priority
- **Repetition (30%)**: Multiple reports in 50m radius increase urgency
- **Size Detection (15%)**: AI-analyzed bounding box area
- **Manual Input (15%)**: User-specified urgency level

### File Structure
- `src/components/ui/`: shadcn/ui components
- `src/components/admin/`: Admin dashboard components
- `src/components/issue-reporting/`: Issue reporting specific components
- `src/pages/`: Main application pages
- `src/contexts/`: React contexts for auth and language
- `BackEnd/routes/reportRoutes.js`: Main API routes
- `BackEnd/uploads/`: File storage organized by category

## Development Notes

### Frontend Proxy Configuration
- Vite proxies `/api` requests to `http://localhost:3000`
- Backend serves static images from `/uploads` endpoint

### ONNX Model Integration
- Model file: `FronEnd/public/mobilenetv2.onnx`
- Client-side inference using `onnxruntime-web`
- Server-side inference using `onnxruntime-node`
- Image preprocessing with Jimp library

### Database Schema
Each report table includes:
- Location coordinates (lat/lng)
- Human-readable address via reverse geocoding
- AI classification and manual category
- Size detection result
- Calculated urgency score
- Image URL and metadata

### Authentication
- Simple modal-based login system
- Admin routes protected via React Router
- No complex JWT implementation - basic session management

## Image Processing Pipeline

1. **Capture**: Camera component or file upload
2. **Client Classification**: ONNX model inference for issue type
3. **Size Detection**: Server-side ONNX model for bounding box analysis
4. **Storage**: Files organized in category-specific folders
5. **Display**: Images served statically via Express

## API Endpoints

- `POST /api/submit-report`: Submit new issue report
- `GET /api/reports?category=<type>`: Fetch reports by category
- `PATCH /api/reports/:category/:id`: Update report status
- `DELETE /api/reports/:category/:id`: Delete report

## Testing and Linting

- Frontend: ESLint configured for React/TypeScript
- No automated test suite currently implemented
- Manual testing via development servers