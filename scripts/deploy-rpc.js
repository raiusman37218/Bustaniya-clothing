const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

console.log('----------------------------------------------------');
console.log('Supabase RPC Migration Deployer');
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

  // Connection strings to try
  const poolerConn = `postgres://postgres.rjkdjbcmyexcbawxgjrd:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require`;
  const directConn = `postgres://postgres:${encodeURIComponent(password)}@db.rjkdjbcmyexcbawxgjrd.supabase.co:5432/postgres`;

  console.log('\nConnecting to Supabase Database...');
  
  let client;
  try {
    // Try pooler first (supports IPv4)
    console.log('Attempting connection via Pooler (port 6543)...');
    client = new Client({ connectionString: poolerConn });
    await client.connect();
    console.log('Connected successfully via Pooler!');
  } catch (poolerErr) {
    console.log(`Pooler connection failed: ${poolerErr.message}`);
    try {
      // Fallback to direct connection
      console.log('Attempting direct connection (port 5432)...');
      client = new Client({ connectionString: directConn });
      await client.connect();
      console.log('Connected successfully via direct connection!');
    } catch (directErr) {
      console.error('\nDatabase Connection Failed!');
      console.error(`Direct connection error: ${directErr.message}`);
      console.error('\nPlease double check your Database Password.');
      console.error('If you forgot your password, you can reset it in the Supabase Dashboard under Settings -> Database.');
      process.exit(1);
    }
  }

  try {
    console.log('Reading migration file...');
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260606000000_admin_products_rpc_fallback.sql');
    let sql = fs.readFileSync(migrationPath, 'utf8');

    // Add extra drop statements to clear the cache of any old signature
    const preSql = `
      DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, boolean, text, text, text, text, boolean, text, boolean, numeric, text);
      DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean);
    `;

    // Add explicit execution grants for anon and authenticated users
    const postSql = `
      GRANT EXECUTE ON FUNCTION public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean) TO anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.admin_update_product_rpc(text, bigint, jsonb) TO anon, authenticated;
      GRANT EXECUTE ON FUNCTION public.admin_delete_product_rpc(text, bigint) TO anon, authenticated;
    `;

    const fullSql = preSql + '\n' + sql + '\n' + postSql;

    console.log('Deploying SQL migration...');
    await client.query(fullSql);
    console.log('\nMigration executed successfully!');
    console.log('The RPC functions for inserting, updating, and deleting products are now deployed and permissions are granted.');
  } catch (err) {
    console.error('Migration failed during execution:', err);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
});
