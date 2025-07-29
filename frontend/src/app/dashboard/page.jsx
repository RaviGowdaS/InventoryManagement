'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import Navigation from '../../components/Navigation';
import DataTable from '../../components/DataTable';
import Chart from '../../components/Chart';
import {
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  fetchCategories,
  setFilters,
} from '../../store/itemSlice';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, categories, pagination, isLoading, error, filters } = useSelector(
    (state) => state.items
  );

  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    dispatch(fetchItems(filters));
    dispatch(fetchCategories());
  }, [isAuthenticated, router, dispatch, filters]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    dispatch(setFilters({ search: value, page: 1 }));
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    dispatch(setFilters({ category, page: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(setFilters({ page }));
  };

  const handleRowsPerPageChange = (limit) => {
    dispatch(setFilters({ limit, page: 1 }));
  };

  const handleCreateItem = async (itemData) => {
    await dispatch(createItem(itemData));
    dispatch(fetchItems(filters));
  };

  const handleUpdateItem = async (id, itemData) => {
    await dispatch(updateItem({ id, itemData }));
    dispatch(fetchItems(filters));
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await dispatch(deleteItem(id));
      dispatch(fetchItems(filters));
    }
  };

  // Calculate statistics
  const totalItems = items.length;
  const totalCategories = categories.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const lowStockItems = items.filter(item => item.stock < 10).length;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Navigation>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InventoryIcon color="primary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Items
                    </Typography>
                    <Typography variant="h5">
                      {totalItems}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CategoryIcon color="secondary" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Categories
                    </Typography>
                    <Typography variant="h5">
                      {totalCategories}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon color="success" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Total Value
                    </Typography>
                    <Typography variant="h5">
                      ${totalValue.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingIcon color="warning" sx={{ mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      Low Stock
                    </Typography>
                    <Typography variant="h5">
                      {lowStockItems}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Data Table" />
            <Tab label="Charts" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Paper sx={{ p: 3 }}>
            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Search items..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <TextField
                select
                label="Category"
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <DataTable
                items={items}
                pagination={pagination}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onEdit={handleUpdateItem}
                onDelete={handleDeleteItem}
                onCreate={handleCreateItem}
                isLoading={isLoading}
              />
            )}
          </Paper>
        )}

        {tabValue === 1 && (
          <Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Chart items={items} />
            )}
          </Box>
        )}
      </Box>
    </Navigation>
  );
}