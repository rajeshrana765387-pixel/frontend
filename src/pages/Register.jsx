import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiMapPin, FiEye, FiEyeOff, FiCheck, FiInfo } from 'react-icons/fi';

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

  const handleFillValidDemo = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setForm({
      name: `Rajesh Kumar Senior Platform User ${randomSuffix}`, // > 20 characters
      email: `customer${randomSuffix}@storerating.com`,
      password: 'User@1234', // Meets uppercase + special char + 8-16 chars
      address: '742 Evergreen Terrace, Sector 4, Metro Plaza',
    });
    setErrors({});
    toast.success('Filled with valid demo data!');
  };

  const validate = () => {
    const newErrors = {};
    const nameLength = form.name.trim().length;
    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (nameLength < 20) {
      newErrors.name = `Name must be at least 20 characters (currently ${nameLength})`;
    } else if (nameLength > 60) {
      newErrors.name = `Name must not exceed 60 characters (currently ${nameLength})`;
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Must be a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8 || form.password.length > 16) {
      newErrors.password = `Password must be 8-16 characters (currently ${form.password.length})`;
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter (A-Z)';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$%...)';
    }

    if (form.address && form.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    return newErrors;
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
      await register(form);
      toast.success('Registration successful! Welcome to StoreRate!');
      navigate('/stores');
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors && Array.isArray(serverErrors)) {
        const errMap = {};
        serverErrors.forEach((e) => { errMap[e.path] = e.msg; });
        setErrors(errMap);
        toast.error(serverErrors[0]?.msg || 'Validation error');
      } else {
        const msg = err.response?.data?.message || err.message || 'Registration failed';
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const isNameValid = form.name.trim().length >= 20 && form.name.trim().length <= 60;
  const isPassLength = form.password.length >= 8 && form.password.length <= 16;
  const hasPassUpper = /[A-Z]/.test(form.password);
  const hasPassSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(rgba(15, 23, 42, 0.78), rgba(67, 56, 202, 0.82)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80") center center / cover no-repeat fixed',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', background: 'white',
            borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem', boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>SR</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>Create User Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Join as a customer to review and rate stores
          </p>
        </div>

        <div className="card" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* Full Name */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Full Name</label>
                <span style={{
                  fontSize: '0.75rem',
                  color: isNameValid ? '#16a34a' : 'var(--gray-400)',
                  fontWeight: isNameValid ? '600' : 'normal'
                }}>
                  {form.name.trim().length}/60 chars (min 20) {isNameValid && '✓'}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Your full legal name (min 20 characters)"
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email Address */}
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

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                  placeholder="8-16 chars, 1 uppercase, 1 special char"
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

              {/* Password checklist badges */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                <span style={{
                  fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                  background: isPassLength ? '#dcfce7' : '#f1f5f9',
                  color: isPassLength ? '#15803d' : '#64748b'
                }}>
                  {isPassLength ? '✓' : '•'} 8–16 Chars
                </span>
                <span style={{
                  fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                  background: hasPassUpper ? '#dcfce7' : '#f1f5f9',
                  color: hasPassUpper ? '#15803d' : '#64748b'
                }}>
                  {hasPassUpper ? '✓' : '•'} Uppercase (A-Z)
                </span>
                <span style={{
                  fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px',
                  background: hasPassSpecial ? '#dcfce7' : '#f1f5f9',
                  color: hasPassSpecial ? '#15803d' : '#64748b'
                }}>
                  {hasPassSpecial ? '✓' : '•'} Special char (!@#)
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">Address <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(optional, max 400)</span></label>
              <div style={{ position: 'relative' }}>
                <FiMapPin style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: 'var(--gray-400)' }} />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  style={{ paddingLeft: '2.25rem', resize: 'vertical', minHeight: '4.5rem' }}
                  placeholder="Street, City, Postal Code"
                  maxLength={400}
                />
              </div>
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            >
              {loading ? 'Creating account...' : 'Create Customer Account'}
            </button>
          </form>

          {/* Quick Fill Valid Sample */}
          <div style={{
            marginTop: '1.25rem', padding: '0.75rem', background: '#f8fafc',
            borderRadius: '0.625rem', border: '1px dashed var(--gray-300)', textAlign: 'center'
          }}>
            <button
              type="button"
              onClick={handleFillValidDemo}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
            >
              <FiCheck /> Auto-fill Valid Registration Data
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
