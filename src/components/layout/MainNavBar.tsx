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
  const iconColor = isOverlay ? '#354531' : brand.ink;
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

  const searchButton = isOpenSearch ? (
    <Button
      aria-label="Close search"
      sx={{ color: 'inherit', padding: 0, minWidth: 0 }}
      onClick={handleCloseSearch}
    >
      <CloseIcon sx={{ color: iconColor, fontSize: 24 }} />
    </Button>
  ) : (
    <Button
      aria-label="Open search"
      onClick={handleOpenSearch}
      sx={{ color: 'inherit', padding: 0, minWidth: 0 }}
    >
      <SearchOutlinedIcon sx={{ color: iconColor, fontSize: 24 }} />
    </Button>
  );

  const utilityIcons = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: { xs: 1.25, md: 1.75 },
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
        p: 0.75,
        ml: { xs: -0.5, md: 0 },
      }}
    >
      <MenuOutlinedIcon sx={{ fontSize: { xs: 26, md: 28 } }} />
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
        backgroundColor: isOverlay ? 'transparent' : brand.white,
        boxShadow: isOverlay ? 'none' : '0 1px 0 rgba(0,0,0,0.06)',
        color: isOverlay ? '#354531' : brand.charcoal,
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
