import React from 'react';
import './admin-pages.css';

const MOCK_CUSTOMERS = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', orders: 15, totalSpent: '$450.00', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@test.com', orders: 3, totalSpent: '$85.50', status: 'Inactive' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.b@domain.org', orders: 22, totalSpent: '$720.25', status: 'Active' },
    { id: 4, name: 'Diana Prince', email: 'diana@themyscira.net', orders: 8, totalSpent: '$210.00', status: 'Active' },
    { id: 5, name: 'Evan Wright', email: 'evan.w@workplace.com', orders: 1, totalSpent: '$25.00', status: 'Active' },
];

const Customers = () => {
    return (
        <div className="customers-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Customers</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>View and manage your customer base.</p>
                </div>
                <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Export CSV
                </button>
            </header>

            <div className="table-card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Email Address</th>
                            <th>Total Orders</th>
                            <th>Total Spent</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_CUSTOMERS.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div className="customer-cell">
                                        <div className="avatar-placeholder" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                                            {customer.name.charAt(0)}
                                        </div>
                                        <span style={{ fontWeight: 500 }}>{customer.name}</span>
                                    </div>
                                </td>
                                <td>{customer.email}</td>
                                <td>{customer.orders}</td>
                                <td>{customer.totalSpent}</td>
                                <td>
                                    <span className={`status-badge ${customer.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions-cell">
                                        <button className="action-btn btn-view">Details</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customers;
