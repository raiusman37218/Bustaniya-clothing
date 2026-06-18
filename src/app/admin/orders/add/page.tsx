'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminShell from '@/src/components/admin/AdminShell';
import { brand, fonts, radius } from '@/src/lib/designTokens';
import { formatPkr } from '@/src/components/admin/formatPkr';
import { Product } from '@/src/types/productTypes';
import { toast } from 'react-toastify';

interface SelectedItem {
  product_id: string | null;
  title: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  image_url: string | null;
}

export default function AddOrderPage() {
  const router = useRouter();
  
  // Customer details state
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingCountry, setShippingCountry] = useState('Pakistan');
  const [shippingPostalCode, setShippingPostalCode] = useState('');
  
  // Fees and discounts
  const [shippingFee, setShippingFee] = useState<number>(200);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  
  // Products catalog for item selection
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Selected items in the order
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // Item builder state
  const [itemType, setItemType] = useState<'catalog' | 'custom'>('catalog');
  const [chosenProductId, setChosenProductId] = useState('');
  const [chosenSize, setChosenSize] = useState('');
  const [chosenColor, setChosenColor] = useState('');
  const [chosenQuantity, setChosenQuantity] = useState<number>(1);
  
  // Custom item state
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Fetch catalog products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products || []);
        } else {
          toast.error(data.error || 'Failed to fetch catalog products');
        }
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  // Selected catalog product details
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === chosenProductId);
  }, [products, chosenProductId]);

  // Set default size and color when product changes
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.product_size && selectedProduct.product_size.length > 0) {
        setChosenSize(selectedProduct.product_size[0]);
      } else {
        setChosenSize('');
      }

      if (selectedProduct.product_color && selectedProduct.product_color.length > 0) {
        setChosenColor(selectedProduct.product_color[0].name);
      } else {
        setChosenColor('');
      }
    }
  }, [selectedProduct]);

  // Add Item to Order list
  const handleAddItem = () => {
    if (itemType === 'catalog') {
      if (!chosenProductId) {
        toast.error('Please select a product from catalog.');
        return;
      }
      if (!selectedProduct) return;

      const imageUrl = selectedProduct.product_img && selectedProduct.product_img.length > 0
        ? selectedProduct.product_img[0]
        : null;

      const newItem: SelectedItem = {
        product_id: selectedProduct.id,
        title: selectedProduct.product_name,
        price: Number(selectedProduct.procuct_price),
        quantity: chosenQuantity,
        size: chosenSize || null,
        color: chosenColor || null,
        image_url: imageUrl,
      };

      setSelectedItems((prev) => [...prev, newItem]);
      
      // Reset selector state
      setChosenProductId('');
      setChosenSize('');
      setChosenColor('');
      setChosenQuantity(1);
    } else {
      if (!customTitle.trim()) {
        toast.error('Please enter a product title.');
        return;
      }
      if (!customPrice || Number(customPrice) <= 0) {
        toast.error('Please enter a valid price.');
        return;
      }

      const newItem: SelectedItem = {
        product_id: null,
        title: customTitle.trim(),
        price: Number(customPrice),
        quantity: chosenQuantity,
        size: chosenSize ? chosenSize.trim() : null,
        color: chosenColor ? chosenColor.trim() : null,
        image_url: null,
      };

      setSelectedItems((prev) => [...prev, newItem]);
      
      // Reset custom state
      setCustomTitle('');
      setCustomPrice('');
      setChosenSize('');
      setChosenColor('');
      setChosenQuantity(1);
    }
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + Number(shippingFee || 0) - Number(discountAmount || 0);

  // Submit Order creation
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      toast.error('Please add at least one item to the order.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: customerEmail,
          customer_name: customerName,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          shipping_city: shippingCity,
          shipping_country: shippingCountry,
          shipping_postal_code: shippingPostalCode,
          shipping_fee: Number(shippingFee || 0),
          discount_amount: Number(discountAmount || 0),
          notes,
          items: selectedItems,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      toast.success('Custom order created successfully!');
      router.push(`/admin/orders/${data.order.id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="Add Custom Order">
      {/* Back link */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/orders')}
          sx={{
            textTransform: 'none',
            color: brand.muted,
            fontFamily: fonts.sans,
            fontWeight: 500,
            '&:hover': {
              color: brand.charcoal,
              bgcolor: 'transparent',
            },
          }}
        >
          Back to Orders
        </Button>
      </Box>

      <Box component="form" onSubmit={handleSubmitOrder}>
        <Grid container spacing={4}>
          {/* Left Column: Customer Details, Address, Items */}
          <Grid item xs={12} md={8}>
            {/* Customer Details & Shipping Address */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 4,
                border: '1px solid #e5e5e5',
                borderRadius: radius.editorial,
                bgcolor: '#ffffff',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontFamily: fonts.display, color: brand.ink }}>
                Customer & Shipping Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Customer Full Name"
                    required
                    fullWidth
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Customer Email Address"
                    required
                    type="email"
                    fullWidth
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Customer Phone Number"
                    required
                    fullWidth
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Shipping Address"
                    required
                    fullWidth
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    required
                    fullWidth
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Postal Code (Optional)"
                    fullWidth
                    value={shippingPostalCode}
                    onChange={(e) => setShippingPostalCode(e.target.value)}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    required
                    fullWidth
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Item Builder Panel */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                border: '1px solid #e5e5e5',
                borderRadius: radius.editorial,
                bgcolor: '#ffffff',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontFamily: fonts.display, color: brand.ink }}>
                Add Products to Order
              </Typography>

              {/* Selector for Catalog vs Custom product */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant={itemType === 'catalog' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setItemType('catalog');
                    setChosenSize('');
                    setChosenColor('');
                  }}
                  sx={{
                    textTransform: 'none',
                    bgcolor: itemType === 'catalog' ? brand.sage : 'transparent',
                    color: itemType === 'catalog' ? brand.white : brand.sage,
                    borderColor: brand.sage,
                    fontWeight: 600,
                    borderRadius: radius.button,
                    '&:hover': {
                      bgcolor: itemType === 'catalog' ? brand.sageLight : 'rgba(90, 109, 87, 0.04)',
                      borderColor: brand.sage,
                    },
                  }}
                >
                  Select from Catalog
                </Button>
                <Button
                  variant={itemType === 'custom' ? 'contained' : 'outlined'}
                  onClick={() => {
                    setItemType('custom');
                    setChosenSize('');
                    setChosenColor('');
                  }}
                  sx={{
                    textTransform: 'none',
                    bgcolor: itemType === 'custom' ? brand.sage : 'transparent',
                    color: itemType === 'custom' ? brand.white : brand.sage,
                    borderColor: brand.sage,
                    fontWeight: 600,
                    borderRadius: radius.button,
                    '&:hover': {
                      bgcolor: itemType === 'custom' ? brand.sageLight : 'rgba(90, 109, 87, 0.04)',
                      borderColor: brand.sage,
                    },
                  }}
                >
                  Add Custom Item
                </Button>
              </Box>

              <Grid container spacing={3} alignItems="flex-end">
                {itemType === 'catalog' ? (
                  /* Catalog Item Selection */
                  <Grid item xs={12} sm={6}>
                    {loadingProducts ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2">Loading catalog...</Typography>
                      </Box>
                    ) : (
                      <FormControl fullWidth size="medium">
                        <InputLabel id="catalog-product-select-label">Select Product</InputLabel>
                        <Select
                          labelId="catalog-product-select-label"
                          label="Select Product"
                          value={chosenProductId}
                          onChange={(e) => setChosenProductId(e.target.value)}
                          renderValue={(selectedId) => {
                            const p = products.find((prod) => prod.id === selectedId);
                            if (!p) return '';
                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {p.product_img && p.product_img.length > 0 ? (
                                  <img
                                    src={p.product_img[0]}
                                    alt={p.product_name}
                                    style={{ width: 24, height: 28, objectFit: 'cover', borderRadius: 2 }}
                                  />
                                ) : (
                                  <Box sx={{ width: 24, height: 28, bgcolor: '#eee', borderRadius: 2 }} />
                                )}
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {p.product_name} ({p.article_number || 'No Article #'})
                                </Typography>
                              </Box>
                            );
                          }}
                        >
                          {products.map((p) => (
                            <MenuItem key={p.id} value={p.id} sx={{ py: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                {p.product_img && p.product_img.length > 0 ? (
                                  <img
                                    src={p.product_img[0]}
                                    alt={p.product_name}
                                    style={{ width: 32, height: 38, objectFit: 'cover', borderRadius: 2, border: '1px solid #eaeaea' }}
                                  />
                                ) : (
                                  <Box sx={{ width: 32, height: 38, bgcolor: '#f4f4f4', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#aaa' }}>No img</Typography>
                                  </Box>
                                )}
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {p.product_name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#707070', display: 'block' }}>
                                    {p.article_number || 'No Article #'} · {formatPkr(Number(p.procuct_price))}
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Grid>
                ) : (
                  /* Custom Item fields */
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Product Title"
                        required
                        fullWidth
                        placeholder="e.g. Silk Embroidered Dupatta"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        size="medium"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Price (PKR)"
                        required
                        type="number"
                        fullWidth
                        placeholder="e.g. 1500"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                        size="medium"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                )}

                {/* Variant selection fields: Size & Color */}
                {itemType === 'catalog' && selectedProduct ? (
                  <>
                    {/* Size Select */}
                    {selectedProduct.product_size && selectedProduct.product_size.length > 0 && (
                      <Grid item xs={6} sm={3}>
                        <FormControl fullWidth size="medium">
                          <InputLabel id="size-select-label">Size</InputLabel>
                          <Select
                            labelId="size-select-label"
                            label="Size"
                            value={chosenSize}
                            onChange={(e) => setChosenSize(e.target.value)}
                          >
                            {selectedProduct.product_size.map((sz) => (
                              <MenuItem key={sz} value={sz}>
                                {sz}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    {/* Color Select */}
                    {selectedProduct.product_color && selectedProduct.product_color.length > 0 && (
                      <Grid item xs={6} sm={3}>
                        <FormControl fullWidth size="medium">
                          <InputLabel id="color-select-label">Color</InputLabel>
                          <Select
                            labelId="color-select-label"
                            label="Color"
                            value={chosenColor}
                            onChange={(e) => setChosenColor(e.target.value)}
                          >
                            {selectedProduct.product_color.map((col) => (
                              <MenuItem key={col.name} value={col.name}>
                                {col.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}
                  </>
                ) : itemType === 'custom' ? (
                  <>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        label="Size (Optional)"
                        fullWidth
                        placeholder="e.g. M"
                        value={chosenSize}
                        onChange={(e) => setChosenSize(e.target.value)}
                        size="medium"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        label="Color (Optional)"
                        fullWidth
                        placeholder="e.g. Rose Gold"
                        value={chosenColor}
                        onChange={(e) => setChosenColor(e.target.value)}
                        size="medium"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </>
                ) : null}

                {/* Quantity */}
                <Grid item xs={6} sm={2}>
                  <TextField
                    label="Qty"
                    required
                    type="number"
                    fullWidth
                    value={chosenQuantity}
                    onChange={(e) => setChosenQuantity(Math.max(1, Number(e.target.value)))}
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Add button */}
                <Grid item xs={6} sm={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAddItem}
                    startIcon={<AddIcon />}
                    sx={{
                      textTransform: 'none',
                      bgcolor: brand.sage,
                      height: 48,
                      fontWeight: 600,
                      borderRadius: radius.button,
                      '&:hover': { bgcolor: brand.sageLight },
                    }}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column: Order Summary & Review */}
          <Grid item xs={12} md={4}>
            {/* Added Items table list */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                border: '1px solid #e5e5e5',
                borderRadius: radius.editorial,
                bgcolor: '#ffffff',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: brand.charcoal }}>
                Order Items ({selectedItems.length})
              </Typography>

              {selectedItems.length === 0 ? (
                <Typography variant="body2" sx={{ color: brand.muted, py: 2, textAlign: 'center' }}>
                  No items added yet. Use the builders on the left to add items.
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, px: 1 }}>Item</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, px: 1 }}>Price</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600, px: 1 }}>Qty</TableCell>
                        <TableCell align="right" sx={{ px: 0 }} />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedItems.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell sx={{ px: 1, py: 1.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                              {item.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: brand.muted, display: 'block', fontSize: '0.7rem' }}>
                              {[item.size && `Sz: ${item.size}`, item.color && `Col: ${item.color}`]
                                .filter(Boolean)
                                .join(' · ') || 'No Variants'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ px: 1, py: 1.5, fontSize: '0.8rem' }}>
                            {formatPkr(item.price)}
                          </TableCell>
                          <TableCell align="center" sx={{ px: 1, py: 1.5, fontSize: '0.8rem' }}>
                            x{item.quantity}
                          </TableCell>
                          <TableCell align="right" sx={{ px: 0, py: 1.5 }}>
                            <IconButton size="small" onClick={() => handleRemoveItem(idx)} sx={{ color: '#d32f2f' }}>
                              <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>

            {/* Calculations & Order Submission */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #e5e5e5',
                borderRadius: radius.editorial,
                bgcolor: '#ffffff',
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: brand.charcoal }}>
                Order Summary
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Shipping Fee (PKR)"
                    type="number"
                    fullWidth
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value))}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Discount Amount (PKR)"
                    type="number"
                    fullWidth
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Order Notes (Internal/Customer)"
                    multiline
                    rows={2}
                    fullWidth
                    placeholder="Enter any extra details or instructions..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: brand.muted }}>Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatPkr(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: brand.muted }}>Shipping Fee</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>+{formatPkr(shippingFee)}</Typography>
                </Box>
                {discountAmount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#2e7d32' }}>Discount</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>-{formatPkr(discountAmount)}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px dashed #eee' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brand.sage }}>{formatPkr(total)}</Typography>
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting || selectedItems.length === 0}
                sx={{
                  textTransform: 'none',
                  bgcolor: brand.sage,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',
                  borderRadius: radius.button,
                  '&:hover': { bgcolor: brand.sageLight },
                }}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Create Custom Order'
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminShell>
  );
}
