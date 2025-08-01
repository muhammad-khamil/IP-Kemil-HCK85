import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Swal from "sweetalert2";
import http from "../libraries/http";
import SidebarCMS from "../components/SidebarCMS";
import RestaurantForm from "../components/RestaurantForm";

export default function EditRestaurantPage() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const { data } = await http.get(`/cms/restaurants/${id}`);
            setRestaurant(data);
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Gagal mengambil data restoran",
                icon: "error",
                confirmButtonText: "Close",
            });
        }
    };

    const handleEdit = async (formData, isFormData = false) => {
        try {
            const config = isFormData ? {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            } : {};
            
            await http.put(`/cms/restaurants/${id}`, formData, config);
            Swal.fire({
                title: "Sukses!",
                text: "Restoran berhasil diubah.",
                icon: "success",
                confirmButtonText: "OK",
            });
            navigate("/cms/restaurants");
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Gagal mengubah restoran",
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
                    <h2>✏️ Edit Restoran</h2>
                    {restaurant && <RestaurantForm onSubmit={handleEdit} initialData={restaurant} />}
                </div>
            </div>
        </div>
    );
}