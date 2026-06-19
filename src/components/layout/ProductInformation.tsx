import React, { PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";
import { fonts, brand } from "@/src/lib/designTokens";

interface Types {
  name: string;
  description: string;
  price?: string;
  articleNumber?: string;
  currentColor?: string;
  stockQuantity?: number;
}

export default function ProductInformation(props: PropsWithChildren<Types>) {
  const { name, description, price, articleNumber, currentColor, stockQuantity } = props;
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontFamily: fonts.sans,
            fontWeight: 500,
            color: '#121212',
            fontSize: { xs: '1.6rem', md: '2.1rem' },
            lineHeight: 1.25,
            letterSpacing: '0.01em',
            textTransform: 'none',
          }}
        >
          {name}
        </Typography>

        {price && (
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: { xs: '1.15rem', md: '1.25rem' },
              fontWeight: 500,
              color: '#121212',
              mt: 0.5,
            }}
          >
            {price}
          </Typography>
        )}

        {/* Article Code */}
        {articleNumber && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 3 }, mt: 0.5 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Article Code: <span style={{ color: '#111111', fontWeight: 600 }}>{articleNumber}</span>
            </Typography>
          </Box>
        )}

        {/* Inventory Indicator */}
        {stockQuantity !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: 1 }}>
            <Box 
              sx={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: stockQuantity <= 5 ? '#e53935' : '#4caf50',
                animation: stockQuantity <= 5 ? 'pulse 1.5s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(0.95)', opacity: 0.5 },
                  '50%': { transform: 'scale(1.15)', opacity: 1 },
                  '100%': { transform: 'scale(0.95)', opacity: 0.5 },
                }
              }} 
            />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: '0.85rem',
                fontWeight: 600,
                color: stockQuantity <= 5 ? '#d32f2f' : '#2e7d32',
              }}
            >
              {stockQuantity <= 0 
                ? 'Out of stock' 
                : stockQuantity <= 5 
                  ? `Only ${stockQuantity} left in stock - order soon!` 
                  : `In stock (${stockQuantity} units available)`
              }
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ borderBottom: '1px solid #eaeaea', my: 1 }} />

      <Typography 
        sx={{ 
          fontFamily: fonts.sans,
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: brand.charcoal,
          mt: 0.5,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
