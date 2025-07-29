'use client';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

export default function DataTable({
  items,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onCreate,
  isLoading,
}) {
  const [editDialog, setEditDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    imageUrl: '',
  });

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      price: item.price.toString(),
      stock: item.stock.toString(),
      imageUrl: item.imageUrl || '',
    });
    setEditDialog(true);
  };

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      imageUrl: '',
    });
    setCreateDialog(true);
  };

  const handleSave = () => {
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    if (currentItem) {
      onEdit(currentItem._id, data);
      setEditDialog(false);
    } else {
      onCreate(data);
      setCreateDialog(false);
    }
    setCurrentItem(null);
  };

  const handleCancel = () => {
    setEditDialog(false);
    setCreateDialog(false);
    setCurrentItem(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Items</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {item.title}
                    </Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary">
                        {item.description.substring(0, 50)}...
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" />
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>
                  <Chip
                    label={item.stock}
                    color={item.stock > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(item._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pagination && (
          <TablePagination
            component="div"
            count={pagination.totalItems}
            page={pagination.currentPage - 1}
            onPageChange={(e, newPage) => onPageChange(newPage + 1)}
            rowsPerPage={10}
            onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
          />
        )}
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}