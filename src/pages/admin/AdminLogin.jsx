import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiShield, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiArrowRight } from 'react-icons/fi';

const AdminLogin = () => {
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
    if (!form.email) newErrors.email = 'Admin email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleFillDemo = () => {
    setForm({
      email: 'admin@storerating.com',
      password: 'Admin@1234',
    });
    setErrors({});
    toast.success('Admin credentials filled!');
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
      if (user.role !== 'admin') {
        toast.error('Access denied: This account is not an Administrator.');
        navigate(user.role === 'store_owner' ? '/owner/dashboard' : '/stores');
        return;
      }
      toast.success('Welcome back, System Administrator!');
      navigate('/admin/dashboard');
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
      background: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(30, 27, 75, 0.90)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80") center center / cover no-repeat fixed',
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
          <Link to="/owner/login" style={{
            flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '500'
          }}>
            🏪 Store Owner
          </Link>
          <div style={{
            flex: 1, textAlign: 'center', padding: '0.5rem', fontSize: '0.8rem',
            background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', fontWeight: '600'
          }}>
            🛡️ Admin
          </div>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3.75rem', height: '3.75rem', background: '#312e81',
            borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            border: '2px solid rgba(129, 140, 248, 0.4)'
          }}>
            <FiShield style={{ color: '#a5b4fc', fontSize: '1.75rem' }} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>Administrator Portal</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            System management & store moderation
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Administrator Email</label>
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
                  placeholder="admin@storerating.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Security Password</label>
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
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div style={{
            marginTop: '1.25rem', padding: '0.875rem', background: '#f8fafc',
            borderRadius: '0.625rem', border: '1px dashed var(--gray-300)', textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginBottom: '0.5rem', fontWeight: '500' }}>
              🔑 Quick Test Credentials
            </p>
            <button
              type="button"
              onClick={handleFillDemo}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            >
              <FiCheck /> Auto-fill Admin Login
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

export default AdminLogin;
