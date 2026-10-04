import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import { useAuth } from '../../context/AuthContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: response } = await api.get('/stores/my');
        setData(response);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setSortOrder('ASC'); }
  };

  const sortedRatings = data?.ratings ? [...data.ratings].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortOrder === 'ASC' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'ASC' ? 1 : -1;
    return 0;
  }) : [];

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  if (!data?.store) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Store Found</h3>
          <p>Your account doesn't have a store assigned yet. Please contact an admin.</p>
        </div>
      </div>
    );
  }

  const { store, ratings } = data;

  const columns = [
    { field: 'name', label: 'Customer Name', sortable: true },
    { field: 'email', label: 'Email', sortable: true },
    { field: 'rating', label: 'Rating', sortable: true },
    { field: 'updated_at', label: 'Date', sortable: true },
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Store Dashboard</h1>
        <p className="page-subtitle">Welcome, {user?.name?.split(' ')[0]}! Here's how your store is doing.</p>
      </div>

      {/* Store Info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '0.5rem' }}>{store.name}</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{store.email}</p>
            {store.address && <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{store.address}</p>}
          </div>
          <div style={{ textAlign: 'right' }}>
            {store.average_rating ? (
              <>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--gray-800)', lineHeight: 1 }}>
                  {parseFloat(store.average_rating).toFixed(1)}
                </div>
                <StarRating rating={Math.round(store.average_rating)} readonly size="md" />
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                  Based on {store.total_ratings} rating{store.total_ratings !== 1 ? 's' : ''}
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No ratings yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Ratings Distribution */}
      {ratings.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-700)' }}>Rating Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratings.filter((r) => r.rating === star).length;
              const pct = ratings.length > 0 ? (count / ratings.length) * 100 : 0;
              return (
                <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '0.875rem', width: '1.5rem' }}>{star}★</span>
                  <div style={{ flex: 1, height: '0.5rem', background: 'var(--gray-100)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: '#f59e0b', borderRadius: '9999px', transition: 'width 0.5s' }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', width: '3rem', textAlign: 'right' }}>{count} ({pct.toFixed(0)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ratings Table */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--gray-700)' }}>
          Ratings from Users ({ratings.length})
        </h3>
        <SortableTable
          columns={columns}
          data={sortedRatings}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No ratings yet"
          renderRow={(r) => (
            <tr key={r.id}>
              <td style={{ fontWeight: '500' }}>{r.name}</td>
              <td>{r.email}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <StarRating rating={r.rating} readonly size="sm" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>({r.rating})</span>
                </div>
              </td>
              <td style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                {new Date(r.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default OwnerDashboard;
