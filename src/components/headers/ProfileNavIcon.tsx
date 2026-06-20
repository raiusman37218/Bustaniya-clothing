'use client';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from '@mui/material/Link';
import { Button, Menu, MenuItem, ListItemIcon, IconButton } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/src/context/authContext';
import { Logout } from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

type ProfileNavIconProps = {
  iconColor?: string;
};

export default function ProfileNavIcon({ iconColor = '#404040' }: ProfileNavIconProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { isLoggedIn, logout } = useAuth();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const iconButtonSx = {
    color: iconColor,
    padding: 0.75,
    minWidth: 0,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: iconColor === '#354531' ? 'rgba(53, 69, 49, 0.08)' : 'rgba(0, 0, 0, 0.05)',
      transform: 'scale(1.08)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  };

  if (isLoggedIn) {
    return (
      <>
        <IconButton
          onClick={handleClick}
          aria-label="Profile menu"
          sx={iconButtonSx}
        >
          <AccountCircleOutlinedIcon sx={{ color: iconColor, fontSize: 22 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Link href="/profile" onClick={handleClose} style={{ color: 'inherit', textDecoration: 'none' }}>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonOutlineOutlinedIcon fontSize="small" />
              </ListItemIcon>
              My account
            </MenuItem>
          </Link>
          <MenuItem
            onClick={() => {
              handleClose();
              logout();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <IconButton
      component="a"
      href="/login"
      aria-label="Sign in"
      sx={iconButtonSx}
    >
      <PersonOutlineOutlinedIcon sx={{ color: iconColor, fontSize: 22 }} />
    </IconButton>
  );
}
