'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

export default function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f4f5' }}>
      <Box
        component="header"
        sx={{
          bgcolor: '#fff',
          borderBottom: '1px solid #e5e5e5',
          px: { xs: 2, md: 4 },
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1a1a1a' }}
          >
            Bustaniya Admin
          </Typography>
          <Typography variant="body2" sx={{ color: '#707070', mt: 0.25 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/"
            startIcon={<StorefrontOutlinedIcon />}
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderColor: '#d9d9d9',
              color: '#404040',
            }}
          >
            Store
          </Button>
          <Button
            onClick={handleLogout}
            startIcon={<LogoutOutlinedIcon />}
            variant="outlined"
            size="small"
            sx={{
              textTransform: 'none',
              borderColor: '#d9d9d9',
              color: '#404040',
            }}
          >
            Log out
          </Button>
        </Box>
      </Box>
      <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>{children}</Box>
    </Box>
  );
}
