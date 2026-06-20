import { AppBar, Toolbar, Box, IconButton, Button } from '@mui/material';
import LogoWebsite from './LogoWebsite';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SimpleDesktopNav from './SimpleDesktopNav';
import LogoMobileWebsite from './LogoMobileWebsite';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Suspense, useState } from 'react';
import SearchField from '../headers/SearchField';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/app/store';
import { openCart } from '@/src/featuers/cart/cartSlice';
import NavigationDropMenuMobile from '../headers/NavigationDropMenuMobile';
import BadgeNumberShopping from '../headers/BadgeNumberShopping';
import ProfileNavIcon from '../headers/ProfileNavIcon';
import CloseIcon from '@mui/icons-material/Close';
import HeroOverlayLogo from './HeroOverlayLogo';
import OverlayCategoryNav from './OverlayCategoryNav';
import { brand, navBar } from '@/src/lib/designTokens';

type MainNavBarProps = {
  variant?: 'default' | 'overlay';
};

function MainNavBar({ variant = 'default' }: MainNavBarProps) {
  const isOverlay = variant === 'overlay';
  const iconColor = isOverlay ? '#354531' : '#1d2d14';
  const shopsItem = useSelector((store: RootState) => store.cart.items);
  const badgetItem = shopsItem.reduce((sum, item) => sum + item.quantity, 0);

  const [open, setOpen] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleOpenCart = () => dispatch(openCart());
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleCloseSearch = () => setIsOpenSearch(false);

  const handleOpenSearch = () => {
    if (!isOpenSearch) setIsOpenSearch(true);
  };

  const utilityButtonStyles = {
    color: 'inherit',
    padding: 0.75,
    minWidth: 0,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: isOverlay ? 'rgba(53, 69, 49, 0.08)' : 'rgba(29, 45, 20, 0.08)',
      transform: 'scale(1.08)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  };

  const searchButton = isOpenSearch ? (
    <IconButton
      aria-label="Close search"
      onClick={handleCloseSearch}
      sx={utilityButtonStyles}
    >
      <CloseIcon sx={{ color: iconColor, fontSize: 22 }} />
    </IconButton>
  ) : (
    <IconButton
      aria-label="Open search"
      onClick={handleOpenSearch}
      sx={utilityButtonStyles}
    >
      <SearchOutlinedIcon sx={{ color: iconColor, fontSize: 22 }} />
    </IconButton>
  );

  const utilityIcons = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: { xs: 0.5, md: 1 },
        flexShrink: 0,
      }}
    >
      {searchButton}
      <ProfileNavIcon iconColor={iconColor} />
      <BadgeNumberShopping
        badgetItem={badgetItem.toString()}
        handleOpenModal={handleOpenCart}
        iconColor={iconColor}
        light={false}
      />
    </Box>
  );

  const menuButton = (
    <IconButton
      onClick={handleDrawerOpen}
      aria-label="Open navigation menu"
      edge="start"
      sx={{
        color: iconColor,
        p: 1,
        ml: { xs: -0.5, md: 0 },
        display: { xs: 'inline-flex', md: 'none' }, // HIDE ON DESKTOP!
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '50%',
        '&:hover': {
          backgroundColor: isOverlay ? 'rgba(53, 69, 49, 0.08)' : 'rgba(29, 45, 20, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 20,
          height: 12,
          position: 'relative',
          '& span': {
            display: 'block',
            width: '100%',
            height: '1.5px',
            backgroundColor: iconColor,
            borderRadius: '1px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&:hover span:nth-of-type(1)': {
            transform: 'scaleX(0.75)',
            transformOrigin: 'left',
          },
          '&:hover span:nth-of-type(2)': {
            transform: 'scaleX(1.15)',
          },
          '&:hover span:nth-of-type(3)': {
            transform: 'scaleX(0.75)',
            transformOrigin: 'right',
          },
        }}
      >
        <span />
        <span />
        <span />
      </Box>
    </IconButton>
  );

  const navGridSx = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    width: '100%',
    columnGap: 1,
    minHeight: navBar.height,
  } as const;

  return (
    <AppBar
      position={isOverlay ? 'static' : 'sticky'}
      sx={{
        background: isOverlay ? 'transparent' : `
          repeating-linear-gradient(0deg, rgba(53, 69, 49, 0.012) 0px, rgba(53, 69, 49, 0.012) 1px, transparent 1px, transparent 4px),
          repeating-linear-gradient(90deg, rgba(53, 69, 49, 0.012) 0px, rgba(53, 69, 49, 0.012) 1px, transparent 1px, transparent 4px),
          radial-gradient(circle at 25% 50%, #cbf598 0%, #bbe983 55%, #b2e079 100%)
        `,
        backgroundBlendMode: isOverlay ? 'normal' : 'multiply',
        boxShadow: isOverlay ? 'none' : '0 1px 0 rgba(0,0,0,0.06)',
        color: isOverlay ? '#354531' : '#1d2d14',
        width: '100%',
      }}
    >
      <Toolbar disableGutters sx={{ minHeight: navBar.height }}>
        <Box sx={navBar.inner}>
          {isOverlay ? (
            <>
              <Box sx={{ ...navGridSx, py: { xs: 0.75, md: 1 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifySelf: 'start' }}>
                  {menuButton}
                </Box>
                <Box sx={{ justifySelf: 'center' }}>
                  <HeroOverlayLogo />
                </Box>
                <Box sx={{ justifySelf: 'end' }}>{utilityIcons}</Box>
              </Box>

              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  pb: 1.25,
                  pt: 0.25,
                }}
              >
                <Suspense fallback={null}>
                  <OverlayCategoryNav />
                </Suspense>
              </Box>
            </>
          ) : (
            <Box sx={{ ...navGridSx, py: { xs: 0.5, md: 0.75 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifySelf: 'start',
                  gap: { md: 1.5 },
                  minWidth: 0,
                }}
              >
                {menuButton}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <LogoWebsite />
                </Box>
              </Box>

              <Box
                sx={{
                  justifySelf: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <LogoMobileWebsite />
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Suspense fallback={null}>
                    <SimpleDesktopNav light={false} />
                  </Suspense>
                </Box>
              </Box>

              <Box sx={{ justifySelf: 'end' }}>{utilityIcons}</Box>
            </Box>
          )}
        </Box>
      </Toolbar>

      <NavigationDropMenuMobile open={open} handleDrawerClose={handleDrawerClose} />
      {isOpenSearch && (
        <Box sx={{ ...navBar.inner, pb: 2 }}>
          <Suspense fallback={null}>
            <SearchField />
          </Suspense>
        </Box>
      )}
    </AppBar>
  );
}

export default MainNavBar;
