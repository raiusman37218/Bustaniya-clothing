import Image from 'next/image';
import Link from 'next/link';
import sustainabilityBanner from '@/public/Sustainability.png';
import { Box, Button, Typography } from '@mui/material';
import SectionContainer from '@/src/components/ui/SectionContainer';
import { brand, fonts, gradients, radius, sectionSpacing } from '@/src/lib/designTokens';

function Sustainability() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 440, md: 540 },
        overflow: 'hidden',
        my: { xs: 2, md: 0 },
      }}
    >
      <Image
        alt="Natural cotton textiles — sustainable fashion at Bustaniya"
        src={sustainabilityBanner}
        fill
        style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        sizes="100vw"
        priority={false}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: gradients.sustainability,
          pointerEvents: 'none',
        }}
      />

      <SectionContainer
        sx={{
          position: 'relative',
          height: '100%',
          minHeight: { xs: 440, md: 540 },
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: 480, color: brand.white, py: sectionSpacing.py }}>
          <Typography
            sx={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 500,
              fontFamily: fonts.sans,
              opacity: 0.92,
              mb: 1.5,
            }}
          >
            Our commitment
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: fonts.display,
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 400,
              lineHeight: 1.2,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            Stylish sustainability
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '14px', md: '16px' },
              lineHeight: 1.65,
              fontFamily: fonts.sans,
              opacity: 0.92,
              mb: 3,
            }}
          >
            Eco-conscious choices in fabric and production — designed for a
            greater future without compromising on elegance.
          </Typography>

          <Button
            component={Link}
            href="/shop"
            variant="contained"
            disableElevation
            sx={{
              textTransform: 'uppercase',
              color: brand.ink,
              bgcolor: brand.white,
              fontWeight: 600,
              fontSize: '12px',
              px: 4,
              py: 1.5,
              borderRadius: 0,
              fontFamily: fonts.sans,
              letterSpacing: '0.15em',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'transparent',
                color: brand.white,
                border: `1px solid ${brand.white}`,
                boxShadow: 'none',
              },
            }}
          >
            Discover more
          </Button>
        </Box>
      </SectionContainer>
    </Box>
  );
}

export default Sustainability;
