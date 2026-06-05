import { Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import StaticPageShell from '@/src/components/layout/StaticPageShell';

export default function ContactPage() {
  return (
    <StaticPageShell title="Contact us">
      <Typography sx={{ color: '#555', lineHeight: 1.7, mb: 2 }}>
        For order questions, returns, or styling help, reach our team:
      </Typography>
      <Typography sx={{ color: '#555', lineHeight: 1.7, mb: 2 }}>
        Email:{' '}
        <MuiLink href="mailto:support@bustaniya.com" sx={{ color: '#5A6D57' }}>
          support@bustaniya.com
        </MuiLink>
      </Typography>
      <Typography sx={{ color: '#555', lineHeight: 1.7 }}>
        <Link href="/shop" style={{ color: '#5A6D57' }}>
          Continue shopping
        </Link>
      </Typography>
    </StaticPageShell>
  );
}
