# 🍔 QuickBite - Production-Ready Food Delivery Platform

<div align="center">

![QuickBite Logo](https://img.icons8.com/color/96/000000/restaurant.png)

**Enterprise-Grade Food Delivery Application**

[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Production Ready](https://img.shields.io/badge/Production-Ready-green)](https://github.com/Abhiboss07/QuickBites)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stars](https://img.shields.io/github/stars/Abhiboss07/QuickBites?style=social)](https://github.com/Abhiboss07/QuickBites)
[![Forks](https://img.shields.io/github/forks/Abhiboss07/QuickBites?style=social)](https://github.com/Abhiboss07/QuickBites)

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [🚀 Quick Start](#-quick-start)
- [📱 Screenshots](#-screenshots)
- [🔧 Configuration](#-configuration)
- [📊 Monitoring](#-monitoring)
- [🔒 Security](#-security)
- [💳 Payment Integration](#-payment-integration)
- [🔄 Real-time Features](#-real-time-features)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

**QuickBite** is a comprehensive, production-ready food delivery platform built with modern technologies. It features a robust Java Spring Boot backend, React Native mobile app, and React web admin panel. The application supports real-time order tracking, secure payments, and enterprise-grade security features.

### 🎯 Business Value
- **Restaurant Management**: Complete CRUD operations for restaurants and menu items
- **Order Management**: Real-time order tracking with status updates
- **Payment Processing**: Secure Razorpay integration with multiple payment methods
- **User Management**: Role-based access control (Customer, Restaurant Owner, Delivery Partner, Admin)
- **Location Services**: GPS-based restaurant discovery and delivery tracking

---

## ✨ Features

### 🍔 Core Features
- **Restaurant Discovery**: Browse restaurants by cuisine, location, and ratings
- **Menu Management**: Dynamic menu items with pricing and dietary information
- **Cart Management**: Add, remove, and update cart items with real-time calculations
- **Order Placement**: Seamless checkout with multiple delivery options
- **Real-time Tracking**: Live order status updates via WebSocket
- **Payment Processing**: Secure payment gateway integration (Razorpay)

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Multi-role user system
- **Rate Limiting**: API abuse prevention (60 requests/minute)
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Modern CSP, CORS, and security headers
- **CSRF Protection**: Stateful session management

### 📊 Enterprise Features
- **Monitoring**: Spring Actuator with Prometheus metrics
- **Health Checks**: Comprehensive health monitoring
- **Logging**: Structured logging with configurable levels
- **Caching**: Performance optimization with caching
- **Docker Support**: Complete containerization
- **API Documentation**: Interactive Swagger documentation

### 📱 Mobile Application Features
- **User Authentication**: Secure login with JWT tokens and OTP verification
- **Restaurant Discovery**: Browse restaurants by cuisine and location
- **Menu Management**: View restaurant menus with detailed items
- **Cart Management**: Add/remove items, manage quantities
- **Order Placement**: Complete checkout process with payment
- **Order Tracking**: Real-time order status updates
- **Location Services**: GPS-based restaurant discovery

### 🖥 Web Admin Panel Features
- **Dashboard**: Real-time stats on Revenue, Orders, and Deliveries
- **Order Management**: Kanban-style status updates (Pending -> Ready -> Out for Delivery)
- **Menu Management**: Add/Edit/Delete items with ease
- **Restaurant Management**: CRUD operations for restaurants
- **User Management**: Manage customers and delivery partners
- **Analytics Dashboard**: Sales and performance metrics
- **Secure Access**: Protected routes with Admin Authentication

---

## 🏗 Architecture

### 📐 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Admin     │    │   Backend API   │
│  (React Native) │◄──►│   (React.js)    │◄──►│  (Spring Boot)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   MySQL DB      │    │   Razorpay API  │
                       │   (Production)  │    │  (Payment)      │
                       └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Docker         │    │   Socket.io     │
                       │   Container      │    │   (Real-time)   │
                       └─────────────────┘    └─────────────────┘
```

### 🔄 Data Flow

1. **User Authentication**: JWT tokens with refresh mechanism
2. **Order Processing**: Cart → Order → Payment → Real-time Updates
3. **Restaurant Management**: CRUD operations with role-based access
4. **Payment Flow**: Razorpay integration with signature verification
5. **Real-time Updates**: WebSocket connections for order tracking

## 🚀 Quick Start

### 📋 Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **Docker**: Desktop installed and running
- **Maven**: 3.6 or higher
- **Git**: For version control

### 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/Abhiboss07/QuickBites.git
cd QuickBite

# Start Database
docker-compose up -d

# Start Backend
cd backend
mvn clean install
mvn spring-boot:run

# Start Web Admin (New Terminal)
cd ../frontend/web-admin
npm install
npm run dev

# Start Mobile App (New Terminal)
cd ../mobile
npm install
npx expo start
```

### 🌐 Access Points

- **Backend API**: http://localhost:8080
- **Web Admin**: http://localhost:5173
- **Mobile App**: Scan QR code from Expo CLI
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

## 🔧 Configuration

### 🗃 Database Configuration

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/quickbite
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 🔐 Security Configuration

```properties
# JWT Configuration
application.security.jwt.secret-key=your_base64_encoded_secret_key_here
application.security.jwt.expiration=86400000
application.security.jwt.refresh-token.expiration=604800000

# Rate Limiting
rate.limit.requests-per-minute=60
rate.limit.enabled=true
```

### � Payment Configuration

```properties
# Razorpay Configuration
razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret
razorpay.webhook.secret=your_webhook_secret
```

### 🌐 CORS Configuration

```properties
# CORS Settings
cors.allowed-origins=http://localhost:3000,http://localhost:5173,exp://localhost:8081
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

---

## 📊 Monitoring

### 🔍 Health Endpoints

```bash
# Application Health
curl http://localhost:8080/actuator/health

# Detailed Health Info
curl http://localhost:8080/actuator/health/details

# Application Metrics
curl http://localhost:8080/actuator/metrics

# Prometheus Metrics
curl http://localhost:8080/actuator/prometheus
```

### 📈 Key Metrics

- **HTTP Requests**: Request count, response times, status codes
- **Database**: Connection pool, query performance
- **JVM**: Memory usage, garbage collection
- **Custom**: Order count, user registrations, payment success rate

---

## 🔒 Security

### �️ Security Features

- **JWT Authentication**: Stateless authentication with refresh tokens
- **Role-Based Access**: USER, RESTAURANT_OWNER, DELIVERY_PARTNER, ADMIN
- **Rate Limiting**: 60 requests per minute per IP address
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Stateful session management

---

## 💳 Payment Integration

### 💰 Razorpay Integration

- **Payment Methods**: Credit Card, Debit Card, UPI, Net Banking, COD
- **Security**: Signature verification for webhook events
- **Refunds**: Automated refund processing
- **Webhooks**: Real-time payment status updates

---

## 🔄 Real-time Features

### 📡 Socket.io Integration

- **Order Tracking**: Real-time order status updates
- **Location Sharing**: Delivery partner location updates
- **Notifications**: Push notifications for order events
- **Connection Management**: Automatic reconnection handling

---

## � Deployment

### 🐳 Docker Deployment

```bash
# Build Docker Image
docker build -t quickbite-backend ./backend

# Run with Docker Compose
docker-compose up -d

# Scale Backend
docker-compose up -d --scale backend=3
```

### 🚀 Production Checklist

- [x] **Environment Variables**: All secrets configured
- [x] **Database**: Production database setup
- [x] **SSL/TLS**: HTTPS certificates installed
- [x] **Monitoring**: Health checks and metrics enabled
- [x] **Logging**: Production logging configured
- [x] **Security**: Security headers and rate limiting
- [x] **Backup**: Database backup strategy
- [x] **Scaling**: Auto-scaling configuration

---

## 🤝 Contributing

### 📋 How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 🐛 Bug Reporting

- Use the **Issues** tab for bug reports
- Provide detailed steps to reproduce
- Include screenshots if applicable
- Specify the environment (OS, browser, app version)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Spring Boot Team** for the excellent framework
- **React Native Team** for the mobile development platform
- **Razorpay** for the payment gateway services
- **Expo Team** for the development tools
- **Open Source Community** for the amazing libraries and tools

---

<div align="center">

**⭐ Star this repository if it helped you!**

**🍔 Happy Coding with QuickBite!**

</div>
