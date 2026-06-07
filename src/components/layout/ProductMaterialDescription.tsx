import React from 'react';
import { Box, Typography } from '@mui/material';
import { brand, fonts, radius } from '@/src/lib/designTokens';

export default function ProductMaterialDescription() {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: 'rgba(90, 109, 87, 0.03)',
        border: `1px dashed ${brand.sageMuted}`,
        borderRadius: radius.product,
        marginTop: '2.5rem',
        padding: '1.5rem 1.5rem',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontFamily: fonts.display,
          fontWeight: 600,
          color: brand.sage,
          borderBottom: `1px solid ${brand.border}`,
          paddingBottom: '0.75rem',
          mb: '1rem',
          fontSize: '1.25rem',
        }}
      >
        CuproLuxe™ Fabric
      </Typography>
      <Typography 
        sx={{ 
          fontFamily: fonts.sans,
          fontSize: '0.9rem',
          lineHeight: 1.5,
          color: brand.charcoal,
          mb: '1.5rem'
        }}
      >
        Our CuproLuxe is a regenerated cellulose fabric made from cotton waste.
        This fabric is made in a zero-waste closed loop process, and is 100%
        biodegradable. Cupro is breathable, quick drying and durable. This
        OEKO-TEX®, FSC, and GRS certified material is made in Turkey.
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {['Quick Dry', 'Highly Breathable', 'Machine Washable'].map((tag) => (
          <Box 
            key={tag}
            sx={{ 
              background: brand.white, 
              border: `1px solid ${brand.border}`,
              borderRadius: radius.button,
              padding: '0.4rem 0.8rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <Typography 
              sx={{ 
                fontFamily: fonts.sans,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: brand.sage,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {tag}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
