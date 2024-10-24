import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.id) {
        try {
          const userResponse = await axios.get(`http://localhost:8080/auth/getById/${userData.id}`);
          setUser(userResponse.data);
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
    // Chỉ tính tổng khi cả giỏ hàng và sản phẩm đã được tải xong
    if (cartItems.length > 0 && products.length > 0) {
      calculateTotals(cartItems);
    }
  }, [cartItems, products]); // Gọi lại khi cartItems hoặc products thay đổi
  
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

  const handleQuantityChange = (prdId, newQuantity) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map(item => {
        if (item.prd_id === prdId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    
      calculateTotals(updatedItems);
      return updatedItems;
    });
  };

  const handleUpdateCart = async () => {
    try {
      let allValid = true;

      for (const item of cartItems) {
        const product = products.find(p => p.prd_id === item.prd_id);

        if (product && item.quantity <= product.prd_stock) {
          await axios.put(`http://localhost:8080/cart/update/${item.cart_id}`, null, {
            params: {
              quantity: item.quantity
            }
          });
        } else {
          toast.error(`Số lượng vượt quá số lượng có trong kho.`);
          allValid = false;
        }
      }

      if (allValid) {
        toast.success('Cập nhật giỏ hàng thành công!');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
          fetchCartItems(userData.id);
        }
      }
    } catch (error) {
      toast.error('Cập nhật giỏ hàng thất bại!');
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      let allValid = true;

      for (const item of cartItems) {
        const product = products.find(p => p.prd_id === item.prd_id);

        if (product && item.quantity <= product.prd_stock) {
          await axios.put(`http://localhost:8080/cart/update/${item.cart_id}`, null, {
            params: {
              quantity: item.quantity
            }
          });
        } else {
          toast.error(`Số lượng vượt quá số lượng có trong kho.`);
          allValid = false;
        }
      }

      if (allValid) {
        navigate('/userpage/checkout');
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
          fetchCartItems(userData.id);
        }
      }
    } catch (error) {
      toast.error('Cập nhật giỏ hàng thất bại!');
      console.error('Lỗi khi cập nhật giỏ hàng:', error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/cart/delete/${itemId}`);
      const updatedCart = cartItems.filter(item => item.cart_id !== itemId);
      setCartItems(updatedCart);
      calculateTotals(updatedCart);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  if (loading) {
    return <p>Đang tải giỏ hàng...</p>;
  }

  return (
    <div className="container pt-5">
      <div className="row pt-4">
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="title mb-2">GIỎ HÀNG</h4>
            <button className="btn btn-outline-success btn-sm mb-2" onClick={handleUpdateCart}>
              Cập nhật giỏ hàng
            </button>
          </div>
          {cartItems.length === 0 ? (
            <p className="text-center">Giỏ hàng của bạn trống.</p>
          ) : (
            <table className="table">
              <thead className="table-light">
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá (VNĐ)</th>
                  <th>Số lượng</th>
                  <th>Tổng (VNĐ)</th>
                  <th>Hành động</th>
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
                      <td className="quantity-cell">
                        <input
                          type="number"
                          value={item.quantity}
                          className="form-control"
                          min="1"
                          onChange={(e) => {
                            const newQuantity = Math.max(1, parseInt(e.target.value) || 0);
                            handleQuantityChange(item.prd_id, newQuantity);
                          }}
                          onBlur={(e) => {
                            if (parseInt(e.target.value) === 0) {
                              e.target.value = 1;
                            }
                          }}
                        />
                      </td>
                      <td>{formatCurrency(item.quantity * product.prd_price)}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemoveItem(item.cart_id)}>
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="align-items-center mb-4">
            <div>
              <Link to="/userpage/product-all">
                <button className="btn btn-outline-primary btn-sm">
                  Tiếp tục xem sản phẩm
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-listgroup">
          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between">
              <span>Tổng số lượng:</span>
              <strong>{totalQuantity}</strong>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Tổng cộng:</span>
              <strong>{formatCurrency(totalPrice)} VNĐ</strong>
            </li>
          </ul>
          <button className="btn btn-primary btn-sm w-100" onClick={handleCheckout}>
            Tiến hành thanh toán
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ShoppingCart;
