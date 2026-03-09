import { Routes, Route, Navigate } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import Home from './pages/Home'
import Restaurant from './pages/Restaurant'
import Cart from './pages/Cart'
import Tracking from './pages/Tracking'
import Search from './pages/Search'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Test from './pages/Test'
import DebugLogin from './pages/DebugLogin'
import SimpleLoginTest from './pages/SimpleLoginTest'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/debug-login" element={<DebugLogin />} />
            <Route path="/simple-login" element={<SimpleLoginTest />} />
            <Route path="/home" element={<Home />} />
            <Route path="/restaurant/:id" element={<Restaurant />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/search" element={<Search />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
