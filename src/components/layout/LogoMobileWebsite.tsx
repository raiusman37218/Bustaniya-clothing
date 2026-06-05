import { Box } from "@mui/material";
import Image from "next/image";
import Logo from '@/public/bustaniya-logo.png';
import Link from 'next/link';

function LogoMobileWebsite() {
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'none' },
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Link href="/">
        <Image
          priority
          unoptimized
          alt="Bustaniya"
          src={Logo}
          width={833}
          height={246}
          style={{
            height: 40,
            width: 'auto',
            maxWidth: 200,
            objectFit: 'contain',
            background: 'transparent',
          }}
        />
      </Link>
    </Box>
  );
}

export default LogoMobileWebsite;
