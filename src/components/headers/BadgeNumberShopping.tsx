import { Badge, IconButton } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

interface Types {
  badgetItem: string;
  handleOpenModal: (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>) => void;
  iconColor?: string;
  light?: boolean;
}

export default function BadgeNumberShopping(props: PropsWithChildren<Types>) {
  const { badgetItem, handleOpenModal, iconColor = '#404040', light = false } = props;
  
  return (
    <IconButton
      onClick={handleOpenModal as any}
      aria-label="Shopping bag"
      sx={{
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
      }}
    >
      <Badge
        badgeContent={badgetItem}
        sx={{
          '& .MuiBadge-badge': {
            color: light ? '#404040' : 'white',
            backgroundColor: light ? '#ffffff' : '#5A6D57',
            fontSize: '9px',
            fontWeight: 700,
            minWidth: 16,
            height: 16,
            top: 2,
            right: 2,
            border: `1.5px solid ${light ? '#5A6D57' : '#ffffff'}`,
            padding: '0 4px',
            fontFamily: "'Inter', sans-serif",
            transition: 'all 0.3s ease',
          },
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ color: iconColor, fontSize: 22 }} />
      </Badge>
    </IconButton>
  );
}
