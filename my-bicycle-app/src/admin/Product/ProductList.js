import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://localhost:8080/products/getAll');
        const categoriesResponse = await axios.get('http://localhost:8080/categories/getAll');
        const brandsResponse = await axios.get('http://localhost:8080/brands/getAll');
        const sortedProducts = productsResponse.data.sort((a, b) => a.prd_id - b.prd_id);
        setProducts(sortedProducts);
        setCategories(categoriesResponse.data);
        setBrands(brandsResponse.data);
      } catch (error) {
        console.error('Error fetching products or categories:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      axios.delete(`http://localhost:8080/products/delete/${id}`)
        .then(() => {
          setProducts(products.filter(product => product.prd_id !== id));
          toast.success('Xóa sản phẩm thành công!');
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          toast.error('Xóa sản phẩm thất bại. Vui lòng thử lại sau.');
        });
    }
  };

  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category.ctg_id] = category.ctg_name;
  });

  const brandMap = {};
  brands.forEach(brand => {
    brandMap[brand.brd_id] = brand.brd_name;
  });

  const filteredProducts = products.filter(product =>
    product.prd_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control me-2"
          style={{ width: '50%' }}
        />
        <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/admin/product/new')}>
          <i className="fa-solid fa-plus"></i> Thêm sản phẩm
        </button>
      </div>

      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : filteredProducts.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>SL tồn</th>
              <th>Danh mục</th>
              <th>Thương hiệu</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.prd_id}>
                <td>
                  <img
                    src={`http://localhost:8080/products/images/${product.prd_image}`}
                    alt={product.prd_name}
                    width="80"
                    height="80"
                    style={{ objectFit: 'cover' }} 
                  />
                </td>
                <td>{product.prd_name}</td>
                <td>{formatCurrency(product.prd_price)}</td>
                <td>{product.prd_stock}</td>
                <td>{categoryMap[product.ctg_id]}</td>
                <td>{brandMap[product.brd_id]}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => handleEdit(product.prd_id)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(product.prd_id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không tìm thấy sản phẩm nào.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default ProductList;
