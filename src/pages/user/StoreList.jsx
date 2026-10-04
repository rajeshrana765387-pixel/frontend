import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import { FiSearch } from 'react-icons/fi';

const RatingModal = ({ store, existingRating, onClose, onSuccess }) => {
  const [rating, setRating] = useState(existingRating || 0);
  const [loading, setLoading] = useState(false);
  const isUpdate = !!existingRating;

  const handleSubmit = async () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      if (isUpdate) {
        await api.put(`/ratings/${store.id}`, { rating });
      } else {
        await api.post('/ratings', { store_id: store.id, rating });
      }
      toast.success(isUpdate ? 'Rating updated!' : 'Rating submitted!');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{isUpdate ? 'Update Rating' : 'Rate Store'}</h3>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          You're rating: <strong>{store.name}</strong>
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <StarRating rating={rating} onRate={setRating} size="lg" />
        </div>
        <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          {rating === 0 ? 'Click a star to rate' : `You selected ${rating} star${rating > 1 ? 's' : ''}`}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !rating} style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Submitting...' : isUpdate ? 'Update Rating' : 'Submit Rating'}
          </button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [ratingModal, setRatingModal] = useState(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.address) params.append('address', filters.address);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      const { data } = await api.get(`/stores?${params}`);
      setStores(data);
    } catch (err) {
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(field); setSortOrder('ASC'); }
  };

  const columns = [
    { field: 'name', label: 'Store Name', sortable: true },
    { field: 'address', label: 'Address', sortable: true },
    { field: 'average_rating', label: 'Overall Rating', sortable: true },
    { field: 'user_rating', label: 'Your Rating', sortable: false },
    { field: 'actions', label: 'Action', sortable: false },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Browse Stores</h1>
        <p className="page-subtitle">Find and rate stores on our platform</p>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); fetchStores(); }} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '180px' }}>
            <label className="form-label">Store Name</label>
            <input
              name="name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="form-input"
              placeholder="Search by name..."
            />
          </div>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '180px' }}>
            <label className="form-label">Address</label>
            <input
              name="address"
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              className="form-input"
              placeholder="Search by address..."
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary">
              <FiSearch /> Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => {
              setFilters({ name: '', address: '' });
              setTimeout(fetchStores, 0);
            }}>Clear</button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <SortableTable
          columns={columns}
          data={stores}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No stores found"
          renderRow={(store) => (
            <tr key={store.id}>
              <td>
                <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{store.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{store.email}</div>
              </td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {store.address || <span style={{ color: 'var(--gray-400)' }}>—</span>}
              </td>
              <td>
                {store.average_rating ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <StarRating rating={Math.round(store.average_rating)} readonly size="sm" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      {parseFloat(store.average_rating).toFixed(1)} ({store.total_ratings} ratings)
                    </span>
                  </div>
                ) : (
                  <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>No ratings yet</span>
                )}
              </td>
              <td>
                {store.user_rating ? (
                  <StarRating rating={store.user_rating} readonly size="sm" />
                ) : (
                  <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>Not rated</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setRatingModal(store)}
                >
                  {store.user_rating ? '✏️ Modify' : '⭐ Rate'}
                </button>
              </td>
            </tr>
          )}
        />
      )}

      {ratingModal && (
        <RatingModal
          store={ratingModal}
          existingRating={ratingModal.user_rating}
          onClose={() => setRatingModal(null)}
          onSuccess={() => { setRatingModal(null); fetchStores(); }}
        />
      )}
    </div>
  );
};

export default StoreList;
