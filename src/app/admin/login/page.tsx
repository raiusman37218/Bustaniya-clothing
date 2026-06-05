'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { toast } from 'sonner';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  useEffect(() => {
    fetch('/api/admin/login')
      .then((res) => res.json())
      .then((data: { configured?: boolean }) => {
        setNotConfigured(data.configured === false);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Login failed');
        return;
      }
      const from = searchParams.get('from') || '/admin';
      router.push(from);
      router.refresh();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        fontFamily: FONT,
        bgcolor: '#f4f4f5',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 2,
          border: '1px solid #e5e5e5',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LockOutlinedIcon sx={{ fontSize: 40, color: '#404040', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Admin sign in
          </Typography>
          <Typography variant="body2" sx={{ color: '#707070', mt: 1 }}>
            View and manage customer orders
          </Typography>
        </Box>
        {notConfigured ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Admin panel is not configured. Add{' '}
            <strong>ADMIN_PASSWORD</strong> to <strong>.env.local</strong> and
            restart the dev server.
          </Alert>
        ) : null}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#1a1a1a',
              textTransform: 'none',
              py: 1.25,
              '&:hover': { bgcolor: '#333' },
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
