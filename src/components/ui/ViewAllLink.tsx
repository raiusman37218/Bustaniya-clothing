import Link from 'next/link';
import { Typography } from '@mui/material';
import { brand, fonts } from '@/src/lib/designTokens';

export default function ViewAllLink({ href = '/shop' }: { href?: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 600,
          color: brand.sage,
          fontFamily: fonts.sans,
          letterSpacing: '0.02em',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.2s ease, color 0.2s ease',
          '&:hover': {
            color: brand.sageLight,
            borderBottomColor: brand.sageLight,
          },
        }}
      >
        View all
      </Typography>
    </Link>
  );
}
