import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import './DashBoard.css';

const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Dashboard = () => {
    const [data, setData] = useState({
        customers: 0,
        products: 0,
        revenue: 0,
        orders: 0,
    });

    const [loading, setLoading] = useState(true);
    const [weeklyRevenue, setWeeklyRevenue] = useState([1200, 1900, 3000, 2500, 2100, 2900, 3500]);
    const [brandData, setBrandData] = useState({
        labels: [],
        datasets: [{
            label: 'Số lượng sản phẩm theo thương hiệu',
            data: [],
            backgroundColor: [
                '#0d6efd',
                '#198754',
                '#ffc107',
                '#dc3545',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
            ],
        }]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerResponse = await axios.get('http://localhost:8080/auth/getAll');
                const totalCustomers = customerResponse.data.length;
        
                const productsResponse = await axios.get('http://localhost:8080/products/getAll');
                const totalProducts = productsResponse.data.length;
        
                // Fetch all orders without filtering by status
                const ordersResponse = await axios.get('http://localhost:8080/order/getAll');
                const totalOrders = ordersResponse.data.length;  // Update to count all orders
        
                const completedOrders = ordersResponse.data.filter(order => order.order_status === 'Hoàn thành');
        
                const totalRevenue = completedOrders.reduce((acc, order) => {
                    const price = parseFloat(order.order_total_price);
                    return acc + (isNaN(price) ? 0 : price);
                }, 0);
        
                const brandsResponse = await axios.get('http://localhost:8080/brands/getAll');
                const brandMap = {};
                brandsResponse.data.forEach(brand => {
                    brandMap[brand.brd_id] = brand.brd_name;
                });
        
                const brandCount = {};
                productsResponse.data.forEach(product => {
                    const brandId = product.brd_id;
                    brandCount[brandId] = (brandCount[brandId] || 0) + 1;
                });
        
                const labels = Object.keys(brandCount).map(id => brandMap[id] || id);
                const dataCounts = Object.values(brandCount);
                setBrandData({
                    labels: labels,
                    datasets: [{
                        label: 'Số lượng sản phẩm',
                        data: dataCounts,
                        backgroundColor: [
                            '#ffc107',
                            '#dc3545',
                            '#198754',
                            '#0d6efd',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],                        
                    }]
                });
        
                setData({
                    customers: totalCustomers,
                    products: totalProducts,
                    orders: totalOrders,
                    revenue: totalRevenue,
                });
        
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };        
    
        fetchData();
    }, []);    

    if (loading) {
        return <div className="container mt-5">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="container mt-5 pt-4">
            <div className="row">
                <div className="col-md-3 mb-4">
                    <div className="custom-box bg-warning">
                        <h5 className="box-title">KHÁCH HÀNG</h5>
                        <p className="box-text">{data.customers}</p>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="custom-box bg-success">
                        <h5 className="box-title">SẢN PHẨM</h5>
                        <p className="box-text">{data.products}</p>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="custom-box bg-primary">
                        <h5 className="box-title">DOANH THU</h5>
                        <p className="box-text">{formatCurrency(data.revenue)} VNĐ</p>
                    </div>
                </div>
                <div className="col-md-3 mb-4">
                    <div className="custom-box bg-danger">
                        <h5 className="box-title">ĐƠN HÀNG</h5>
                        <p className="box-text">{data.orders}</p>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8 mb-4">
                    <h5>Doanh thu hàng tuần</h5>
                    <Bar
                        data={{
                            labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7'],
                            datasets: [{
                                label: 'Doanh thu (VNĐ)',
                                data: weeklyRevenue,
                                backgroundColor: '#0d6efd',
                            }]
                        }}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Biểu đồ doanh thu hàng tuần',
                                },
                            },
                        }}
                    />
                </div>

                <div className="col-md-4 mb-4">
                    <h5>Số lượng sản phẩm theo thương hiệu</h5>
                    <div style={{ height: '400px' }}>
                        <Pie
                            data={brandData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Biểu đồ sản phẩm theo thương hiệu',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
