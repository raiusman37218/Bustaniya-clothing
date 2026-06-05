'use client';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import { Product } from '@/src/types/productTypes';
import { Box } from '@mui/material';
import { Container } from '@mui/material';
import { Grid } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
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
import { useAuth } from '@/src/context/authContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface ProductValue {
  product: Product;
  ItemMiddle: string;
  ItemLink: string;
}

export default function ProductDetail(props: PropsWithChildren<ProductValue>) {
  const { product, ItemMiddle, ItemLink } = props;
  const [size, setSize] = useState('Size');
  const [openToaster, setOpenToaster] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleChange = (event: SelectChangeEvent) => {
    setSize(event.target.value as string);
  };

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
    if (size === 'Size') {
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
      <BannerHeader />
      <NavBar />
      <Box sx={{ pt: 3 }}>
        <Container
          sx={{ paddingLeft: '0', paddingRight: { xs: '0', md: '16px' } }}
        >
          <Breadcrumb
            name={product_name}
            ItemMiddle={ItemMiddle}
            ItemLink={ItemLink}
          />
          <Grid
            container
            spacing={3}
            sx={{ mt: 4, display: { xs: 'none', md: 'flex' } }}
          >
            <Grid item xs={2}>
              <ProductImageGallery
                SelectItem={itemS}
                options={product_img}
                onSelect={handleImageSelect}
              />

              <AccordionProduct />
            </Grid>

            <Grid item xs={12} sm={12} md={4}>
              <ProductImage
                Images={product_img[0]}
                isHovered={isHovered}
                isSelected={isSelected}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ProductInformation
                name={product_name}
                description={product_description}
              />
              <Box
                sx={{
                  mt: 7,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <SizeGuidModal
                  handleOpen={handleOpen}
                  handleClose={handleClose}
                  open={open}
                />
                <SizeSelector
                  handleChange={handleChange}
                  size={size}
                  productSize={product_size}
                />

                <ProductAddCart
                  openToaster={openToaster}
                  handle={handle}
                  price={procuct_price}
                  close={setOpenToaster}
                />
              </Box>
              <ProductUtilityIcons />
              {/* background item */}
              <ProductMaterialDescription />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: { xs: 'flex', md: 'none' } }}>
            <Swiper
              style={{ paddingBottom: '4rem' }}
              modules={[Pagination, Autoplay]}
              // autoplay={{ delay: 2700, disableOnInteraction: false }}
              // spaceBetween={20}
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
            {/* <ProductInformation
              name={product_name}
              description={product_description}
            /> */}
          </Box>
          <Container sx={{ display: { xs: 'block', md: 'none' } }}>
            <ProductInformation
              name={product_name}
              description={product_description}
            />
            <Box
              sx={{
                mt: 7,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <SizeGuidModal
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
              />
              <SizeSelector
                handleChange={handleChange}
                size={size}
                productSize={product_size}
              />

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
