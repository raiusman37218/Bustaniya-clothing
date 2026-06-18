'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, Grid, Typography } from '@mui/material';
import { EDITORIAL_TRIPTYCH } from '@/src/data/landingEditorial';
import SectionHeading from '@/src/components/ui/SectionHeading';
import SectionContainer from '@/src/components/ui/SectionContainer';
import MediaFrame, {
  mediaFrameImageClass,
  mediaFrameImageStyle,
} from '@/src/components/ui/MediaFrame';
import { brand, fonts, sectionSpacing } from '@/src/lib/designTokens';

export default function EditorialTriptych() {
  return (
    <Box
      component="section"
      sx={{ py: sectionSpacing.py, bgcolor: brand.surface }}
    >
      <SectionContainer>
        <SectionHeading
          eyebrow="Bustaniya edits"
          title="Three moods to explore"
          subtitle="Occasion dressing, bridal studio, and everyday ease — start with an edit."
        />

        <Grid container spacing={{ xs: 2, md: 2.5 }}>
          {EDITORIAL_TRIPTYCH.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Link
                href={item.href}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <MediaFrame aspectRatio="4/5" gradient="bottomStrong">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={mediaFrameImageClass}
                    sizes="(max-width:900px) 100vw, 33vw"
                    style={mediaFrameImageStyle}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      p: { xs: 2, md: 2.5 },
                      zIndex: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: brand.white,
                        fontWeight: 400,
                        fontSize: { xs: '1.1rem', md: '1.25rem' },
                        letterSpacing: '0.05em',
                        fontFamily: fonts.display,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '13px',
                        mt: 0.5,
                        lineHeight: 1.6,
                        fontFamily: fonts.sans,
                      }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Box>
                </MediaFrame>
              </Link>
            </Grid>
          ))}
        </Grid>
      </SectionContainer>
    </Box>
  );
}
