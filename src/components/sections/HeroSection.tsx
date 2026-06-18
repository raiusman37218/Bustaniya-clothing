'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Button } from '@mui/material';
import { fonts } from '@/src/lib/designTokens';

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '65vh', md: '75vh', lg: '82vh' },
        minHeight: { xs: '400px', md: '550px', lg: '650px' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
      }}
    >
      {/* Background Image */}
      <Image
        src="https://res.cloudinary.com/dqd6xx60g/image/upload/q_auto/f_auto/v1781804049/bustaniya_specific_kurti_ta9gwf.png"
        alt="Bustaniya luxury retail campaign"
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />

      {/* Centered CTA Button */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Button
          component={Link}
          href="/shop"
          variant="contained"
          disableElevation
          sx={{
            bgcolor: '#111111',
            color: '#ffffff',
            px: { xs: 4, sm: 5, md: 6 },
            py: { xs: 1.75, sm: 2 },
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: fonts.sans,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderRadius: 0,
            transition: 'all 0.3s ease',
            border: '1px solid #111111',
            '&:hover': {
              bgcolor: 'transparent',
              color: '#111111',
              borderColor: '#111111',
              boxShadow: 'none',
            },
          }}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
}
