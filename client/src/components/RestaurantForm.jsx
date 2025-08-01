import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

export default function RestaurantForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    category: "",
    imageUrl: "",
    rating: "",
  });
  const [imageFile, setImageFile] = useState(null);

  // Set initial form data only when component mounts or initialData changes
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      console.log('Setting initial data:', initialData);
      setForm({
        name: initialData.name || "",
        address: initialData.address || "",
        category: initialData.category || "",
        imageUrl: initialData.imageUrl || "",
        rating: initialData.rating || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    console.log('form update:', newForm);
    setForm(newForm);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData if there's a file, otherwise send regular form data
    if (imageFile) {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('address', form.address);
      formData.append('category', form.category);
      formData.append('rating', form.rating);
      formData.append('image', imageFile); // Backend expects 'image' field
      
      onSubmit(formData, true); // Second parameter indicates it's FormData
    } else {
      onSubmit(form, false); // Regular JSON data
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Nama Restoran</label>
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
        <label className="form-label">Alamat</label>
        <input
          type="text"
          className="form-control"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
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

      {/* Image Upload Component */}
      <ImageUpload
        label="Gambar Restoran"
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
        <label className="form-label">Rating (1-5) <span className="text-danger">*</span></label>
        <select
          className="form-select"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          required
        >
          <option value="">Pilih rating...</option>
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Simpan
      </button>
    </form>
  );
}