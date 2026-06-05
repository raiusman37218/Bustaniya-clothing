type EnvMap = Record<string, string | undefined>;

function normalizeBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/$/, '');
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
}

/** Absolute URL for the logo image in transactional emails. */
export function getEmailLogoUrlFromEnv(env: EnvMap): string {
  const explicit = env.EMAIL_LOGO_URL?.trim();
  if (explicit) return explicit;

  const base =
    env.NEXT_PUBLIC_SITE_URL?.trim() ||
    env.SITE_URL?.trim() ||
    env.VERCEL_URL?.trim();
  if (!base) return '';

  return `${normalizeBaseUrl(base)}/bustaniya-logo.png`;
}
