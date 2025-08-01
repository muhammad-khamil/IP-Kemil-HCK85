import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import http from "../libraries/http";
import SidebarCMS from "../components/SidebarCMS";

export default function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
    fetchRestaurants();
  }, []);

  const fetchFoods = async () => {
    try {
      const { data } = await http.get("/cms/foods");
      setFoods(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data makanan", "error");
    }
  };

  const fetchRestaurants = async () => {
    try {
      const { data } = await http.get("/cms/restaurants");
      setRestaurants(data);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  // Function to get restaurant name by ID
  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : 'N/A';
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin hapus?",
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
    });

    if (confirm.isConfirmed) {
      try {
        await http.delete(`/cms/foods/${id}`);
        Swal.fire("Berhasil", "Makanan dihapus", "success");
        fetchFoods();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", err.response?.data?.message || "Gagal menghapus makanan", "error");
      }
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div style={{ width: "250px", flexShrink: 0 }}>
        <SidebarCMS />
      </div>

      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">🍽️ Daftar Makanan</h2>

        <button
          className="btn btn-success mb-3"
          onClick={() => navigate("/cms/foods/add")}
        >
          ➕ Tambah Makanan
        </button>

                <table className="table table-bordered table-striped">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Gambar</th>
                            <th>Nama</th>
                            <th>Deskripsi</th>
                            <th>Kategori</th>
                            <th>Restoran</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foods.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">Tidak ada makanan.</td>
                            </tr>
                        ) : (
                            foods.map((food) => (
                                <tr key={food.id}>
                                    <td className="text-center">
                                        <img
                                            src={food.imageUrl || 'https://via.placeholder.com/80x60?text=No+Image'}
                                            alt={food.name}
                                            style={{ 
                                                width: '80px', 
                                                height: '60px', 
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80x60?text=No+Image';
                                            }}
                                        />
                                    </td>
                                    <td>{food.name}</td>
                                    <td>
                                        <span 
                                            title={food.description}
                                            style={{ 
                                                display: 'block',
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {food.description}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge" style={{ backgroundColor: '#3c5a3c' }}>
                                            {food.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-primary fw-semibold">
                                            {getRestaurantName(food.restaurantId)}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    backgroundColor: '#f39c12',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    boxShadow: '0 2px 4px rgba(243, 156, 18, 0.3)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => navigate(`/cms/foods/edit/${food.id}`)}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#e67e22';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                    e.target.style.boxShadow = '0 4px 8px rgba(243, 156, 18, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#f39c12';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 2px 4px rgba(243, 156, 18, 0.3)';
                                                }}
                                            >
                                                <i className="bi bi-pencil-square me-1"></i>
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    backgroundColor: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 12px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: '500',
                                                    boxShadow: '0 2px 4px rgba(231, 76, 60, 0.3)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => handleDelete(food.id)}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#c0392b';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                    e.target.style.boxShadow = '0 4px 8px rgba(231, 76, 60, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#e74c3c';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 2px 4px rgba(231, 76, 60, 0.3)';
                                                }}
                                            >
                                                <i className="bi bi-trash me-1"></i>
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
      </div>
    </div>
  );
}