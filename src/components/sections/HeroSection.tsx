'use client';

import Image from 'next/image';
import { Box } from '@mui/material';

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '65vh', md: '75vh', lg: '82vh' },
        minHeight: { xs: '400px', md: '550px', lg: '650px' },
        overflow: 'hidden',
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Background Image */}
      <Image
        src="https://res.cloudinary.com/dqd6xx60g/image/upload/q_auto/f_auto/v1781804177/bustaniya_specific_3_iw2nnb.png"
        alt="Bustaniya luxury retail campaign"
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    </Box>
  );
}
