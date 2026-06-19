import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { brand } from '@/src/lib/designTokens';

import FooterGridMobile from './FooterGridMobile';
import FooterGridDesktop from './FooterGridDesktop';

function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ color: '#FFFFFF', backgroundColor: brand.sage, pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 10 } }}>
      <Container>
        {isMobile ? <FooterGridMobile /> : <FooterGridDesktop />}
      </Container>
    </Box>
  );
}

export default Footer;
