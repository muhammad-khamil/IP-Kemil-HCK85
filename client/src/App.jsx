import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router";
import { isAdmin, isLoggedIn } from "./libraries/auth";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import RestaurantListPage from "./pages/RestaurantListPage";
import AddRestaurantPage from "./pages/AddRestaurantPage";
import EditRestaurantPage from "./pages/EditRestaurantPage";
import FoodListPage from "./pages/FoodListPage";
import FoodAddPage from "./pages/FoodAddPage";
import FoodEditPage from "./pages/FoodEditPage";

// Protected Route Component
function ProtectedRoute({ children, requireAdmin = false }) {
  const isUserLoggedIn = isLoggedIn();
  const isUserAdmin = isAdmin();

  if (!isUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isUserAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Public Only Route Component (for login/register)
function PublicOnlyRoute({ children }) {
  if (isLoggedIn()) {
    // If user is logged in, redirect to appropriate page
    if (isAdmin()) {
      return <Navigate to="/cms/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant/:id" element={<DetailPage />} />
        
        {/* Auth routes - accessible only when NOT logged in */}
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          } 
        />

        {/* CMS routes - protected, requires admin */}
        <Route
          path="/cms/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cms/restaurants"
          element={
            <ProtectedRoute requireAdmin>
              <RestaurantListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cms/restaurants/add"
          element={
            <ProtectedRoute requireAdmin>
              <AddRestaurantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cms/restaurants/edit/:id"
          element={
            <ProtectedRoute requireAdmin>
              <EditRestaurantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cms/foods"
          element={
            <ProtectedRoute requireAdmin>
              <FoodListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cms/foods/add"
          element={
            <ProtectedRoute requireAdmin>
              <FoodAddPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cms/foods/edit/:id"
          element={
            <ProtectedRoute requireAdmin>
              <FoodEditPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;