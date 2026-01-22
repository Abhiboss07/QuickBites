import React from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import './dashboard.css';

const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="card stat-card"
    >
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
            <Icon size={24} />
        </div>
        <div className="stat-info">
            <span className="stat-title">{title}</span>
            <h3 className="stat-value">{value}</h3>
            <span className="stat-trend success">
                <TrendingUp size={14} /> {trend}
            </span>
        </div>
    </motion.div>
);

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <div className="stats-grid">
                <StatCard
                    icon={ShoppingCart}
                    title="Total Orders"
                    value="1,248"
                    trend="+12% this week"
                    color="#f42525"
                />
                <StatCard
                    icon={DollarSign}
                    title="Total Revenue"
                    value="$34,500"
                    trend="+8% this week"
                    color="#22c55e"
                />
                <StatCard
                    icon={Users}
                    title="New Customers"
                    value="156"
                    trend="+22% this week"
                    color="#8b5cf6"
                />
                <StatCard
                    icon={Clock}
                    title="Avg. Delivery"
                    value="24 min"
                    trend="-2 min this week"
                    color="#f59e0b"
                />
            </div>

            <div className="dashboard-split">
                <div className="card recent-orders">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                        <button className="btn-link">View All</button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    <td>#QB-{1000 + i}</td>
                                    <td className="customer-cell">
                                        <div className="avatar-placeholder">A</div>
                                        <span>Alex Dough</span>
                                    </td>
                                    <td>2x Burgers, 1x Fries</td>
                                    <td className="font-bold">$24.50</td>
                                    <td>
                                        <span className="badge badge-preparing">Preparing</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card popular-items">
                    <div className="card-header">
                        <h3>Popular Items</h3>
                    </div>
                    <div className="items-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="popular-item">
                                <img src={`https://lh3.googleusercontent.com/aida-public/AB6AXuBRodguPyy61Mjdsy4wORcoveEyF1EuRCI18mk3_7TjK84EizfDI5jfwS-zfpsnLoNQhaZv5Hkj91aJnFyOWfX3MU781COENL_h63jo5rhaS_fs_7VAA1M4xZ2XfuMiytsTpFLFI70iTdTPv2RAeU3b_HmPW1g7kLjaPDtfyvR-RglbYQj3juU2USTe2WLvT3BvYi9mnRLbFBIzj8Gj26MVfi6miyahv0iRwix9Egj6fZVyH0SgOwwqkjxP3DLl45qpg4uQJbyACqY`} alt="Food" className="item-img" />
                                <div className="item-details">
                                    <h4>Mega Cheesy Burger</h4>
                                    <span>124 ordered</span>
                                </div>
                                <span className="item-price">$12.99</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Lazy import fix for icon used in variable
import { Users } from 'lucide-react';

export default Dashboard;
