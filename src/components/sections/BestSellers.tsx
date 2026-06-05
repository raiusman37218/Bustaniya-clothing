"use client";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useEffect } from "react";
import SkeletonData from "../utility/SkeletonData";
import BestSellerHeader from "@/src/components/headers/BestSellerHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import Products from "../layout/Products";
import ProductMobile from "../layout/ProductMobile";
import SectionContainer from "@/src/components/ui/SectionContainer";
import UseProductsReturn from "@/src/hooks/UseProductsReturn";

const BestSellers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items, loading } = UseProductsReturn();

  return (
    <SectionContainer>
      <BestSellerHeader />
      <Grid container spacing={{ lg: 2, md: 2 }}>
        {loading ? (
          <Grid container spacing={{ xs: 2 }} item>
            {Array.from({ length: 3 }, (_, index) => (
              <Grid item md={3} xs={6} key={index}>
                <SkeletonData />
              </Grid>
            ))}
          </Grid>
        ) : isMobile ? (
          <Swiper
            className="bustaniya-swiper"
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            loop={true}
            slidesPerView={2}
            pagination={{ clickable: true }}
          >
            {items
              ?.filter((item) => item.product_bestsellere)
              .slice(0, 8)
              .map((item) => (
                <SwiperSlide key={item.id}>
                  <ProductMobile item={item} link={`/shop/${item.id}`} />
                </SwiperSlide>
              ))}
          </Swiper>
        ) : (
            items
            ?.filter((item) => item.product_bestsellere)
            .slice(0, 8)
            .map((item, index) => (
              <Grid
                item
                md={3}
                xs={6}
                key={index}
                sx={{ mb: { xs: '1rem', md: '1.5rem' } }}
              >
                <Products item={item} link={`/shop/${item.id}`} />
              </Grid>
            ))
        )}
      </Grid>
    </SectionContainer>
  );
};

export default BestSellers;
