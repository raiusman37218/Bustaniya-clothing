'use client';

import { Container } from '@mui/material';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import Footer from '@/src/components/layout/Footer';
import SpinnerLoader from '@/src/components/layout/SpinnerLoader';
import useLocalstorage from '@/src/hooks/useLocalstorage';
import CartDisplayItems from '@/src/components/layout/CartDisplayItems';
import useProductItems from '@/src/hooks/useProductItems';
import UseProductsReturn from '@/src/hooks/UseProductsReturn';

export default function CartPage() {
  const { loading } = UseProductsReturn();
  const { shopsItem, handleRemove } = useProductItems();

  useLocalstorage();

  if (loading) return <SpinnerLoader />;

  return (
    <>
      <BannerHeader />
      <NavBar />
      <Container sx={{ pb: { md: 8 }, pt: { xs: 2, md: 3 } }}>
        <CartDisplayItems shopsItem={shopsItem} handleRemove={handleRemove} />
      </Container>
      <Footer />
    </>
  );
}
