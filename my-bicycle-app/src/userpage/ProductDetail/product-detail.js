import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './product-detail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  const handleChange = (e) => {
    const value = Math.max(1, Math.min(e.target.value, product.prd_stock));
    setQuantity(value);
  };

  const formatCurrency = (amount) => {
    return amount ? amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ' : '';
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.id) {
      axios.get(`http://localhost:8080/auth/getById/${userData.id}`)
        .then(response => setUser(response.data))
        .catch(error => console.error('Lỗi khi lấy thông tin người dùng:', error));
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/products/getById/${id}`);
        setProduct(response.data || {});
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
        setError('Không thể tải thông tin sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
        const auth_id = user?.id;

        if (!user) {
            toast.error('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
            navigate('/auth');
            return;
        }

        if (quantity > product.prd_stock) {
            toast.error('Số lượng vượt quá số sản phẩm có trong kho.');
            return;
        }

        const response = await axios.post('http://localhost:8080/cart/create', null, {
            params: { auth_id: user.auth_id, prd_id: product.prd_id, quantity },
        });
        setQuantity(1);
        toast.success(response.data);
    } catch (error) {
        toast.error(`Lỗi khi thêm vào giỏ hàng: ${error.response?.data?.message || error.message}`);
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
    }
  };  

  if (loading) return <p>Đang tải thông tin sản phẩm...</p>;  
  if (error) return <p className="text-danger">{error}</p>;

  const images = [
    product.prd_image,
    product.prd_image1,
    product.prd_image2,
    product.prd_image3,
  ].filter(image => image);

  if (!product || !product.prd_name) {
    return <p>Không có thông tin sản phẩm.</p>;
  }

  return (
    <div className="container pt-5 pb-5">
      <div className="row pt-4">
        <div className="col-md-5">
          {images.length > 0 ? (
            <>
              <Swiper
                style={{
                  '--swiper-navigation-color': '#fff',
                  '--swiper-pagination-color': '#fff',
                }}
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={`http://localhost:8080/products/images/${image}`} alt={`Hình ảnh sản phẩm ${index}`} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img src={`http://localhost:8080/products/images/${image}`} alt={`Hình ảnh thu nhỏ sản phẩm ${index}`} />
                  </SwiperSlide>
                ))}
              </Swiper>

            </>
          ) : (
            <p>Không có hình ảnh nào</p>
          )}
        </div>

        <div className="col-md-7">
          <h2 className="text-primary">{product.prd_name}</h2>
          <p className="title-detail" style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
            <span><strong>Mã sản phẩm:</strong> {product.prd_id}</span>
            <span><strong>Kho:</strong> {product.prd_stock}</span>
          </p>
          <p className="title-detail"><strong>Mô tả:</strong> {product.prd_description || 'Không có mô tả'}</p>
          <p className="text-danger h4">{formatCurrency(product.prd_price)}</p>
          <p className="title-detail"><strong>Thương hiệu:</strong> {product.brand?.brd_name || 'N/A'}</p>
          <p className="title-detail"><strong>Loại sản phẩm:</strong> {product.category?.ctg_name}</p>
          <p className="title-detail"><strong>Số lượng:</strong></p>
          <input
            type="number"
            className="form-control form-control-quantity mb-2"
            min="1"
            value={quantity}
            onChange={handleChange}
          />
          <p className="title-detail"><strong>Thông số kỹ thuật</strong></p>
            <li>{product.prd_parameter}</li>

          <div className="mt-3">
          <button className="btn btn-primary btn-hover" onClick={() => {
            handleAddToCart();
            }}>
              Thêm vào giỏ hàng
          </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    
  );
};

export default ProductDetail;
