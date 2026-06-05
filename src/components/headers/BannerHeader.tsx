import { Typography, Box } from '@mui/material';
import { brand, fonts } from '@/src/lib/designTokens';

function BannerHeader() {
  return (
    <Box component="aside" sx={{ width: '100%' }}>
      <Typography
        component="p"
        textAlign="center"
        sx={{
          py: { xs: 0.75, md: 0.875 },
          px: 2,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: { xs: '11px', sm: '12px', md: '13px' },
          lineHeight: 1.4,
          bgcolor: '#1a1a1a',
          color: '#ffffff',
          fontFamily: fonts.sans,
        }}
      >
        UNLOCK FREE SHIPPING ON NATIONWIDE PAID ORDERS — <a href="/collections/all" style={{ color: '#fff', textDecoration: 'underline' }}>SHOP NOW</a>
      </Typography>
    </Box>
  );
}

export default BannerHeader;
