import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';
import './index.css';

const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
};

const ProductCard = ({ imgSrc, title, price, prd_id }) => (
  <SwiperSlide>
    <Link to={`/userpage/product-detail/${prd_id}`}>
      <div className="card mt-4 mb-5">
        <img src={imgSrc} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text price">{price}</p>
        </div>
      </div>
    </Link>
  </SwiperSlide>
);

const ProductSection = ({ products }) => {
  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="section-title">SẢN PHẨM</h3>
        <Link to="/userpage/product-all" className="btn btn-outline-primary">Xem thêm</Link>
      </div>
      <div className="swiper swiper-prd">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next_card',
            prevEl: '.swiper-button-prev_card',
          }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={4}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          <div className="swiper-wrapper swiper-wrapper-prd">
            {products && products.length > 0 ? (
              products.map((product) => (
                <SwiperSlide className="swiper-slide swiper-slide-prd" key={product.prd_id}>
                  <ProductCard
                    imgSrc={`http://localhost:8080/products/images/${product.prd_image}`}
                    title={product.prd_name}
                    price={formatCurrency(product.prd_price)}
                    prd_id={product.prd_id}
                  />
                </SwiperSlide>
              ))
            ) : (
              <div className="swiper-slide swiper-slide-prd">No products available.</div>
            )}
          </div>
        </Swiper>
        <div className="swiper-button-next swiper-button-next_card"></div>
        <div className="swiper-button-prev swiper-button-prev_card"></div>
      </div>
    </div>
  );
};

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products data
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/products/getAll');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center">Loading products...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <>
      <div className="banner-prd">
        <img src="/assets/images/21d6fd1320d1d48f8dc0-scaled.jpeg" alt="Banner 1" />
      </div>
      <ProductSection title="SẢN PHẨM" products={products} />
    </>
  );
};

export default App;
