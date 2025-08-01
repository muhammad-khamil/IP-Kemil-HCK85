import { Link, useNavigate } from "react-router";

export default function NavbarPublic() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <nav 
      className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #2c5530 0%, #3c5a3c 50%, #4a6b4a 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid rgba(60, 90, 60, 0.3)'
      }}
    >
      <Link 
        className="navbar-brand fw-bold d-flex align-items-center"
        to="/"
        style={{
          color: 'white',
          fontSize: '1.8rem',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.textShadow = 'none';
        }}
      >
        <span 
          className="me-2"
          style={{
            display: 'inline-block',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            fontSize: '1.2rem'
          }}
        >
          🍽️
        </span>
        Manganlur
      </Link>

      <div className="ms-auto d-flex align-items-center">
        {isLoggedIn ? (
          <div className="d-flex align-items-center">
            <span 
              className="me-3 fw-semibold"
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.95rem'
              }}
            >
              Welcome back! 👋
            </span>
            <button 
              className="btn fw-semibold d-flex align-items-center"
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(231, 76, 60, 0.4)';
                e.target.style.background = 'linear-gradient(45deg, #c0392b, #a93226)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
                e.target.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
              }}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        ) : (
          <div className="d-flex gap-3">
            <Link 
              to="/login" 
              className="btn fw-semibold d-flex align-items-center text-decoration-none"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '25px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </Link>
            <Link 
              to="/register" 
              className="btn fw-semibold d-flex align-items-center text-decoration-none"
              style={{
                background: 'linear-gradient(45deg, #f39c12, #e67e22)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 20px',
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(243, 156, 18, 0.3)',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #e67e22, #d68910)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(243, 156, 18, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(45deg, #f39c12, #e67e22)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(243, 156, 18, 0.3)';
              }}
            >
              <i className="bi bi-person-plus me-2"></i>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}