import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const serviceKey = (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  const testResults = {
    anonKeyTest: 'not_run',
    serviceKeyTest: 'not_run',
  };

  if (url && anonKey) {
    try {
      const res = await fetch(`${url}/rest/v1/product?select=id&limit=1`, {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      });
      if (res.ok) {
        testResults.anonKeyTest = 'SUCCESS (200)';
      } else {
        const body = await res.json().catch(() => ({}));
        testResults.anonKeyTest = `FAILED: ${res.status} ${res.statusText} - ${JSON.stringify(body)}`;
      }
    } catch (err) {
      testResults.anonKeyTest = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  if (url && serviceKey) {
    try {
      const res = await fetch(`${url}/rest/v1/product?select=id&limit=1`, {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      });
      if (res.ok) {
        testResults.serviceKeyTest = 'SUCCESS (200)';
      } else {
        const body = await res.json().catch(() => ({}));
        testResults.serviceKeyTest = `FAILED: ${res.status} ${res.statusText} - ${JSON.stringify(body)}`;
      }
    } catch (err) {
      testResults.serviceKeyTest = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  const info = {
    NEXT_PUBLIC_SUPABASE_URL: {
      value: url,
      length: url ? url.length : 0,
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      exists: !!anonKey,
      length: anonKey ? anonKey.length : 0,
      prefix: anonKey ? anonKey.substring(0, 15) : '',
      suffix: anonKey ? anonKey.substring(anonKey.length - 15) : '',
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      exists: !!serviceKey,
      length: serviceKey ? serviceKey.length : 0,
      prefix: serviceKey ? serviceKey.substring(0, 15) : '',
      suffix: serviceKey ? serviceKey.substring(serviceKey.length - 15) : '',
    },
    ADMIN_PASSWORD: {
      exists: !!adminPassword,
      length: adminPassword ? adminPassword.length : 0,
    },
    testResults
  };

  return NextResponse.json(info);
}
