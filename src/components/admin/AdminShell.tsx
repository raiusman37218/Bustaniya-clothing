'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { brand, fonts } from '@/src/lib/designTokens';

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: DashboardOutlinedIcon },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingCartOutlinedIcon },
    { label: 'Products', href: '/admin/products', icon: StorefrontOutlinedIcon },
    { label: 'Expenses', href: '/admin/expenses', icon: ReceiptLongOutlinedIcon },
    { label: 'Section Images', href: '/admin/sections', icon: ImageOutlinedIcon },
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: '#f4f4f5' }}>
      {/* Left Sidebar */}
      <Paper
        elevation={0}
        sx={{
          width: 260,
          borderRight: '1px solid #e5e5e5',
          borderRadius: 0,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          bgcolor: '#ffffff',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo Section */}
        <Box sx={{ p: 3, borderBottom: '1px solid #f4f4f5' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1.25rem',
              color: brand.ink,
              fontFamily: fonts.display,
              letterSpacing: '0.05em',
            }}
          >
            BUSTANIYA
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: brand.muted,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Management Portal
          </Typography>
        </Box>

        {/* Nav Items */}
        <List
          sx={{
            px: 2,
            py: 3,
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
            return (
              <ListItem key={item.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    borderRadius: '6px',
                    py: 1.25,
                    bgcolor: isActive ? 'rgba(90, 109, 87, 0.08)' : 'transparent',
                    color: isActive ? brand.sage : brand.charcoal,
                    '&:hover': {
                      bgcolor: 'rgba(90, 109, 87, 0.04)',
                      color: brand.sage,
                      '& .MuiListItemIcon-root': { color: brand.sage },
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive ? brand.sage : brand.muted,
                    }}
                  >
                    <Icon sx={{ fontSize: '1.25rem' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.875rem',
                      fontFamily: fonts.sans,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ opacity: 0.5 }} />

        {/* Footer actions */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<StorefrontOutlinedIcon />}
            variant="outlined"
            fullWidth
            sx={{
              textTransform: 'none',
              borderColor: '#e5e5e5',
              color: brand.charcoal,
              justifyContent: 'flex-start',
              pl: 2,
              '&:hover': {
                borderColor: brand.sage,
                color: brand.sage,
                bgcolor: 'rgba(90, 109, 87, 0.02)',
              },
            }}
          >
            Go to Store
          </Button>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutOutlinedIcon />}
            variant="text"
            fullWidth
            sx={{
              textTransform: 'none',
              color: '#d32f2f',
              justifyContent: 'flex-start',
              pl: 2,
              '&:hover': {
                bgcolor: 'rgba(211, 47, 47, 0.04)',
              },
            }}
          >
            Log Out
          </Button>
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Header */}
        <Box
          component="header"
          sx={{
            bgcolor: '#fff',
            borderBottom: '1px solid #e5e5e5',
            px: { xs: 2, md: 4 },
            py: 2.25,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: '1.25rem', color: brand.ink }}
            >
              {title}
            </Typography>
          </Box>

          {/* Mobile buttons */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  size="small"
                  variant={isActive ? 'contained' : 'outlined'}
                  sx={{
                    textTransform: 'none',
                    bgcolor: isActive ? brand.sage : 'transparent',
                    borderColor: isActive ? brand.sage : '#e5e5e5',
                    color: isActive ? '#fff' : brand.charcoal,
                    '&:hover': {
                      bgcolor:
                        isActive ? brand.sageLight : 'rgba(90, 109, 87, 0.04)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <IconButton onClick={handleLogout} color="error" size="small">
              <LogoutOutlinedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Children */}
        <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
