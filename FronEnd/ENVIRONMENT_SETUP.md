# Environment Setup Guide

## Overview
This project now uses environment variables to dynamically configure API endpoints and image URLs, making it portable across different environments.

## Environment Files

### 1. Local Development (`.env.local`)
```bash
# Copy env.local.example to .env.local
cp env.local.example .env.local

# Edit .env.local
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Ngrok Testing (`.env.ngrok`)
```bash
# Create .env.ngrok for testing from other devices
VITE_API_BASE_URL=https://your-ngrok-id.ngrok-free.app
```

### 3. Production (`.env.production`)
```bash
# For production deployment
VITE_API_BASE_URL=https://smart-municipality.com/api
```

## How It Works

### API Configuration (`src/config/api.ts`)
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Helper function to build full image URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Ensure path starts with / and prepend base URL
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
```

### Usage in Components
```typescript
import { getImageUrl } from '@/config/api';

// Instead of hardcoded URLs
<img src="http://localhost:3000/uploads/image.jpg" />

// Use the helper function
<img src={getImageUrl('/uploads/image.jpg')} />
```

## Environment-Specific Behavior

### Local Development
- Images load from: `http://localhost:3000/uploads/...`
- API calls go to: `http://localhost:3000/api/...`

### Ngrok Testing
- Images load from: `https://your-ngrok-id.ngrok-free.app/uploads/...`
- API calls go to: `https://your-ngrok-id.ngrok-free.app/api/...`

### Production
- Images load from: `https://smart-municipality.com/api/uploads/...`
- API calls go to: `https://smart-municipality.com/api/...`

## Switching Environments

### For Local Development
```bash
# Ensure .env.local exists with:
VITE_API_BASE_URL=http://localhost:3000
```

### For Ngrok Testing
```bash
# Create .env.ngrok with:
VITE_API_BASE_URL=https://your-ngrok-id.ngrok-free.app

# Or temporarily override:
VITE_API_BASE_URL=https://abc123.ngrok-free.app npm run dev
```

### For Production Build
```bash
# Create .env.production with:
VITE_API_BASE_URL=https://smart-municipality.com/api

# Build with production config:
npm run build
```

## Benefits

1. **Portability**: Same code works in any environment
2. **No Hardcoded URLs**: All URLs are dynamic
3. **Easy Testing**: Switch between local, ngrok, and production
4. **Deployment Ready**: No code changes needed for different servers
5. **Database Agnostic**: Image paths stored as relative paths

## Troubleshooting

### Images Not Loading
1. Check that `VITE_API_BASE_URL` is set correctly
2. Verify the backend is serving `/uploads` at the correct domain
3. Check browser console for CORS errors

### API Calls Failing
1. Ensure `VITE_API_BASE_URL` points to a running backend
2. Check that the backend has CORS enabled for the frontend domain
3. Verify the backend is accessible from the frontend domain

### Environment Variables Not Working
1. Restart the Vite dev server after changing `.env` files
2. Ensure environment variable names start with `VITE_`
3. Check that the `.env` file is in the project root
