import { Alert, Box, Button, Snackbar, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import React, { PropsWithChildren, useState } from 'react';
import { fonts, radius } from '@/src/lib/designTokens';

interface Types {
  handle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleBuyNow?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  price: string;
  openToaster: boolean;
  close: (hover: boolean) => void;
  quantity?: number;
  setQuantity?: (q: number) => void;
}

export default function ProductAddCart(props: PropsWithChildren<Types>) {
  const { handle, handleBuyNow, price, openToaster, close, quantity, setQuantity } = props;

  const [localQuantity, setLocalQuantity] = useState(1);
  const currentQuantity = quantity ?? localQuantity;
  const changeQuantity = setQuantity ?? setLocalQuantity;

  const handleDecrement = () => {
    if (currentQuantity > 1) {
      changeQuantity(currentQuantity - 1);
    }
  };

  const handleIncrement = () => {
    changeQuantity(currentQuantity + 1);
  };

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      {/* Row with Quantity Selector and Add to Cart */}
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
        {/* Quantity Selector */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #d3d3d3',
            borderRadius: '24px',
            width: '120px',
            height: '48px',
            flexShrink: 0,
            px: 1,
          }}
        >
          <IconButton onClick={handleDecrement} size="small" sx={{ color: '#111111' }}>
            <RemoveIcon sx={{ fontSize: '0.9rem' }} />
          </IconButton>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#111111',
              userSelect: 'none',
            }}
          >
            {currentQuantity}
          </Typography>
          <IconButton onClick={handleIncrement} size="small" sx={{ color: '#111111' }}>
            <AddIcon sx={{ fontSize: '0.9rem' }} />
          </IconButton>
        </Box>

        {/* Add to Cart Button */}
        <Button
          onClick={handle}
          variant="contained"
          disableElevation
          startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: '1.2rem !important' }} />}
          sx={{
            flexGrow: 1,
            height: '48px',
            backgroundColor: '#111111',
            color: '#ffffff',
            fontFamily: fonts.sans,
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderRadius: '24px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#222222',
            },
          }}
        >
          Add to cart
        </Button>
      </Box>

      {/* Buy It Now Button */}
      {handleBuyNow && (
        <Button
          onClick={handleBuyNow}
          variant="contained"
          disableElevation
          sx={{
            width: '100%',
            height: '48px',
            mt: 1.5,
            backgroundColor: '#000000',
            color: '#ffffff',
            fontFamily: fonts.sans,
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderRadius: '24px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#1a1a1a',
            },
          }}
        >
          Buy it now
        </Button>
      )}

      {/* toaster */}
      <Snackbar
        open={openToaster}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => close(false)}
      >
        <Alert severity="error" variant="filled" sx={{ width: '100%', borderRadius: radius.button }}>
          You must be logged in!
        </Alert>
      </Snackbar>
    </Box>
  );
}
