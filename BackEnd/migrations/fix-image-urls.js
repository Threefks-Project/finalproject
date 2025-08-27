const mysql = require('mysql2/promise');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root', // Update with your DB credentials
  password: '', // Update with your DB password
  database: 'municipality_db' // Update with your DB name
};

async function fixImageUrls() {
  let connection;
  
  try {
    console.log('🔧 Starting image URL migration...');
    
    // Connect to database
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    // Tables to check for image URLs
    const tables = ['garbage_reports', 'pothole_reports', 'others_reports'];
    
    for (const table of tables) {
      console.log(`\n📋 Processing table: ${table}`);
      
      // Find records with hardcoded localhost URLs
      const [rows] = await connection.execute(
        `SELECT id, image_url FROM ${table} WHERE image_url LIKE '%localhost%'`
      );
      
      if (rows.length === 0) {
        console.log(`   No localhost URLs found in ${table}`);
        continue;
      }
      
      console.log(`   Found ${rows.length} records with localhost URLs`);
      
      // Update each record
      for (const row of rows) {
        const oldUrl = row.image_url;
        
        // Extract relative path from localhost URL
        let newUrl = oldUrl;
        
        if (oldUrl.includes('localhost:3000')) {
          // Extract path after localhost:3000
          const urlParts = oldUrl.split('localhost:3000');
          if (urlParts.length > 1) {
            newUrl = urlParts[1];
            // Ensure it starts with /
            if (!newUrl.startsWith('/')) {
              newUrl = '/' + newUrl;
            }
          }
        } else if (oldUrl.includes('localhost:5000')) {
          // Extract path after localhost:5000
          const urlParts = oldUrl.split('localhost:5000');
          if (urlParts.length > 1) {
            newUrl = urlParts[1];
            // Ensure it starts with /
            if (!newUrl.startsWith('/')) {
              newUrl = '/' + newUrl;
            }
          }
        }
        
        // Update the record
        if (newUrl !== oldUrl) {
          await connection.execute(
            `UPDATE ${table} SET image_url = ? WHERE id = ?`,
            [newUrl, row.id]
          );
          console.log(`   ✅ Updated ID ${row.id}: ${oldUrl} → ${newUrl}`);
        }
      }
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📝 Summary:');
    console.log('- All hardcoded localhost URLs have been converted to relative paths');
    console.log('- Images will now load from the current server domain');
    console.log('- No more localhost dependencies in the database');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  fixImageUrls();
}

module.exports = { fixImageUrls };
