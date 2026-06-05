import { getEmailLogoUrlFromEnv } from '../../../shared/email/emailBrand';

export function getEmailLogoUrl(): string {
  return getEmailLogoUrlFromEnv(process.env as Record<string, string | undefined>);
}
