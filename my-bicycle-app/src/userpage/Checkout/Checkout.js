import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [products, setProducts] = useState([]);
    const [authEmail, setAuthEmail] = useState('');
    const [authName, setAuthName] = useState('');
    const [authPhone, setAuthPhone] = useState('');
    const [authAddress, setAuthAddress] = useState('');
    const [authWard, setAuthWard] = useState('');
    const [authDistrict, setAuthDistrict] = useState('');
    const [authCity, setAuthCity] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [paymentMethod, setPaymentMethod] = useState('paymentInStore');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData && userData.id) {
                try {
                    const userResponse = await axios.get(`http://localhost:8080/auth/getById/${userData.id}`);
                    setUser(userResponse.data);
                    setAuthEmail(userResponse.data.auth_email);
                    setAuthName(userResponse.data.auth_name);
                    setAuthPhone(userResponse.data.auth_phone);
                    
                    const fullAddress = userResponse.data.auth_address;
                    const addressParts = fullAddress.split(',').map(part => part.trim());
                    if (addressParts.length >= 3) {

                        setAuthCity(addressParts[addressParts.length - 1]);
                        setAuthDistrict(addressParts[addressParts.length - 2]);
                        setAuthWard(addressParts[addressParts.length - 3]);
                        
                        if (addressParts.length > 3) {
                            setAuthAddress(addressParts.slice(0, -3).join(', '));
                        } else {
                            setAuthAddress('');
                        }
                    } else {
                        setAuthWard('');
                        setAuthDistrict('');
                        setAuthCity('');
                        setAuthAddress('');
                    }
    
                    await fetchCartItems(userData.id);
                } catch (error) {
                    console.error('Error fetching user:', error);
                    toast.error('Không thể tải dữ liệu người dùng.');
                }
            } else {
                console.error('Dữ liệu người dùng không có sẵn hoặc id không xác định');
                setLoading(false);
            }
    
            try {
                const productsResponse = await axios.get('http://localhost:8080/products/getAll');
                const sortedProducts = productsResponse.data.sort((a, b) => a.prd_id - b.prd_id);
                setProducts(sortedProducts);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error);
                toast.error('Không thể lấy sản phẩm. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0 && products.length > 0) {
            calculateTotals(cartItems);
        }
    }, [cartItems, products]);

    const fetchCartItems = async (userId) => {
        try {
            const cartResponse = await axios.get(`http://localhost:8080/cart/getByAuthId/${userId}`);
            const sortedCartItems = cartResponse.data.sort((a, b) => b.cart_id - a.cart_id);
            setCartItems(sortedCartItems);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
        }
    };

    const calculateTotals = (items) => {
        let totalQty = 0;
        let totalPrice = 0;
        items.forEach(item => {
            const product = products.find(p => p.prd_id === item.prd_id);
            if (product) {
                totalQty += item.quantity;
                totalPrice += item.quantity * product.prd_price;
            }
        });
        setTotalQuantity(totalQty);
        setTotalPrice(totalPrice);
    };

    const deleteCartItems = async (userId) => {
        try {
            const deleteResponse = await axios.delete(`http://localhost:8080/cart/deleteByAuthId/${userId}`);
            if (deleteResponse.status === 200) {
            } else {
                console.error('Failed to delete cart items');
            }
        } catch (error) {
            console.error('Error while deleting cart items:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData || !userData.id) {
                toast.error("Không tìm thấy thông tin người dùng");
                return;
            }
    
            const deliveryMethodMap = {
                pickup: "Nhận hàng tại cửa hàng",
                freeDelivery: "Giao hàng miễn phí (Toàn quốc)"
            };
        
            const paymentMethodMap = {
                paymentInStore: "Thanh toán tại cửa hàng",
                bankTransfer: "Chuyển khoản ngân hàng"
            };
    
            const orderParams = {
                auth_id: userData.id,
                prd_ids: cartItems.map(item => item.prd_id).join(","),
                order_quantity: cartItems.map(item => item.quantity).join(","),
                order_total_price: totalPrice,
                order_date: new Date().toISOString(),
                order_payment: paymentMethodMap[paymentMethod] || paymentMethod,
                order_shipp: deliveryMethodMap[deliveryMethod] || deliveryMethod,
                order_status: "Chờ xác nhận"
            };
    
            const fullAddress = `${authAddress ? authAddress + ', ' : ''}${authWard}, ${authDistrict}, ${authCity}`;
    
            const updatedAuth = {
                auth_name: authName,
                auth_phone: authPhone,
                auth_address: fullAddress,
            };
    
            const responseAuth = await axios.put(`http://localhost:8080/auth/update/${userData.id}`, updatedAuth);       
    
            if (responseAuth.status !== 200) {
                toast.error('Cập nhật thông tin người dùng thất bại!');
                return;
            }
    
            const response = await axios.post('http://localhost:8080/order/create', null, {
                params: orderParams,
            });
    
            if (response.status === 200) {
                toast.success('Đặt hàng thành công!');
                await deleteCartItems(userData.id);
                navigate('/userpage/shoppingcart');
            } else {
                toast.error('Đặt hàng thất bại!');
            }
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            toast.error('Không thể tiến hành thanh toán.');
        }
    };    

    if (loading) {
        return <p>Đang tải thông tin thanh toán...</p>;
    }

    return (
        <div className="container pt-5">
            <div className="row pt-4">
                <div className="col-md-6">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="title mb-2">THÔNG TIN THANH TOÁN</h4>
                        <Link to="/userpage/cart">
                            <button className="btn btn-outline-primary btn-sm mb-2">
                                Quay lại giỏ hàng
                            </button>
                        </Link>
                    </div>
                    {cartItems.length === 0 ? (
                        <p className="text-center">Không tìm thấy thông tin thanh toán.</p>
                    ) : (
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Giá (VNĐ)</th>
                                    <th>Số lượng</th>
                                    <th>Tổng (VNĐ)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map(item => {
                                    const product = products.find(p => p.prd_id === item.prd_id);
                                    if (!product) return null;

                                    return (
                                        <tr key={`${item.cart_id}-${product.prd_id}`}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={`http://localhost:8080/products/images/${product.prd_image}`}
                                                        alt={product.prd_name}
                                                        width="70"
                                                        height="70"
                                                        className="me-3"
                                                    />
                                                    <div>
                                                        <h6 className="mb-0">{product.prd_name}</h6>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{formatCurrency(product.prd_price)}</td>
                                            <td className="quantity-cell">{item.quantity}</td>
                                            <td className="td-total-price">{formatCurrency(item.quantity * product.prd_price)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    <div>
                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between p-3">
                                <strong>Tổng số lượng:</strong>
                                <strong>{totalQuantity}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between p-3">
                                <strong>Tổng cộng:</strong>
                                <strong>{formatCurrency(totalPrice)} VNĐ</strong>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-6 col-listgroup">
                    <ul className="list-group mb-3">
                        <li className="list-group-item">
                            <label htmlFor="authEmail" className="form-label">
                                <strong>Email</strong>
                            </label>
                            <input
                                type="email"
                                id="authEmail"
                                className="form-control"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                required
                                readOnly
                            />
                        </li>
                        <li className="list-group-item">
                            <label htmlFor="authName" className="form-label">
                                <strong>Họ và Tên</strong>
                            </label>
                            <input
                                type="text"
                                id="authName"
                                className="form-control"
                                value={authName}
                                onChange={(e) => setAuthName(e.target.value)}
                                required
                            />
                        </li>
                        <li className="list-group-item">
                            <label htmlFor="authPhone" className="form-label">
                                <strong>Số điện thoại</strong>
                            </label>
                            <input
                                type="text"
                                id="authPhone"
                                className="form-control"
                                value={authPhone}
                                onChange={(e) => setAuthPhone(e.target.value)}
                                required
                            />
                        </li>
                        <li className="list-group-item">
                            <label htmlFor="authAddress" className="form-label">
                                <strong>Địa chỉ cụ thể</strong>
                            </label>
                            <input
                                type="text"
                                id="authAddress"
                                className="form-control"
                                value={authAddress}
                                onChange={(e) => setAuthAddress(e.target.value)}
                                required
                            />
                        </li>
                        <li className="list-group-item">
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="phuongXa" className="form-label">
                                        <strong>Phường/Xã</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="phuongXa"
                                        className="form-control"
                                        value={authWard}
                                        onChange={(e) => setAuthWard(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="quanHuyen" className="form-label">
                                        <strong>Quận/Huyện</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="quanHuyen"
                                        className="form-control"
                                        value={authDistrict}
                                        onChange={(e) => setAuthDistrict(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="tinhThanhPho" className="form-label">
                                        <strong>Tỉnh/Thành Phố</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="tinhThanhPho"
                                        className="form-control"
                                        value={authCity}
                                        onChange={(e) => setAuthCity(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <strong>Giao hàng</strong>
                            <div className="form-check mt-2">
                                <input
                                    type="radio"
                                    id="pickup"
                                    name="deliveryMethod"
                                    className="form-check-input"
                                    value="pickup"
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                    checked={deliveryMethod === 'pickup'}
                                    required
                                />
                                <label htmlFor="pickup" className="form-check-label" style={{ fontSize: '15px' }}>
                                    Nhận hàng tại cửa hàng
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="freeDelivery"
                                    name="deliveryMethod"
                                    className="form-check-input"
                                    value="freeDelivery"
                                    onChange={(e) => setDeliveryMethod(e.target.value)}
                                    checked={deliveryMethod === 'freeDelivery'}
                                    required
                                />
                                <label htmlFor="freeDelivery" className="form-check-label" style={{ fontSize: '15px' }}>
                                    Giao hàng miễn phí (Toàn quốc)
                                </label>
                            </div>
                        </li>

                        <li className="list-group-item">
                            <strong>Phương thức thanh toán</strong>
                            <div className="form-check mt-2">
                                <input
                                    type="radio"
                                    id="paymentInStore"
                                    name="paymentMethod"
                                    className="form-check-input"
                                    value="paymentInStore"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    checked={paymentMethod === 'paymentInStore'}
                                    required
                                />
                                <label htmlFor="paymentInStore" className="form-check-label" style={{ fontSize: '15px' }}>
                                    Thanh toán tại cửa hàng
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    id="bankTransfer"
                                    name="paymentMethod"
                                    className="form-check-input"
                                    value="bankTransfer"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    checked={paymentMethod === 'bankTransfer'}
                                    required
                                />
                                <label htmlFor="bankTransfer" className="form-check-label" style={{ fontSize: '15px' }}>
                                    Chuyển khoản ngân hàng
                                </label>
                            </div>
                        </li>

                    </ul>
                    <button className="btn btn-primary btn-sm mb-3 w-100" onClick={handleCheckout}>
                        Xác nhận đặt hàng
                    </button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default Checkout;