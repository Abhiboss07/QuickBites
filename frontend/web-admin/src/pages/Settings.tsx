import React, { useState } from 'react';
import './admin-pages.css';

const Settings = () => {
    const [restaurantName, setRestaurantName] = useState('QuickBites Central');
    const [email, setEmail] = useState('admin@quickbites.com');
    const [notifications, setNotifications] = useState(true);
    const [newOrdersAlert, setNewOrdersAlert] = useState(true);

    const handleSave = () => {
        alert('Settings Saved Successfully!');
    };

    return (
        <div className="settings-container">
            <header>
                <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>Settings</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your restaurant preferences and account settings.</p>
            </header>

            <div className="settings-card">
                <div className="settings-section">
                    <h3 className="settings-title">General Information</h3>
                    <div className="form-row">
                        <div className="setting-input-group">
                            <label className="setting-label">Restaurant Name</label>
                            <input
                                type="text"
                                className="setting-input"
                                value={restaurantName}
                                onChange={(e) => setRestaurantName(e.target.value)}
                            />
                        </div>
                        <div className="setting-input-group">
                            <label className="setting-label">Contact Email</label>
                            <input
                                type="email"
                                className="setting-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="setting-input-group">
                        <label className="setting-label">Address</label>
                        <input
                            type="text"
                            className="setting-input"
                            defaultValue="123 Culinary Avenue, Foodie City, FC 90210"
                        />
                    </div>
                </div>

                <div className="settings-section">
                    <h3 className="settings-title">Notifications</h3>
                    <div className="toggle-switch">
                        <span className="toggle-label">Enable Email Notifications</span>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            style={{ width: 20, height: 20, accentColor: 'var(--color-primary)' }}
                        />
                    </div>
                    <div className="toggle-switch">
                        <span className="toggle-label">Sound Alert on New Order</span>
                        <input
                            type="checkbox"
                            checked={newOrdersAlert}
                            onChange={(e) => setNewOrdersAlert(e.target.checked)}
                            style={{ width: 20, height: 20, accentColor: 'var(--color-primary)' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button className="btn-primary" onClick={handleSave}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
