import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../admin/styles/HeaderAdmin.css';

const HeaderAdmin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData && userData.id) {
      axios.get(`http://localhost:8080/auth/getById/${userData.id}`)
        .then(response => {
          const fetchedUser = response.data;

          if (fetchedUser.auth_role !== 'Admin') {
            // Điều hướng nếu không phải là admin
            navigate('/auth');
            return;
          }

          setUser(fetchedUser); // Đặt dữ liệu người dùng khi thành công
        })
        .catch(error => {
          console.error('Error fetching user:', error);
          navigate('/auth'); // Điều hướng nếu xảy ra lỗi
        });
    } else {
      navigate('/auth'); // Điều hướng nếu không có thông tin người dùng
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/auth'); // Điều hướng về trang đăng nhập sau khi đăng xuất
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
              <Link className="nav-link" to="/admin/index">Trang chủ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/customer">Khách hàng</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/product">Sản phẩm</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/category">Danh mục</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/brand">Thương hiệu</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/order">Đơn hàng</Link>
            </li>
          </ul>
          {user ? (
            <div className="dropdown">
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
                <li><Link className="dropdown-item" to="/auth" onClick={confirmLogout}>Đăng xuất</Link></li>
              </ul>
            </div>
          ) : (
            <Link className="btn btn-primary" to="/auth">Đăng nhập</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderAdmin;
