'use client';

import { Box } from '@mui/material';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import HeroSection from '@/src/components/sections/HeroSection';

function HomeHeroBlock() {
  return (
    <Box sx={{ width: '100%' }}>
      <BannerHeader />
      <NavBar variant="default" />
      <HeroSection />
    </Box>
  );
}

export default HomeHeroBlock;
