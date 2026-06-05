import { Suspense } from 'react';
import { Box, Skeleton, Container } from '@mui/material';
import ShopCatalog from './ShopCatalog';

function ShopFallback() {
  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '50vh', py: 4 }}>
      <Container maxWidth="lg">
        <Skeleton width={180} height={40} sx={{ mb: 2 }} />
        <Skeleton width="100%" height={48} sx={{ maxWidth: 420, mb: 3 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="22%" height={280} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ShopCatalog />
    </Suspense>
  );
}
