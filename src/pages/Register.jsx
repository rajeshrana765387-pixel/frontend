import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiMapPin, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
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
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Must be a valid email address';

    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8 || form.password.length > 16) newErrors.password = 'Password must be 8-16 characters';
    else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Password must contain at least one uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) newErrors.password = 'Password must contain at least one special character';

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
      await register(form);
      toast.success('Registration successful! Welcome!');
      navigate('/stores');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const errMap = {};
        serverErrors.forEach((e) => { errMap[e.path] = e.msg; });
        setErrors(errMap);
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, label, type = 'text', placeholder, icon, extra }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: '0.75rem', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none'
        }}>{icon}</span>
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`form-input ${errors[name] ? 'error' : ''}`}
          style={{ paddingLeft: '2.25rem', ...(extra ? { paddingRight: '2.5rem' } : {}) }}
          placeholder={placeholder}
        />
        {extra}
      </div>
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(rgba(15, 23, 42, 0.78), rgba(67, 56, 202, 0.82)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80") center center / cover no-repeat fixed',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3rem', height: '3rem', background: 'white',
            borderRadius: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>SR</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Join StoreRate today
          </p>
        </div>

        <div className="card" style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(20–60 chars)</span></label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Your full name (min 20 characters)"
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{form.name.length}/60 characters</span>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(8-16 chars, uppercase + special)</span></label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                  placeholder="Min 8 chars, uppercase + special char"
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

            <div className="form-group">
              <label className="form-label">Address <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional)</span></label>
              <div style={{ position: 'relative' }}>
                <FiMapPin style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: 'var(--gray-400)' }} />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem', resize: 'vertical', minHeight: '5rem' }}
                  placeholder="Your address (max 400 characters)"
                  maxLength={400}
                />
              </div>
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
