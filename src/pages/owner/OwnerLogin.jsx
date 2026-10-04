import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiHome } from 'react-icons/fi';

const OwnerLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Store Owner email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleFillDemo = () => {
    setForm({
      email: 'owner@storerating.com',
      password: 'Owner@1234',
    });
    setErrors({});
    toast.success('Store Owner credentials filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'store_owner' && user.role !== 'admin') {
        toast.error('Notice: This account is a Normal User. Redirecting to store list.');
        navigate('/stores');
        return;
      }
      toast.success(`Welcome back, ${user.name?.split(' ')[0]}!`);
      navigate('/owner/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please verify credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(rgba(6, 78, 59, 0.85), rgba(15, 23, 42, 0.88)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80") center center / cover no-repeat fixed',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '26rem' }}>
        {/* Role Navigation Switcher */}
        <div style={{
          display: 'flex', background: 'rgba(15, 23, 42, 0.7)',
          padding: '0.35rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)'
        }}>
          <Link to="/login" style={{
            flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '500'
          }}>
            👤 User
          </Link>
          <div style={{
            flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem',
            background: '#059669', color: 'white', borderRadius: '0.5rem', fontWeight: '600'
          }}>
            🏪 Store Owner
          </div>
          <Link to="/admin/login" style={{
            flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '500'
          }}>
            🛡️ Admin
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3.75rem', height: '3.75rem', background: '#065f46',
            borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: '2px solid rgba(52, 211, 153, 0.4)'
          }}>
            <FiShoppingBag style={{ color: '#6ee7b7', fontSize: '1.75rem' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>Store Owner Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Store analytics, customer ratings & insights
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Store Owner Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray-400)'
                }} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="owner@storerating.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{
                  position: 'absolute', left: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--gray-400)'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '0.75rem', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    color: 'var(--gray-400)', cursor: 'pointer', padding: 0
                  }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{
                width: '100%', justifyContent: 'center', marginTop: '0.5rem',
                backgroundColor: '#059669', borderColor: '#059669'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In as Store Owner'}
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div style={{
            marginTop: '1.25rem', padding: '0.875rem', background: '#f0fdf4',
            borderRadius: '0.625rem', border: '1px dashed #86efac', textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: '#166534', marginBottom: '0.5rem', fontWeight: '500' }}>
              🔑 Quick Test Credentials
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', background: 'white' }}
            >
              <FiCheck style={{ color: '#059669' }} /> Auto-fill Store Owner Login
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <Link to="/login" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', textDecoration: 'none' }}>
            ← Back to Normal User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;
