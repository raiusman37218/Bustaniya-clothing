'use client';

import Link from 'next/link';
import { Box, Button, List, ListItem, Typography } from '@mui/material';
import { useAuth } from '@/src/context/authContext';

interface MenuItem {
  label: string;
  category: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Shop',
    category: 'shop',
    href: '/shop',
  },
  {
    label: 'Collection',
    category: 'collection',
    href: '/#collections',
  },
  {
    label: 'Contact',
    category: 'contact',
    href: '/contact-us',
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

  return (
    <Box sx={{ px: 2, pb: 4 }}>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => (
          <Box key={item.label} sx={{ borderBottom: '1px solid #f1f1f1' }}>
            <ListItem disablePadding sx={{ py: 1.5 }}>
              <Link
                href={item.href}
                onClick={() => onNavigate?.()}
                style={{ textDecoration: 'none', width: '100%', color: 'inherit' }}
              >
                <Typography sx={{ fontWeight: 600, fontSize: '1.02rem', py: 0.5, px: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </Typography>
              </Link>
            </ListItem>
          </Box>
        ))}
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
                borderColor: '#111111',
                color: '#111111',
                textTransform: 'uppercase',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                borderRadius: 0,
                mb: 1.5,
                '&:hover': {
                  borderColor: '#000000',
                  bgcolor: 'rgba(0,0,0,0.02)',
                }
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
                bgcolor: '#111111',
                color: '#ffffff',
                textTransform: 'uppercase',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                borderRadius: 0,
                '&:hover': { bgcolor: '#000000' },
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
