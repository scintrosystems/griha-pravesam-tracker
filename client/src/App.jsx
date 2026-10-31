import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PublicView from './pages/PublicView';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, loading } = useAuth();

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<PublicView />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              loading ? null : isAdmin ? (
                <AdminDashboard
                  sidebarOpen={sidebarOpen}
                  onCloseSidebar={() => setSidebarOpen(false)}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router basename="/griha-pravesam-tracker">
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}