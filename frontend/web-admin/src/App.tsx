import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import MenuManagement from './pages/MenuManagement';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="menu" element={<MenuManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<div className="p-10"><h1>404 Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
