import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, Settings, LogOut } from 'lucide-react';
import './layout.css';

const Layout = () => {
    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <UtensilsCrossed size={24} color="white" />
                    </div>
                    <h1 className="logo-text logo-font">Quick<span>Bites</span></h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={22} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/orders" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                        <ShoppingBag size={22} />
                        <span>Orders</span>
                    </NavLink>
                    <NavLink to="/menu" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                        <UtensilsCrossed size={22} />
                        <span>Menu</span>
                    </NavLink>
                    <NavLink to="/customers" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                        <Users size={22} />
                        <span>Customers</span>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                        <Settings size={22} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <h2 className="page-title">Admin Overview</h2>
                    <div className="user-profile">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQVBnLWOYGb5g5Rfr3cZHirgQ5yuf-WYwEinX8rllqyNowwQNJkzbYg-cZrjtr41aQ4hf3jOleIIKJ-bDhGpZ5bdV-yNwFT2c2DES1rDoVHdBh9kbaGd9EmJn0DXL5vZb1h56CIrzCndxDhzujTaBMsAZc2JcRsOZGqB941d9yOLL_kce7OVHxLuz9DYGTrNq0Q2Z0gH8lPrpxNtH-zbUAReLp9Y-XaW05Jv81msbd-4K2or94JZhdk3ggjO75rIeIf1_psS7Y5a0"
                            alt="Admin"
                            className="avatar"
                        />
                        <span className="username">Chef Admin</span>
                    </div>
                </header>

                <div className="content-scroll">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
