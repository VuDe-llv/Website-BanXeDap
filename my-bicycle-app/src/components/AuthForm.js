import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AuthForm.css';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAddress, setAuthAddress] = useState('');
  const [authWard, setAuthWard] = useState('');
  const [authDistrict, setAuthDistrict] = useState('');
  const [authCity, setAuthCity] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9.]+@gmail\.com$/;
  const phoneRegex = /^[0-9]{10}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
  
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }
  
    if (isRegister && !authPhone) {
      toast.error("Số điện thoại không thể để trống");
      return;
    }  
  
    if (isRegister) {
      if (password !== confirmPassword) {
        toast.error("Mật khẩu chưa chính xác.");
        return;
      }
  
      if (!passwordRegex.test(password)) {
        toast.error("Mật khẩu phải chứa từ 8 đến 20 ký tự, bao gồm cả chữ và số.");
        return;
      }
  
      const fullAddress = `${authAddress ? authAddress + ', ' : ''}${authWard}, ${authDistrict}, ${authCity}`;
      try {
        const response = await axios.post('http://localhost:8080/auth/register', {
          auth_email: email,
          auth_password: password,
          auth_password_confirmation: confirmPassword,
          auth_name: authName,
          auth_phone: authPhone,
          auth_address: fullAddress,
        });
  
        toast.success("Đăng ký thành công!");
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAuthName('');
        setAuthPhone('');
        setAuthAddress('');
        setAuthWard(''); 
        setAuthDistrict(''); 
        setAuthCity(''); 
        setIsRegister(false);
        setShowPassword(false);
      } catch (error) {
        toast.error(`Đăng ký thất bại: ${error.response.data || error.message}`);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8080/auth/login', {
          auth_email: email,
          auth_password: password,
        });
        const { auth_role, auth_id, auth_name, auth_email, auth_image } = response.data;
  
        localStorage.setItem('user', JSON.stringify({ id: auth_id, name: auth_name, email: auth_email, image: auth_image }));
        toast.success("Đăng nhập thành công!");
  
        if (auth_role === 'User') {
          navigate('/userpage/index');
        } else if (auth_role === 'Admin') {
          navigate('/admin/index');
        }
      } catch (error) {
        toast.error(`Đăng nhập thất bại: ${error.response.data || error.message}`);
      }
    }
  };  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="auth-form-container">
        <h3 className="text-center">{isRegister ? 'Đăng Ký' : 'Đăng Nhập'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className={isRegister ? 'col-6' : 'col-12'}>
              <div className="mb-3 pt-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-control-sm"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isRegister && (
                <div className="mb-3">
                  <label htmlFor="authPhone" className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="authPhone"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
            {isRegister && (
              <div className="col-6">
                <div className="mb-3 pt-4">
                  <label htmlFor="authName" className="form-label">Tên đăng nhập</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="authName"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control form-control-sm"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="authAddress" className="form-label">Địa chỉ cụ thể</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="authAddress"
                    value={authAddress}
                    onChange={(e) => setAuthAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>
  
          {isRegister && (
            <>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="authWard" className="form-label">Phường/Xã</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="authWard"
                      value={authWard}
                      onChange={(e) => setAuthWard(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="authDistrict" className="form-label">Quận/Huyện</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="authDistrict"
                      value={authDistrict}
                      onChange={(e) => setAuthDistrict(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="authCity" className="form-label">Tỉnh/Thành Phố</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="authCity"
                      value={authCity}
                      onChange={(e) => setAuthCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}
  
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPasswordCheck"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label" htmlFor="showPasswordCheck">
              Hiển thị mật khẩu
            </label>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              {isRegister ? 'Đăng Ký' : 'Đăng Nhập'}
            </button>
          </div>
        </form>
        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Đã có tài khoản? Đăng Nhập' : 'Chưa có tài khoản? Đăng Ký'}
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );  
};

export default AuthForm;
