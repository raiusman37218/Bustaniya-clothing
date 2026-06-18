'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AdminShell from '@/src/components/admin/AdminShell';
import { brand, fonts, radius } from '@/src/lib/designTokens';
import { formatPkr } from '@/src/components/admin/formatPkr';
import { toast } from 'react-toastify';

interface ExpenseItem {
  name: string;
  amount: number;
}

interface StockEntry {
  id: string;
  created_at: string;
  description: string | null;
  expenses: ExpenseItem[];
  totalExpense: number;
  linkedProductsCount: number;
  linkedProducts: Array<{ id: string; name: string; stockQuantity: number }>;
  isSoldOut: boolean;
  totalRevenue: number;
  netProfit: number;
}

export default function ExpensesPage() {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating new entry
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [stockId, setStockId] = useState('');
  const [autoGenId, setAutoGenId] = useState(true);
  const [description, setDescription] = useState('');
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [currentExpenses, setCurrentExpenses] = useState<ExpenseItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Detail Modal states
  const [selectedEntry, setSelectedEntry] = useState<StockEntry | null>(null);

  // Fetch entries
  const fetchStockEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/expenses');
      const data = await res.json();
      if (res.ok) {
        setStockEntries(data.stockEntries || []);
      } else {
        toast.error(data.error || 'Failed to fetch stock entries');
      }
    } catch {
      toast.error('Failed to load expenses data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockEntries();
  }, []);

  // Handle auto-gen toggle
  useEffect(() => {
    if (autoGenId) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      setStockId(`STK-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${rand}`);
    } else {
      setStockId('');
    }
  }, [autoGenId, isCreateOpen]);

  const handleAddExpenseItem = () => {
    if (!expenseName.trim()) {
      toast.error('Expense item name is required.');
      return;
    }
    const amt = Number(expenseAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid expense amount.');
      return;
    }

    setCurrentExpenses((prev) => [...prev, { name: expenseName.trim(), amount: amt }]);
    setExpenseName('');
    setExpenseAmount('');
  };

  const handleRemoveExpenseItem = (idx: number) => {
    setCurrentExpenses((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateStockEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockId.trim()) {
      toast.error('Stock ID is required');
      return;
    }
    if (currentExpenses.length === 0) {
      toast.error('Please add at least one expense item.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stockId.trim(),
          description,
          expenses: currentExpenses,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Stock expense entry created successfully!');
        setIsCreateOpen(false);
        // Reset state
        setDescription('');
        setCurrentExpenses([]);
        setAutoGenId(true);
        fetchStockEntries();
      } else {
        toast.error(data.error || 'Failed to create stock entry');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!confirm(`Are you sure you want to delete Stock Entry "${id}"?`)) return;

    try {
      const res = await fetch(`/api/admin/expenses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Stock entry deleted');
        fetchStockEntries();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete stock entry');
      }
    } catch {
      toast.error('Failed to delete stock entry');
    }
  };

  const totalCurrentExpense = currentExpenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AdminShell title="Expenses & Stock Management">
      {/* Top action row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="body1" sx={{ color: brand.muted, fontFamily: fonts.sans }}>
          Track procurement expenses, link them to catalog products, and monitor sales profitability automatically.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateOpen(true)}
          sx={{
            bgcolor: brand.sage,
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: radius.button,
            px: 3,
            py: 1,
            '&:hover': { bgcolor: brand.sageLight },
          }}
        >
          Add Stock Entry
        </Button>
      </Box>

      {/* Main Stock Entries list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="success" />
        </Box>
      ) : stockEntries.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 4,
            textAlign: 'center',
            border: '1px dashed #e5e5e5',
            borderRadius: radius.editorial,
            bgcolor: '#ffffff',
          }}
        >
          <ReceiptLongIcon sx={{ fontSize: 48, color: '#bdbdbd', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: brand.ink }}>
            No Stock Entries Found
          </Typography>
          <Typography variant="body2" sx={{ color: brand.muted, mb: 3 }}>
            Get started by recording your first procurement batch and its expenses.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setIsCreateOpen(true)}
            sx={{
              borderColor: brand.sage,
              color: brand.sage,
              textTransform: 'none',
              borderRadius: radius.button,
              '&:hover': { borderColor: brand.sage, bgcolor: 'rgba(90, 109, 87, 0.04)' },
            }}
          >
            Create First Batch
          </Button>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid #e5e5e5', borderRadius: radius.editorial }}
        >
          <Table>
            <TableHead sx={{ bgcolor: '#f9f9f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Stock ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date Created</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Total Expense</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Products Linked</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Sales Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Total Revenue</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Net Profit / Loss</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockEntries.map((entry) => {
                const profitColor = entry.netProfit >= 0 ? '#2e7d32' : '#c62828';
                return (
                  <TableRow key={entry.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Button
                        onClick={() => setSelectedEntry(entry)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          color: brand.sage,
                          p: 0,
                          minWidth: 0,
                          textAlign: 'left',
                          '&:hover': { color: brand.sageLight, bgcolor: 'transparent' },
                        }}
                      >
                        {entry.id}
                      </Button>
                    </TableCell>
                    <TableCell sx={{ color: '#666', fontSize: '0.85rem' }}>
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell sx={{ color: '#555', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.description || '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      <Tooltip title={
                        <Box sx={{ p: 0.5 }}>
                          {entry.expenses.map((e, idx) => (
                            <Typography key={idx} variant="caption" sx={{ display: 'block' }}>
                              {e.name}: {formatPkr(e.amount)}
                            </Typography>
                          ))}
                        </Box>
                      } arrow>
                        <span style={{ borderBottom: '1px dashed #bbb', cursor: 'help' }}>
                          {formatPkr(entry.totalExpense)}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${entry.linkedProductsCount} Products`}
                        size="small"
                        sx={{ bgcolor: '#f0f4f1', color: brand.sage, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {entry.linkedProductsCount === 0 ? (
                        <Chip label="Unlinked" size="small" sx={{ bgcolor: '#eee', color: '#666' }} />
                      ) : entry.isSoldOut ? (
                        <Chip label="Sold Out" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
                      ) : (
                        <Chip label="Active" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 600 }} />
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ color: entry.linkedProductsCount > 0 ? '#333' : '#aaa' }}>
                      {entry.linkedProductsCount > 0 ? formatPkr(entry.totalRevenue) : '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: entry.linkedProductsCount > 0 ? profitColor : '#aaa' }}>
                      {entry.linkedProductsCount === 0 ? (
                        '—'
                      ) : !entry.isSoldOut ? (
                        <Tooltip title="Net Profit/Loss is finalized once all products linked to this stock ID are sold out. Current preview shown.">
                          <span style={{ borderBottom: '1px dashed #ccc', cursor: 'help', color: profitColor }}>
                            {entry.netProfit >= 0 ? '+' : ''}{formatPkr(entry.netProfit)}
                          </span>
                        </Tooltip>
                      ) : (
                        <span>{entry.netProfit >= 0 ? '+' : ''}{formatPkr(entry.netProfit)}</span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEntry(entry.id)}
                        sx={{ color: '#d32f2f', '&:hover': { bgcolor: '#ffebee' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Creation Modal Dialog */}
      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: radius.editorial, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: fonts.display, color: brand.ink }}>
          Create Stock & Expense Entry
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateStockEntry}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={autoGenId}
                      onChange={(e) => setAutoGenId(e.target.checked)}
                      color="success"
                    />
                  }
                  label="Auto-generate unique Stock ID"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Stock ID"
                  required
                  fullWidth
                  disabled={autoGenId}
                  value={stockId}
                  onChange={(e) => setStockId(e.target.value)}
                  placeholder="e.g. STK-KURTI-2026"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description / Batch Notes"
                  fullWidth
                  multiline
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Raw silk kurti collection procurement from Karachi"
                  size="medium"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brand.charcoal }}>
                  Add Expense Items
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 2 }}>
                  <TextField
                    label="Item Name"
                    fullWidth
                    value={expenseName}
                    onChange={(e) => setExpenseName(e.target.value)}
                    placeholder="e.g. Purchase Cost, Shipping, Customs"
                    size="small"
                  />
                  <TextField
                    label="Amount (PKR)"
                    type="number"
                    sx={{ width: 180 }}
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 12000"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddExpenseItem}
                    sx={{
                      bgcolor: brand.sage,
                      height: 40,
                      minWidth: 40,
                      borderRadius: radius.button,
                      '&:hover': { bgcolor: brand.sageLight }
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>

                {/* Local current expenses list */}
                {currentExpenses.length === 0 ? (
                  <Typography variant="body2" sx={{ color: brand.muted, py: 1, textAlign: 'center' }}>
                    No expense items added yet. Add at least one above.
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200, borderRadius: 2 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Item Name</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600, width: 60 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {currentExpenses.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">{formatPkr(item.amount)}</TableCell>
                            <TableCell align="center">
                              <IconButton size="small" onClick={() => handleRemoveExpenseItem(idx)} sx={{ color: '#d32f2f' }}>
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                          <TableCell sx={{ fontWeight: 700 }}>Total Expense</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: brand.sage }}>
                            {formatPkr(totalCurrentExpense)}
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setIsCreateOpen(false)}
              sx={{ color: brand.muted, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting || currentExpenses.length === 0}
              sx={{
                bgcolor: brand.sage,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: radius.button,
                px: 3,
                '&:hover': { bgcolor: brand.sageLight }
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Save Entry'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Stock Entry Detail View Dialog */}
      <Dialog
        open={selectedEntry !== null}
        onClose={() => setSelectedEntry(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: radius.editorial, p: 1 } }}
      >
        {selectedEntry && (
          <>
            <DialogTitle sx={{ fontWeight: 700, fontFamily: fonts.display, color: brand.ink, pb: 1 }}>
              Stock Details: {selectedEntry.id}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: brand.muted, display: 'block' }}>Date Created</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {new Date(selectedEntry.created_at).toLocaleString('en-US')}
                  </Typography>
                </Box>

                {selectedEntry.description && (
                  <Box>
                    <Typography variant="caption" sx={{ color: brand.muted, display: 'block' }}>Description</Typography>
                    <Typography variant="body2">{selectedEntry.description}</Typography>
                  </Box>
                )}

                <Divider />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Expense Breakdown</Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableBody>
                        {selectedEntry.expenses.map((exp, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ py: 1 }}>{exp.name}</TableCell>
                            <TableCell align="right" sx={{ py: 1, fontWeight: 500 }}>{formatPkr(exp.amount)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                          <TableCell sx={{ fontWeight: 700 }}>Total Procurement Expense</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: brand.sage }}>
                            {formatPkr(selectedEntry.totalExpense)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Linked Inventory Products</Typography>
                  {selectedEntry.linkedProducts.length === 0 ? (
                    <Typography variant="body2" sx={{ color: brand.muted, fontStyle: 'italic' }}>
                      No catalog products are currently linked to this Stock ID.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                        <Table size="small">
                          <TableHead sx={{ bgcolor: '#fdfdfd' }}>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 600 }}>Product Name</TableCell>
                              <TableCell align="center" sx={{ fontWeight: 600 }}>Current Stock Qty</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {selectedEntry.linkedProducts.map((p) => (
                              <TableRow key={p.id}>
                                <TableCell>{p.name}</TableCell>
                                <TableCell align="center">
                                  {p.stockQuantity <= 0 ? (
                                    <Chip label="Sold Out" size="small" color="error" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                  ) : (
                                    <Chip label={`${p.stockQuantity} Left`} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem' }} />
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {/* Revenue analysis */}
                      <Box sx={{ bgcolor: '#f9faf9', p: 2, borderRadius: radius.button, border: '1px solid #e2eee3', mt: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brand.sage, mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          Sales Profitability Analysis
                          <Tooltip title="Profit & loss calculations are dynamically aggregated based on actual successful customer orders for linked products.">
                            <InfoOutlinedIcon sx={{ fontSize: 16, color: '#aaa', cursor: 'help' }} />
                          </Tooltip>
                        </Typography>
                        
                        <Grid container spacing={1.5}>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: brand.muted, display: 'block' }}>Total Sales Revenue</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#2c3e50' }}>{formatPkr(selectedEntry.totalRevenue)}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: brand.muted, display: 'block' }}>Total Expenses</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#2c3e50' }}>{formatPkr(selectedEntry.totalExpense)}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ my: 0.5 }} />
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" sx={{ color: brand.muted, display: 'block' }}>
                              Net {selectedEntry.netProfit >= 0 ? 'Profit' : 'Loss'} ({selectedEntry.isSoldOut ? 'Finalized' : 'Active Batch Preview'})
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: selectedEntry.netProfit >= 0 ? '#2e7d32' : '#c62828' }}>
                              {selectedEntry.netProfit >= 0 ? '+' : ''}{formatPkr(selectedEntry.netProfit)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setSelectedEntry(null)}
                sx={{
                  borderColor: brand.sage,
                  color: brand.sage,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: radius.button,
                  '&:hover': { borderColor: brand.sage, bgcolor: 'rgba(90, 109, 87, 0.04)' }
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </AdminShell>
  );
}
