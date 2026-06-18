'use client';

import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

interface NavLink {
  href: string;
  label: string;
  category: string;
}

const navLinks: NavLink[] = [
  {
    href: '/shop',
    label: 'Shop',
    category: 'shop',
  },
  {
    href: '/#collections',
    label: 'Collection',
    category: 'collection',
  },
  {
    href: '/contact-us',
    label: 'Contact',
    category: 'contact',
  },
  {
    href: '/order-track',
    label: 'Track Order',
    category: 'order-track',
  },
];

type SimpleDesktopNavProps = {
  light?: boolean;
};

export default function SimpleDesktopNav({ light = false }: SimpleDesktopNavProps) {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: { md: 4, lg: 5.5 },
        height: '100%',
      }}
    >
      {navLinks.map(({ href, label, category }) => {
        const isLinkActive = 
          pathname === href || 
          (href === '/shop' && pathname.startsWith('/shop')) ||
          (href === '/#collections' && pathname === '/' && typeof window !== 'undefined' && window.location.hash === '#collections');

        return (
          <Box
            key={href}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 2.5,
            }}
          >
            <Link href={href} style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: isLinkActive ? 700 : 500,
                  color: isLinkActive 
                    ? (light ? '#ffffff' : '#111111') 
                    : light 
                      ? 'rgba(255,255,255,0.85)' 
                      : '#555555',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'color 0.2s ease',
                  '&:hover': { color: light ? '#ffffff' : '#111111' },
                }}
              >
                {label}
              </Typography>
            </Link>
          </Box>
        );
      })}
    </Box>
  );
}
