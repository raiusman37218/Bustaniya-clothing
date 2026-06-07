'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/app/store';
import { clearCart } from '@/src/featuers/cart/cartSlice';
import {
  LAST_ORDER_STORAGE_KEY,
  OrderConfirmation,
} from '@/src/types/order';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/app/store';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  applyDiscountCode,
  formatPkr,
} from '@/src/lib/currency/formatCurrency';
import { isValidEmail } from '@/src/lib/validation/email';
import { brand, fonts } from '@/src/lib/designTokens';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '6px',
    bgcolor: '#fff',
    fontSize: '0.875rem',
    fontFamily: fonts.sans,
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#5A6D57', borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: fonts.sans,
    fontSize: '0.875rem',
    color: '#64748b',
    '&.Mui-focused': { color: '#5A6D57' },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: fonts.sans,
    fontSize: '11px',
    color: '#64748b',
  }
};

const sectionTitleSx = {
  fontFamily: fonts.sans,
  fontSize: '0.975rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#0f172a',
  mb: 2,
};

const selectionBoxSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: 2,
  py: 1.5,
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  bgcolor: '#f8fafc',
  fontFamily: fonts.sans,
  fontSize: '0.9rem',
  color: '#334155',
};

const formCardSx = {
  p: { xs: 2.5, sm: 4 },
  border: `1px solid ${brand.border}`,
  borderRadius: '8px',
  bgcolor: '#ffffff',
  mb: 3,
  boxShadow: '0 2px 16px rgba(0,0,0,0.01)',
};

const COUNTRY_OPTIONS = [
  { value: 'PK', label: 'Pakistan' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
] as const;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Typography sx={sectionTitleSx}>{children}</Typography>;
}

function CountrySelect({
  value,
  onChange,
  sx,
}: {
  value: string;
  onChange: (value: string) => void;
  sx?: object;
}) {
  return (
    <FormControl fullWidth sx={{ ...fieldSx, ...sx }}>
      <InputLabel sx={{ '&.Mui-focused': { color: '#111' } }}>Country/Region</InputLabel>
      <Select
        label="Country/Region"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          fontSize: '0.875rem',
          '&.MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': { borderColor: '#111' }
          }
        }}
      >
        {COUNTRY_OPTIONS.map((c) => (
          <MenuItem key={c.value} value={c.value} sx={{ fontSize: '13px' }}>
            {c.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const shopsItem = useSelector((s: RootState) => s.cart.items);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState('');
  const [emailOffers, setEmailOffers] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('PK');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [billingSame, setBillingSame] = useState('same');
  const [billingFirstName, setBillingFirstName] = useState('');
  const [billingLastName, setBillingLastName] = useState('');
  const [billingCountry, setBillingCountry] = useState('PK');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingPostalCode, setBillingPostalCode] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');

  const subtotal = useMemo(
    () =>
      shopsItem.reduce(
        (acc, it) => acc + Number(it.price) * (it.quantity ?? 1),
        0,
      ),
    [shopsItem],
  );

  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = () => {
    const code = discountCode.trim();
    if (!code) return;
    const result = applyDiscountCode(code, subtotal);
    if (result) {
      setDiscountAmount(result.discountAmount);
      setAppliedCode(result.code);
      toast.success('Discount applied');
    } else {
      setDiscountAmount(0);
      setAppliedCode('');
      toast.error('Invalid discount code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopsItem.length) {
      toast.error('Your cart is empty.');
      router.push('/shop');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      const el = document.getElementById('email');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      const el = document.getElementById('email');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!firstName.trim()) {
      toast.error('Please enter your first name.');
      const el = document.getElementById('firstName');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!lastName.trim()) {
      toast.error('Please enter your last name.');
      const el = document.getElementById('lastName');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!address.trim()) {
      toast.error('Please enter your address.');
      const el = document.getElementById('address');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!city.trim()) {
      toast.error('Please enter your city.');
      const el = document.getElementById('city');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number.');
      const el = document.getElementById('phone');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (billingSame === 'different') {
      if (!billingFirstName.trim()) {
        toast.error('Please enter your billing first name.');
        const el = document.getElementById('billingFirstName');
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      if (!billingLastName.trim()) {
        toast.error('Please enter your billing last name.');
        const el = document.getElementById('billingLastName');
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      if (!billingAddress.trim()) {
        toast.error('Please enter your billing address.');
        const el = document.getElementById('billingAddress');
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      if (!billingCity.trim()) {
        toast.error('Please enter your billing city.');
        const el = document.getElementById('billingCity');
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      if (!billingPhone.trim()) {
        toast.error('Please enter your billing phone number.');
        const el = document.getElementById('billingPhone');
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            email,
            firstName,
            lastName,
            country,
            address,
            city,
            postalCode,
            phone,
          },
          ...(billingSame === 'different' && {
            billing: {
              firstName: billingFirstName,
              lastName: billingLastName,
              country: billingCountry,
              address: billingAddress,
              city: billingCity,
              postalCode: billingPostalCode,
              phone: billingPhone,
            },
          }),
          items: shopsItem,
          discountCode: appliedCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? 'Could not place order.');
        return;
      }

      const order = data.order as OrderConfirmation;
      sessionStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
      dispatch(clearCart());

      if (order.emailSent) {
        toast.success('Order placed! Check your email for confirmation.');
      } else {
        toast.success('Order placed — thank you!');
      }

      router.push(`/order-confirmation?order=${encodeURIComponent(order.orderNumber)}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shopsItem.length) {
    return (
      <>
        <ToastContainer position="top-center" />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: fonts.sans,
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ textAlign: 'center', px: 3 }}>
            <Typography sx={{ fontSize: '1.2rem', mb: 3, color: '#111', fontWeight: 600 }}>
              Your cart is empty
            </Typography>
            <Button
              component={Link}
              href="/shop"
              variant="contained"
              disableElevation
              sx={{
                bgcolor: '#111111',
                textTransform: 'uppercase',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                px: 4,
                py: 1.5,
                borderRadius: '4px',
                '&:hover': { bgcolor: '#2a2a2a' },
              }}
            >
              Continue shopping
            </Button>
          </Box>
        </Box>
      </>
    );
  }
  return (
    <>
      <ToastContainer position="top-center" />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          fontFamily: fonts.sans,
        }}
      >
        {/* Left — checkout form */}
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            bgcolor: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: { xs: 4, md: 6 },
            px: { xs: 2.5, sm: 4 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 580 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Link href="/">
                <Image
                  unoptimized
                  src="/bustaniya-logo.png"
                  alt="Bustaniya"
                  width={833}
                  height={246}
                  style={{
                    height: 36,
                    width: 'auto',
                    maxWidth: 180,
                    objectFit: 'contain',
                    background: 'transparent',
                  }}
                />
              </Link>
              <Button
                component={Link}
                href="/shop"
                startIcon={<ArrowBackIosIcon sx={{ fontSize: '10px !important' }} />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: brand.charcoal,
                  fontFamily: fonts.sans,
                  '&:hover': { color: brand.sage, bgcolor: 'transparent' }
                }}
              >
                Back to shop
              </Button>
            </Box>

            {/* Step Breadcrumbs */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4, flexWrap: 'wrap' }}>
              <Typography sx={{ fontSize: '0.725rem', fontWeight: 600, color: brand.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cart
              </Typography>
              <Typography sx={{ fontSize: '0.725rem', color: brand.muted }}>/</Typography>
              <Typography sx={{ fontSize: '0.725rem', fontWeight: 700, color: brand.sage, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Information
              </Typography>
              <Typography sx={{ fontSize: '0.725rem', color: brand.muted }}>/</Typography>
              <Typography sx={{ fontSize: '0.725rem', fontWeight: 600, color: brand.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Shipping
              </Typography>
              <Typography sx={{ fontSize: '0.725rem', color: brand.muted }}>/</Typography>
              <Typography sx={{ fontSize: '0.725rem', fontWeight: 600, color: brand.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Payment
              </Typography>
            </Box>

            {/* Contact Information Card */}
            <Paper sx={formCardSx} elevation={0}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography sx={{ ...sectionTitleSx, mb: 0 }}>Contact Information</Typography>
                <Link
                  href="/login"
                  style={{
                    fontSize: '0.825rem',
                    color: brand.sage,
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Log in
                </Link>
              </Box>
              <TextField
                id="email"
                fullWidth
                required
                type="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="For order confirmation and updates"
                sx={fieldSx}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={emailOffers}
                    onChange={(e) => setEmailOffers(e.target.checked)}
                    size="small"
                    sx={{
                      color: '#cbd5e1',
                      '&.Mui-checked': { color: brand.sage },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                    Keep me updated on news and exclusive offers
                  </Typography>
                }
                sx={{ mt: 1.5, ml: 0 }}
              />
            </Paper>

            {/* Shipping Address Card */}
            <Paper sx={formCardSx} elevation={0}>
              <Typography sx={sectionTitleSx}>Shipping Address</Typography>
              <CountrySelect
                value={country}
                onChange={setCountry}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  id="firstName"
                  fullWidth
                  required
                  label="First Name"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={fieldSx}
                />
                <TextField
                  id="lastName"
                  fullWidth
                  required
                  label="Last Name"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  sx={fieldSx}
                />
              </Box>
              <TextField
                id="address"
                fullWidth
                required
                label="Address"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ ...fieldSx, mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  id="city"
                  fullWidth
                  required
                  label="City"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  sx={fieldSx}
                />
                <TextField
                  id="postalCode"
                  fullWidth
                  label="Postal Code (optional)"
                  placeholder="Postal Code (optional)"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  sx={fieldSx}
                />
              </Box>
              <TextField
                id="phone"
                fullWidth
                required
                label="Phone Number"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={fieldSx}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    size="small"
                    sx={{
                      color: '#cbd5e1',
                      '&.Mui-checked': { color: brand.sage },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                    Save this information for next checkout
                  </Typography>
                }
                sx={{ mt: 1.5, ml: 0 }}
              />
            </Paper>

            {/* Methods Card */}
            <Paper sx={formCardSx} elevation={0}>
              <Typography sx={sectionTitleSx}>Shipping Method</Typography>
              <Box sx={{ ...selectionBoxSx, mb: 3.5 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>Standard Home Delivery</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: brand.sage }}>FREE</Typography>
              </Box>

              <Typography sx={sectionTitleSx}>Payment Method</Typography>
              <Typography
                sx={{ fontSize: '0.8rem', color: '#64748b', mb: 1.5, fontFamily: fonts.sans }}
              >
                All transactions are secure and encrypted.
              </Typography>
              <Box sx={selectionBoxSx}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>Cash on Delivery (COD)</Typography>
              </Box>
            </Paper>

            {/* Billing Address Card */}
            <Paper sx={formCardSx} elevation={0}>
              <Typography sx={sectionTitleSx}>Billing Address</Typography>
              <Box
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                }}
              >
                <RadioGroup
                  value={billingSame}
                  onChange={(e) => setBillingSame(e.target.value)}
                >
                  <FormControlLabel
                    value="same"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: '#cbd5e1',
                          '&.Mui-checked': { color: brand.sage },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500 }}>
                        Same as shipping address
                      </Typography>
                    }
                    sx={{
                      m: 0,
                      px: 2,
                      py: 1.5,
                      width: '100%',
                      bgcolor: billingSame === 'same' ? '#f8fafc' : '#fff',
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 0.2s ease',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  />
                  <FormControlLabel
                    value="different"
                    control={
                      <Radio
                        size="small"
                        sx={{
                          color: '#cbd5e1',
                          '&.Mui-checked': { color: brand.sage },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500 }}>
                        Use a different billing address
                      </Typography>
                    }
                    sx={{
                      m: 0,
                      px: 2,
                      py: 1.5,
                      width: '100%',
                      bgcolor: billingSame === 'different' ? '#f8fafc' : '#fff',
                      transition: 'background-color 0.2s ease',
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  />
                </RadioGroup>

                <Collapse in={billingSame === 'different'} timeout={280}>
                  <Box
                    sx={{
                      px: 2,
                      pt: 2.5,
                      pb: 3,
                      borderTop: '1px solid #e2e8f0',
                      bgcolor: '#f8fafc',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        color: '#64748b',
                        mb: 2,
                        fontFamily: fonts.sans,
                      }}
                    >
                      Enter the address associated with your payment method.
                    </Typography>
                    <CountrySelect
                      value={billingCountry}
                      onChange={setBillingCountry}
                      sx={{ mb: 1.5 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                      <TextField
                        id="billingFirstName"
                        fullWidth
                        required={billingSame === 'different'}
                        disabled={billingSame !== 'different'}
                        label="First Name"
                        placeholder="First Name"
                        value={billingFirstName}
                        onChange={(e) => setBillingFirstName(e.target.value)}
                        sx={fieldSx}
                      />
                      <TextField
                        id="billingLastName"
                        fullWidth
                        required={billingSame === 'different'}
                        disabled={billingSame !== 'different'}
                        label="Last Name"
                        placeholder="Last Name"
                        value={billingLastName}
                        onChange={(e) => setBillingLastName(e.target.value)}
                        sx={fieldSx}
                      />
                    </Box>
                    <TextField
                      id="billingAddress"
                      fullWidth
                      required={billingSame === 'different'}
                      disabled={billingSame !== 'different'}
                      label="Address"
                      placeholder="Address"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      sx={{ ...fieldSx, mb: 1.5 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                      <TextField
                        id="billingCity"
                        fullWidth
                        required={billingSame === 'different'}
                        disabled={billingSame !== 'different'}
                        label="City"
                        placeholder="City"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        sx={fieldSx}
                      />
                      <TextField
                        id="billingPostalCode"
                        fullWidth
                        disabled={billingSame !== 'different'}
                        label="Postal Code (optional)"
                        placeholder="Postal Code (optional)"
                        value={billingPostalCode}
                        onChange={(e) => setBillingPostalCode(e.target.value)}
                        sx={fieldSx}
                      />
                    </Box>
                    <TextField
                      id="billingPhone"
                      fullWidth
                      required={billingSame === 'different'}
                      disabled={billingSame !== 'different'}
                      label="Phone Number"
                      placeholder="Phone Number"
                      value={billingPhone}
                      onChange={(e) => setBillingPhone(e.target.value)}
                      sx={fieldSx}
                    />
                  </Box>
                </Collapse>
              </Box>
            </Paper>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={isSubmitting}
              sx={{
                bgcolor: brand.sage,
                color: '#fff',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.12em',
                py: 2,
                borderRadius: '8px',
                fontFamily: fonts.sans,
                boxShadow: '0 4px 12px rgba(90, 109, 87, 0.15)',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: brand.sageLight, transform: 'translateY(-1px)' },
                '&.Mui-disabled': { bgcolor: '#cccccc' }
              }}
            >
              {isSubmitting ? 'Placing order…' : 'Complete order'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                component={Link}
                href="/cart"
                startIcon={<ArrowBackIosIcon sx={{ fontSize: '11px !important', mt: '-2px' }} />}
                sx={{
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  color: brand.charcoal,
                  fontFamily: fonts.sans,
                  '&:hover': { color: brand.sage, bgcolor: 'transparent' }
                }}
              >
                Return to cart
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right — order summary */}
        <Box
          sx={{
            width: { xs: '100%', md: '42%' },
            maxWidth: { md: 520 },
            bgcolor: '#F5F1EB',
            borderLeft: { md: `1px solid ${brand.border}` },
            borderBottom: { xs: `1px solid ${brand.border}`, md: 'none' },
            px: { xs: 2.5, sm: 4.5 },
            py: { xs: 4, md: 6 },
          }}
        >
          <Box sx={{ maxWidth: 420, mx: { md: 'auto' }, ml: { md: 0 } }}>
            {shopsItem.map((it) => (
              <Box
                key={`${it.id}-${it.color}-${it.size}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 2.5,
                }}
              >
                <Box sx={{ position: 'relative', flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 80,
                      border: `1px solid ${brand.border}`,
                      overflow: 'hidden',
                      bgcolor: '#fff',
                      borderRadius: 0,
                    }}
                  >
                    <Image
                      src={it.image}
                      alt={it.name}
                      width={64}
                      height={80}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      minWidth: 20,
                      height: 20,
                      px: 0.5,
                      borderRadius: '50%',
                      bgcolor: brand.sage,
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {it.quantity ?? 1}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: brand.ink,
                      lineHeight: 1.3,
                      fontFamily: fonts.sans,
                    }}
                  >
                    {it.name}
                  </Typography>
                  {(it.color || it.size) && (
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: brand.muted,
                        mt: 0.5,
                        fontFamily: fonts.sans,
                      }}
                    >
                      {it.color}{it.size ? ` / ${it.size}` : ''}
                    </Typography>
                  )}
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: brand.ink,
                    flexShrink: 0,
                    fontFamily: fonts.sans,
                  }}
                >
                  {formatPkr(Number(it.price) * (it.quantity ?? 1))}
                </Typography>
              </Box>
            ))}

            <Box sx={{ display: 'flex', gap: 1.5, mb: 3.5, mt: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                size="small"
                sx={{
                  ...fieldSx,
                  '& .MuiOutlinedInput-root': {
                    ...fieldSx['& .MuiOutlinedInput-root'],
                    bgcolor: '#fff',
                  },
                }}
              />
              <Button
                type="button"
                onClick={handleApplyDiscount}
                disabled={!discountCode.trim()}
                variant="outlined"
                sx={{
                  flexShrink: 0,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  borderRadius: '6px',
                  borderColor: '#cbd5e1',
                  color: brand.ink,
                  bgcolor: '#ffffff',
                  px: 3,
                  '&:hover': {
                    borderColor: brand.sage,
                    bgcolor: brand.sage,
                    color: '#ffffff',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#f1f5f9',
                    color: '#94a3b8',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                Apply
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, borderTop: `1px solid ${brand.border}`, pt: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.875rem', color: brand.charcoal, fontFamily: fonts.sans }}>
                  Subtotal
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: brand.ink, fontFamily: fonts.sans }}>
                  {formatPkr(subtotal)}
                </Typography>
              </Box>
              {discountAmount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '0.875rem', color: brand.charcoal, fontFamily: fonts.sans }}>
                    Discount ({appliedCode})
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444', fontFamily: fonts.sans }}>
                    −{formatPkr(discountAmount)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '0.875rem', color: brand.charcoal, fontFamily: fonts.sans }}>
                    Shipping
                  </Typography>
                  <HelpOutlineIcon sx={{ fontSize: 15, color: brand.muted }} />
                </Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: brand.sage, fontFamily: fonts.sans }}>
                  FREE
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  pt: 2.5,
                  mt: 0.75,
                  borderTop: `1px solid ${brand.border}`,
                }}
              >
                <Typography
                  sx={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: brand.ink, fontFamily: fonts.sans }}
                >
                  Total
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                  <Typography
                    component="span"
                    sx={{ fontSize: '0.75rem', fontWeight: 600, color: brand.muted, fontFamily: fonts.sans }}
                  >
                    PKR
                  </Typography>
                  <Typography
                    sx={{ fontSize: '1.35rem', fontWeight: 700, color: brand.ink, fontFamily: fonts.sans }}
                  >
                    {formatPkr(total)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
