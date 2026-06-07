import React, { PropsWithChildren } from 'react';
import { Box, Button } from '@mui/material';
import Image from 'next/image';
import { brand } from '@/src/lib/designTokens';

interface Types {
  options: string[];
  onSelect: (image: string, index: any) => void;
  SelectItem: string | null;
}

export default function ProductImageGallery(props: PropsWithChildren<Types>) {
  const { options, onSelect, SelectItem } = props;
  
  return (
    <Box
      sx={{
        overflowY: 'auto',
        maxHeight: '600px',
        pr: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        // Hide scrollbar for Chrome, Safari and Opera
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
        },
        '&::-webkit-scrollbar-thumb': {
          background: brand.sageMuted,
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: brand.sage,
        },
      }}
    >
      {options.map((image, index) => {
        const isSelected = SelectItem === index.toString() || (SelectItem === null && index === 0);
        return (
          <Button
            key={index}
            onClick={() => {
              onSelect(image, index);
            }}
            sx={{
              padding: 0,
              minWidth: 0,
              borderRadius: '4px',
              overflow: 'hidden',
              border: isSelected 
                ? `2px solid ${brand.sage}` 
                : `1px solid ${brand.border}`,
              backgroundColor: 'transparent',
              transition: 'all 0.2s ease-in-out',
              opacity: isSelected ? 1 : 0.75,
              '&:hover': {
                opacity: 1,
                borderColor: brand.sageLight,
                backgroundColor: 'transparent',
              },
            }}
          >
            <Image
              src={image}
              width={100}
              height={125}
              style={{
                objectFit: 'cover',
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
              alt={`thumbnail gallery image ${index + 1}`}
            />
          </Button>
        );
      })}
    </Box>
  );
}
