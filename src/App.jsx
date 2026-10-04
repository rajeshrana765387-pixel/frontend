import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Auth Pages (Dedicated by Role)
import Login from './pages/Login';
import AdminLogin from './pages/admin/AdminLogin';
import OwnerLogin from './pages/owner/OwnerLogin';
import Register from './pages/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AddUser from './pages/admin/AddUser';
import AdminStores from './pages/admin/AdminStores';
import AddStore from './pages/admin/AddStore';

// User & Store Owner Pages
import StoreList from './pages/user/StoreList';
import Profile from './pages/user/Profile';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {children}
    </main>
  </>
);

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '0.5rem', fontSize: '0.875rem' },
          }}
        />
        <Routes>
          {/* Public Auth Routes (Role-Specific) */}
          <Route path="/login" element={<Login />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/register" element={<Register />} />

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AdminDashboard /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AdminUsers /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AddUser /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AdminUserDetail /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AdminStores /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stores/new"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout><AddStore /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Normal User Routes */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <AppLayout><StoreList /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['user', 'store_owner']}>
                <AppLayout><Profile /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Store Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['store_owner']}>
                <AppLayout><OwnerDashboard /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
