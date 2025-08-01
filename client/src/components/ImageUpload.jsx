import { useState } from "react";
import Swal from "sweetalert2";

export default function ImageUpload({ onImageUploaded, currentImageUrl = "", label = "Upload Image" }) {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire('Error', 'Hanya file gambar yang diperbolehkan (JPG, PNG, GIF)', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'Ukuran file maksimal 5MB', 'error');
      return;
    }

    // Create preview
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);

    // Pass the file object to parent component so it can be included in FormData
    onImageUploaded(file);
    
    Swal.fire('Sukses', 'File gambar berhasil dipilih! Gambar akan diupload saat form disimpan.', 'success');
  };

  const handleManualUrl = async () => {
    const { value: manualUrl } = await Swal.fire({
      title: 'Masukkan URL Gambar',
      input: 'url',
      inputPlaceholder: 'https://example.com/image.jpg',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'URL tidak boleh kosong!'
        }
        if (!value.match(/\.(jpeg|jpg|gif|png)$/)) {
          return 'URL harus berupa link gambar yang valid!'
        }
      }
    });

    if (manualUrl) {
      setPreviewUrl(manualUrl);
      setSelectedFile(null); // Clear file if using URL
      onImageUploaded(manualUrl);
      Swal.fire('Sukses', 'URL gambar berhasil ditambahkan!', 'success');
    }
  };

  const clearImage = () => {
    setPreviewUrl('');
    setSelectedFile(null);
    onImageUploaded(null);
    
    // Clear file input
    const fileInput = document.getElementById('image-upload-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="mb-3">
      <label className="form-label d-flex align-items-center gap-2">
        <i className="bi bi-cloud-upload"></i>
        {label}
      </label>
      
      {/* Preview Section */}
      {previewUrl && (
        <div className="mb-3 position-relative" style={{ maxWidth: '300px' }}>
          <img
            src={previewUrl}
            alt="Preview"
            className="img-fluid rounded shadow-sm"
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Error';
            }}
          />
          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
            onClick={clearImage}
            title="Hapus gambar"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}

      {/* Upload Options */}
      <div className="d-flex gap-2 mb-2">
        <div className="flex-grow-1">
          <input
            id="image-upload-input"
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileSelect}
          />
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleManualUrl}
          title="Gunakan URL manual"
        >
          <i className="bi bi-link-45deg"></i>
        </button>
      </div>

      <small className="form-text text-muted">
        📁 Upload file atau 🔗 gunakan URL. Format: JPG, PNG, GIF. Maksimal 5MB.
      </small>
    </div>
  );
}
