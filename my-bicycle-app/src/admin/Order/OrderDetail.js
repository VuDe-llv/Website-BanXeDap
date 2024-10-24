import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OrderDetail.css';

const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8080/order/getById/${id}`)
                .then(response => {
                    const order = response.data;
                    setOrder(order);

                    const productIds = order.prd_ids.split(',').map(id => id.trim());
                    const uniqueProductIds = [...new Set(productIds)];

                    const productPromises = uniqueProductIds.map(id =>
                        axios.get(`http://localhost:8080/products/getById/${id}`)
                            .then(response => ({
                                id,
                                data: response.data
                            }))
                            .catch(error => {
                                console.error(`Lỗi khi lấy thông tin sản phẩm có id ${id}:`, error);
                                toast.error(`Không thể tải thông tin sản phẩm có id ${id}`);
                                return null;
                            })
                    );

                    return Promise.all(productPromises)
                        .then(productResponses => {
                            const productsObj = {};
                            productResponses.forEach(productResponse => {
                                if (productResponse) {
                                    productsObj[productResponse.id] = productResponse.data;
                                }
                            });
                            setProducts(productsObj);
                        });
                })
                .catch(error => {
                    console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
                    toast.error('Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const getProductById = (prdId) => {
        return products[prdId];
    };

    const handleApproveOrder = () => {
        if (window.confirm('Bạn có chắc muốn duyệt đơn hàng này?')) {
            axios.put(`http://localhost:8080/order/update/${id}`, null, {
                params: { status: 'Đang xử lý' },
            })
                .then(() => {
                    setOrder({ ...order, order_status: 'Đang xử lý' });
                    toast.success('Đơn hàng đã được duyệt thành công');
                })
                .catch(error => {
                    console.error('Error approving order:', error);
                    toast.error('Duyệt đơn hàng thất bại. Vui lòng thử lại sau.');
                });
        }
    };

    if (loading) {
        return <p>Đang tải thông tin đơn hàng...</p>;
    }

    if (!order) {
        return <p>Đơn hàng không tồn tại.</p>;
    }

    return (
        <div className="container mt-5 pt-2 ">
            <div className="row mb-4 order-detail-container p-4">
                <div className="col-md-6">
                    <h3 className="mb-4">Thông tin đơn hàng</h3>
                    <div className="order-info">
                        <p className="mb-2"><strong>Trạng thái đơn hàng:</strong> <span>{order.order_status}</span></p>
                        <p className="mb-2"><strong>Ngày đặt hàng:</strong> <span>{new Date(order.order_date).toLocaleString('vi-VN')}</span></p>
                        <p className="mb-2"><strong>Thanh toán:</strong> <span>{order.order_payment}</span></p>
                        <p className="mb-2"><strong>Giao hàng:</strong> <span>{order.order_shipp}</span></p>
                        <p className="mb-2"><strong>Tổng thanh toán:</strong> <span>{formatCurrency(order.order_total_price)} VNĐ</span></p>
                    </div>
                </div>
                <div className="col-md-6">
                    <h3 className="mb-4">Thông tin khách hàng</h3>
                    <div className="customer-info">
                        <p className="mb-2"><strong>Tên khách hàng:</strong> <span>{order.auth ? order.auth.auth_name : 'Không xác định'}</span></p>
                        <p className="mb-2"><strong>Số điện thoại:</strong> <span>{order.auth ? order.auth.auth_phone : 'Không xác định'}</span></p>
                        <p className="mb-2"><strong>Địa chỉ:</strong> <span>{order.auth ? order.auth.auth_address : 'Không xác định'}</span></p>
                    </div>
                </div>
            </div>

            <section className="order-detail-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Chi tiết sản phẩm</h3>
                <div>
                    {order.order_status === 'Chờ xác nhận' && (
                        <button
                            className="btn btn-success btn-sm me-2"
                            onClick={handleApproveOrder}
                        >
                            Duyệt đơn hàng
                        </button>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/order')}>Quay lại</button>
                </div>
            </div>
                
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ width: '16%' }}>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th style={{ width: '16%' }}>Giá bán</th>
                            <th style={{ width: '11%' }}>Số lượng</th>
                            <th style={{ width: '16%' }}>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.prd_ids.split(',').map((prdId, index) => {
                            const product = getProductById(prdId.trim());
                            const quantity = order.order_quantity.split(',')[index].trim();
                            const totalPrice = product ? quantity * product.prd_price : 0;

                            return (
                                <tr key={index}>
                                    <td>
                                        {product ? (
                                            <img
                                                src={`http://localhost:8080/products/images/${product.prd_image}`}
                                                alt={product.prd_name}
                                                className="img-fluid"
                                                style={{ maxWidth: '50px' }}
                                            />
                                        ) : (
                                            'Không tìm thấy sản phẩm'
                                        )}
                                    </td>
                                    <td>{product ? product.prd_name : 'Không xác định'}</td>
                                    <td>{product ? formatCurrency(product.prd_price) : 'N/A'} VNĐ</td>
                                    <td>{quantity}</td>
                                    <td>{formatCurrency(totalPrice)} VNĐ</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
            <ToastContainer />
        </div>
    );
};

export default OrderDetail;
