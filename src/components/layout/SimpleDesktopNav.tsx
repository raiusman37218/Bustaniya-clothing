'use client';

import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';

interface SubLink {
  href: string;
  label: string;
  subCategory: string;
}

interface NavLink {
  href: string;
  label: string;
  category: string;
  subs?: SubLink[];
}

const navLinks: NavLink[] = [
  {
    href: '/shop?category=unstitched',
    label: 'Unstitched',
    category: 'unstitched',
    subs: [
      { href: '/shop?category=unstitched', label: 'All Unstitched', subCategory: 'all' },
      { href: '/shop?category=unstitched&sub=2-piece', label: '2 Piece', subCategory: '2-piece' },
      { href: '/shop?category=unstitched&sub=3-piece', label: '3 Piece', subCategory: '3-piece' },
    ],
  },
  {
    href: '/shop?category=ready-to-wear',
    label: 'Ready To Wear',
    category: 'ready-to-wear',
    subs: [
      { href: '/shop?category=ready-to-wear', label: 'All Ready To Wear', subCategory: 'all' },
      { href: '/shop?category=ready-to-wear&sub=2-piece', label: '2 Piece Stitched', subCategory: '2-piece' },
      { href: '/shop?category=ready-to-wear&sub=3-piece', label: '3 Piece Stitched', subCategory: '3-piece' },
      { href: '/shop?category=ready-to-wear&sub=formal', label: 'Formal', subCategory: 'formal' },
      { href: '/shop?category=ready-to-wear&sub=causal', label: 'Causal', subCategory: 'causal' },
      { href: '/shop?category=ready-to-wear&sub=informal', label: 'Informal', subCategory: 'informal' },
    ],
  },
  {
    href: '/shop?category=bottoms',
    label: 'Bottoms',
    category: 'bottoms',
    subs: [
      { href: '/shop?category=bottoms', label: 'All Bottoms', subCategory: 'all' },
      { href: '/shop?category=bottoms&sub=pants', label: 'Pants & Trousers', subCategory: 'pants' },
    ]
  },
  {
    href: '/shop?category=accessories',
    label: 'Accessories',
    category: 'accessories',
  },
];

type SimpleDesktopNavProps = {
  light?: boolean;
};

export default function SimpleDesktopNav({ light = false }: SimpleDesktopNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';
  const activeSub = searchParams.get('sub') ?? '';

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        gap: { md: 3, lg: 4.5 },
        height: '100%',
      }}
    >
      {navLinks.map(({ href, label, category, subs }) => {
        const isCatActive = pathname === '/shop' && activeCategory === category;

        return (
          <Box
            key={href}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 2.5,
              '&:hover .nav-dropdown': {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
              },
            }}
          >
            <Link href={href} style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: isCatActive ? 800 : 600,
                  color: isCatActive ? (light ? '#ffffff' : '#111111') : light ? 'rgba(255,255,255,0.92)' : '#444444',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'color 0.2s ease',
                  '&:hover': { color: light ? '#ffffff' : '#111111' },
                }}
              >
                {label}
              </Typography>
            </Link>

            {subs && (
              <Box
                className="nav-dropdown"
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  bgcolor: '#ffffff',
                  minWidth: 200,
                  border: '1px solid #eaeaea',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  borderRadius: '2px',
                  py: 2,
                  px: 2.5,
                  opacity: 0,
                  visibility: 'hidden',
                  transform: 'translateY(10px)',
                  transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s',
                  zIndex: 999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                {subs.map((sub) => {
                  const isSubActive = isCatActive && activeSub === sub.subCategory;
                  return (
                    <Link key={sub.href} href={sub.href} style={{ textDecoration: 'none' }}>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: isSubActive ? 700 : 500,
                          color: isSubActive ? '#111111' : '#666666',
                          fontFamily: "'Inter', sans-serif",
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            color: '#111111',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        {sub.label}
                      </Typography>
                    </Link>
                  );
                })}
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
