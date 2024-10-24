import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/brands/getAll')
      .then(response => {
        const sortedBrands = response.data.sort((a, b) => a.brd_id - b.brd_id);
        setBrands(sortedBrands);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/brand/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) {
      axios.delete(`http://localhost:8080/brands/delete/${id}`)
        .then(() => {
          setBrands(brands.filter(brand => brand.brd_id !== id));
          toast.success('Xóa thương hiệu thành công!');
        })
        .catch(error => console.error('Lỗi khi xóa thương hiệu:', error));
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.brd_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm thương hiệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control me-2"
          style={{ width: '50%' }}
        />
        <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/admin/brand/new')}>
          <i className="fa-solid fa-plus"></i> Thêm thương hiệu
        </button>
      </div>
      {loading ? (
        <p>Đang tải thương hiệu...</p>
      ) : filteredBrands.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Tên thương hiệu</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map(brand => (
              <tr key={brand.brd_id}>
                <td>{brand.brd_name}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(brand.brd_id)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(brand.brd_id)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không tìm thấy thương hiệu nào khớp với tìm kiếm của bạn.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default BrandList;
