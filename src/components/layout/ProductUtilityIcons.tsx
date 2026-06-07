import React from 'react';
import { Box, Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { brand, fonts } from '@/src/lib/designTokens';

export default function ProductUtilityIcons() {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      marginTop={'1.5rem'}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: '1.5rem',
        borderBottom: `1px solid ${brand.border}`,
        pb: 2,
      }}
    >
      <Box display={'flex'} alignItems={'center'} gap={'8px'}>
        <LocalShippingOutlinedIcon sx={{ color: brand.sage, fontSize: '1.3rem' }} />
        <Typography 
          sx={{ 
            fontFamily: fonts.sans,
            fontSize: '0.85rem',
            fontWeight: 500,
            color: brand.charcoal,
          }}
        >
          Free Shipping & Easy Returns
        </Typography>
      </Box>
      <Box 
        display={'flex'} 
        alignItems={'center'} 
        gap={'8px'}
        sx={{
          cursor: 'pointer',
          transition: 'color 0.2s',
          '&:hover': {
            color: brand.sage,
          }
        }}
      >
        <FavoriteBorderOutlinedIcon sx={{ color: brand.charcoal, fontSize: '1.2rem' }} />
        <Typography 
          sx={{ 
            fontFamily: fonts.sans,
            fontSize: '0.85rem',
            fontWeight: 500,
            color: brand.charcoal,
          }}
        >
          Add to Wish List
        </Typography>
      </Box>
    </Box>
  );
}
