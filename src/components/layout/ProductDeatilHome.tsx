'use client';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import { Product } from '@/src/types/productTypes';
import { Box } from '@mui/material';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import SizeGuidModal from './SizeGuidModal';
import Breadcrumb from '../headers/Breadcrumb';
import AccordionProduct from './AccordionProduct';
import Footer from './Footer';
import RecommondProduct from './RecommondProduct';
import useProductColorHook from '@/src/hooks/useProductColorHook';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/app/store';
import { addCart, openCart } from '@/src/featuers/cart/cartSlice';
import ProductImageGallery from './ProductImageGallery';
import ProductImage from './ProductImage';
import ProductInformation from './ProductInformation';
import ProductUtilityIcons from './ProductUtilityIcons';
import ProductMaterialDescription from './ProductMaterialDescription';
import SizeSelector from './SizeSelector';
import ProductAddCart from './ProductAddCart';
import 'swiper/css/pagination';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import UseProductsReturn from '@/src/hooks/UseProductsReturn';
import { useAuth } from '@/src/context/authContext';
import { Toaster, toast } from 'sonner';

interface Types {
  product: Product;
}

export default function ProductDeatilHome(props: PropsWithChildren<Types>) {
  const { product } = props;
  const {
    id,
    product_color,
    procuct_price,
    product_name,
    product_img,
    product_description,
    product_size,
    product_category,
  } = product;

  const [size, setSize] = useState(() => {
    return product_size.includes('M') ? 'M' : (product_size[0] || '');
  });
  const [openToaster, setOpenToaster] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setSize(product_size.includes('M') ? 'M' : (product_size[0] || ''));
  }, [product_size]);

  const {
    open,
    handleOpen,
    handleClose,
    isSelected,
    setIsSelected,
    isHovered,
    setIsHovered,
    itemS,
    setItemS,
    CurrentColor,
  } = useProductColorHook(product_color);

  const dispatch = useDispatch<AppDispatch>();

  const itemToAdd = {
    id: id,
    name: product_name,
    image: product_img[0],
    quantity: 1,
    price: procuct_price.toString(),
    color: CurrentColor,
    size: size,
  };

  const handle = () => {
    if (!size) {
      toast.error('Please select a size.');
      return;
    }
    if (product.product_instock === false) {
      toast.error('This item is out of stock.');
      return;
    }
    dispatch(addCart(itemToAdd));
    dispatch(openCart());
  };

  const handleImageSelect = (image: string, index: any) => {
    setIsHovered(true);
    setIsSelected(image);
    setItemS(itemS === index.toString() ? null : index.toString());
  };

  return (
    <>
      <Box sx={{ pt: 3 }}>
        <Container
          sx={{ paddingLeft: '0', paddingRight: { xs: '0', md: '16px' } }}
        >
          <Grid
            container
            spacing={4}
            sx={{ mt: 4, display: { xs: 'none', md: 'flex' } }}
          >
            {/* Left Column: Image Gallery + Main Image */}
            <Grid item xs={12} md={7.5} sx={{ display: 'flex', gap: '20px' }}>
              <Box sx={{ width: '120px', flexShrink: 0 }}>
                <ProductImageGallery
                  SelectItem={itemS}
                  options={product_img}
                  onSelect={handleImageSelect}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <ProductImage
                  Images={product_img[0]}
                  isHovered={isHovered}
                  isSelected={isSelected}
                />
              </Box>
            </Grid>

            {/* Right Column: Title, Info, Selector, Buttons */}
            <Grid item xs={12} md={4.5} sx={{ pl: { md: 2 } }}>
              <ProductInformation
                name={product_name}
                description={product_description}
              />
              <Box
                sx={{
                  mt: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <SizeSelector
                  selectedSize={size}
                  onSizeSelect={setSize}
                  productSize={product_size}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: -1 }}>
                  <SizeGuidModal
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    open={open}
                  />
                </Box>

                <ProductAddCart
                  openToaster={openToaster}
                  handle={handle}
                  price={procuct_price}
                  close={setOpenToaster}
                />
              </Box>
              <ProductUtilityIcons />
              <ProductMaterialDescription />
              <AccordionProduct />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: { xs: 'flex', md: 'none' } }}>
            <Swiper
              style={{ paddingBottom: '4rem' }}
              modules={[Pagination, Autoplay]}
              loop={true}
              slidesPerView={1}
              pagination={{ clickable: true }}
            >
              {product_img.map((item) => (
                <SwiperSlide key={item}>
                  <Image
                    src={item}
                    width={500}
                    height={500}
                    style={{ objectFit: 'cover', width: '100%' }}
                    alt="images"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
          
          <Container sx={{ display: { xs: 'block', md: 'none' } }}>
            <ProductInformation
              name={product_name}
              description={product_description}
            />
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <SizeSelector
                selectedSize={size}
                onSizeSelect={setSize}
                productSize={product_size}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: -1 }}>
                <SizeGuidModal
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                  open={open}
                />
              </Box>
              <Toaster />

              <ProductAddCart
                openToaster={openToaster}
                handle={handle}
                price={procuct_price}
                close={setOpenToaster}
              />
            </Box>
            <ProductUtilityIcons />
            <ProductMaterialDescription />
            <AccordionProduct />
          </Container>
          <RecommondProduct category={product_category} />
        </Container>
        <Footer />
      </Box>
    </>
  );
}
