const SESSION_PAYLOAD = 'admin-authenticated';

function getAdminSecret(): string | undefined {
  return process.env.ADMIN_PASSWORD?.trim() || undefined;
}

function bufferToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function createSessionToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(SESSION_PAYLOAD),
  );
  return bufferToHex(new Uint8Array(signature));
}

export async function isValidAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret || !token) return false;
  const expected = await createSessionToken(secret);
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
