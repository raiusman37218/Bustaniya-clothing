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

export default function OverlayCategoryNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';
  const activeSub = searchParams.get('sub') ?? '';

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        gap: { md: 3, lg: 5 },
        py: 1,
      }}
    >
      {navLinks.map(({ href, label, category, subs }) => {
        const isCatActive = pathname.startsWith('/shop') && activeCategory === category;

        return (
          <Box
            key={href}
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              py: 1,
              '&:hover .overlay-dropdown': {
                opacity: 1,
                visibility: 'visible',
                transform: 'translateY(0)',
              },
            }}
          >
            <Link href={href} style={{ textDecoration: 'none' }}>
              <Typography
                component="span"
                sx={{
                  fontSize: { md: '13px', lg: '14px' },
                  fontWeight: isCatActive ? 700 : 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#354531',
                  fontFamily: "'Inter', sans-serif",
                  borderBottom: isCatActive ? '2px solid #354531' : '2px solid transparent',
                  pb: 0.5,
                  lineHeight: 1.2,
                  transition: 'opacity 0.18s ease, border-color 0.18s ease',
                  '&:hover': { opacity: 0.8 },
                }}
              >
                {label}
              </Typography>
            </Link>

            {subs && (
              <Box
                className="overlay-dropdown"
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(10px)',
                  bgcolor: '#ffffff',
                  minWidth: 200,
                  border: '1px solid #eaeaea',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  borderRadius: '2px',
                  py: 2,
                  px: 2.5,
                  opacity: 0,
                  visibility: 'hidden',
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
                          color: isSubActive ? '#354531' : '#666666',
                          fontFamily: "'Inter', sans-serif",
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                          '&:hover': {
                            color: '#354531',
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
