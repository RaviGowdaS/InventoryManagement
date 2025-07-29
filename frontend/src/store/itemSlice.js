import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async ({ page = 1, limit = 10, category, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await api.get(`/items?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch items');
    }
  }
);

export const createItem = createAsyncThunk(
  'items/createItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await api.post('/items', itemData);
      return response.data.data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create item');
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ id, itemData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/items/${id}`, itemData);
      return response.data.data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/items/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete item');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'items/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/items/categories');
      return response.data.data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  items: [],
  categories: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    category: '',
    search: '',
  },
};

const itemSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Item
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Item
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Item
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setFilters, clearError, resetFilters } = itemSlice.actions;
export default itemSlice.reducer;