'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Box, Button, List, ListItem, ListItemText, Typography, Collapse, ListItemButton } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useAuth } from '@/src/context/authContext';

interface SubItem {
  href: string;
  label: string;
}

interface MenuItem {
  label: string;
  category: string;
  href: string;
  subs?: SubItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Unstitched',
    category: 'unstitched',
    href: '/shop?category=unstitched',
    subs: [
      { href: '/shop?category=unstitched', label: 'All Unstitched' },
      { href: '/shop?category=unstitched&sub=2-piece', label: '2 Piece' },
      { href: '/shop?category=unstitched&sub=3-piece', label: '3 Piece' },
    ],
  },
  {
    label: 'Ready To Wear',
    category: 'ready-to-wear',
    href: '/shop?category=ready-to-wear',
    subs: [
      { href: '/shop?category=ready-to-wear', label: 'All Ready To Wear' },
      { href: '/shop?category=ready-to-wear&sub=2-piece', label: '2 Piece Stitched' },
      { href: '/shop?category=ready-to-wear&sub=3-piece', label: '3 Piece Stitched' },
      { href: '/shop?category=ready-to-wear&sub=formal', label: 'Formal' },
      { href: '/shop?category=ready-to-wear&sub=causal', label: 'Causal' },
      { href: '/shop?category=ready-to-wear&sub=informal', label: 'Informal' },
    ],
  },
  {
    label: 'Bottoms',
    category: 'bottoms',
    href: '/shop?category=bottoms',
    subs: [
      { href: '/shop?category=bottoms', label: 'All Bottoms' },
      { href: '/shop?category=bottoms&sub=pants', label: 'Pants & Trousers' },
    ],
  },
  {
    label: 'Accessories',
    category: 'accessories',
    href: '/shop?category=accessories',
  },
  {
    label: 'Track Order',
    category: 'order-track',
    href: '/order-track',
  },
];

export default function SimpleMobileMenu({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const { isLoggedIn } = useAuth();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleToggle = (category: string) => {
    setOpenSection(openSection === category ? null : category);
  };

  return (
    <Box sx={{ px: 2, pb: 4 }}>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const hasSubs = !!item.subs;
          const isSectionOpen = openSection === item.category;

          return (
            <Box key={item.label} sx={{ borderBottom: '1px solid #f1f1f1' }}>
              {hasSubs ? (
                <>
                  <ListItemButton
                    onClick={() => handleToggle(item.category)}
                    sx={{
                      py: 1.5,
                      px: 0.5,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '1.02rem', color: '#111' }}>
                      {item.label}
                    </Typography>
                    {isSectionOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />}
                  </ListItemButton>
                  <Collapse in={isSectionOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2, pb: 1.5 }}>
                      {item.subs?.map((sub) => (
                        <ListItem key={sub.href} disablePadding sx={{ py: 0.75 }}>
                          <Link
                            href={sub.href}
                            onClick={() => onNavigate?.()}
                            style={{ textDecoration: 'none', width: '100%', color: '#555' }}
                          >
                            <Typography sx={{ fontSize: '0.92rem', fontWeight: 500 }}>
                              {sub.label}
                            </Typography>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding sx={{ py: 1 }}>
                  <Link
                    href={item.href}
                    onClick={() => onNavigate?.()}
                    style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '1.02rem', py: 0.5, px: 0.5 }}>
                      {item.label}
                    </Typography>
                  </Link>
                </ListItem>
              )}
            </Box>
          );
        })}
      </List>

      <Box sx={{ mt: 3, px: 1 }}>
        {isLoggedIn ? (
          <Typography variant="body2" color="text.secondary">
            Signed in — browse the shop to add favorites.
          </Typography>
        ) : (
          <>
            <Button
              component={Link}
              href="/login"
              onClick={() => onNavigate?.()}
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#5A6D57',
                color: '#404040',
                textTransform: 'none',
                mb: 1,
              }}
            >
              Log in
            </Button>
            <Button
              component={Link}
              href="/register"
              onClick={() => onNavigate?.()}
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#5A6D57',
                textTransform: 'none',
                '&:hover': { bgcolor: '#4a5a48' },
              }}
            >
              Register
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
