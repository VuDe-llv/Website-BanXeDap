import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';

const CustomerProfile = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.id) {
      const fetchUser = async () => {
        try {
          const userResponse = await axios.get(`http://localhost:8080/auth/getById/${userData.id}`);
          setUser(userResponse.data);
          setValue('auth_name', userResponse.data.auth_name);
          setValue('auth_phone', userResponse.data.auth_phone);
          setValue('auth_address', userResponse.data.auth_address);
          setValue('auth_email', userResponse.data.auth_email);
        } catch (error) {
          console.error('Error fetching user:', error);
          toast.error('Không thể tải dữ liệu người dùng.');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    } else {
      console.error('Dữ liệu người dùng không có sẵn hoặc id không xác định');
      setLoading(false);
    }
  }, [setValue]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const onSubmit = async (data) => {
    const customer = { ...data };
    const formData = new FormData();
    formData.append('auth_name', customer.auth_name);
    formData.append('auth_email', customer.auth_email); // Keep the email in the formData even though it's read-only
    formData.append('auth_phone', customer.auth_phone);
    formData.append('auth_address', customer.auth_address);
    if (image) {
      formData.append('auth_image', image);
    }

    try {
      await axios.put(`http://localhost:8080/auth/update/${user.auth_id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setUser({ ...user, ...customer });
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      toast.error('Cập nhật không thành công.');
    }
  };

  return (
    <div className="container pt-5 pb-5">
      {loading ? (
        <p>Đang tải thông tin người dùng...</p>
      ) : user ? (
        <div className="profile-wrapper p-3 mb-3">
          <div className="text-center mb-3">
            <img
              src={`http://localhost:8080/auth/images/${user.auth_image}`}
              alt={user.auth_name}
              className="rounded-circle mt-5"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
          </div>
          <div className="d-flex justify-content-end align-items-center">
            <button className="btn btn-outline-primary btn-sm" onClick={handleEdit}>
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="row">
            <div className="col-md-6 mb-3">
              <label>Tên khách hàng</label>
              <input
                type="text"
                className="form-control"
                {...register('auth_name', { required: 'Tên là bắt buộc' })}
                readOnly={!isEditing}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                {...register('auth_email')}
                readOnly={true} // Set as always read-only
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Số điện thoại</label>
              <input
                type="text"
                className="form-control"
                {...register('auth_phone')}
                readOnly={!isEditing}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Địa chỉ</label>
              <input
                type="text"
                className="form-control"
                {...register('auth_address')}
                readOnly={!isEditing}
              />
            </div>

            {isEditing && (
              <div className="col-md-6 mb-3">
                <label>Hình ảnh</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>
            )}

            {isEditing && (
              <div className="col-md-12 d-flex justify-content-end mb-3">
                <button type="submit" className="btn btn-success me-2">Cập nhật</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Hủy</button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <p>Không tìm thấy thông tin người dùng.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default CustomerProfile;
