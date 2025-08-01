import { useState } from "react";
import Swal from "sweetalert2";
import http from "../libraries/http";
import { useNavigate } from "react-router";

export default function ReviewForm({ restaurantId, onSuccess }) {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      const result = await Swal.fire({
        title: "Login Dulu",
        text: "Kamu harus login dulu untuk mengirim ulasan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Sekarang",
        cancelButtonText: "Nanti Aja",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      Swal.fire("Peringatan", "Rating wajib diisi (1-5)", "warning");
      return;
    }

    if (!newComment.trim()) {
      Swal.fire("Peringatan", "Komentar tidak boleh kosong", "warning");
      return;
    }

    try {
      // Pre-validate review content length
      if (newComment.length < 3) {
        Swal.fire("Peringatan", "Komentar terlalu pendek, minimal 3 karakter", "warning");
        return;
      }

      // Loading state
      Swal.fire({
        title: "Mengirim Ulasan",
        text: "Mohon tunggu, kami sedang memeriksa ulasan Anda...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      // Kirim review dengan AI check
      await http.post(`/public/restaurants/${restaurantId}/reviews`, {
        comment: newComment.trim(),
        rating: rating
      });
      
      setNewComment("");
      setRating(0);
      onSuccess?.();
      Swal.fire("Sukses", "Ulasan berhasil dikirim", "success");
    } catch (err) {
      console.error("Error detail:", err.response?.data || err.message);
      
      if (err.response?.status === 403) {
        Swal.fire({
          title: "Review Ditolak",
          text: "Mohon maaf, ulasan Anda mengandung konten SARA atau kata-kata yang tidak pantas. Silakan tulis ulang dengan bahasa yang lebih sopan.",
          icon: "error"
        });
      } else {
        Swal.fire({
          title: "Gagal Mengirim Ulasan",
          text: err.response?.data?.message?.includes('GoogleGenerativeAI Error') 
            ? "Sistem moderasi konten sedang dalam perbaikan, tapi ulasan Anda tetap akan kami proses."
            : "Mohon maaf, terjadi kesalahan. Silakan coba lagi nanti.",
          icon: "error"
        });
      }
    }
  };

  return (
    <form onSubmit={handleAddReview}>
      <div className="mb-3">
        <label className="form-label">Rating <span className="text-danger">*</span></label>
        <select
          className="form-select mb-2"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          required
        >
          <option value={0}>Pilih rating...</option>
          {[1,2,3,4,5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Tulis komentarmu di sini..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-success">
        Kirim Ulasan
      </button>
    </form>
  );
}