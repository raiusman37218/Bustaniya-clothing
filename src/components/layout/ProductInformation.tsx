import React, { PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";
import { fonts, brand } from "@/src/lib/designTokens";

interface Types {
  name: string;
  description: string;
}

export default function ProductInformation(props: PropsWithChildren<Types>) {
  const { name, description } = props;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontFamily: fonts.display, 
          fontWeight: 600,
          color: brand.ink,
          fontSize: { xs: '1.75rem', md: '2.25rem' },
          lineHeight: 1.2,
          letterSpacing: '-0.01em'
        }}
      >
        {name}
      </Typography>
      <Typography 
        sx={{ 
          fontFamily: fonts.sans,
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: brand.charcoal,
          maxWidth: '580px'
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
