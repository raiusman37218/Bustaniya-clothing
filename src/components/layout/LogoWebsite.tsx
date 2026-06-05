import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/bustaniya-logo.png';
import { Box } from '@mui/material';

function LogoWebsite() {
  return (
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <Link href="/">
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
      </Link>
    </Box>
  );
}

export default LogoWebsite;
