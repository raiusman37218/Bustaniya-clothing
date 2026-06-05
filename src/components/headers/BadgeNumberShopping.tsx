import { Badge } from '@mui/material';
import Link from '@mui/material/Link';
import React, { PropsWithChildren } from 'react';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';

interface Types {
  badgetItem: string;
  handleOpenModal: (event: React.MouseEvent<HTMLButtonElement>) => void;
  iconColor?: string;
  light?: boolean;
}

export default function BadgeNumberShopping(props: PropsWithChildren<Types>) {
  const { badgetItem, handleOpenModal, iconColor = '#404040', light = false } = props;
  return (
    <Badge
      badgeContent={badgetItem}
      sx={{
        '& .MuiBadge-badge': {
          color: light ? '#404040' : 'white',
          backgroundColor: light ? '#ffffff' : '#5A6D57',
          fontSize: '10px',
          minWidth: 16,
          height: 16,
        },
      }}
    >
      <Link
        component="button"
        color="inherit"
        underline="none"
        onClick={handleOpenModal}
      >
        <ShoppingBagOutlinedIcon sx={{ color: iconColor }} />
      </Link>
    </Badge>
  );
}
