'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, Zoom, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { keyframes } from '@emotion/react';
import { brand, fonts } from '@/src/lib/designTokens';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
  }
  70% {
    box-shadow: 0 0 0 14px rgba(37, 211, 102, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
`;

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '+923053530008';

  useEffect(() => {
    // Show a floating bubble tooltip after 2.5 seconds to attract attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
    const encodedText = encodeURIComponent(message || 'Hello! I would like to inquire about your clothing collection.');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: { xs: 20, sm: 28 }, right: { xs: 20, sm: 28 }, zIndex: 9999 }}>
      {/* Chat Window */}
      <Zoom in={isOpen} style={{ transformOrigin: 'bottom right' }}>
        <Paper
          elevation={5}
          sx={{
            position: 'absolute',
            bottom: 72,
            right: 0,
            width: { xs: '290px', sm: '330px' },
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.04)',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: brand.sage || '#5A6D57',
              color: '#fff',
              p: 2.5,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Typography sx={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: fonts.display || 'serif' }}>B</Typography>
              {/* Online Dot */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#4CAF50',
                  border: '2px solid #5A6D57',
                }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontFamily: fonts.display || 'serif',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  letterSpacing: '0.5px',
                  lineHeight: 1.2,
                }}
              >
                Bustaniya Support
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', opacity: 0.85, mt: 0.2 }}>
                Typically replies in minutes
              </Typography>
            </Box>
            <IconButton
              onClick={handleToggle}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': { color: '#fff' },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Chat Body */}
          <Box sx={{ p: 2.5, backgroundColor: brand.surface || '#fafafa', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              sx={{
                backgroundColor: '#fff',
                p: 2,
                borderRadius: '12px',
                borderTopLeftRadius: 0,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid rgba(0,0,0,0.03)',
              }}
            >
              <Typography sx={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.4, fontFamily: fonts.sans || 'sans-serif' }}>
                Hi there! 👋 Welcome to Bustaniya. How can we help you today with your order, sizes, or custom clothing inquiries?
              </Typography>
            </Box>

            {/* Chat Input / Form */}
            <Box component="form" onSubmit={handleSend} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    fontSize: '0.875rem',
                    fontFamily: fonts.sans || 'sans-serif',
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: brand.sage || '#5A6D57' },
                    '&.Mui-focused fieldset': { borderColor: brand.sage || '#5A6D57' },
                  },
                }}
                sx={{ mb: 1.5 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                endIcon={<SendIcon sx={{ fontSize: '0.9rem' }} />}
                sx={{
                  bgcolor: brand.sage || '#5A6D57',
                  color: '#fff',
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 1.2,
                  fontWeight: 500,
                  boxShadow: 'none',
                  fontFamily: fonts.sans || 'sans-serif',
                  '&:hover': {
                    bgcolor: brand.sageLight || '#748C70',
                    boxShadow: 'none',
                  },
                }}
              >
                Send via WhatsApp
              </Button>
            </Box>
          </Box>
        </Paper>
      </Zoom>

      {/* Slide-in Prompt / Bubble Tooltip */}
      <Fade in={showTooltip && !isOpen}>
        <Paper
          elevation={4}
          sx={{
            position: 'absolute',
            bottom: 72,
            right: 0,
            width: '230px',
            p: 1.5,
            borderRadius: '12px',
            borderBottomRightRadius: '2px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            cursor: 'pointer',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
          onClick={handleToggle}
        >
          <Typography sx={{ fontSize: '0.8rem', color: '#333', fontWeight: 500, fontFamily: fonts.sans || 'sans-serif', lineHeight: 1.3 }}>
            Hi! Need help with your order? Chat with us!
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            sx={{ p: 0.2, color: '#999', '&:hover': { color: '#666' } }}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Paper>
      </Fade>

      {/* Floating Action Button */}
      <Box
        onClick={handleToggle}
        sx={{
          width: { xs: 52, sm: 58 },
          height: { xs: 52, sm: 58 },
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          animation: `${pulse} 2s infinite, ${float} 4s ease-in-out infinite`,
          '&:hover': {
            transform: 'scale(1.08)',
            backgroundColor: '#20ba59',
            boxShadow: '0 6px 20px rgba(37, 211, 102, 0.5)',
          },
        }}
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.031 2a9.967 9.967 0 0 0-7.07 2.929 9.97 9.97 0 0 0-2.93 7.07c0 2.083.637 4.116 1.84 5.834L2.05 22l4.316-1.133a9.947 9.947 0 0 0 5.665 1.733h.004a9.97 9.97 0 0 0 7.07-2.93 9.97 9.97 0 0 0 2.93-7.07c0-2.673-1.04-5.186-2.93-7.07A9.97 9.97 0 0 0 12.03 2zM12 4.155c2.095 0 4.065.816 5.545 2.297 1.48 1.48 2.296 3.45 2.296 5.548 0 2.096-.816 4.067-2.297 5.547-1.48 1.48-3.45 2.297-5.548 2.297a7.76 7.76 0 0 1-4.086-1.151l-.292-.174-2.544.667.679-2.48-.19-.303A7.756 7.756 0 0 1 4.156 12c0-2.097.817-4.067 2.298-5.548 1.48-1.48 3.45-2.297 5.547-2.297zm-3.327 3.325c-.18 0-.39.043-.568.212-.177.169-.675.66-.675 1.608 0 .949.69 1.866.786 1.993.096.128 1.33 2.115 3.28 2.892.464.184.826.294 1.109.384.467.147.892.126 1.228.077.375-.055 1.15-.47 1.312-.924.162-.455.162-.845.113-.927-.048-.082-.177-.128-.372-.224-.195-.097-1.15-.568-1.328-.633-.178-.065-.308-.097-.438.097-.13.195-.502.632-.615.762-.113.13-.227.146-.422.049a5.32 5.32 0 0 1-1.565-.965 5.86 5.86 0 0 1-1.084-1.348c-.113-.195-.012-.3.085-.397.088-.087.195-.228.293-.34.097-.115.13-.196.195-.326.065-.13.032-.244-.016-.34-.049-.098-.438-1.056-.6-1.446-.157-.38-.313-.328-.43-.334-.11-.005-.238-.005-.366-.005z" />
        </svg>
      </Box>
    </Box>
  );
}
