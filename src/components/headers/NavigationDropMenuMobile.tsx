import React, { PropsWithChildren } from 'react';
import { Drawer, IconButton, Box } from '@mui/material';
import BannerHeader from '../headers/BannerHeader';
import SimpleMobileMenu from '../layout/SimpleMobileMenu';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import LogoMobileWebsite from '@/src/components/layout/LogoMobileWebsite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

interface Types {
  open: boolean;
  handleDrawerClose: () => void;
}

export default function NavigationDropMenuMobile(
  props: PropsWithChildren<Types>,
) {
  const { open, handleDrawerClose } = props;
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleDrawerClose}
      variant="temporary"
      ModalProps={{ keepMounted: true }}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: 'min(100%, 320px)',
          backgroundColor: 'white',
        },
      }}
    >
      <BannerHeader />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.2rem 1rem',
        }}
      >
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            cursor: 'pointer',
            padding: '7px 10px',
          }}
        >
          <IconButton onClick={handleDrawerClose} sx={{ cursor: 'pointer' }}>
            <CloseIcon sx={{ color: '#000000' }} />
          </IconButton>
          <SearchIcon />
        </Box>
        <LogoMobileWebsite />
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            gap: '9px',
          }}
        >
          <FavoriteBorderOutlinedIcon sx={{ cursor: 'pointer' }} />
          <ShoppingBagOutlinedIcon sx={{ cursor: 'pointer' }} />
        </Box>
      </Box>
      <SimpleMobileMenu onNavigate={handleDrawerClose} />
    </Drawer>
  );
}
