import React, { PropsWithChildren } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { brand, fonts, radius } from '@/src/lib/designTokens';

interface SizeSelectorProps {
  onSizeSelect: (size: string) => void;
  selectedSize: string;
  productSize: string[];
}

export default function SizeSelector(props: PropsWithChildren<SizeSelectorProps>) {
  const { productSize, selectedSize, onSizeSelect } = props;

  return (
    <Box sx={{ my: 2, width: '100%' }}>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: brand.charcoal,
          mb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span>Size:</span>
        {selectedSize ? (
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: brand.sage,
              backgroundColor: 'rgba(90, 109, 87, 0.08)',
              px: 1.2,
              py: 0.2,
              fontSize: '0.8rem',
              borderRadius: '2px',
            }}
          >
            {selectedSize}
          </Box>
        ) : (
          <Box component="span" sx={{ fontWeight: 400, color: brand.muted, fontSize: '0.8rem' }}>
            Not selected
          </Box>
        )}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {productSize.map((s) => {
          const isSelected = selectedSize === s;
          return (
            <Button
              key={s}
              onClick={() => onSizeSelect(s)}
              variant={isSelected ? 'contained' : 'outlined'}
              disableElevation
              sx={{
                minWidth: '50px',
                height: '46px',
                padding: '0 12px',
                borderRadius: radius.button,
                fontFamily: fonts.sans,
                fontSize: '0.875rem',
                fontWeight: isSelected ? 600 : 500,
                border: isSelected ? `1px solid ${brand.sage}` : `1px solid ${brand.border}`,
                backgroundColor: isSelected ? brand.sage : 'transparent',
                color: isSelected ? brand.white : brand.charcoal,
                transition: 'all 0.15s ease-in-out',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: isSelected ? brand.sageLight : 'rgba(90, 109, 87, 0.05)',
                  borderColor: brand.sage,
                },
              }}
            >
              {s}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
