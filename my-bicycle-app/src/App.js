import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HeaderAdmin from './components/HeaderAdmin';
import HeaderUser from './components/HeaderUser';
import Footer from './components/Footer';
import CustomerList from './admin/Customer/CustomerList';
import CustomerForm from './admin/Customer/CustomerForm';
import CategoryList from './admin/Category/CategoryList';
import CategoryForm from './admin/Category/CategoryForm';
import ProductList from './admin/Product/ProductList';
import ProductForm from './admin/Product/ProductForm';
import BrandList from './admin/Brand/BrandList';
import BrandForm from './admin/Brand/BrandForm';
import OrderList from './admin/Order/OrderList';
import OrderDetail from './admin/Order/OrderDetail';
import Index from './userpage/Index/index';
import DashBoard from './admin/DashBoard/DashBoard';
import ProductAll from './userpage/ProductAll/product-all';
import AuthForm from './components/AuthForm';
import ProductDetail from './userpage/ProductDetail/product-detail';
import Checkout from './userpage/Checkout/Checkout';
import Order from './userpage/Order/Order';
import CustomerProfile from './userpage/CustomerProfile/CustomerProfile';
import ShoppingCart from './userpage/ShoppingCart/ShoppingCart';

const Layout = ({ children }) => {
  const location = useLocation();
  const showFooter = location.pathname.startsWith('/userpage');

  return (
    <>
      {children}
      {showFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/*" element={<HeaderAdmin />} />
        
          {/* User routes */}
          <Route path="/userpage/*" element={<HeaderUser />} />

          {/* Auth routes */}
        </Routes>

        {/* Define admin-specific routes */}
        <Routes>
          <Route path="/admin">
            <Route path="index" element={<DashBoard />} />

            <Route path="customer" element={<CustomerList />} />
            <Route path="customer/new" element={<CustomerForm />} />
            <Route path="customer/edit/:id" element={<CustomerForm />} />

            <Route path="category" element={<CategoryList />} />
            <Route path="category/new" element={<CategoryForm />} />
            <Route path="category/edit/:id" element={<CategoryForm />} />

            <Route path="product" element={<ProductList />} />
            <Route path="product/new" element={<ProductForm />} />
            <Route path="product/edit/:id" element={<ProductForm />} />

            <Route path="brand" element={<BrandList />} />
            <Route path="brand/new" element={<BrandForm />} />
            <Route path="brand/edit/:id" element={<BrandForm />} />

            <Route path="order" element={<OrderList />} />
            <Route path="order/details/:id" element={<OrderDetail />} />
          </Route>

          {/* User routes */}
          <Route path="/userpage">
            <Route path="index" element={<Index />} />
            <Route path="product-all" element={<ProductAll />} />
            <Route path="shoppingcart" element={<ShoppingCart />} />
            <Route path="product-detail/:id" element={<ProductDetail />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order" element={<Order />} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>


          <Route path="/" element={<Navigate to="/userpage/index" />} />
          {/* Auth routes */}
          <Route path="/auth" element={<AuthForm />} />
          {/* Catch all unknown paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const NotFound = () => <h2>Page Not Found</h2>;

export default App;
