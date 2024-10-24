import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../admin/styles/HeaderUser.css';

const HeaderUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.id) {
      // Fetch user data only if the user is logged in
      axios.get(`http://localhost:8080/auth/getById/${userData.id}`)
        .then(response => {
          setUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const confirmLogout = () => {
    if (window.confirm("Bạn có đồng ý đăng xuất không?")) {
      handleLogout();
    }
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container px-0">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/userpage/index">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/userpage/product-all">Sản phẩm</Link>
            </li>
          </ul>
          <div className="dropdown">
            {user ? (
              <>
                <Link className="nav-link dropdown-toggle" to="#" id="avatarDropdown" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="me-2">{user.auth_name}</span>
                  <img 
                    src={`http://localhost:8080/auth/images/${user.auth_image}`} 
                    alt="Avatar" 
                    width="30" 
                    height="30" 
                    className="rounded-circle" 
                  />
                </Link>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="avatarDropdown">
                  <li><Link className="dropdown-item" to="/userpage/profile">Tài khoản</Link></li>
                  <li><Link className="dropdown-item" to="/userpage/order">Đơn mua</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="#" onClick={confirmLogout}>Đăng xuất</Link></li>
                </ul>
              </>
            ) : (
              <Link className="btn btn-primary" to="/auth">Đăng nhập</Link>
            )}
          </div>

          {user && (
            <Link className="nav-link nav-link-cart ps-2" to="/userpage/shoppingcart">
              <i className="fa-solid fa-cart-shopping"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderUser;
