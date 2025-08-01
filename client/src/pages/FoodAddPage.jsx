import { useNavigate } from "react-router";
import http from "../libraries/http";
import FoodForm from "../components/FoodForm";

export default function FoodAddPage() {
  const navigate = useNavigate();

  const handleAdd = async (formData, isFormData = false) => {
    const config = isFormData ? {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    } : {};
    
    await http.post("/cms/foods", formData, config);
    navigate("/cms/foods");
  };

  return (
    <div className="container mt-4">
      <h2>Tambah Makanan</h2>
      <FoodForm onSubmit={handleAdd} />
    </div>
  );
}