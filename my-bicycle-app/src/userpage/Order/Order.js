import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Order.css';

const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState({});
    const [authId, setAuthId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthId = () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData && userData.id) {
                setAuthId(userData.id);
            } else {
                toast.error('User not logged in or ID not available.');
            }
        };

        fetchAuthId();
    }, []);

    useEffect(() => {
        if (!authId) return;

        const fetchOrders = async () => {
            try {
                const ordersResponse = await axios.get(`http://localhost:8080/order/getByAuthId/${authId}`);
                const sortedOrders = ordersResponse.data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

                setOrders(sortedOrders);
                const productIds = ordersResponse.data.flatMap(order => {
                    if (order.prd_ids && typeof order.prd_ids === 'string') {
                        return order.prd_ids.split(",").map(id => id.trim());
                    }
                    return [];
                });

                const uniqueProductIds = [...new Set(productIds)];

                const productPromises = uniqueProductIds.map(id =>
                    axios.get(`http://localhost:8080/products/getById/${id}`).then(response => ({
                        id,
                        data: response.data
                    }))
                );

                const productResponses = await Promise.all(productPromises);
                const productsObj = {};
                productResponses.forEach(({ id, data }) => {
                    productsObj[id] = data;
                });
                setProducts(productsObj);
            } catch (error) {
                console.error("Error fetching orders or products:", error);
                toast.error('Lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [authId]);

    const getProductById = (prdId) => {
        return products[prdId];
    };

    const calculateProductTotalPrice = (prdId, quantity) => {
        const product = getProductById(prdId);
        if (product) {
            const price = product.prd_price;
            return quantity * price;
        }
        return 0;
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
            try {
                await axios.put(`http://localhost:8080/order/cancel/${orderId}`);
                setOrders(orders.map(order => 
                    order.order_id === orderId ? { ...order, order_status: 'Đã hủy' } : order
                ));
                toast.success('Đơn hàng đã được hủy thành công.');
            } catch (error) {
                console.error("Error canceling order:", error);
                toast.error('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5 pt-4">
            <h4 className="title mb-2">ĐƠN MUA</h4>
            {orders.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    Không tìm thấy đơn hàng nào
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.order_id} className="mb-5">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                <td colSpan="2">
                                    <div className="d-flex justify-content-between">
                                        <span>Trạng thái: 
                                             <span 
                                                className={`order-status 
                                                    ${order.order_status === "Đã hủy" ? "da-huy" : ""} 
                                                    ${order.order_status === "Chờ xác nhận" ? "chua-xac-nhan" : ""} 
                                                    ${order.order_status === "Đang xử lý" ? "dang-xu-ly" : ""}
                                                    ${order.order_status === "Hoàn thành" ? "hoan-thanh" : ""}`}
                                            >
                                                 {order.order_status}
                                            </span>
                                        </span>
                                        {order.order_status === "Chờ xác nhận" && (
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleCancelOrder(order.order_id)}
                                            >
                                                Hủy đơn hàng
                                            </button>
                                        )}
                                    </div>
                                </td>
                                </tr>
                            </thead>
                            <tbody>
                                {order.prd_ids && order.prd_ids.split(",").map((prdId, index) => {
                                    const product = getProductById(prdId.trim());
                                    const quantity = order.order_quantity.split(",")[index].trim();
                                    const productTotalPrice = calculateProductTotalPrice(prdId.trim(), quantity);
                                    return (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td>
                                                    {product ? (
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={`http://localhost:8080/products/images/${product.prd_image}`}
                                                                alt={product.prd_name}
                                                                className="product-img me-3"
                                                            />
                                                            <div>
                                                                <h6>{product.prd_name}</h6>
                                                                <small>Số lượng: {quantity}</small>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span>Sản phẩm không tìm thấy</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="total-price">{formatCurrency(productTotalPrice)} VNĐ</span>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                                <tr>
                                    <td colSpan="2">
                                        <div className="d-flex justify-content-between">
                                            <span>Thời gian: {new Date(order.order_date).toLocaleString()}</span>
                                            <span>Tổng cộng: <span className="total-price">{formatCurrency(order.order_total_price)} VNĐ</span></span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))
            )}
            <ToastContainer />
        </div>
    );
};

export default OrderPage;
