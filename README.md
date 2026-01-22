# QuickBites - Cartoon Food Delivery App

## 🍔 Project Overview
A fully functional, production-ready food delivery application with a playful cartoon theme.
- **Frontend Mobile**: React Native (Expo)
- **Frontend Web Admin**: React (Vite)
- **Backend**: Spring Boot 3, Java 17, MySQL

## 🚀 Getting Started

### 1. Prerequisites
- Node.js & npm
- Java 17+ (JDK)
- Docker (optional, for Database) OR local MySQL server

### 2. Database Setup
If you have Docker installed:
```bash
docker-compose up -d
```
Or manually create a MySQL database named `quickbitedb` with user `root` and password `password`.

### 3. Backend Setup
```bash
cd backend
# Windows
./mvnw spring-boot:run
# Linux/Mac
./mvnw spring-boot:run
```
Server runs at `http://localhost:8080`

### 4. Mobile App (Consumer)
```bash
cd frontend/mobile
npm install
npm start
```
- Press `a` to run on Android Emulator
- Press `w` to run on Web
- Scan QR code with Expo Go on your phone

### 5. Web Admin Panel
```bash
cd frontend/web-admin
npm install
npm run dev
```
Access at `http://localhost:5173`

## 🏗️ Architecture
- **Authentication**: JWT based stateless auth.
- **API**: RESTful endpoints.
- **Design**: Custom CSS variables & React Native StyleSheet.

## 📱 Features
- Pixel-perfect "Cartoon" UI
- JWT Authentication
- Dynamic Menu & Restaurants
- Admin Dashboard
