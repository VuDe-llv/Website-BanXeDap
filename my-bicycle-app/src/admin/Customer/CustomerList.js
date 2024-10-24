import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/auth/getAll')
      .then(response => {
        const sortedCustomers = response.data.sort((a, b) => a.auth_id - b.auth_id);
        setCustomers(sortedCustomers);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải khách hàng:', error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/customer/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này không?')) {
      axios.delete(`http://localhost:8080/auth/delete/${id}`)
        .then(() => {
          setCustomers(customers.filter(customer => customer.auth_id !== id));
          toast.success('Xóa khách hàng thành công!');
        })
        .catch(error => console.error('Lỗi khi xóa khách hàng:', error));
    }
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.auth_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.auth_phone || '').includes(searchQuery) ||
    (customer.auth_address || '').toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container mt-5 pt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control me-2"
          style={{ width: '50%' }}
        />
      </div>
      {loading ? (
        <p>Đang tải khách hàng...</p>
      ) : filteredCustomers.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.auth_id}>
                <td>
                  <img
                    src={`http://localhost:8080/auth/images/${customer.auth_image}`}
                    alt={customer.auth_name}
                    width="60"
                    height="60"
                    style={{ objectFit: 'cover' }} 
                  />
                </td>
                <td>{customer.auth_name || 'N/A'}</td>
                <td>{customer.auth_email || 'N/A'}</td>
                <td>{customer.auth_phone || 'N/A'}</td>
                <td>{customer.auth_address || 'N/A'}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(customer.auth_id)}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(customer.auth_id)}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không tìm thấy khách hàng nào khớp với tìm kiếm của bạn.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default CustomerList;
