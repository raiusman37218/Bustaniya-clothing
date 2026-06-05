'use client';

import { Typography, Box } from '@mui/material';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import Footer from '@/src/components/layout/Footer';
import SectionContainer from '@/src/components/ui/SectionContainer';
import { brand, fonts } from '@/src/lib/designTokens';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function StaticPageShell({ title, children }: Props) {
  return (
    <>
      <BannerHeader />
      <NavBar />
      <Box
        component="main"
        sx={{ bgcolor: brand.surface, minHeight: '55vh', py: { xs: 4, md: 6 } }}
      >
        <SectionContainer maxWidth="md">
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 700,
              mb: 3,
              color: brand.ink,
              letterSpacing: '-0.03em',
              fontFamily: fonts.display,
              lineHeight: 1.15,
            }}
          >
            {title}
          </Typography>
          {children}
        </SectionContainer>
      </Box>
      <Footer />
    </>
  );
}
