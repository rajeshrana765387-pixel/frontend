import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiShoppingBag, FiUsers, FiLogOut, FiMenu, FiX, FiSettings } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/admin/stores', label: 'Stores', icon: <FiShoppingBag /> },
    { to: '/admin/users', label: 'Users', icon: <FiUsers /> },
  ];

  const userLinks = [
    { to: '/stores', label: 'Stores', icon: <FiShoppingBag /> },
    { to: '/profile', label: 'Profile', icon: <FiSettings /> },
  ];

  const ownerLinks = [
    { to: '/owner/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/profile', label: 'Profile', icon: <FiSettings /> },
  ];

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'store_owner'
      ? ownerLinks
      : userLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '2rem', height: '2rem', background: 'var(--primary)',
              borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '1rem'
            }}>SR</div>
            <span style={{ fontWeight: '700', fontSize: '1.125rem', color: 'var(--gray-800)' }}>StoreRate</span>
          </Link>

          {/* Desktop Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                  textDecoration: 'none', fontSize: '0.875rem', fontWeight: '500',
                  transition: 'all 0.15s',
                  background: isActive(link.to) ? '#ede9fe' : 'transparent',
                  color: isActive(link.to) ? 'var(--primary)' : 'var(--gray-600)',
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Info + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--gray-800)' }}>
                {user?.name?.split(' ')[0]}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--gray-500)', textTransform: 'capitalize' }}>
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
