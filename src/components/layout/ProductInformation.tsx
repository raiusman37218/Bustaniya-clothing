import React, { PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";
import { fonts } from "@/src/lib/designTokens";

interface Types {
  name: string;
  description: string;
  price?: string;
  articleNumber?: string;
  currentColor?: string;
  stockQuantity?: number;
}

export default function ProductInformation(props: PropsWithChildren<Types>) {
  const { name, price, articleNumber } = props;
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Typography 
          variant="h1" 
          sx={{ 
            fontFamily: fonts.sans,
            fontWeight: 500,
            color: '#4A0E17',
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
              fontSize: { xs: '1.1rem', md: '1.2rem' },
              fontWeight: 500,
              color: '#4A0E17',
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
      </Box>

      <Box sx={{ borderBottom: '1px solid #4a0e17', opacity: 0.2, my: 1.5 }} />
    </Box>
  );
}
