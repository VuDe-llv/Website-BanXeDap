import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
};

const ProductForm = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:8080/categories/getAll');
        setCategories(categoriesResponse.data);
        const brandsResponse = await axios.get('http://localhost:8080/brands/getAll');
        setBrands(brandsResponse.data);

        if (id) {
          const productResponse = await axios.get(`http://localhost:8080/products/getById/${id}`);
          const product = productResponse.data;

          Object.keys(product).forEach(key => setValue(key, product[key]));
        }
      } catch (error) {
        toast.error(`Lỗi khi lấy dữ liệu: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key] instanceof FileList ? data[key][0] : data[key]);
    });

    try {
      const request = id
        ? await axios.put(`http://localhost:8080/products/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await axios.post('http://localhost:8080/products/create', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      toast.success(`${id ? 'Cập nhật' : 'Tạo'} sản phẩm thành công!`);
      setTimeout(() => navigate('/admin/product'), 2000);
    } catch (error) {
      toast.error(`Lỗi khi ${id ? 'cập nhật' : 'tạo'} sản phẩm: ${error.message}`);
    }
  };

  const handleCancel = () => {
    reset();
    navigate('/admin/product');
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="container mt-5 pt-4">
      <h3>{id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h3>

      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <label htmlFor="prd_name" className="form-label">
                Tên sản phẩm <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="prd_name"
                {...register('prd_name', { required: 'Tên sản phẩm là bắt buộc' })}
              />
              {errors.prd_name && <span className="text-danger">{errors.prd_name.message}</span>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-2">
              <label htmlFor="prd_price" className="form-label">
                Giá <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="prd_price"
                {...register('prd_price', { required: 'Giá là bắt buộc' })}
              />
              {errors.prd_price && <span className="text-danger">{errors.prd_price.message}</span>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <label htmlFor="prd_stock" className="form-label">
                Số lượng <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="prd_stock"
                {...register('prd_stock', { required: 'Số lượng là bắt buộc' })}
              />
              {errors.prd_stock && <span className="text-danger">{errors.prd_stock.message}</span>}
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-2">
                  <label htmlFor="ctg_id" className="form-label">
                    Danh mục <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="ctg_id"
                    {...register('ctg_id', { required: 'Danh mục là bắt buộc' })}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.ctg_id} value={category.ctg_id}>
                        {category.ctg_name}
                      </option>
                    ))}
                  </select>
                  {errors.ctg_id && <span className="text-danger">{errors.ctg_id.message}</span>}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-2">
                  <label htmlFor="brd_id" className="form-label">
                    Thương hiệu <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="brd_id"
                    {...register('brd_id', { required: 'Thương hiệu là bắt buộc' })}
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map(brand => (
                      <option key={brand.brd_id} value={brand.brd_id}>
                        {brand.brd_name}
                      </option>
                    ))}
                  </select>
                  {errors.brd_id && <span className="text-danger">{errors.brd_id.message}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="mb-2">
              <label htmlFor="prd_description" className="form-label">Mô tả sản phẩm (Tùy chọn)</label>
              <textarea className="form-control" id="prd_description" {...register('prd_description')} />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-2">
              <label htmlFor="prd_parameter" className="form-label">Thông số sản phẩm (Tùy chọn)</label>
              <textarea className="form-control" id="prd_parameter" {...register('prd_parameter')} />
            </div>
          </div>
        </div>

        <div className="row">
          {['prd_image', 'prd_image1', 'prd_image2', 'prd_image3'].map((imageField, index) => (
            <div className="col-md-6" key={index}>
              <div className="mb-2">
                <label htmlFor={imageField} className="form-label">
                  Hình ảnh {index + 1} {index === 0 && <span className="text-danger">*</span>}
                </label>
                <input
                  type="file"
                  className="form-control"
                  id={imageField}
                  {...register(imageField)}
                />
                {index === 0 && errors.prd_image && <span className="text-danger">{errors.prd_image.message}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-success me-2" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : id ? 'Cập nhật' : 'Thêm'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Hủy
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default ProductForm;
