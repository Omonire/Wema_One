import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LoadingPage } from './components/ui/Elements';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import BranchesPage from './pages/public/BranchesPage';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import QueuePage from './pages/customer/QueuePage';
import DocumentsPage from './pages/customer/DocumentsPage';
import PaymentsPage from './pages/customer/PaymentsPage';
import FeedbackPage from './pages/customer/FeedbackPage';

import BranchDashboard from './pages/branch/BranchDashboard';
import BranchConnectPage from './pages/branch/BranchConnectPage';

import AdminDashboard from './pages/admin/AdminDashboard';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingPage />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingPage />;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') return <Navigate to="/admin" />;
  if (user?.role === 'BRANCH_OFFICER' || user?.role === 'BRANCH_MANAGER') return <Navigate to="/branch" />;
  return <Navigate to="/customer" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

              <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
              <Route path="/customer" element={<PrivateRoute roles={['CUSTOMER']}><CustomerDashboard /></PrivateRoute>} />
              <Route path="/customer/queue" element={<PrivateRoute roles={['CUSTOMER']}><QueuePage /></PrivateRoute>} />
              <Route path="/customer/documents" element={<PrivateRoute roles={['CUSTOMER']}><DocumentsPage /></PrivateRoute>} />
              <Route path="/customer/payments" element={<PrivateRoute roles={['CUSTOMER']}><PaymentsPage /></PrivateRoute>} />
              <Route path="/customer/feedback" element={<PrivateRoute roles={['CUSTOMER']}><FeedbackPage /></PrivateRoute>} />

              <Route path="/branch" element={<PrivateRoute roles={['BRANCH_OFFICER', 'BRANCH_MANAGER']}><BranchDashboard /></PrivateRoute>} />
              <Route path="/branch/connect" element={<PrivateRoute roles={['BRANCH_OFFICER', 'BRANCH_MANAGER']}><BranchConnectPage /></PrivateRoute>} />

              <Route path="/admin" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/branch-connect" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><BranchConnectPage /></PrivateRoute>} />

              <Route path="*" element={<div className="text-center py-20"><h1 className="text-2xl font-bold text-gray-900">404</h1><p className="text-gray-500 mt-2">Page not found</p></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
