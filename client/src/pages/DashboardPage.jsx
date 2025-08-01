import { useState, useEffect } from "react";
import SidebarCMS from "../components/SidebarCMS";
import http from "../libraries/http";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalFoods: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch data secara parallel
      const [restaurantsRes, foodsRes, usersRes] = await Promise.all([
        http.get('/cms/restaurants'),
        http.get('/cms/foods')
      ]);

      setStats({
        totalRestaurants: restaurantsRes.data.length || 0,
        totalFoods: foodsRes.data.length || 0,
        totalUsers: usersRes.data.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Jika endpoint users tidak ada, coba tanpa users
      try {
        const [restaurantsRes, foodsRes] = await Promise.all([
          http.get('/cms/restaurants'),
          http.get('/cms/foods')
        ]);

        setStats({
          totalRestaurants: restaurantsRes.data.length || 0,
          totalFoods: foodsRes.data.length || 0
        });
      } catch (err) {
        console.error('Error fetching basic stats:', err);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="d-flex">
      <SidebarCMS />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        <h2 className="mb-4">📊 Dashboard Admin</h2>

        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Total Restaurants</h5>
                <p className="card-text fs-4 fw-bold text-primary">
                  {loading ? '⏳ Loading...' : `${stats.totalRestaurants} restoran`}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Total Foods</h5>
                <p className="card-text fs-4 fw-bold text-success">
                  {loading ? '⏳ Loading...' : `${stats.totalFoods} menu`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}