'use client';

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Link from '@mui/material/Link';
import { Button, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '@/src/context/authContext';
import { Logout } from '@mui/icons-material';
import Person4Icon from '@mui/icons-material/Person4';
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

  if (isLoggedIn) {
    return (
      <>
        <Button
          onClick={handleClick}
          aria-label="Profile menu"
          sx={{
            color: iconColor,
            padding: 0,
            minWidth: 0,
          }}
        >
          <AccountCircleOutlinedIcon sx={{ color: iconColor }} />
        </Button>
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
    <Link href="/login" color="inherit" underline="none" aria-label="Sign in">
      <Person4Icon sx={{ color: iconColor, display: 'block' }} />
    </Link>
  );
}
