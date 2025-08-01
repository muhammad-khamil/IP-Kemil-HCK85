import { useNavigate, useParams } from "react-router";
import SidebarCMS from "../components/SidebarCMS";
import FoodForm from "../components/FoodForm";

export default function AddFoodPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(`/cms/restaurants/foods/${restaurantId}`);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <SidebarCMS />
      </div>
      <div className="flex-grow-1 p-4" style={{ overflow: 'auto' }}>
        <div className="container">
          <h2>➕ Tambah Menu Makanan</h2>
          <div className="row">
            <div className="col-md-6">
              <FoodForm
                type="add"
                restaurantId={restaurantId}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
