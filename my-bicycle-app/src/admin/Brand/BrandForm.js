import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrandForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/brands/getById/${id}`)
        .then(response => {
          const brand = response.data;
          setValue('brd_name', brand.brd_name);
        })
        .catch(error => {
          console.error('Lỗi khi lấy thông tin thương hiệu:', error);
          toast.error('Lỗi khi lấy thông tin thương hiệu');
        });
    }
  }, [id, setValue]);

  const onSubmit = (data) => {
    const brand = { ...data };

    const request = id 
      ? axios.put(`http://localhost:8080/brands/update/${id}`, brand) 
      : axios.post('http://localhost:8080/brands/create', brand);

    request
      .then(response => {
        toast.success(id ? 'Cập nhật thương hiệu thành công!' : 'Tạo thương hiệu thành công!');
        setTimeout(() => navigate('/admin/brand'), 2000);
      })
      .catch(error => {

        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          console.error('Lỗi khi tạo/cập nhật thương hiệu:', error);
          toast.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
        }
      });
  };

  return (
    <div className="container mt-5 pt-4">
      <h3>{id ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu'}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="brd_name" className="form-label">Tên thương hiệu</label>
          <input
            type="text"
            className="form-control"
            id="brd_name"
            {...register('brd_name', { required: 'Tên thương hiệu là bắt buộc' })}
          />
          {errors.brd_name && <span className="text-danger">{errors.brd_name.message}</span>}
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success me-2">Lưu</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/brand')}>Hủy</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BrandForm;
