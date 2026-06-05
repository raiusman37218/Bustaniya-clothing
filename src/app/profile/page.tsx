'use client';

import Link from 'next/link';
import { Typography, Button, Box } from '@mui/material';
import StaticPageShell from '@/src/components/layout/StaticPageShell';
import { useAuth } from '@/src/context/authContext';

export default function ProfilePage() {
  const { isLoggedIn, userInfoEmail, userInfoFirstName, userInfoLastName, logout } =
    useAuth();

  return (
    <StaticPageShell title="My account">
      {isLoggedIn ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 420 }}>
          <Typography sx={{ color: '#444' }}>
            Signed in as{' '}
            <strong>
              {userInfoFirstName} {userInfoLastName}
            </strong>
            {userInfoEmail ? ` (${userInfoEmail})` : ''}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => logout()}
            sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
          >
            Sign out
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography sx={{ color: '#555' }}>
            Sign in to track orders and save your details for faster checkout.
          </Typography>
          <Button
            component={Link}
            href="/login"
            variant="contained"
            sx={{
              alignSelf: 'flex-start',
              bgcolor: '#5A6D57',
              textTransform: 'none',
              '&:hover': { bgcolor: '#4a5a48' },
            }}
          >
            Sign in
          </Button>
        </Box>
      )}
    </StaticPageShell>
  );
}
