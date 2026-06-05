import Image from 'next/image';
import Link from 'next/link';
import { Box } from '@mui/material';
import Logo from '@/public/bustaniya-logo.png';

function HeroOverlayLogo() {
  return (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <Box sx={{ textAlign: 'center', lineHeight: 1 }}>
        <Image
          priority
          unoptimized
          src={Logo}
          alt="Bustaniya"
          width={833}
          height={246}
          style={{
            height: 48,
            width: 'auto',
            maxWidth: 240,
            objectFit: 'contain',
            background: 'transparent',
          }}
        />
      </Box>
    </Link>
  );
}

export default HeroOverlayLogo;
