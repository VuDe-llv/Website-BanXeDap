import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/order/getAll');
        const sortedOrders = response.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/admin/order/details/${id}`);
  };

  const handleApproveOrder = (id) => {
    if (window.confirm('Bạn có chắc muốn duyệt đơn hàng này?')) {
      axios.put(`http://localhost:8080/order/update/${id}`, null, {
        params: { status: 'Đang xử lý' },
      })
        .then(() => {
          setOrders(orders.map(order => 
            order.order_id === id ? { ...order, order_status: 'Đang xử lý' } : order
          ));
          toast.success('Đơn hàng đã được duyệt thành công');
        })
        .catch(error => {
          console.error('Error approving order:', error);
          toast.error('Duyệt đơn hàng thất bại. Vui lòng thử lại sau.');
        });
    }
  };  

  return (
    <div className="container mt-5 pt-4">
      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : orders.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th>Tổng giá</th>
              <th>Ngày đặt hàng</th>
              <th>Trạng thái</th>
              <th>Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.auth ? order.auth.auth_name : 'Không xác định'}</td>
                <td>{formatCurrency(order.order_total_price)}</td>
                <td>{new Date(order.order_date).toLocaleDateString('vi-VN')}</td>
                <td>{order.order_status}</td>
                <td>
                  <button
                    className="btn btn-outline-info btn-sm me-2"
                    onClick={() => handleViewDetails(order.order_id)}
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  {order.order_status === 'Chờ xác nhận' && (
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleApproveOrder(order.order_id)}
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không tìm thấy đơn hàng nào.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default OrderList;
