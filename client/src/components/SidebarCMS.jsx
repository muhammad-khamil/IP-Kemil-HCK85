import { Link, useNavigate } from "react-router";

export default function SidebarCMS() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px", position: "fixed" }}>
      <h4 className="mb-4">Manganlur CMS</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/cms/restaurants">📍 Restaurants</Link>
        </li>
        <li className="nav-item mb-2">
          <Link className="nav-link text-white" to="/cms/foods">🍜 Foods</Link>
        </li>
        <li className="nav-item mt-4">
          <button className="btn btn-danger w-100" onClick={handleLogout}>🚪 Logout</button>
        </li>
      </ul>
    </div>
  );
}