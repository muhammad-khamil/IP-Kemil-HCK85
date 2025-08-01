import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import http from "../libraries/http";
import NavbarPublic from "../components/NavbarPublic";
import Swal from "sweetalert2";
import ReviewForm from "../components/ReviewForm";

export default function DetailPage() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const { data } = await http.get(`/public/restaurants/${id}`);
            setRestaurant(data);
        } catch (err) {
            console.error("Gagal fetch detail restoran:", err);
        }
    };

    if (!restaurant) {
        return (
            <>
                <NavbarPublic />
                <div className="container mt-5">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <NavbarPublic />

            {/* Hero Section with Restaurant Info */}
            <div className="text-white py-5 mb-4 position-relative" style={{
                background: 'linear-gradient(rgba(39, 56, 38, 0.92), rgba(39, 56, 38, 0.85)), url("https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <div className="position-relative">
                                <img
                                    src={restaurant.imageUrl}
                                    className="img-fluid rounded-3"
                                    alt={restaurant.name}
                                    style={{ 
                                        width: "100%", 
                                        height: "400px", 
                                        objectFit: "cover",
                                        border: '5px solid rgba(255,255,255,0.2)',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                    }}
                                />
                                <div className="position-absolute top-0 end-0 m-3">
                                    <span className="badge" style={{ 
                                        backgroundColor: 'rgba(60, 90, 60, 0.95)',
                                        backdropFilter: 'blur(5px)',
                                        fontSize: '1.1rem',
                                        padding: '0.5rem 1rem'
                                    }}>
                                        <i className="bi bi-award me-2"></i>
                                        {restaurant.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 ps-md-5">
                            <div className="mb-4">
                                <h1 className="display-4 fw-bold mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                    {restaurant.name}
                                </h1>
                                <div className="d-flex align-items-center mb-3" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                                    <i className="bi bi-geo-alt-fill text-white me-2 fs-5"></i>
                                    <p className="lead mb-0">{restaurant.address}</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-4" style={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(5px)',
                                padding: '1rem',
                                borderRadius: '10px'
                            }}>
                                <div>
                                    <div className="fs-4 mb-1 text-warning" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                                        {"⭐".repeat(Math.round(restaurant.rating))}
                                    </div>
                                    <span className="text-white-50">({restaurant.rating}/5)</span>
                                </div>
                                <div className="vr bg-white opacity-25"></div>
                                <div>
                                    <div className="fs-4 mb-1">
                                        <i className="bi bi-chat-quote-fill me-2"></i>
                                        {restaurant.RestaurantReviews?.length || 0}
                                    </div>
                                    <span className="text-white-50">Ulasan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Menu Section */}
                <section className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0 d-flex align-items-center" style={{ color: '#3c5a3c' }}>
                            <i className="bi bi-cup-hot me-2"></i>
                            Menu Makanan
                        </h2>
                        <span className="badge fs-6" style={{ 
                            backgroundColor: '#3c5a3c',
                            padding: '0.5rem 1rem',
                            borderRadius: '50px'
                        }}>
                            <i className="bi bi-menu-button-wide me-2"></i>
                            {restaurant.Food?.length || 0} Menu
                        </span>
                    </div>

                    <div className="row g-4">
                        {restaurant.Food?.length === 0 ? (
                            <div className="col-12 text-center py-5" style={{ 
                                backgroundColor: 'rgba(60, 90, 60, 0.05)',
                                borderRadius: '15px',
                                padding: '3rem'
                            }}>
                                <i className="bi bi-clock-history display-1 mb-3" style={{ color: '#3c5a3c' }}></i>
                                <h3 style={{ color: '#3c5a3c' }}>Belum ada menu tersedia</h3>
                                <p className="text-muted">Menu akan segera ditambahkan</p>
                            </div>
                        ) : (
                            restaurant.Food.map((food) => (
                                <div className="col-md-6 col-lg-4" key={food.id}>
                                    <div className="card h-100 shadow-sm hover-shadow transition-all">
                                        <div className="position-relative">
                                            <img
                                                src={food.imageUrl}
                                                className="card-img-top"
                                                alt={food.name}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                            <span className="position-absolute top-0 end-0 m-2 badge bg-dark">
                                                {food.category}
                                            </span>
                                        </div>
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title mb-2">{food.name}</h5>
                                            <p className="card-text text-muted mb-3 small">{food.description}</p>
                                            <div className="mt-auto d-flex gap-2">
                                                <button
                                                    className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                                    onClick={async () => {
                                                        try {
                                                            const { data } = await http.get(`/public/menu/nutrition?name=${food.name}`);
                                                            let nutritionHtml = '';
                                                            if (data && typeof data === 'object') {
                                                                nutritionHtml = `<table class='table table-bordered'><tbody>`;
                                                                Object.entries(data).forEach(([key, value]) => {
                                                                    nutritionHtml += `<tr><th style='text-transform:capitalize'>${key.replace(/_/g, ' ')}</th><td>${value}</td></tr>`;
                                                                });
                                                                nutritionHtml += `</tbody></table>`;
                                                            } else {
                                                                nutritionHtml = '<p>Data nutrisi tidak tersedia.</p>';
                                                            }

                                                            Swal.fire({
                                                                title: `Nutrisi untuk ${food.name}`,
                                                                html: nutritionHtml,
                                                                customClass: { popup: 'text-start' },
                                                                width: 600
                                                            });
                                                        } catch (err) {
                                                            Swal.fire('Gagal', 'Gagal mengambil data nutrisi', 'error');
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-info-circle"></i>
                                                    Lihat Nutrisi
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                                                    onClick={async () => {
                                                        if (!localStorage.getItem("access_token")) {
                                                            return Swal.fire({
                                                                title: "Login Dulu",
                                                                text: "Kamu harus login untuk menyimpan favorit.",
                                                                icon: "warning",
                                                            });
                                                        }

                                                        try {
                                                            await http.post(`/public/favorites`, { foodId: food.id });
                                                            Swal.fire("Sukses", `${food.name} ditambahkan ke favorit!`, "success");
                                                        } catch (err) {
                                                            console.error("AxiosError detail:", err.response?.data || err.message);
                                                            Swal.fire("Gagal", (err.response?.data?.message || "Gagal menambahkan ke favorit"), "error");
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-heart"></i>
                                                    Favorit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">
                            <i className="bi bi-chat-quote me-2"></i>
                            Ulasan Pengunjung
                        </h2>
                        <span className="badge bg-primary fs-6">
                            {restaurant.RestaurantReviews?.length || 0} Ulasan
                        </span>
                    </div>

                    <div className="row g-4 mb-5">
                        {restaurant.RestaurantReviews?.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <i className="bi bi-chat-dots display-1 text-muted mb-3"></i>
                                <h3>Belum ada ulasan</h3>
                                <p className="text-muted">Jadilah yang pertama memberikan ulasan!</p>
                            </div>
                        ) : (
                            restaurant.RestaurantReviews.map((review) => (
                                <div className="col-md-6" key={review.id}>
                                    <div className="card h-100 shadow-sm border-0 bg-light">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-primary text-white rounded-circle p-2 me-3">
                                                    <i className="bi bi-person-circle fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0">{review.User?.fullname}</h6>
                                                    <small className="text-muted">{review.User?.email}</small>
                                                </div>
                                            </div>
                                            <p className="card-text mb-0 fst-italic">"{review.comment}"</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Review Form Section */}
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <h3 className="card-title mb-4">
                                <i className="bi bi-pencil-square me-2"></i>
                                Tulis Ulasan
                            </h3>
                            <ReviewForm restaurantId={id} onSuccess={fetchRestaurant} />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}