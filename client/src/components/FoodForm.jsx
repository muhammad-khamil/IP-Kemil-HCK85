import { useEffect, useState } from "react";
import http from "../libraries/http";
import { useNavigate } from "react-router";
import ImageUpload from "./ImageUpload";

export default function FoodForm({ onSubmit, initialForm = {} }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    restaurantId: ""
  });

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  // Cegah infinite loop dengan cek id
  useEffect(() => {
    if (initialForm && initialForm.id && initialForm.id !== form.id) {
      setForm((prev) => ({
        ...prev,
        ...initialForm,
      }));
    }
  }, [initialForm]);

  // Ambil data restoran
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await http.get("/public/restaurants");
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleImageUpload = (imageData) => {
    if (typeof imageData === 'string') {
      // It's a URL
      setForm(prev => ({
        ...prev,
        imageUrl: imageData
      }));
      setImageFile(null);
    } else if (imageData instanceof File) {
      // It's a file
      setImageFile(imageData);
      setForm(prev => ({
        ...prev,
        imageUrl: '' // Clear URL when file is selected
      }));
    } else {
      // Clear both
      setImageFile(null);
      setForm(prev => ({
        ...prev,
        imageUrl: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create FormData if there's a file, otherwise send regular form data
      if (imageFile) {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('category', form.category);
        formData.append('restaurantId', form.restaurantId);
        formData.append('image', imageFile); // Backend expects 'image' field
        
        await onSubmit(formData, true); // Second parameter indicates it's FormData
      } else {
        await onSubmit(form, false); // Regular JSON data
      }
      navigate("/cms/foods"); // pastikan route ini valid
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-3">
        <label className="form-label">Nama Makanan</label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Deskripsi</label>
        <textarea
          className="form-control"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Image Upload Component */}
      <ImageUpload
        label="Gambar Makanan"
        currentImageUrl={form.imageUrl}
        onImageUploaded={handleImageUpload}
      />

      {/* Manual Image URL Input (Alternative) */}
      <div className="mb-3">
        <label className="form-label">
          <i className="bi bi-link-45deg me-2"></i>
          Atau masukkan URL gambar manual
        </label>
        <input
          type="url"
          className="form-control"
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Kategori</label>
        <input
          type="text"
          className="form-control"
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Restoran</label>
        <select
          className="form-select"
          name="restaurantId"
          value={form.restaurantId || ""}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            {loading ? "Loading..." : "Pilih restoran"}
          </option>
          {restaurants.map((resto) => (
            <option key={resto.id} value={resto.id}>
              {resto.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        {initialForm?.id ? "💾 Simpan" : "➕ Tambah"}
      </button>
    </form>
  );
}