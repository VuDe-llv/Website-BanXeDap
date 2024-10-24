import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryForm = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/categories/getById/${id}`)
        .then(response => {
          const category = response.data;
          setValue('ctg_name', category.ctg_name);
        })
        .catch(error => {
          console.error('Lỗi khi lấy thông tin danh mục:', error);
          toast.error('Lỗi khi lấy thông tin danh mục');
        });
    }
  }, [id, setValue]);

  const onSubmit = (data) => {
    const category = { ...data };

    const request = id 
      ? axios.put(`http://localhost:8080/categories/update/${id}`, category) 
      : axios.post('http://localhost:8080/categories/create', category);

    request
      .then(response => {
        toast.success(id ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục thành công!');
        setTimeout(() => navigate('/admin/category'), 2000);
      })
      .catch(error => {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else {
          console.error('Lỗi khi tạo/cập nhật danh mục:', error);
          toast.error('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
        }
      });
  };

  return (
    <div className="container mt-5 pt-4">
      <h3>{id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="ctg_name" className="form-label">Tên danh mục</label>
          <input
            type="text"
            className="form-control"
            id="ctg_name"
            {...register('ctg_name', { required: 'Tên danh mục là bắt buộc' })}
          />
          {errors.ctg_name && <span className="text-danger">{errors.ctg_name.message}</span>}
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success me-2">Lưu</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/category')}>Hủy</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CategoryForm;
