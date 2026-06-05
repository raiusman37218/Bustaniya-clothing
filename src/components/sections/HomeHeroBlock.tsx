import { Box } from '@mui/material';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import HeroSection from '@/src/components/sections/HeroSection';

function HomeHeroBlock() {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <HeroSection />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: 'none',
          '& a, & button, & [role="button"]': { pointerEvents: 'auto' },
        }}
      >
        <BannerHeader />
        <NavBar variant="overlay" />
      </Box>
    </Box>
  );
}

export default HomeHeroBlock;
