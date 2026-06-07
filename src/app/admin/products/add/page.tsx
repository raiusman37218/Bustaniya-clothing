'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  Grid,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import FiberNewIcon from '@mui/icons-material/FiberNew';

import AdminShell from '@/src/components/admin/AdminShell';
import { brand, fonts, radius } from '@/src/lib/designTokens';
import { ColorData } from '@/src/types/productTypes';
import { toast } from 'react-toastify';

const DEFAULT_FORM_STATE = {
  product_name: '',
  procuct_price: '',
  product_category: '',
  product_description: '',
  product_img: [] as string[],
  product_size: [] as string[],
  product_color: [] as ColorData[],
  product_instock: true,
  product_bestsellere: false,
  product_new: false,
  stock_quantity: 10,
  low_stock_threshold: 5,
  sku: '',
};

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);

  // Color Builder Temp State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#5A6D57');

  // Image Input Temp State
  const [newImageUrl, setNewImageUrl] = useState('');

  // Custom Size Input Temp State
  const [customSize, setCustomSize] = useState('');

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  // Color management
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      toast.error('Please enter a color name');
      return;
    }
    const colorObj: ColorData = {
      name: newColorName.trim(),
      hex: newColorHex,
      currentColor: newColorName.trim(),
    };
    setFormData((prev) => ({
      ...prev,
      product_color: [...prev.product_color, colorObj],
    }));
    setNewColorName('');
  };

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      product_color: prev.product_color.filter((_, i) => i !== index),
    }));
  };

  // Image management
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (!newImageUrl.startsWith('http') && !newImageUrl.startsWith('/')) {
      toast.error('Please enter a valid URL or path (e.g. /images/...)');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      product_img: [...prev.product_img, newImageUrl.trim()],
    }));
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      product_img: prev.product_img.filter((_, i) => i !== index),
    }));
  };

  // Size management
  const handleSizeToggle = (size: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.product_size.includes(size);
      const updatedSizes = alreadySelected
        ? prev.product_size.filter((s) => s !== size)
        : [...prev.product_size, size];
      return { ...prev, product_size: updatedSizes };
    });
  };

  const handleAddCustomSize = () => {
    const trimmed = customSize.trim().toUpperCase();
    if (!trimmed) return;
    if (formData.product_size.includes(trimmed)) {
      toast.info('Size already added');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      product_size: [...prev.product_size, trimmed],
    }));
    setCustomSize('');
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.procuct_price || Number(formData.procuct_price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        procuct_price: formData.procuct_price.toString(),
        stock_quantity: Number(formData.stock_quantity),
        low_stock_threshold: Number(formData.low_stock_threshold),
        product_instock: Number(formData.stock_quantity) > 0,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error ?? 'Failed to save product');
      }

      toast.success('Product created successfully');
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="Add Product">
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/products')}
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
          Back to Products List
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          border: '1px solid #e5e5e5',
          borderRadius: radius.editorial,
          bgcolor: '#ffffff',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: brand.ink,
            fontFamily: fonts.display,
            mb: 1,
          }}
        >
          Create New Product
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: brand.muted,
            fontFamily: fonts.sans,
            mb: 4,
          }}
        >
          Fill out the product information below. A corresponding inventory record will automatically be initialized.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column: Basic Information */}
            <Grid item xs={12} md={7}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: brand.charcoal,
                  fontFamily: fonts.sans,
                  mb: 2,
                }}
              >
                Basic Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    required
                    fullWidth
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, product_name: e.target.value }))
                    }
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price (PKR)"
                    required
                    type="number"
                    fullWidth
                    value={formData.procuct_price}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, procuct_price: e.target.value }))
                    }
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="SKU Code"
                    fullWidth
                    placeholder="e.g. BUST-SAGE-01"
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, sku: e.target.value }))
                    }
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    fullWidth
                    placeholder="e.g. linen, silk, velvet"
                    value={formData.product_category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        product_category: e.target.value.toLowerCase(),
                      }))
                    }
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Initial Stock Quantity"
                    type="number"
                    fullWidth
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, stock_quantity: Number(e.target.value) }))
                    }
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Low Stock Warning Threshold"
                    type="number"
                    fullWidth
                    value={formData.low_stock_threshold}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        low_stock_threshold: Number(e.target.value),
                      }))
                    }
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.product_bestsellere}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              product_bestsellere: e.target.checked,
                            }))
                          }
                          color="success"
                          size="medium"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2">Show Bestseller Badge</Typography>
                          <StarIcon sx={{ fontSize: '1rem', color: '#f59e0b' }} />
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.product_new}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, product_new: e.target.checked }))
                          }
                          color="primary"
                          size="medium"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2">Show New Arrival Badge</Typography>
                          <FiberNewIcon sx={{ fontSize: '1.2rem', color: '#3b82f6' }} />
                        </Box>
                      }
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={formData.product_description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, product_description: e.target.value }))
                    }
                    size="medium"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Right Column: Custom Attributes & Media */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Sizes Selection */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: brand.charcoal,
                      fontFamily: fonts.sans,
                      mb: 1.5,
                    }}
                  >
                    Product Sizes
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {standardSizes.map((sz) => {
                      const isSelected = formData.product_size.includes(sz);
                      return (
                        <Chip
                          key={sz}
                          label={sz}
                          clickable
                          onClick={() => handleSizeToggle(sz)}
                          variant={isSelected ? 'filled' : 'outlined'}
                          sx={{
                            bgcolor: isSelected ? brand.sage : 'transparent',
                            color: isSelected ? brand.white : brand.charcoal,
                            borderColor: isSelected ? brand.sage : '#ccc',
                            '&:hover': {
                              bgcolor: isSelected ? brand.sageLight : 'rgba(0,0,0,0.04)',
                            },
                          }}
                        />
                      );
                    })}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      placeholder="Add custom size (e.g. 3XL, 34)"
                      size="small"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddCustomSize}
                      sx={{
                        textTransform: 'none',
                        color: brand.sage,
                        borderColor: brand.sage,
                        '&:hover': {
                          borderColor: brand.sageLight,
                          bgcolor: 'rgba(90, 109, 87, 0.04)',
                        },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>

                <Divider />

                {/* Color Builder */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: brand.charcoal,
                      fontFamily: fonts.sans,
                      mb: 1.5,
                    }}
                  >
                    Color Configurations
                  </Typography>
                  {formData.product_color.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {formData.product_color.map((col, idx) => (
                        <Chip
                          key={idx}
                          label={col.name}
                          onDelete={() => handleRemoveColor(idx)}
                          avatar={
                            <Box
                              sx={{
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                bgcolor: col.hex,
                                border: '1px solid rgba(0,0,0,0.15)',
                                ml: '4px !important',
                              }}
                            />
                          }
                          sx={{
                            borderRadius: radius.button,
                            bgcolor: '#f1f1f1',
                            '& .MuiChip-deleteIcon': {
                              color: '#888',
                              '&:hover': { color: '#d32f2f' },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      alignItems: 'center',
                      bgcolor: '#fafafa',
                      p: 2,
                      borderRadius: radius.product,
                      border: '1px dashed #ccc',
                    }}
                  >
                    <TextField
                      placeholder="Color name (e.g. Slate, Emerald)"
                      size="small"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      sx={{ flexGrow: 2, bgcolor: '#ffffff' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        style={{
                          width: '36px',
                          height: '36px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          padding: 0,
                          backgroundColor: 'transparent',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                      >
                        {newColorHex.toUpperCase()}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAddColor}
                      sx={{
                        textTransform: 'none',
                        bgcolor: brand.sage,
                        '&:hover': { bgcolor: brand.sageLight },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>

                <Divider />

                {/* Images Manager */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: brand.charcoal,
                      fontFamily: fonts.sans,
                      mb: 1.5,
                    }}
                  >
                    Product Images
                  </Typography>

                  {formData.product_img.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      {formData.product_img.map((url, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            border: '1px solid #eee',
                            borderRadius: '6px',
                            bgcolor: '#fafafa',
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 50,
                              borderRadius: '4px',
                              overflow: 'hidden',
                              border: '1px solid #ddd',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={url}
                              alt="preview"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                          <Typography
                            noWrap
                            variant="body2"
                            sx={{
                              flexGrow: 1,
                              fontSize: '0.8rem',
                              color: brand.charcoal,
                            }}
                          >
                            {url}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveImage(idx)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <CloseIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      placeholder="Enter image URL or path (e.g. /images/...)"
                      size="small"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddImage}
                      sx={{
                        textTransform: 'none',
                        color: brand.sage,
                        borderColor: brand.sage,
                        '&:hover': {
                          borderColor: brand.sageLight,
                          bgcolor: 'rgba(90, 109, 87, 0.04)',
                        },
                      }}
                    >
                      Add Image
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Footer Submit Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push('/admin/products')}
              sx={{
                textTransform: 'none',
                borderColor: '#ccc',
                color: brand.charcoal,
                px: 3,
                py: 1,
                fontFamily: fonts.sans,
                fontWeight: 500,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                textTransform: 'none',
                bgcolor: brand.sage,
                '&:hover': { bgcolor: brand.sageLight },
                minWidth: 150,
                px: 4,
                py: 1,
                fontFamily: fonts.sans,
                fontWeight: 600,
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Create Product'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
    </AdminShell>
  );
}
