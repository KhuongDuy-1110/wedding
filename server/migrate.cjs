require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wedding_db',
  ssl: process.env.DB_CA_CERT ? { ca: process.env.DB_CA_CERT } : undefined,
};

async function migrate() {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    console.log('Migrating visitor_logs...');
    
    // Add scroll_percent if it doesnt exist
    try {
      await conn.execute('ALTER TABLE visitor_logs ADD COLUMN scroll_percent INT DEFAULT 0');
    } catch (_) {}
    
    // Add updated_at if it doesnt exist
    try {
      await conn.execute('ALTER TABLE visitor_logs ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    } catch (_) {}

    // Add unique key. This will fail if there are existing duplicates
    try {
      await conn.execute('ALTER TABLE visitor_logs ADD UNIQUE KEY guest_path (guest_name, path)');
    } catch (e) {
      console.warn('Could not add UNIQUE key (maybe duplicates exist or already exists):', e.message);
    }

    console.log('Migration done.');
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    if (conn) await conn.end();
  }
}

migrate();
