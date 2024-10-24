import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/categories/getAll')
      .then(response => {
        const sortedCategories = response.data.sort((a, b) => a.ctg_id - b.ctg_id);
        setCategories(sortedCategories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải danh mục:', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/category/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      axios.delete(`http://localhost:8080/categories/delete/${id}`)
        .then(() => {
          setCategories(categories.filter(category => category.ctg_id !== id));
          toast.success('Xóa danh mục thành công!');
        })
        .catch(error => console.error('Lỗi khi xóa danh mục:', error));
    }
  };

  const filteredCategories = categories.filter(category =>
    category.ctg_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control me-2"
          style={{ width: '50%' }}
        />
        <button className="btn btn-outline-success btn-sm" onClick={() => navigate('/admin/category/new')}>
        <i className="fa-solid fa-plus"></i> Thêm danh mục
        </button>
      </div>
      {loading ? (
        <p>Đang tải danh mục...</p>
      ) : filteredCategories.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => (
              <tr key={category.ctg_id}>
                <td>{category.ctg_name}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(category.ctg_id)}>
                  <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(category.ctg_id)}>
                  <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không tìm thấy danh mục nào khớp với tìm kiếm của bạn.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default CategoryList;
