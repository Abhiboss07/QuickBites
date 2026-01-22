import React, { useState } from 'react';
import { Plus, Image, Edit2, Trash } from 'lucide-react';
import './dashboard.css';
import './orders.css'; // Reusing button styles

const MenuManagement = () => {
    const [items, setItems] = useState([
        { id: 1, name: "Mega Cheesy Burger", price: 12.99, category: "Burgers", available: true },
        { id: 2, name: "Rainbow Fries", price: 4.50, category: "Sides", available: true },
        { id: 3, name: "Berry Blast Shake", price: 6.99, category: "Drinks", available: true },
    ]);

    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="dashboard-container">
            <div className="card-header">
                <h2>Menu Items</h2>
                <button className="btn-primary flex items-center gap-2" onClick={() => setIsFormOpen(!isFormOpen)}>
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            {isFormOpen && (
                <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Add New Item</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label>Item Name</label>
                            <input type="text" className="input-field" placeholder="e.g. Super Burger" />
                        </div>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input type="number" className="input-field" placeholder="0.00" />
                        </div>
                        <div className="form-group">
                            <label>Category</label>
                            <select className="input-field">
                                <option>Burgers</option>
                                <option>Sides</option>
                                <option>Drinks</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="text" className="input-field" placeholder="https://..." />
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" onClick={() => setIsFormOpen(false)}>Save Item</button>
                        <button className="btn-icon" onClick={() => setIsFormOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="card">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    <div className="avatar-placeholder" style={{ borderRadius: '8px' }}>
                                        <Image size={16} />
                                    </div>
                                </td>
                                <td className="font-bold">{item.name}</td>
                                <td><span className="badge">{item.category}</span></td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${item.available ? 'badge-success' : 'badge-warning'}`}>
                                        {item.available ? 'Available' : 'Sold Out'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-icon info"><Edit2 size={16} /></button>
                                        <button className="btn-icon primary"><Trash size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .input-field {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    margin-top: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default MenuManagement;
