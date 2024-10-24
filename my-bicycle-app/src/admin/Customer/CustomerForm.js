import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/auth/getById/${id}`)
        .then(response => {
          const customer = response.data;
          setValue('auth_name', customer.auth_name);
          setValue('auth_phone', customer.auth_phone);
          setValue('auth_address', customer.auth_address);
          setValue('auth_email', customer.auth_email);
        })
        .catch(error => console.error('Lỗi khi tải thông tin khách hàng:', error));
    }
  }, [id, setValue]);

  const onSubmit = (data) => {
    const customer = { ...data };

    axios.put(`http://localhost:8080/auth/update/${id}`, customer)
      .then(() => {
        toast.success('Cập nhật khách hàng thành công!');
        setTimeout(() => navigate('/admin/customer'), 2000);
      })
      .catch(error => console.error('Lỗi khi cập nhật khách hàng:', error));
  };

  return (
    <div className="container mt-5 pt-4">
      <h3>Cập nhật khách hàng</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="auth_name" className="form-label">Tên khách hàng</label>
          <input
            type="text"
            className="form-control"
            id="auth_name"
            {...register('auth_name', { required: 'Tên là bắt buộc' })}
          />
          {errors.auth_name && <span className="text-danger">{errors.auth_name.message}</span>}
        </div>
        <div className="mb-3">
          <label htmlFor="auth_phone" className="form-label">Số điện thoại</label>
          <input
            type="text"
            className="form-control"
            id="auth_phone"
            {...register('auth_phone')}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="auth_address" className="form-label">Địa chỉ</label>
          <input
            type="text"
            className="form-control"
            id="auth_address"
            {...register('auth_address')}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success me-2">Cập nhật</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/customer')}>Hủy</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CustomerForm;
