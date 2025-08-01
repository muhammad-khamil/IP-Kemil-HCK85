import { useState } from "react";
import { useNavigate } from "react-router";
import http from "../libraries/http"; // pastikan axios instance lu bener brok
import Swal from "sweetalert2";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await http.post("/register", {
        fullname,
        email,
        password,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil Daftar!",
        text: "Silakan login sekarang!",
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Daftar!",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

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
        {/* Sushi Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '12%',
            left: '18%',
            fontSize: '2.8rem',
            color: 'rgba(255, 255, 255, 0.15)',
            animation: 'float 7s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        >
          🍣
        </div>
        
        {/* Taco Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '25%',
            right: '22%',
            fontSize: '2.4rem',
            color: 'rgba(255, 255, 255, 0.12)',
            animation: 'float 6s ease-in-out infinite reverse',
            pointerEvents: 'none'
          }}
        >
          🌮
        </div>

        {/* Ramen Icon */}
        <div 
          className="position-absolute"
          style={{
            bottom: '18%',
            left: '12%',
            fontSize: '2.6rem',
            color: 'rgba(255, 255, 255, 0.13)',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        >
          🍜
        </div>

        {/* Croissant Icon */}
        <div 
          className="position-absolute"
          style={{
            bottom: '28%',
            right: '18%',
            fontSize: '2.2rem',
            color: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 5.5s ease-in-out infinite reverse',
            pointerEvents: 'none'
          }}
        >
          🥐
        </div>

        {/* Pasta Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '50%',
            left: '8%',
            fontSize: '2.5rem',
            color: 'rgba(255, 255, 255, 0.11)',
            animation: 'float 9.5s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        >
          🍝
        </div>

        {/* Cake Icon */}
        <div 
          className="position-absolute"
          style={{
            top: '65%',
            right: '10%',
            fontSize: '2.1rem',
            color: 'rgba(255, 255, 255, 0.14)',
            animation: 'float 7.5s ease-in-out infinite reverse',
            pointerEvents: 'none'
          }}
        >
          🍰
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
                    <i className="bi bi-person-plus-fill text-white" style={{ fontSize: '2rem' }}></i>
                  </div>
                  <h2 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Create Account</h2>
                  <p className="text-muted mb-0">Join us today and start exploring!</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                      <i className="bi bi-person me-2" style={{ color: '#3c5a3c' }}></i>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      placeholder="Enter your full name"
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
                      placeholder="Create a strong password"
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
                    className="btn btn-lg w-100 fw-bold"
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
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account? 
                    <a 
                      href="/login" 
                      className="text-decoration-none fw-semibold ms-1"
                      style={{ color: '#3c5a3c' }}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      Sign in here
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