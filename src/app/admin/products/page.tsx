'use client';

import { useCallback, useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Chip,
  Tooltip,
  Grid,
  Divider,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RefreshIcon from '@mui/icons-material/Refresh';

import AdminShell from '@/src/components/admin/AdminShell';
import { formatPkr } from '@/src/components/admin/formatPkr';
import { brand, fonts, radius } from '@/src/lib/designTokens';
import { Product, ColorData } from '@/src/types/productTypes';
import { toast } from 'react-toastify';

interface CombinedProduct extends Product {
  inventory: {
    stock_quantity: number;
    low_stock_threshold: number;
    sku: string;
  };
}

const DEFAULT_FORM_STATE = {
  id: '',
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
  article_number: '',
  stock_id: '',
};

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<CombinedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [configError, setConfigError] = useState('');
  const [stocks, setStocks] = useState<Array<{ id: string; description: string | null }>>([]);

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await fetch('/api/admin/expenses');
        const data = await res.json();
        if (res.ok) {
          setStocks(data.stockEntries || []);
        }
      } catch (err) {
        console.error('Failed to fetch stocks:', err);
      }
    }
    fetchStocks();
  }, []);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form & Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);

  // Color Builder Temp State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#5A6D57');

  // Image Input Temp State
  const [newImageUrl, setNewImageUrl] = useState('');

  // Custom Size Input Temp State
  const [customSize, setCustomSize] = useState('');

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<CombinedProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    setConfigError('');
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'MISSING_SERVICE_ROLE') {
          setConfigError(data.error ?? 'Admin database access is not configured.');
        } else {
          setError(data.error ?? 'Could not load products');
        }
        return;
      }
      setProducts(data.products ?? []);
    } catch {
      setError('Could not load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Check URL parameters for ?add=true
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      router.push('/admin/products/add');
    }
  }, [searchParams, router]);

  // Filter Categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.product_category) cats.add(p.product_category);
    });
    return Array.from(cats);
  }, [products]);

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.inventory.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toString().includes(searchTerm);
      const matchesCategory =
        categoryFilter === 'all' || p.product_category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  // Handlers
  const handleAddClick = () => {
    router.push('/admin/products/add');
  };

  const handleEditClick = (product: CombinedProduct) => {
    setFormData({
      id: product.id,
      product_name: product.product_name || '',
      procuct_price: product.procuct_price || '',
      product_category: product.product_category || '',
      product_description: product.product_description || '',
      product_img: product.product_img || [],
      product_size: product.product_size || [],
      product_color: product.product_color || [],
      product_instock: product.product_instock ?? true,
      product_bestsellere: product.product_bestsellere ?? false,
      product_new: product.product_new ?? false,
      stock_quantity: product.inventory?.stock_quantity ?? 10,
      low_stock_threshold: product.inventory?.low_stock_threshold ?? 5,
      sku: product.inventory?.sku || '',
      article_number: product.article_number || '',
      stock_id: product.stock_id || '',
    });
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (product: CombinedProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

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
      const url = isEditMode ? `/api/admin/products/${formData.id}` : '/api/admin/products';
      const method = isEditMode ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        procuct_price: formData.procuct_price.toString(),
        stock_quantity: Number(formData.stock_quantity),
        low_stock_threshold: Number(formData.low_stock_threshold),
        product_instock: Number(formData.stock_quantity) > 0,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error ?? 'Failed to save product');
      }

      toast.success(isEditMode ? 'Product updated successfully' : 'Product created successfully');
      setIsDrawerOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to delete product');
      }
      toast.success('Product deleted successfully');
      setDeleteDialogOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleting(false);
      setProductToDelete(null);
    }
  };

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  return (
    <AdminShell title="Products">
      {/* Configuration Error Box */}
      {configError && (
        <Box sx={{ p: 4, mb: 4, bgcolor: '#fff', border: '1px solid #e5e5e5', borderRadius: 2 }}>
          <Typography sx={{ color: '#c62828', mb: 1, fontWeight: 600 }}>{configError}</Typography>
          <Typography variant="body2" sx={{ color: '#707070' }}>
            Supabase Dashboard → Project Settings → API → copy the{' '}
            <strong>service_role</strong> key into{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, then restart{' '}
            <code>npm run dev</code>.
          </Typography>
        </Box>
      )}

      {/* Main Container */}
      {!configError && (
        <Box>
          {/* Header Controls */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: brand.muted, fontFamily: fonts.sans }}>
                Manage products, update stock quantities, edit categories, and define items attributes.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={loadProducts}
                startIcon={<RefreshIcon />}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  borderColor: '#e5e5e5',
                  color: brand.charcoal,
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: brand.sage,
                    bgcolor: 'rgba(90, 109, 87, 0.02)',
                  },
                }}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                onClick={handleAddClick}
                startIcon={<AddIcon />}
                sx={{
                  textTransform: 'none',
                  bgcolor: brand.sage,
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  borderRadius: radius.button,
                  px: 3,
                  '&:hover': { bgcolor: brand.sageLight },
                }}
              >
                Add Product
              </Button>
            </Box>
          </Box>

          {/* Search & Filter Card */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              border: '1px solid #e5e5e5',
              borderRadius: 2,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            <TextField
              placeholder="Search products by name, SKU or ID..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: brand.muted, mr: 1, fontSize: '1.25rem' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  bgcolor: '#fafafa',
                },
              }}
            />

            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 } }}>
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{ borderRadius: '6px', bgcolor: '#fafafa' }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {(searchTerm || categoryFilter !== 'all') && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                sx={{ color: brand.muted, textTransform: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                Clear Filters
              </Button>
            )}
          </Paper>

          {/* Table list */}
          <Paper
            elevation={0}
            sx={{ border: '1px solid #e5e5e5', borderRadius: 2, overflow: 'hidden' }}
          >
            {loading ? (
              <Box sx={{ py: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
                <CircularProgress size={40} sx={{ color: brand.sage }} />
                <Typography variant="body2" sx={{ color: brand.muted, fontFamily: fonts.sans }}>
                  Loading inventory items...
                </Typography>
              </Box>
            ) : error ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography sx={{ color: '#c62828', fontWeight: 600 }}>{error}</Typography>
                <Button onClick={loadProducts} size="small" variant="outlined" sx={{ mt: 2, borderColor: '#c62828', color: '#c62828', '&:hover': { bgcolor: '#ffebee' } }}>
                  Try Again
                </Button>
              </Box>
            ) : filteredProducts.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography sx={{ color: brand.muted, fontSize: '0.9rem', mb: 2 }}>
                  {searchTerm || categoryFilter !== 'all'
                    ? 'No products matched your filter search.'
                    : 'No products registered in the database yet.'}
                </Typography>
                {(searchTerm || categoryFilter !== 'all') && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                    }}
                    size="small"
                    sx={{ textTransform: 'none', borderColor: '#dcdcdc', color: brand.charcoal }}
                  >
                    Reset Search
                  </Button>
                )}
              </Box>
            ) : (
              <TableContainer>
                <Table size="medium">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600, width: 80 }}>Image</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Article #</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>SKU</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Stock Qty</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Badges</TableCell>
                      <TableCell sx={{ fontWeight: 600, width: 100 }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((p) => {
                      const qty = p.inventory?.stock_quantity ?? 0;
                      const thresh = p.inventory?.low_stock_threshold ?? 5;
                      
                      let stockStatus = 'in-stock';
                      if (qty <= 0) stockStatus = 'out-of-stock';
                      else if (qty <= thresh) stockStatus = 'low-stock';

                      return (
                        <TableRow key={p.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          {/* Image */}
                          <TableCell>
                            <Box
                              sx={{
                                width: 50,
                                height: 60,
                                borderRadius: '4px',
                                overflow: 'hidden',
                                bgcolor: '#f4f4f4',
                                border: '1px solid #eaeaea',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {p.product_img && p.product_img.length > 0 ? (
                                <img
                                  src={p.product_img[0]}
                                  alt={p.product_name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: brand.muted }}>
                                  No img
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          {/* Product details */}
                          <TableCell>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: brand.ink }}>
                              {p.product_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: brand.muted }}>
                              ID: {p.id}
                            </Typography>
                          </TableCell>

                          {/* Article # */}
                          <TableCell>
                            <Typography sx={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: brand.sage }}>
                              {p.article_number || '—'}
                            </Typography>
                            {p.stock_id && (
                              <Chip
                                label={p.stock_id}
                                size="small"
                                sx={{
                                  mt: 0.5,
                                  height: 18,
                                  fontSize: '0.6rem',
                                  fontWeight: 600,
                                  bgcolor: '#e0f2f1',
                                  color: '#004d40',
                                }}
                              />
                            )}
                          </TableCell>

                          {/* SKU */}
                          <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: brand.charcoal }}>
                            {p.inventory?.sku || `SKU-${p.id}`}
                          </TableCell>

                          {/* Category */}
                          <TableCell sx={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>
                            {p.product_category || '—'}
                          </TableCell>

                          {/* Price */}
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', color: brand.sage }}>
                            {formatPkr(Number(p.procuct_price))}
                          </TableCell>

                          {/* Stock Quantity Status */}
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                {qty}
                              </Typography>
                              {stockStatus === 'out-of-stock' && (
                                <Chip
                                  label="Out of Stock"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    bgcolor: '#fce8e8',
                                    color: '#c62828',
                                  }}
                                />
                              )}
                              {stockStatus === 'low-stock' && (
                                <Chip
                                  label="Low Stock"
                                  size="small"
                                  icon={<WarningAmberIcon sx={{ '&&': { fontSize: '0.8rem', color: '#8a6d00' } }} />}
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    bgcolor: '#fff8e6',
                                    color: '#8a6d00',
                                  }}
                                />
                              )}
                              {stockStatus === 'in-stock' && (
                                <Chip
                                  label="In Stock"
                                  size="small"
                                  sx={{
                                    height: 18,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    bgcolor: '#e8f5e9',
                                    color: '#2e7d32',
                                  }}
                                />
                              )}
                            </Box>
                          </TableCell>

                          {/* Badges */}
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              {p.product_bestsellere && (
                                <Tooltip title="Bestseller">
                                  <IconButton size="small" sx={{ p: 0.25, color: '#f59e0b', bgcolor: '#fef3c7' }}>
                                    <StarIcon sx={{ fontSize: '1rem' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {p.product_new && (
                                <Tooltip title="New Arrival">
                                  <IconButton size="small" sx={{ p: 0.25, color: '#3b82f6', bgcolor: '#dbeafe' }}>
                                    <FiberNewIcon sx={{ fontSize: '1rem' }} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {!p.product_bestsellere && !p.product_new && (
                                <Typography variant="caption" sx={{ color: brand.muted }}>
                                  —
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          {/* Actions */}
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(p)}
                                sx={{ color: brand.muted, '&:hover': { color: brand.sage, bgcolor: 'rgba(90, 109, 87, 0.05)' } }}
                              >
                                <EditOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(p)}
                                sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.05)' } }}
                              >
                                <DeleteOutlineIcon sx={{ fontSize: '1.2rem' }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      )}

      {/* Add / Edit Product Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 580 },
            p: 4,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: brand.ink, fontFamily: fonts.display }}>
                {isEditMode ? 'Edit Product Details' : 'Add New Product'}
              </Typography>
              <Typography variant="caption" sx={{ color: brand.muted }}>
                {isEditMode ? `Updating Product ID: ${formData.id}` : 'Fill in the information to publish a product.'}
              </Typography>
            </Box>
            <IconButton onClick={() => setIsDrawerOpen(false)} sx={{ color: brand.muted }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Scrollable Form Content */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mb: 3 }}>
            <Grid container spacing={3}>
              {/* Product Name */}
              <Grid item xs={12}>
                <TextField
                  label="Product Name"
                  required
                  fullWidth
                  value={formData.product_name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, product_name: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Article Number */}
              <Grid item xs={12}>
                <TextField
                  label="Article Number"
                  fullWidth
                  placeholder="e.g. bu-p#001 (leave empty to auto-generate)"
                  value={formData.article_number}
                  onChange={(e) => setFormData((prev) => ({ ...prev, article_number: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Link to Stock ID */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="stock-select-label">Link to Stock ID (Optional)</InputLabel>
                  <Select
                    labelId="stock-select-label"
                    label="Link to Stock ID (Optional)"
                    value={formData.stock_id || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock_id: e.target.value as string }))}
                  >
                    <MenuItem value="">
                      <em>None - Do not link to any Stock batch</em>
                    </MenuItem>
                    {stocks.map((stk) => (
                      <MenuItem key={stk.id} value={stk.id}>
                        {stk.id} {stk.description ? `(${stk.description})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Price & SKU */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price (PKR)"
                  required
                  type="number"
                  fullWidth
                  value={formData.procuct_price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, procuct_price: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="SKU Code"
                  fullWidth
                  placeholder="e.g. BUST-SAGE-01"
                  value={formData.sku}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Category & Stock */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  fullWidth
                  placeholder="e.g. linen, silk, velvet"
                  value={formData.product_category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, product_category: e.target.value.toLowerCase() }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Stock Quantity"
                  type="number"
                  fullWidth
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: Number(e.target.value) }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Low Stock Warning */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Low Stock Threshold"
                  type="number"
                  fullWidth
                  value={formData.low_stock_threshold}
                  onChange={(e) => setFormData((prev) => ({ ...prev, low_stock_threshold: Number(e.target.value) }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              {/* Badges / Visibility Switch */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.product_bestsellere}
                        onChange={(e) => setFormData((prev) => ({ ...prev, product_bestsellere: e.target.checked }))}
                        color="success"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Show Bestseller Badge</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.product_new}
                        onChange={(e) => setFormData((prev) => ({ ...prev, product_new: e.target.checked }))}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Show New Arrival Badge</Typography>}
                  />
                </Box>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  multiline
                  rows={3}
                  fullWidth
                  value={formData.product_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, product_description: e.target.value }))}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Sizes Selection */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: brand.charcoal, mb: 1 }}>
                  Product Sizes
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
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
                {/* Custom size input */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Add other size (e.g. 3XL, 32)"
                    size="small"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddCustomSize}
                    sx={{ textTransform: 'none', color: brand.sage, borderColor: brand.sage }}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>

              {/* Color Builder */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: brand.charcoal, mb: 1 }}>
                  Colors Configurations
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
                          borderRadius: '6px',
                          bgcolor: '#f1f1f1',
                          '& .MuiChip-deleteIcon': { color: '#888', '&:hover': { color: '#d32f2f' } },
                        }}
                      />
                    ))}
                  </Box>
                )}
                {/* Add new color row */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', bgcolor: '#fcfcfc', p: 1.5, borderRadius: '6px', border: '1px dashed #ccc' }}>
                  <TextField
                    placeholder="Color name (e.g. Sage, Crimson)"
                    size="small"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    sx={{ flexGrow: 2 }}
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
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {newColorHex.toUpperCase()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleAddColor}
                    sx={{ textTransform: 'none', bgcolor: brand.sage, '&:hover': { bgcolor: brand.sageLight } }}
                  >
                    Add Color
                  </Button>
                </Box>
              </Grid>

              {/* Images Manager */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: brand.charcoal, mb: 1 }}>
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
                          p: 1,
                          border: '1px solid #eee',
                          borderRadius: '6px',
                          bgcolor: '#fafafa',
                        }}
                      >
                        <Box sx={{ width: 40, height: 50, borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd', flexShrink: 0 }}>
                          <img src={url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </Box>
                        <Typography noWrap variant="body2" sx={{ flexGrow: 1, fontSize: '0.8rem', color: brand.charcoal, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {url}
                        </Typography>
                        <IconButton size="small" onClick={() => handleRemoveImage(idx)} sx={{ color: '#d32f2f' }}>
                          <CloseIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Enter image URL or path (e.g. https://... or /images/...)"
                    size="small"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddImage}
                    sx={{ textTransform: 'none', color: brand.sage, borderColor: brand.sage }}
                  >
                    Add Image
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Drawer Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => setIsDrawerOpen(false)}
              sx={{ textTransform: 'none', borderColor: '#ccc', color: brand.charcoal }}
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
                minWidth: 120,
              }}
            >
              {submitting ? <CircularProgress size={20} color="inherit" /> : isEditMode ? 'Update Product' : 'Create Product'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '8px', width: '100%', maxWidth: 450 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: fonts.display }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: brand.charcoal }}>
            Are you sure you want to delete product{' '}
            <strong>{productToDelete?.product_name}</strong>? This action will completely remove the product and its inventory from the system and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ textTransform: 'none', borderColor: '#ccc', color: brand.charcoal }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            sx={{ textTransform: 'none', bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' }, minWidth: 100 }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <AdminShell title="Products">
        <Box sx={{ py: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: brand.sage }} />
          <Typography variant="body2" sx={{ color: brand.muted, fontFamily: fonts.sans }}>
            Loading inventory layout...
          </Typography>
        </Box>
      </AdminShell>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
