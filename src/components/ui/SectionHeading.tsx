'use client';

import { Box, Typography } from '@mui/material';
import { brand, fonts } from '@/src/lib/designTokens';
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  sx?: object;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = 'left',
  sx,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: centered ? 'column' : { xs: 'column', sm: 'row' },
        alignItems: centered ? 'center' : { xs: 'flex-start', sm: 'center' },
        justifyContent: centered ? 'center' : 'space-between',
        gap: centered ? 1 : 2,
        mb: { xs: 3, md: 4 },
        textAlign: centered ? 'center' : 'left',
        ...sx,
      }}
    >
      <Box sx={{ maxWidth: centered ? 560 : 640 }}>
        {eyebrow && (
          <Typography
            component="p"
            sx={{
              fontSize: { xs: '11px', md: '12px' },
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: brand.muted,
              fontWeight: 500,
              fontFamily: fonts.sans,
              mb: 1,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.35rem' },
            fontWeight: 400,
            letterSpacing: '0.03em',
            lineHeight: 1.2,
            color: brand.ink,
            fontFamily: fonts.display,
            fontStyle: 'normal',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              mt: 1.25,
              fontSize: { xs: '14px', md: '15px' },
              lineHeight: 1.65,
              color: brand.charcoal,
              fontFamily: fonts.sans,
              fontWeight: 400,
              maxWidth: 480,
              mx: centered ? 'auto' : 0,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
