'use client';

import { Box } from '@mui/material';
import HomeHeroBlock from '@/src/components/sections/HomeHeroBlock';
import NewInSection from '@/src/components/sections/NewInSection';
import BestSellers from '@/src/components/sections/BestSellers';
import MostTrending from '@/src/components/sections/MostTrending';
import Collection from '@/src/components/sections/Collection';
import MoodiWeek from '@/src/components/sections/MoodiWeek';
import Sustainability from '@/src/components/sections/Sustainability';
import FollowUs from '@/src/components/sections/FollowUs';
import Footer from '@/src/components/layout/Footer';
import ScrollReveal from '@/src/components/utility/ScrollReveal';
import UseProductsReturn from '../hooks/UseProductsReturn';
import { brand, sectionSpacing } from '@/src/lib/designTokens';

export default function Home() {
  UseProductsReturn();

  return (
    <Box component="main" sx={{ bgcolor: brand.white, overflow: 'hidden' }}>
      <HomeHeroBlock />

      <ScrollReveal>
        <Box sx={{ py: sectionSpacing.pyCompact }}>
          <NewInSection />
        </Box>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <Box sx={{ bgcolor: brand.surface, py: sectionSpacing.py }}>
          <BestSellers />
        </Box>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <Box sx={{ py: sectionSpacing.py }}>
          <MostTrending />
        </Box>
      </ScrollReveal>

      <ScrollReveal>
        <Box sx={{ py: sectionSpacing.py }}>
          <Collection />
        </Box>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <Box sx={{ bgcolor: brand.surface, py: sectionSpacing.py }}>
          <MoodiWeek />
        </Box>
      </ScrollReveal>

      <ScrollReveal variant="fade-left">
        <Sustainability />
      </ScrollReveal>

      <ScrollReveal>
        <Box sx={{ bgcolor: brand.surface, py: sectionSpacing.py }}>
          <FollowUs />
        </Box>
      </ScrollReveal>

      <ScrollReveal variant="fade-up" duration={0.6}>
        <Footer />
      </ScrollReveal>
    </Box>
  );
}
