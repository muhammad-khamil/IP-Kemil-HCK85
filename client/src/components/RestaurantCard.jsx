import { Link } from "react-router";

export default function RestaurantCard({ restaurant }) {
  const ratingStars = "⭐".repeat(Math.round(restaurant.rating));

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm hover-shadow transition-all">
        <div className="position-relative">
          <img
            src={restaurant.imageUrl}
            className="card-img-top"
            alt={restaurant.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-primary fs-6 px-2 py-1">
              {ratingStars}
            </span>
          </div>
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className="badge bg-dark text-white">
              {restaurant.category}
            </span>
          </div>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title mb-1 fw-bold">{restaurant.name}</h5>
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-geo-alt text-primary me-1"></i>
            <small className="text-muted">{restaurant.address}</small>
          </div>
          <Link 
            to={`/restaurant/${restaurant.id}`} 
            className="btn btn-outline-primary w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
          >
            Lihat Detail
            <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}