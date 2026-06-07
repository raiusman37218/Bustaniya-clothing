'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Divider,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tooltip,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { toast } from 'sonner';

import AdminShell from '@/src/components/admin/AdminShell';
import { brand, fonts, radius } from '@/src/lib/designTokens';

interface SectionImage {
  id: string;
  section: string;
  image_url: string;
  alt_text: string | null;
  link_url: string | null;
  sort_order: number;
}

const SECTIONS = [
  { value: 'hero', label: 'Hero Slider' },
  { value: 'collection', label: 'Collection / Masonry' },
  { value: 'mood_week', label: 'Bustaniya Week' },
  { value: 'follow_us', label: 'Follow Us / Instagram' },
];

export default function SectionImagesPage() {
  const [images, setImages] = useState<SectionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');

  // Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form State
  const [section, setSection] = useState('hero');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [linkUrl, setLinkUrl] = useState('/shop');
  const [sortOrder, setSortOrder] = useState('0');
  const [saving, setSaving] = useState(false);

  // Fetch all images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/homepage');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load images');
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Could not fetch section images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleOpenAdd = () => {
    setDialogMode('add');
    setSelectedId(null);
    setSection(activeTab);
    setImageUrl('');
    setAltText('');
    setLinkUrl('/shop');
    setSortOrder((filteredImages.length).toString());
    setOpenDialog(true);
  };

  const handleOpenEdit = (img: SectionImage) => {
    setDialogMode('edit');
    setSelectedId(img.id);
    setSection(img.section);
    setImageUrl(img.image_url);
    setAltText(img.alt_text || '');
    setLinkUrl(img.link_url || '');
    setSortOrder(img.sort_order.toString());
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Submit Add or Edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error('Image URL or Path is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        section,
        image_url: imageUrl.trim(),
        alt_text: altText.trim(),
        link_url: linkUrl.trim(),
        sort_order: parseInt(sortOrder) || 0,
      };

      let res;
      if (dialogMode === 'add') {
        res = await fetch('/api/admin/homepage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/homepage/${selectedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to save section image');

      toast.success(dialogMode === 'add' ? 'Image added successfully' : 'Image updated successfully');
      setOpenDialog(false);
      fetchImages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // Delete Image
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section image?')) return;

    try {
      const res = await fetch(`/api/admin/homepage/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to delete image');

      toast.success('Image removed successfully');
      fetchImages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  const filteredImages = images.filter((img) => img.section === activeTab);

  return (
    <AdminShell title="Homepage Section Images">
      {/* Page Header info */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: brand.muted,
              fontFamily: fonts.sans,
              maxWidth: 600,
            }}
          >
            Manage the editorial images appearing in the storefront's homepage sections (Hero Slider, Collection masonry blocks, Bustaniya daily week looks, and Follow Us feed). If a section has no images uploaded here, it will automatically render the beautiful built-in default image slides.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenAdd}
          sx={{
            textTransform: 'none',
            bgcolor: brand.sage,
            fontFamily: fonts.sans,
            fontWeight: 600,
            borderRadius: radius.button,
            boxShadow: 'none',
            '&:hover': { bgcolor: brand.sageLight, boxShadow: 'none' },
          }}
        >
          Add Section Image
        </Button>
      </Box>

      {/* Tabs list */}
      <Paper elevation={0} sx={{ border: '1px solid #e5e5e5', borderRadius: radius.editorial, bgcolor: '#ffffff', overflow: 'hidden', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: '1px solid #e5e5e5',
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: '0.875rem',
              py: 2.25,
              color: brand.muted,
              '&.Mui-selected': {
                color: brand.sage,
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: brand.sage,
              height: '3px',
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {SECTIONS.map((sec) => (
            <Tab key={sec.value} value={sec.value} label={sec.label} />
          ))}
        </Tabs>

        {/* Dynamic section grid */}
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
              <CircularProgress size={40} sx={{ color: brand.sage }} />
              <Typography variant="body2" sx={{ color: brand.muted, fontFamily: fonts.sans }}>
                Loading section assets...
              </Typography>
            </Box>
          ) : filteredImages.length === 0 ? (
            <Box sx={{ py: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: '50%', bgcolor: 'rgba(90, 109, 87, 0.06)', color: brand.sage }}>
                <ImageOutlinedIcon sx={{ fontSize: '2.5rem' }} />
              </Box>
              <Typography sx={{ color: brand.ink, fontWeight: 700, fontFamily: fonts.display, fontSize: '1.25rem' }}>
                No custom images uploaded
              </Typography>
              <Typography variant="body2" sx={{ color: brand.muted, fontFamily: fonts.sans, maxWidth: 380, mb: 1 }}>
                This section is currently displaying its default built-in static asset slides. Upload a custom image to overwrite them.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenAdd}
                sx={{
                  textTransform: 'none',
                  color: brand.sage,
                  borderColor: brand.sage,
                  borderRadius: radius.button,
                  '&:hover': { borderColor: brand.sageLight, bgcolor: 'rgba(90, 109, 87, 0.02)' },
                }}
              >
                Upload First Image
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredImages.map((img) => (
                <Grid item xs={12} sm={6} md={4} key={img.id}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid #e5e5e5',
                      borderRadius: radius.product,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: brand.sage,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    <Box sx={{ position: 'relative', pt: '125%', bgcolor: brand.imageBg, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={img.image_url}
                        alt={img.alt_text || 'homepage image'}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: 'monospace',
                            bgcolor: '#f4f4f5',
                            px: 1,
                            py: 0.25,
                            borderRadius: '4px',
                            fontWeight: 600,
                            color: brand.charcoal,
                          }}
                        >
                          Order: {img.sort_order}
                        </Typography>
                        {img.link_url && (
                          <Tooltip title="Opens linked page">
                            <IconButton
                              size="small"
                              href={img.link_url}
                              target="_blank"
                              sx={{ p: 0.25, color: brand.muted, '&:hover': { color: brand.sage } }}
                            >
                              <OpenInNewIcon sx={{ fontSize: '0.85rem' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>

                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          fontFamily: fonts.sans,
                          color: brand.ink,
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {img.alt_text || 'No description / Alt text'}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{
                          color: brand.muted,
                          fontFamily: fonts.sans,
                          wordBreak: 'break-all',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {img.image_url}
                      </Typography>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1, gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(img)}
                        sx={{ color: brand.charcoal, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                      >
                        <EditOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(img.id)}
                        sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.04)' } }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: '1.2rem' }} />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Add/Edit dialog modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontFamily: fonts.display, fontWeight: 700, pb: 1 }}>
            {dialogMode === 'add' ? 'Add Section Image' : 'Edit Section Image'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <FormControl fullWidth size="medium">
                  <InputLabel id="dialog-section-label">Target Section</InputLabel>
                  <Select
                    labelId="dialog-section-label"
                    value={section}
                    label="Target Section"
                    onChange={(e) => setSection(e.target.value)}
                  >
                    {SECTIONS.map((sec) => (
                      <MenuItem key={sec.value} value={sec.value}>
                        {sec.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Image URL or local path"
                  placeholder="e.g. /images/pakistani-fashion/stock-1.jpg or https://images.unsplash.com/..."
                  required
                  fullWidth
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Dynamic Image Preview */}
              {imageUrl.trim() && (
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{ color: brand.muted, display: 'block', mb: 1 }}>
                    Real-time Image Preview:
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      height: 180,
                      borderRadius: radius.product,
                      border: '1px solid #ddd',
                      bgcolor: brand.imageBg,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt="realtime preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL+or+Path';
                      }}
                    />
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  label="Alt Text / Title Description"
                  placeholder="e.g. Sage Embroidered lawn suit close-up"
                  fullWidth
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  label="Redirect URL / Shop Action Link"
                  placeholder="e.g. /shop or /shop/some-uuid"
                  fullWidth
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Sort Order"
                  type="number"
                  fullWidth
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                textTransform: 'none',
                color: brand.charcoal,
                fontWeight: 500,
                fontFamily: fonts.sans,
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{
                textTransform: 'none',
                bgcolor: brand.sage,
                fontFamily: fonts.sans,
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: brand.sageLight },
              }}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </AdminShell>
  );
}
