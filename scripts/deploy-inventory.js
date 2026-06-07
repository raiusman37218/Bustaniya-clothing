const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// 1. Install 'pg' module if not present
try {
  require.resolve('pg');
} catch (e) {
  console.log('Installing "pg" database driver (temporary)...');
  try {
    execSync('npm install pg --no-save', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  } catch (error) {
    console.error('Failed to install "pg" module. Please run: npm install pg');
    process.exit(1);
  }
}

const { Client } = require('pg');

// 2. Parse Project Reference from .env.local
let projectId = 'rjkdjbcmyexcbawxgjrd';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nPlease enter your Supabase Database Password: ', async (password) => {
  rl.close();
  
  if (!password.trim()) {
    console.error('Password cannot be empty.');
    process.exit(1);
  }

  const poolerConn = `postgres://postgres.${projectId}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;
  const directConn = `postgres://postgres:${encodeURIComponent(password)}@db.${projectId}.supabase.co:5432/postgres`;

  console.log('\nConnecting to Supabase Database...');
  
  let client;
  try {
    console.log('Attempting connection via Pooler (port 6543)...');
    client = new Client({ connectionString: poolerConn });
    await client.connect();
    console.log('Connected successfully via Pooler!');
  } catch (poolerErr) {
    console.log(`Pooler connection failed: ${poolerErr.message}`);
    try {
      console.log('Attempting direct connection (port 5432)...');
      client = new Client({ connectionString: directConn });
      await client.connect();
      console.log('Connected successfully via direct connection!');
    } catch (directErr) {
      console.error('\nDatabase Connection Failed!');
      console.error(`Direct connection error: ${directErr.message}`);
      process.exit(1);
    }
  }

  try {
    console.log('\nExecuting plural products schema migration...');
    const filePath = path.join(__dirname, '../supabase/migrations/20260606020000_plural_products_migration.sql');
    const sql = fs.readFileSync(filePath, 'utf8');

    await client.query(sql);
    console.log('Migration executed successfully!');
    console.log('The "products" table, updated "inventory"/"order_items" tables, triggers, and RPC fallbacks have been registered.');
  } catch (err) {
    console.error('\nMigration failed:', err.message);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
});
