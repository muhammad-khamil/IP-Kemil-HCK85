import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchRestaurants, 
  setSearchTerm, 
  setSelectedCategory, 
  clearFilters,
  clearError 
} from '../store/slices/restaurantSlice';
import RestaurantCard from "../components/RestaurantCard";
import NavbarPublic from "../components/NavbarPublic";

export default function HomePage() {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    filteredRestaurants,
    categories,
    loading,
    error,
    searchTerm,
    selectedCategory
  } = useSelector(state => state.restaurants);

  // Fetch restaurants on component mount
  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  // Handle retry fetch
  const handleRetry = () => {
    dispatch(fetchRestaurants());
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavbarPublic />

      {/* Hero Section */}
      <div className="py-5 mb-4 text-white position-relative" style={{
        background: 'linear-gradient(rgba(39, 56, 38, 0.9), rgba(39, 56, 38, 0.85)), url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold mb-3">
                Temukan Restoran Terbaik
              </h1>
              <p className="lead mb-4">
                Jelajahi berbagai pilihan restoran dengan kategori makanan yang lezat
              </p>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Cari restoran atau lokasi..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex-grow-1">
        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => dispatch(clearError())}
            ></button>
            <div className="mt-2">
              <button className="btn btn-sm btn-outline-danger" onClick={handleRetry}>
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-4 d-flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Memuat restoran...</p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">Katalog Restoran</h2>
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-success">
                  {filteredRestaurants.length} restoran
                </span>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => dispatch(clearFilters())}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Restaurant Cards */}
            <div className="row g-4">
              {filteredRestaurants.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <h3 className="text-muted mb-3">Tidak ada restoran ditemukan</h3>
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => dispatch(clearFilters())}
                  >
                    Tampilkan Semua Restoran
                  </button>
                </div>
              ) : (
                filteredRestaurants.map((resto) => (
                  <RestaurantCard key={resto.id} restaurant={resto} />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}