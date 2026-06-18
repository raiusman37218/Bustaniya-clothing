'use client';
import BannerHeader from '@/src/components/headers/BannerHeader';
import NavBar from '@/src/components/layout/NavBar';
import { Product } from '@/src/types/productTypes';
import { brand, fonts } from '@/src/lib/designTokens';
import { Box, Container, Grid, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
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

  const {
    id,
    product_color,
    procuct_price,
    product_name,
    product_img,
    product_description,
    product_size,
    product_category,
    article_number,
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
    currentColor,
    setCurrentColor,
  } = useProductColorHook(product_color);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
  };

  const handlePrevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? product_img.length - 1 : prev - 1));
  };

  const handleNextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightboxIndex((prev) => (prev === product_img.length - 1 ? 0 : prev + 1));
  };

  const currentMainImage = isHovered ? isSelected : product_img[0];
  const currentImageIndex = Math.max(0, product_img.indexOf(currentMainImage));

  const dispatch = useDispatch<AppDispatch>();
  const articleCode = article_number || `BST-${(product_category || 'RTW').slice(0, 3).toUpperCase()}-${id.slice(0, 5).toUpperCase()}`;

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
              <Box onClick={() => handleOpenLightbox(currentImageIndex)} sx={{ flexGrow: 1, cursor: 'zoom-in' }}>
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
                articleNumber={articleCode}
                currentColor={CurrentColor}
              />
              <Box
                sx={{
                  mt: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Color Selector */}
                {product_color && product_color.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: brand.ink,
                        fontFamily: fonts.sans,
                        mb: 1.5,
                      }}
                    >
                      Color: <span style={{ color: brand.muted, fontWeight: 400 }}>{CurrentColor}</span>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      {product_color.map((colorItem) => {
                        const isHexSelected = colorItem.hex === currentColor;
                        return (
                          <Box
                            key={colorItem.hex}
                            onClick={() => {
                              setCurrentColor(colorItem.hex);
                              const matchIndex = product_img.findIndex((img) => img.toLowerCase().includes(colorItem.name.toLowerCase()));
                              if (matchIndex !== -1) {
                                setIsHovered(true);
                                setIsSelected(product_img[matchIndex]);
                                setItemS(matchIndex.toString());
                              }
                            }}
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              bgcolor: colorItem.hex || colorItem.currentColor || '#cccccc',
                              cursor: 'pointer',
                              border: isHexSelected ? '2px solid #111111' : '1px solid rgba(0,0,0,0.15)',
                              outline: isHexSelected ? '1px solid #111111' : 'none',
                              outlineOffset: '2.5px',
                              transition: 'transform 0.2s',
                              '&:hover': { transform: 'scale(1.08)' }
                            }}
                            title={colorItem.name}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                )}

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
              {product_img.map((item, idx) => (
                <SwiperSlide key={item} onClick={() => handleOpenLightbox(idx)} style={{ cursor: 'zoom-in' }}>
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
              articleNumber={articleCode}
              currentColor={CurrentColor}
            />
            <Box
              sx={{
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Color Selector */}
              {product_color && product_color.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: brand.ink,
                      fontFamily: fonts.sans,
                      mb: 1.5,
                    }}
                  >
                    Color: <span style={{ color: brand.muted, fontWeight: 400 }}>{CurrentColor}</span>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    {product_color.map((colorItem) => {
                      const isHexSelected = colorItem.hex === currentColor;
                      return (
                        <Box
                          key={colorItem.hex}
                          onClick={() => {
                            setCurrentColor(colorItem.hex);
                            const matchIndex = product_img.findIndex((img) => img.toLowerCase().includes(colorItem.name.toLowerCase()));
                            if (matchIndex !== -1) {
                              setIsHovered(true);
                              setIsSelected(product_img[matchIndex]);
                              setItemS(matchIndex.toString());
                            }
                          }}
                          sx={{
                            width: 26,
                            height: 26,
                            borderRadius: '50%',
                            bgcolor: colorItem.hex || colorItem.currentColor || '#cccccc',
                            cursor: 'pointer',
                            border: isHexSelected ? '2px solid #111111' : '1px solid rgba(0,0,0,0.15)',
                            outline: isHexSelected ? '1px solid #111111' : 'none',
                            outlineOffset: '2.5px',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.08)' }
                          }}
                          title={colorItem.name}
                        />
                      );
                    })}
                  </Box>
                </Box>
              )}

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
          </Container>
          <RecommondProduct category={product_category} />
        </Container>
        <Footer />
      </Box>

      {/* Image Preview Lightbox */}
      <Dialog
        open={lightboxOpen}
        onClose={handleCloseLightbox}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            boxShadow: 'none',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
          }
        }}
      >
        <IconButton
          onClick={handleCloseLightbox}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#111',
            bgcolor: 'rgba(255,255,255,0.9)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            '&:hover': { bgcolor: '#fff' },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', position: 'relative', bgcolor: '#fbfbfb' }}>
          <Box sx={{ position: 'relative', width: '100%', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 2, md: 8 } }}>
            {/* Prev Button */}
            {product_img.length > 1 && (
              <IconButton
                onClick={handlePrevLightbox}
                sx={{
                  position: 'absolute',
                  left: { xs: 8, md: 24 },
                  color: '#111',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  '&:hover': { bgcolor: '#fff' },
                }}
              >
                <NavigateBeforeIcon sx={{ fontSize: 28 }} />
              </IconButton>
            )}

            {/* Main Lightbox Image */}
            <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={product_img[lightboxIndex]}
                alt={`${product_name} preview`}
                style={{
                  maxHeight: '70vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
              />
            </Box>

            {/* Next Button */}
            {product_img.length > 1 && (
              <IconButton
                onClick={handleNextLightbox}
                sx={{
                  position: 'absolute',
                  right: { xs: 8, md: 24 },
                  color: '#111',
                  bgcolor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  '&:hover': { bgcolor: '#fff' },
                }}
              >
                <NavigateNextIcon sx={{ fontSize: 28 }} />
              </IconButton>
            )}
          </Box>

          {/* Thumbnails list */}
          {product_img.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', p: 3, width: '100%', justifyContent: 'center', borderTop: '1px solid #eaeaea', bgcolor: '#fff' }}>
              {product_img.map((img, idx) => (
                <Box
                  key={img}
                  onClick={() => setLightboxIndex(idx)}
                  sx={{
                    width: 50,
                    height: 62,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: `2px solid ${idx === lightboxIndex ? '#5A6D57' : 'transparent'}`,
                    opacity: idx === lightboxIndex ? 1 : 0.6,
                    transition: 'all 0.2s',
                    '&:hover': { opacity: 1, borderColor: '#5A6D57' },
                  }}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
