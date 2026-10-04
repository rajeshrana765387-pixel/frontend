import { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiUsers, FiShoppingBag, FiStar, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div className="stat-card" style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
      <div className="stat-icon" style={{ background: color + '20', color }}>
        {icon}
      </div>
      <div className="stat-value">{value ?? '...'}</div>
      <div className="stat-label">{label}</div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/users/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Welcome back, {user?.name?.split(' ')[0]}! Here's an overview of the platform.</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard icon={<FiUsers />} label="Total Users" value={stats?.totalUsers} color="#4f46e5" to="/admin/users" />
            <StatCard icon={<FiShoppingBag />} label="Total Stores" value={stats?.totalStores} color="#0ea5e9" to="/admin/stores" />
            <StatCard icon={<FiStar />} label="Total Ratings" value={stats?.totalRatings} color="#f59e0b" to="/admin/stores" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--gray-700)' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  <FiUsers /> Manage Users
                </Link>
                <Link to="/admin/stores" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  <FiShoppingBag /> Manage Stores
                </Link>
                <Link to="/admin/users/new" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                  + Add New User
                </Link>
                <Link to="/admin/stores/new" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                  + Add New Store
                </Link>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--gray-700)' }}>
                Platform Summary
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                  <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Avg Ratings per Store</span>
                  <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>
                    {stats?.totalStores > 0 ? (stats.totalRatings / stats.totalStores).toFixed(1) : '0'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                  <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Total Registered Users</span>
                  <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{stats?.totalUsers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
                  <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>Registered Stores</span>
                  <span style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{stats?.totalStores}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
