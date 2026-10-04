import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import SortableTable from '../../components/SortableTable';
import { FiSearch, FiPlus, FiEye } from 'react-icons/fi';

const roleBadge = (role) => (
  <span className={`badge badge-${role}`} style={{ textTransform: 'capitalize' }}>
    {role?.replace('_', ' ')}
  </span>
);

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      const { data } = await api.get(`/users?${params}`);
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const columns = [
    { field: 'name', label: 'Name', sortable: true },
    { field: 'email', label: 'Email', sortable: true },
    { field: 'address', label: 'Address', sortable: true },
    { field: 'role', label: 'Role', sortable: true },
    { field: 'store_rating', label: 'Store Rating', sortable: false },
    { field: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage all users on the platform</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">
          <FiPlus /> Add User
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Name</label>
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
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Role</label>
            <select name="role" value={filters.role} onChange={handleFilterChange} className="form-select">
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <FiSearch /> Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => {
              setFilters({ name: '', email: '', address: '', role: '' });
              setTimeout(fetchUsers, 0);
            }}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <SortableTable
          columns={columns}
          data={users}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage="No users found"
          renderRow={(user) => (
            <tr key={user.id}>
              <td style={{ fontWeight: '500' }}>{user.name}</td>
              <td>{user.email}</td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.address || <span style={{ color: 'var(--gray-400)' }}>—</span>}
              </td>
              <td>{roleBadge(user.role)}</td>
              <td>
                {user.role === 'store_owner' && user.store_rating
                  ? <span>⭐ {parseFloat(user.store_rating).toFixed(1)}</span>
                  : <span style={{ color: 'var(--gray-400)' }}>—</span>
                }
              </td>
              <td>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <FiEye /> View
                </button>
              </td>
            </tr>
          )}
        />
      )}
    </div>
  );
};

export default AdminUsers;
