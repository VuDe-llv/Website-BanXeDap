import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from '../admin/styles/Footer.css';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <div className="row">
                    {/* About */}
                    <div className="col-md-4">
                        <h5>Về Chúng Tôi</h5>
                        <p>Shop Xe Đạp chuyên cung cấp các dòng xe đạp thể thao, phụ kiện và phụ tùng chất lượng cao. Đảm bảo sản phẩm chính hãng và dịch vụ tận tình.</p>
                    </div>

                    {/* Useful Links */}
                    <div className="col-md-2">
                        <h5>Liên Kết</h5>
                        <ul>
                            <li><a href="#">Trang chủ</a></li>
                            <li><a href="#">Xe đạp</a></li>
                            <li><a href="#">Thương hiệu</a></li>
                            <li><a href="#">Liên hệ</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-3">
                        <h5>Liên Hệ</h5>
                        <p><i className="fa fa-map-marker-alt"></i> Địa chỉ: 23/1, Trần Thị Thu, Phường 4, TP. Cao Lãnh</p>
                        <p><i className="fa fa-phone"></i> SĐT: 0907 89 1780</p>
                        <p><i className="fa fa-envelope"></i> Email: lailamvu2003@gmail.com</p>
                    </div>

                    {/* Social Media */}
                    <div className="col-md-3">
                        <h5>Kết Nối Với Chúng Tôi</h5>
                        <div className="footer-social-icons">
                            <a href="#"><i className="fab fa-facebook"></i></a>
                            <a href="#"><i className="fab fa-instagram"></i></a>
                            <a href="#"><i className="fab fa-twitter"></i></a>
                            <a href="#"><i className="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col">
                        <p className="footer-bottom">&copy; 2024 Shop Xe Đạp - lailam2003@gmail.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
