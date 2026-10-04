import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

const AddUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    else if (form.name.trim().length < 20) newErrors.name = 'Name must be at least 20 characters';
    else if (form.name.trim().length > 60) newErrors.name = 'Name must not exceed 60 characters';

    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Must be a valid email';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8 || form.password.length > 16) newErrors.password = 'Password must be 8-16 characters';
    else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Must contain at least one uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) newErrors.password = 'Must contain at least one special character';

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
      await api.post('/users', form);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const errMap = {};
        serverErrors.forEach((e) => { errMap[e.path] = e.msg; });
        setErrors(errMap);
      } else {
        toast.error(err.response?.data?.message || 'Failed to create user');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/users')} style={{ marginBottom: '1.5rem' }}>
        <FiArrowLeft /> Back to Users
      </button>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '1.5rem' }}>
          Add New User
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(20–60 chars)</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter full name (min 20 characters)"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{form.name.length}/60</span>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="user@example.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(8-16 chars)</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={{ paddingRight: '2.5rem' }}
                placeholder="8-16 chars, uppercase + special char"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', background: 'none',
                  border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 0
                }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Address <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional, max 400 chars)</span></label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? 'error' : ''}`}
              style={{ resize: 'vertical', minHeight: '4.5rem' }}
              placeholder="User's address"
              maxLength={400}
            />
            {errors.address && <span className="form-error">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="form-select">
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
