import React, { PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";
import { fonts, brand } from "@/src/lib/designTokens";

interface Types {
  name: string;
  description: string;
  articleNumber?: string;
  currentColor?: string;
}

export default function ProductInformation(props: PropsWithChildren<Types>) {
  const { name, description, articleNumber, currentColor } = props;
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: fonts.display, 
            fontWeight: 500,
            color: brand.ink,
            fontSize: { xs: '1.75rem', md: '2.15rem' },
            lineHeight: 1.25,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
          }}
        >
          {name}
        </Typography>

        {/* Article Code & Color details */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 3 }, mt: 0.5 }}>
          {articleNumber && (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Article Code: <span style={{ color: '#111111', fontWeight: 600 }}>{articleNumber}</span>
            </Typography>
          )}
          {currentColor && (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(0,0,0,0.5)',
              }}
            >
              Color: <span style={{ color: '#111111', fontWeight: 600 }}>{currentColor}</span>
            </Typography>
          )}
        </Box>
      </Box>

      <Typography 
        sx={{ 
          fontFamily: fonts.sans,
          fontSize: '0.92rem',
          lineHeight: 1.65,
          color: brand.charcoal,
          maxWidth: '580px',
          mt: 1,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
