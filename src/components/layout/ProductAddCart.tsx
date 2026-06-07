import { Alert, Box, Button, Snackbar } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import { brand, fonts, radius } from '@/src/lib/designTokens';

interface Types {
  handle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  price: string;
  openToaster: boolean;
  close: (hover: boolean) => void;
}

export default function ProductAddCart(props: PropsWithChildren<Types>) {
  const { handle, price, openToaster, close } = props;

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <Button
        onClick={handle}
        fullWidth
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: brand.sage,
          color: brand.white,
          fontFamily: fonts.sans,
          fontSize: '0.95rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          py: 1.8,
          borderRadius: radius.button,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: brand.sageLight,
          },
        }}
      >
        Add to cart — ${price}
      </Button>

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
