import { Box, Container, useTheme, useMediaQuery } from '@mui/material';

import FooterGridMobile from './FooterGridMobile';
import FooterGridDesktop from './FooterGridDesktop';

function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ color: '#FFFFFF', backgroundColor: '#111111', pb: 6 }}>
      <Container>
        {isMobile ? <FooterGridMobile /> : <FooterGridDesktop />}
      </Container>
    </Box>
  );
}

export default Footer;
