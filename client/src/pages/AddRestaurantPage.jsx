import http from "../libraries/http";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import SidebarCMS from "../components/SidebarCMS";
import RestaurantForm from "../components/RestaurantForm";

export default function AddRestaurantPage() {
    const navigate = useNavigate();

    const handleAdd = async (formData, isFormData = false) => {
        try {
            const config = isFormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            } : {};
            
            await http.post("/cms/restaurants", formData, config);
            Swal.fire({
                title: "Sukses!",
                text: "Restoran berhasil ditambahkan.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/cms/restaurants");
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Gagal menambahkan restoran",
                icon: "error",
                confirmButtonText: "Close",
            });
        }
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '250px', flexShrink: 0 }}>
                <SidebarCMS />
            </div>
            <div className="flex-grow-1 p-4" style={{ overflow: 'auto' }}>
                <div className="container">
                    <h2>➕ Tambah Restoran</h2>
                    <RestaurantForm onSubmit={handleAdd} />
                </div>
            </div>
        </div>
    );
}