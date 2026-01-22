## 📦 **QuickBites — Cartoon-Themed Food Delivery App (Production Ready)**

![Image](https://cdn.dribbble.com/userupload/45221244/file/28720eb3c7d5979a622c22969beec31a.png?resize=752x\&vertical=center)

![Image](https://cdn.dribbble.com/userupload/25431966/file/original-f058e18a6788a3f80e1fe71dd4fdc267.gif)

![Image](https://cdn.dribbble.com/userupload/15671616/file/original-33c7735c8100fc23bf6eb5f7b3d5e069.png?crop=0x0-3201x2401\&format=webp\&resize=400x300\&vertical=center)

![Image](https://mir-s3-cdn-cf.behance.net/project_modules/hd/cfc43a55921801.56099ea9dc231.jpg)

---

# 🍔 QuickBites

**QuickBites** is a **full-stack, production-ready food delivery application** with a **fun cartoon UI**, smooth animations, real-time order tracking, and a **scalable Java backend**.
Built to feel playful for users—and rock-solid for businesses.

---

## ✨ Highlights

* 🎨 **Cartoon UI & Animations** (Lottie + motion effects)
* 📱 **Mobile App** for Users & Delivery Partners
* 🧑‍💼 **Web Panels** for Admin & Restaurants
* ☕ **Java 17 + Spring Boot Backend**
* 🗺️ **Live Order Tracking**
* 💳 **Secure Payments**
* 🔐 **Enterprise-grade Security**
* 🚀 **Production-ready Architecture**

---

## 🧠 System Architecture

```
Mobile Apps (User / Delivery)
        ↓
Web Apps (Admin / Restaurant)
        ↓
Spring Boot REST APIs (Java)
        ↓
Database (MySQL / PostgreSQL)
        ↓
3rd-Party Services (Maps, Payments, Notifications)
```

---

## 🛠️ Tech Stack

### Backend (Core Engine)

* **Java 17**
* **Spring Boot**
* Spring Security + JWT
* Hibernate / JPA
* MySQL / PostgreSQL
* Redis (optional caching)
* Swagger (API documentation)

### Frontend

* **React Native (Expo)** – Mobile apps
* **React.js** – Admin & Restaurant panels
* Tailwind CSS
* Lottie Animations
* Framer Motion

### Integrations

* Google Maps API – Live tracking
* Razorpay / Stripe – Payments
* Firebase – Push notifications
* Cloudinary – Image uploads

---

## 👥 User Roles & Features

### 👤 Customer App

* OTP / Email Login
* Location-based restaurant discovery
* Animated food cards 🍕
* Smart cart & checkout
* Live order tracking 🚴
* Coupons & offers
* Order history & re-order
* Ratings & reviews

### 🏪 Restaurant Panel

* Menu management (CRUD)
* Accept / reject orders
* Order status updates
* Earnings dashboard
* Working hours & availability

### 🛵 Delivery Partner App

* Login & verification
* Online / offline status
* Order assignment
* GPS navigation
* Delivery confirmation
* Earnings & history

### 🧑‍💼 Admin Panel

* User / restaurant / rider management
* Order monitoring & disputes
* Commission & payouts
* Coupon & banner management
* Analytics & reports
* Complaint handling

---

## 🗂️ Project Structure

### Backend (Spring Boot)

```
quickbites-backend/
│── controller/
│── service/
│── repository/
│── model/
│── dto/
│── security/
│── config/
│── exception/
│── QuickBitesApplication.java
```

### Frontend

```
quickbites-frontend/
│── components/
│── screens/
│── navigation/
│── services/
│── hooks/
│── assets/
│── animations/
```

---

## 🔐 Security & Performance

* JWT Authentication & Role-based access
* Encrypted passwords
* Input validation & error handling
* Optimized APIs
* Secure payment webhooks
* Centralized logging

---

## 🧪 Testing & Quality Assurance

* End-to-end flow testing
* API & integration testing
* Payment failure handling
* Network & edge-case testing
* UI responsiveness testing
* Bug fixes before production build

---

## 🚀 Getting Started

### Prerequisites

* Java 17+
* Node.js 18+
* MySQL / PostgreSQL
* Git

### Backend

```bash
cd quickbites-backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd quickbites-frontend
npm install
npm start
```

---

## 📄 Documentation

* API Docs: `/swagger-ui.html`
* Environment configs included
* Deployment guide provided

---

## 🎯 Goal

> **QuickBites combines playful design with enterprise-level engineering** — delivering a delightful user experience while staying scalable, secure, and ready for real-world traffic.

---

## ❤️ Contributing

Pull requests are welcome.
For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

MIT License — Free to use, modify, and distribute.
