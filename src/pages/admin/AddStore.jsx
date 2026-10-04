import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

const AddStore = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [storeOwners, setStoreOwners] = useState([]);

  useEffect(() => {
    // Fetch all store owners for assignment
    const fetchOwners = async () => {
      try {
        const { data } = await api.get('/users?role=store_owner');
        setStoreOwners(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Store name is required';
    else if (form.name.trim().length < 20) newErrors.name = 'Store name must be at least 20 characters';
    else if (form.name.trim().length > 60) newErrors.name = 'Store name must not exceed 60 characters';

    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Must be a valid email';

    if (form.address && form.address.length > 400) newErrors.address = 'Address must not exceed 400 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.owner_id) delete payload.owner_id;
      await api.post('/stores', payload);
      toast.success('Store created successfully!');
      navigate('/admin/stores');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const errMap = {};
        serverErrors.forEach((e) => { errMap[e.path] = e.msg; });
        setErrors(errMap);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create store');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/stores')} style={{ marginBottom: '1.5rem' }}>
        <FiArrowLeft /> Back to Stores
      </button>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '1.5rem' }}>
          Add New Store
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Store Name <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(20–60 chars)</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter store name (min 20 characters)"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{form.name.length}/60</span>
          </div>

          <div className="form-group">
            <label className="form-label">Store Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="store@example.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Address <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional, max 400 chars)</span></label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? 'error' : ''}`}
              style={{ resize: 'vertical', minHeight: '4.5rem' }}
              placeholder="Store address"
              maxLength={400}
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Store Owner <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
            <select name="owner_id" value={form.owner_id} onChange={handleChange} className="form-select">
              <option value="">-- No Owner Assigned --</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>{owner.name} ({owner.email})</option>
              ))}
            </select>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
              Only users with "Store Owner" role will appear here
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Creating...' : 'Create Store'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/stores')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
