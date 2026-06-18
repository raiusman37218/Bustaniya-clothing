const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

console.log('----------------------------------------------------');
console.log('Supabase Expenses & Stock Management Migration Deployer');
console.log('----------------------------------------------------');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter your Supabase Database Password: ', async (password) => {
  rl.close();
  
  if (!password.trim()) {
    console.error('Password cannot be empty.');
    process.exit(1);
  }

  // Connection strings
  const poolerConn = `postgres://postgres.rjkdjbcmyexcbawxgjrd:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;
  const directConn = `postgres://postgres:${encodeURIComponent(password)}@db.rjkdjbcmyexcbawxgjrd.supabase.co:5432/postgres`;

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
      console.error('\nPlease double check your Database Password.');
      process.exit(1);
    }
  }

  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260618000000_add_expenses_and_stock.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Deploying Expenses & Stock SQL migration...');
    await client.query(sql);
    console.log('\nMigration executed successfully!');
    console.log('The stock_entries table has been created, and products table linked.');
  } catch (err) {
    console.error('Migration failed during execution:', err);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
});
