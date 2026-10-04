import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SortableTable from '../../components/SortableTable';
import { FiSearch, FiPlus } from 'react-icons/fi';

const AdminStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchStores = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      const { data } = await api.get(`/stores/admin/list?${params}`);
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

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const columns = [
    { field: 'name', label: 'Store Name', sortable: true },
    { field: 'email', label: 'Email', sortable: true },
    { field: 'address', label: 'Address', sortable: true },
    { field: 'owner_name', label: 'Owner', sortable: false },
    { field: 'average_rating', label: 'Avg. Rating', sortable: true },
    { field: 'total_ratings', label: 'Total Ratings', sortable: false },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h1 className="page-title">Stores</h1>
          <p className="page-subtitle">Manage all registered stores</p>
        </div>
        <Link to="/admin/stores/new" className="btn btn-primary">
          <FiPlus /> Add Store
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); fetchStores(); }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Store Name</label>
            <input name="name" value={filters.name} onChange={handleFilterChange} className="form-input" placeholder="Search by name..." />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Email</label>
            <input name="email" value={filters.email} onChange={handleFilterChange} className="form-input" placeholder="Search by email..." />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Address</label>
            <input name="address" value={filters.address} onChange={handleFilterChange} className="form-input" placeholder="Search by address..." />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <FiSearch /> Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => {
              setFilters({ name: '', email: '', address: '' });
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
              <td style={{ fontWeight: '500' }}>{store.name}</td>
              <td>{store.email}</td>
              <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {store.address || <span style={{ color: 'var(--gray-400)' }}>—</span>}
              </td>
              <td>{store.owner_name || <span style={{ color: 'var(--gray-400)' }}>—</span>}</td>
              <td>
                {store.average_rating
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ color: '#f59e0b' }}>★</span>
                      {parseFloat(store.average_rating).toFixed(1)}
                    </span>
                  : <span style={{ color: 'var(--gray-400)' }}>No ratings</span>
                }
              </td>
              <td>{store.total_ratings}</td>
            </tr>
          )}
        />
      )}
    </div>
  );
};

export default AdminStores;
