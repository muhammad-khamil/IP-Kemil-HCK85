import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../libraries/http';

// Async thunk untuk fetch restaurants
export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get('/public/restaurants');
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal fetch restoran'
      );
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    restaurants: [],
    filteredRestaurants: [],
    categories: ['all'],
    loading: false,
    error: null,
    searchTerm: '',
    selectedCategory: 'all',
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      restaurantSlice.caseReducers.filterRestaurants(state);
    },
    
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      restaurantSlice.caseReducers.filterRestaurants(state);
    },
    
    filterRestaurants: (state) => {
      state.filteredRestaurants = state.restaurants.filter(resto => {
        const matchesSearch = 
          resto.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          resto.address.toLowerCase().includes(state.searchTerm.toLowerCase());
        
        const matchesCategory = 
          state.selectedCategory === 'all' || 
          resto.category === state.selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
    },
    
    setCategories: (state) => {
      const uniqueCategories = [
        'all', 
        ...new Set(state.restaurants.map(resto => resto.category))
      ];
      state.categories = uniqueCategories;
    },
    
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategory = 'all';
      state.filteredRestaurants = state.restaurants;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload;
        state.filteredRestaurants = action.payload;
        restaurantSlice.caseReducers.setCategories(state);
        restaurantSlice.caseReducers.filterRestaurants(state);
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.restaurants = [];
        state.filteredRestaurants = [];
      });
  },
});

export const {
  setSearchTerm,
  setSelectedCategory,
  clearFilters,
  clearError
} = restaurantSlice.actions;

export default restaurantSlice.reducer;