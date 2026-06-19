import React, { PropsWithChildren } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { fonts } from '@/src/lib/designTokens';

interface SizeSelectorProps {
  onSizeSelect: (size: string) => void;
  selectedSize: string;
  productSize: string[];
}

export default function SizeSelector(props: PropsWithChildren<SizeSelectorProps>) {
  const { productSize, selectedSize, onSizeSelect } = props;

  return (
    <Box sx={{ my: 1.5, width: '100%' }}>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#121212',
          mb: 1.5,
        }}
      >
        Size
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {productSize.map((s) => {
          const isSelected = selectedSize === s;
          return (
            <Button
              key={s}
              onClick={() => onSizeSelect(s)}
              variant="outlined"
              disableElevation
              sx={{
                minWidth: '60px',
                height: '40px',
                px: 2.5,
                borderRadius: '20px',
                fontFamily: fonts.sans,
                fontSize: '0.85rem',
                fontWeight: 500,
                border: isSelected ? '1px solid #111111' : '1px solid #d3d3d3',
                backgroundColor: isSelected ? '#111111' : 'transparent',
                color: isSelected ? '#ffffff' : '#111111',
                transition: 'all 0.15s ease-in-out',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: isSelected ? '#222222' : 'rgba(0, 0, 0, 0.05)',
                  borderColor: '#111111',
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
