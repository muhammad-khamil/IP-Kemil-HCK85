import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import http from "../libraries/http";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await http.post("/login", { email, password });

      // Simpan token dan role
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullname", data.fullname); // kalau ada

      Swal.fire("Berhasil Login", "", "success").then(() => {
        window.location.reload();
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal Login", err.response?.data?.message || "Terjadi kesalahan", "error");
    }
  };

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    // panggil axios untuk kirim token ke server dan ditukerin sama access token aplikasi kita

    try {
      const balikan = await http.post('/google-login', {
        googleToken: response.credential
      });
      console.log(balikan);

      // Simpan token, role, dan fullname
      localStorage.setItem('access_token', balikan.data.access_token);
      localStorage.setItem('role', balikan.data.role);
      localStorage.setItem('fullname', balikan.data.fullname);

      Swal.fire("Berhasil Login", "", "success").then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error, "<<<");

      let errorMessage = 'Something went wrong!';
      if (error.response) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Close'
      });
    }
  }
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "935582159034-4tts57bpju4e6eaii6eerri6e6qj7vna.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });

    // nampilkan tombol Google Sign-In di div yg sudah kita siapkan
    google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      { theme: "outline", size: "large" }  // customization attributes
    );

  }, []);

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
      style={{
        background: 'linear-gradient(135deg, #2c5530 0%, #3c5a3c 25%, #4a6b4a 50%, #5a7c5a 75%, #6b8e6b 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* Food Pattern Background */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-15-5c0 2.761-2.239 5-5 5s-5-2.239-5-5 2.239-5 5-5 5 2.239 5 5z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      ></div>

      {/* Floating Food Icons */}
      <div className="position-absolute w-100 h-100" style={{ zIndex: 1, pointerEvents: 'none' }}>
        {/* Pizza Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '10%',
            left: '15%',
            fontSize: '3rem',
            color: 'rgba(255, 255, 255, 0.15)',
            animation: 'float 6s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        >
          🍕
        </div>
        
        {/* Burger Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '20%',
            right: '20%',
            fontSize: '2.5rem',
            color: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 8s ease-in-out infinite reverse',
            pointerEvents: 'none'
          }}
        >
          🍔
        </div>

        {/* Restaurant Icon */}
        <div 
          className="position-absolute"
          style={{
            bottom: '15%',
            left: '10%',
            fontSize: '2.8rem',
            color: 'rgba(255, 255, 255, 0.12)',
            animation: 'float 7s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        >
          🏪
        </div>

        {/* Utensils Icon */}
        <div 
          className="position-absolute"
          style={{
            bottom: '25%',
            right: '15%',
            fontSize: '2.2rem',
            color: 'rgba(255, 255, 255, 0.08)',
            animation: 'float 5s ease-in-out infinite reverse',
            pointerEvents: 'none'
          }}
        >
          🍽️
        </div>

        {/* Chef Hat Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '45%',
            left: '5%',
            fontSize: '2rem',
            color: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 9s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        >
          👨‍🍳
        </div>

        {/* Coffee Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '60%',
            right: '8%',
            fontSize: '2.3rem',
            color: 'rgba(255, 255, 255, 0.12)',
            animation: 'float 6.5s ease-in-out infinite reverse',
            pointerEvents: 'none'
          }}
        >
          ☕
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(5deg);
          }
          66% {
            transform: translateY(-10px) rotate(-3deg);
          }
        }
      `}</style>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div 
              className="card shadow-lg border-0"
              style={{
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                position: 'relative',
                zIndex: 20
              }}
            >
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(45deg, #3c5a3c, #5a7c5a)',
                      boxShadow: '0 8px 20px rgba(60, 90, 60, 0.3)'
                    }}
                  >
                    <i className="bi bi-person-fill text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h2 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Welcome Back</h2>
                  <p className="text-muted mb-0">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      <i className="bi bi-envelope me-2" style={{ color: '#3c5a3c' }}></i>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        padding: '12px 16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #3c5a3c';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(60, 90, 60, 0.25)';
                        e.target.style.backgroundColor = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9ecef';
                        e.target.style.boxShadow = 'none';
                        e.target.style.backgroundColor = '#f8f9fa';
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      <i className="bi bi-lock me-2" style={{ color: '#3c5a3c' }}></i>
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e9ecef',
                        padding: '12px 16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f8f9fa'
                      }}
                      onFocus={(e) => {
                        e.target.style.border = '2px solid #3c5a3c';
                        e.target.style.boxShadow = '0 0 0 0.2rem rgba(60, 90, 60, 0.25)';
                        e.target.style.backgroundColor = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.border = '2px solid #e9ecef';
                        e.target.style.boxShadow = 'none';
                        e.target.style.backgroundColor = '#f8f9fa';
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="btn btn-lg w-100 fw-bold mb-3"
                    style={{
                      background: 'linear-gradient(45deg, #3c5a3c, #5a7c5a)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '1.1rem',
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      boxShadow: '0 8px 20px rgba(60, 90, 60, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 24px rgba(60, 90, 60, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 20px rgba(60, 90, 60, 0.3)';
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center mb-3">
                  <div className="d-flex align-items-center">
                    <hr className="flex-grow-1" style={{ height: '1px', backgroundColor: '#dee2e6' }} />
                    <span className="px-3 text-muted fw-semibold">OR</span>
                    <hr className="flex-grow-1" style={{ height: '1px', backgroundColor: '#dee2e6' }} />
                  </div>
                </div>

                {/* Google Login */}
                <div className="text-center mb-4">
                  <div 
                    id="google-btn" 
                    className="d-flex justify-content-center"
                    style={{
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                  ></div>
                </div>

                {/* Footer */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account? 
                    <a 
                      href="/register" 
                      className="text-decoration-none fw-semibold ms-1"
                      style={{ color: '#3c5a3c' }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      Create one here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}