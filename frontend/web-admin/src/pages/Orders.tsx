import React, { useState } from 'react';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';
import './dashboard.css'; // Reusing dashboard styles
import './orders.css';

const Orders = () => {
    // Mock Data
    const [orders, setOrders] = useState([
        { id: 1001, customer: "Alex Dough", items: "2x Burgers, 1x Fries", total: 24.50, status: "PENDING", time: "12:30 PM" },
        { id: 1002, customer: "Sarah Smith", items: "1x Taco Combo", total: 14.20, status: "PREPARING", time: "12:35 PM" },
        { id: 1003, customer: "John Doe", items: "3x Pizza", total: 45.00, status: "READY", time: "12:40 PM" },
    ]);

    const updateStatus = (id: number, newStatus: string) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <span className="badge badge-warning">Pending</span>;
            case 'PREPARING': return <span className="badge badge-preparing">Preparing</span>;
            case 'READY': return <span className="badge badge-success">Ready</span>;
            default: return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="card-header">
                <h2>Active Orders</h2>
                <div className="flex gap-2">
                    <button className="btn-filter active">All</button>
                    <button className="btn-filter">Pending</button>
                    <button className="btn-filter">Preparing</button>
                </div>
            </div>

            <div className="card">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Time</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#QB-{order.id}</td>
                                    <td>{order.time}</td>
                                    <td className="customer-cell">
                                        <div className="avatar-placeholder">{order.customer[0]}</div>
                                        <span>{order.customer}</span>
                                    </td>
                                    <td>{order.items}</td>
                                    <td className="font-bold">${order.total.toFixed(2)}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {order.status === 'PENDING' && (
                                                <button className="btn-icon success" onClick={() => updateStatus(order.id, 'PREPARING')}>
                                                    <CheckCircle size={18} /> Accept
                                                </button>
                                            )}
                                            {order.status === 'PREPARING' && (
                                                <button className="btn-icon primary" onClick={() => updateStatus(order.id, 'READY')}>
                                                    <Package size={18} /> Ready
                                                </button>
                                            )}
                                            {order.status === 'READY' && (
                                                <button className="btn-icon info" onClick={() => updateStatus(order.id, 'DELIVERED')}>
                                                    <Truck size={18} /> Assign Driver
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
