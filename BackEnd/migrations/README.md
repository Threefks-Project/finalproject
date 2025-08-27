# Database Migration: Fix Image URLs

## Overview
This migration converts hardcoded localhost URLs in image paths to relative paths, making the application portable across different environments.

## What it does
- Finds all records with `http://localhost:3000/uploads/...` or `http://localhost:5000/uploads/...`
- Converts them to relative paths like `/uploads/...`
- Updates all tables: `garbage_reports`, `pothole_reports`, `others_reports`

## Before running
1. **Backup your database** - This script modifies data
2. Update database credentials in `fix-image-urls.js`:
   ```js
   const dbConfig = {
     host: 'localhost',
     user: 'your_username',
     password: 'your_password',
     database: 'your_database_name'
   };
   ```

## Running the migration

### Option 1: Direct execution
```bash
cd Backend/migrations
node fix-image-urls.js
```

### Option 2: From package.json script
Add this to your `Backend/package.json`:
```json
{
  "scripts": {
    "migrate:images": "node migrations/fix-image-urls.js"
  }
}
```

Then run:
```bash
cd Backend
npm run migrate:images
```

## Expected output
```
🔧 Starting image URL migration...
✅ Connected to database

📋 Processing table: garbage_reports
   Found 5 records with localhost URLs
   ✅ Updated ID 1: http://localhost:3000/uploads/garbage/file1.jpg → /uploads/garbage/file1.jpg
   ✅ Updated ID 2: http://localhost:3000/uploads/garbage/file2.jpg → /uploads/garbage/file2.jpg
   ...

📋 Processing table: pothole_reports
   No localhost URLs found in pothole_reports

📋 Processing table: others_reports
   Found 2 records with localhost URLs
   ✅ Updated ID 10: http://localhost:3000/uploads/others/file3.jpg → /uploads/others/file3.jpg
   ...

🎉 Migration completed successfully!

📝 Summary:
- All hardcoded localhost URLs have been converted to relative paths
- Images will now load from the current server domain
- No more localhost dependencies in the database

🔌 Database connection closed
```

## After migration
1. **Test locally** - Images should still load from `http://localhost:3000/uploads/...`
2. **Test with ngrok** - Images should load from `https://your-ngrok-id.ngrok-free.app/uploads/...`
3. **Deploy** - Images will automatically load from your production domain

## Rollback (if needed)
If you need to revert, you can restore from your database backup or create a reverse migration script.
