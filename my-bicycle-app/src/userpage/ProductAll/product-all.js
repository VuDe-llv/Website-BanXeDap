import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './product-all.module.css';

const ProductAll = () => {
  const [products, setProducts] = useState([]);
  const [bikeType, setBikeType] = useState('all');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsAndBrandsAndCategories = async () => {
      setLoading(true);
      try {
        const productsResponse = await axios.get('http://localhost:8080/products/getAll');
        setProducts(productsResponse.data);

        const brandsResponse = await axios.get('http://localhost:8080/brands/getAll');
        setBrands(brandsResponse.data);

        const categoriesResponse = await axios.get('http://localhost:8080/categories/getAll'); // Fetch categories
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm, thương hiệu hoặc danh mục:', error);
        setError('Không thể tải sản phẩm, thương hiệu hoặc danh mục.');
        toast.error('Không thể tải sản phẩm, thương hiệu hoặc danh mục.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndBrandsAndCategories();
  }, []);

  const handleSortChange = (e) => setSortOrder(e.target.value);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleBrandChange = (e) => setBrand(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value); // Handle category change

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VNĐ';
  };

  const filterProducts = () => {
    return products.filter(product => {
      const matchesBikeType = bikeType === 'all' || product.brd_id === Number(bikeType);
      const matchesBrand = !brand || product.brd_id === Number(brand);
      const matchesCategory = !category || product.ctg_id === Number(category); // Filter by category
      const matchesSearchQuery = product.prd_name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBikeType && matchesBrand && matchesCategory && matchesSearchQuery;
    });
  };

  const sortedProducts = () => {
    const filteredProducts = filterProducts();
    const sorted = [...filteredProducts];

    switch (sortOrder) {
      case 'priceAsc':
        return sorted.sort((a, b) => a.prd_price - b.prd_price);
      case 'priceDesc':
        return sorted.sort((a, b) => b.prd_price - a.prd_price);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.prd_date) - new Date(a.prd_date));
      default:
        return sorted;
    }
  };

  if (loading) return <p className="text-center">Đang tải sản phẩm...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container pt-5">
      <div className="d-flex justify-content-between mb-3 pt-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control me-2"
          style={{ width: '40%' }}
        />
        <div className="ms-auto d-flex">
          <select className="form-select me-2" id="brandSelect" onChange={handleBrandChange}>
            <option value="">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.brd_id} value={brand.brd_id}>{brand.brd_name}</option>
            ))}
          </select>

          <select className="form-select me-2" id="categorySelect" onChange={handleCategoryChange}>
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category.ctg_id} value={category.ctg_id}>{category.ctg_name}</option>
            ))}
          </select>

          <select className="form-select" id="sortSelect" onChange={handleSortChange} defaultValue="newest">
            <option value="newest">Mới nhất</option>
            <option value="priceAsc">Giá: Thấp đến Cao</option>
            <option value="priceDesc">Giá: Cao đến Thấp</option>
          </select>
        </div>
      </div>

      <div className="row pt-2">
        {sortedProducts().length > 0 ? (
          sortedProducts().map(product => (
            <div className="col-md-3 mb-4" key={product.prd_id}>
              <Link to={`/userpage/product-detail/${product.prd_id}`}>
                <div className="card">
                  <img 
                    src={`http://localhost:8080/products/images/${product.prd_image}`} 
                    className="card-img-top" 
                    alt={product.prd_name} 
                    loading="lazy"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.prd_name}</h5>
                    <p className="card-text price">{formatCurrency(product.prd_price)}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center">Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn.</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ProductAll;
