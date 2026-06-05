'use client';

import { Container, ContainerProps } from '@mui/material';
import { containerPadding } from '@/src/lib/designTokens';

type SectionContainerProps = ContainerProps;

export default function SectionContainer({
  maxWidth = 'xl',
  sx,
  ...props
}: SectionContainerProps) {
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        ...containerPadding,
        ...sx,
      }}
      {...props}
    />
  );
}
