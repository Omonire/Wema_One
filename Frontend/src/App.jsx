import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AboutPage from './pages/public/AboutPage';
import HelpPage from './pages/public/HelpPage';

import CustomerDashboard from './pages/customer/CustomerDashboard';
import QueuePage from './pages/customer/QueuePage';
import DocumentsPage from './pages/customer/DocumentsPage';
import PaymentsPage from './pages/customer/PaymentsPage';
import FeedbackPage from './pages/customer/FeedbackPage';

import BranchDashboard from './pages/branch/BranchDashboard';
import BranchAppointmentsPage from './pages/branch/BranchAppointmentsPage';
import BranchDocumentsPage from './pages/branch/BranchDocumentsPage';
import BranchFeedbackPage from './pages/branch/BranchFeedbackPage';
import BranchConnectPage from './pages/branch/BranchConnectPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminBranchesPage from './pages/admin/AdminBranchesPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminFeedbackPage from './pages/admin/AdminFeedbackPage';
import AdminDocumentsPage from './pages/admin/AdminDocumentsPage';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingPage />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
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

function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <div className={`min-h-screen flex flex-col ${isLanding ? 'bg-surface' : 'bg-gray-50'}`}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />

          <Route path="/customer" element={<PrivateRoute roles={['CUSTOMER']}><CustomerDashboard /></PrivateRoute>} />
          <Route path="/customer/queue" element={<PrivateRoute roles={['CUSTOMER']}><QueuePage /></PrivateRoute>} />
          <Route path="/customer/documents" element={<PrivateRoute roles={['CUSTOMER']}><DocumentsPage /></PrivateRoute>} />
          <Route path="/customer/payments" element={<PrivateRoute roles={['CUSTOMER']}><PaymentsPage /></PrivateRoute>} />
          <Route path="/customer/feedback" element={<PrivateRoute roles={['CUSTOMER']}><FeedbackPage /></PrivateRoute>} />

          <Route path="/branch" element={<PrivateRoute roles={['BRANCH_OFFICER', 'BRANCH_MANAGER']}><BranchDashboard /></PrivateRoute>} />
          <Route path="/branch/appointments" element={<PrivateRoute roles={['BRANCH_OFFICER', 'BRANCH_MANAGER']}><BranchAppointmentsPage /></PrivateRoute>} />
          <Route path="/branch/documents" element={<PrivateRoute roles={['BRANCH_OFFICER', 'BRANCH_MANAGER']}><BranchDocumentsPage /></PrivateRoute>} />
          <Route path="/branch/feedback" element={<PrivateRoute roles={['BRANCH_OFFICER', 'BRANCH_MANAGER']}><BranchFeedbackPage /></PrivateRoute>} />
          <Route path="/branch/connect" element={<PrivateRoute roles={['BRANCH_OFFICER', 'BRANCH_MANAGER']}><BranchConnectPage /></PrivateRoute>} />

          <Route path="/admin" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminAnalyticsPage /></PrivateRoute>} />
          <Route path="/admin/branches" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminBranchesPage /></PrivateRoute>} />
          <Route path="/admin/services" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminServicesPage /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminUsersPage /></PrivateRoute>} />
          <Route path="/admin/feedback" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminFeedbackPage /></PrivateRoute>} />
          <Route path="/admin/documents" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><AdminDocumentsPage /></PrivateRoute>} />
          <Route path="/admin/branch-connect" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN']}><BranchConnectPage /></PrivateRoute>} />

          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <p className="text-gray-500 mb-6">Page not found</p>
              <a href="/" className="bg-primary-container text-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary transition-all shadow-[0_2px_8px_rgba(0,82,255,0.25)]">Go Home</a>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
