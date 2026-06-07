const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

console.log('----------------------------------------------------');
console.log('Bustaniya Supabase Database Initializer');
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

// 2. Parse Project Reference from .env.local
let projectId = '';
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*https:\/\/([a-z0-9]+)\.supabase\.co/i);
    if (match && match[1]) {
      projectId = match[1].trim();
      console.log(`Detected Supabase Project Reference: ${projectId}`);
    }
  }
} catch (err) {
  console.warn('Could not parse .env.local automatically:', err.message);
}

if (!projectId) {
  console.log('Could not detect project reference from .env.local.');
  const rlProject = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rlProject.question('Please enter your Supabase Project Reference ID (e.g. svszvwblyskeloocfwqb): ', (id) => {
    rlProject.close();
    if (!id.trim()) {
      console.error('Project Reference cannot be empty.');
      process.exit(1);
    }
    projectId = id.trim();
    promptPassword();
  });
} else {
  promptPassword();
}

function promptPassword() {
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
        console.error('\nPlease double check your Database Password.');
        console.error('If you forgot your password, you can reset it in the Supabase Dashboard under Settings -> Database.');
        process.exit(1);
      }
    }

    try {
      console.log('\nScanning migrations in supabase/migrations...');
      const migrationsDir = path.join(__dirname, '../supabase/migrations');
      const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort(); // Run chronologically

      console.log(`Found ${files.length} migration files to execute.`);

      for (const file of files) {
        console.log(`\nExecuting migration: ${file}...`);
        const filePath = path.join(migrationsDir, file);
        let sql = fs.readFileSync(filePath, 'utf8');

        // Special handling for the products rpc migration to add drop statements and grants
        if (file.includes('admin_products_rpc_fallback')) {
          const preSql = `
            DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, boolean, text, text, text, text, boolean, text, boolean, numeric, text);
            DROP FUNCTION IF EXISTS public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean);
          `;
          const postSql = `
            GRANT EXECUTE ON FUNCTION public.admin_insert_product_rpc(text, text, text, text, text, jsonb, jsonb, jsonb, boolean, boolean, boolean) TO anon, authenticated;
            GRANT EXECUTE ON FUNCTION public.admin_update_product_rpc(text, bigint, jsonb) TO anon, authenticated;
            GRANT EXECUTE ON FUNCTION public.admin_delete_product_rpc(text, bigint) TO anon, authenticated;
          `;
          sql = preSql + '\n' + sql + '\n' + postSql;
        }

        await client.query(sql);
        console.log(`Successfully completed migration: ${file}`);
      }

      console.log('\n----------------------------------------------------');
      console.log('Database Initialization Completed Successfully!');
      console.log('All tables, triggers, policies, and RPC procedures have been deployed.');
      console.log('----------------------------------------------------');

    } catch (err) {
      console.error('\nMigration failed during execution:', err.message);
    } finally {
      await client.end();
      console.log('Database connection closed.');
    }
  });
}
