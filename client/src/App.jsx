import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import QRPage from './pages/QRPage';
import WeeklyReview from './pages/WeeklyReview';
import ReturnRequest from './pages/ReturnRequest';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminReturns from './pages/AdminReturns';
import AdminPoints from './pages/AdminPoints';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      <Route path="/qr/:userId" element={<QRPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/review" element={
        <ProtectedRoute>
          <WeeklyReview />
        </ProtectedRoute>
      } />
      
      <Route path="/return" element={
        <ProtectedRoute>
          <ReturnRequest />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/returns" element={
        <ProtectedRoute roles={['admin']}>
          <AdminReturns />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/points" element={
        <ProtectedRoute roles={['admin']}>
          <AdminPoints />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
