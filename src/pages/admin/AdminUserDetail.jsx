import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUser, FiMail, FiMapPin, FiStar } from 'react-icons/fi';

const roleBadge = (role) => (
  <span className={`badge badge-${role}`} style={{ textTransform: 'capitalize', fontSize: '0.875rem', padding: '0.375rem 0.875rem' }}>
    {role?.replace('_', ' ')}
  </span>
);

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setUser(data);
      } catch (err) {
        toast.error('Failed to load user details');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  if (!user) return null;

  const InfoRow = ({ icon, label, value }) => (
    <div style={{
      display: 'flex', gap: '1rem', alignItems: 'flex-start',
      padding: '1rem', borderBottom: '1px solid var(--gray-100)'
    }}>
      <div style={{ color: 'var(--primary)', marginTop: '0.125rem', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ color: 'var(--gray-800)', fontWeight: '500' }}>{value || <span style={{ color: 'var(--gray-400)' }}>Not provided</span>}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate('/admin/users')}
        style={{ marginBottom: '1.5rem' }}
      >
        <FiArrowLeft /> Back to Users
      </button>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem', fontWeight: '700', flexShrink: 0
          }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-800)' }}>{user.name}</h2>
            <div style={{ marginTop: '0.25rem' }}>{roleBadge(user.role)}</div>
          </div>
        </div>

        <InfoRow icon={<FiUser />} label="Full Name" value={user.name} />
        <InfoRow icon={<FiMail />} label="Email Address" value={user.email} />
        <InfoRow icon={<FiMapPin />} label="Address" value={user.address} />

        {user.role === 'store_owner' && (
          <div style={{
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
            padding: '1rem', borderBottom: '1px solid var(--gray-100)'
          }}>
            <div style={{ color: '#f59e0b', marginTop: '0.125rem', flexShrink: 0 }}><FiStar /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Store Rating</div>
              <div style={{ color: 'var(--gray-800)', fontWeight: '500' }}>
                {user.store_rating
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#f59e0b', fontSize: '1.25rem' }}>★</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>{parseFloat(user.store_rating).toFixed(1)}</span>
                      <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>/ 5.0</span>
                    </span>
                  : <span style={{ color: 'var(--gray-400)' }}>No ratings yet</span>
                }
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '1rem 1rem 0' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
            Member since {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
