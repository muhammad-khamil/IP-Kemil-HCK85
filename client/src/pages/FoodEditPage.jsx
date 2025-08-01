import FoodForm from "../components/FoodForm";
import SidebarCMS from "../components/SidebarCMS";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import http from "../libraries/http";

export default function FoodEditPage() {
  const { id: foodId } = useParams(); // ✅ rename langsung ke foodId
  const navigate = useNavigate();
  const [food, setFood] = useState(null);

  useEffect(() => {
    http.get(`/cms/foods/${foodId}`)
      .then(res => {
        setFood(res.data);
      })
      .catch(err => {
        console.error("Error fetching food data:", err);
      });
  }, [foodId]);

  const handleEditSubmit = async (form, isFormData = false) => {
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    await http.put(`/cms/foods/${foodId}`, form, config); // 🟢 ini update datanya
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <SidebarCMS />
      </div>

      <div className="flex-grow-1 p-4" style={{ overflow: 'auto' }}>
        <div className="container">
          <h2 className="mb-4">✏️ Edit Makanan</h2>

          {food && (
            <FoodForm
              type="edit"
              initialForm={food}
              onSubmit={handleEditSubmit}
              onSuccess={() => navigate(`/cms/foods`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}