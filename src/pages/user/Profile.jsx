import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { FiLock, FiEye, FiEyeOff, FiUser, FiMail, FiMapPin } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.password) newErrors.password = 'New password is required';
    else if (form.password.length < 8 || form.password.length > 16) newErrors.password = 'Password must be 8-16 characters';
    else if (!/[A-Z]/.test(form.password)) newErrors.password = 'Must contain at least one uppercase letter';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) newErrors.password = 'Must contain at least one special character';

    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
      await api.patch('/users/me/password', { password: form.password });
      toast.success('Password updated successfully!');
      setForm({ password: '', confirmPassword: '' });
      setErrors({});
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const errMap = {};
        serverErrors.forEach((e) => { errMap[e.path] = e.msg; });
        setErrors(errMap);
      } else {
        toast.error(err.response?.data?.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  const roleLabels = { admin: 'System Administrator', user: 'Normal User', store_owner: 'Store Owner' };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View your account details and update your password</p>
      </div>

      {/* Profile Info */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--gray-100)' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '50%',
            background: 'var(--primary)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: '700'
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--gray-800)' }}>{user?.name}</h2>
            <span className={`badge badge-${user?.role}`} style={{ textTransform: 'capitalize' }}>
              {roleLabels[user?.role]}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
            <FiUser style={{ color: 'var(--primary)', marginTop: '0.125rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.125rem' }}>Full Name</div>
              <div style={{ fontWeight: '500', color: 'var(--gray-800)' }}>{user?.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
            <FiMail style={{ color: 'var(--primary)', marginTop: '0.125rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.125rem' }}>Email Address</div>
              <div style={{ fontWeight: '500', color: 'var(--gray-800)' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.875rem', background: 'var(--gray-50)', borderRadius: '0.5rem' }}>
            <FiMapPin style={{ color: 'var(--primary)', marginTop: '0.125rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.125rem' }}>Address</div>
              <div style={{ fontWeight: '500', color: 'var(--gray-800)' }}>{user?.address || <span style={{ color: 'var(--gray-400)' }}>Not provided</span>}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-800)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FiLock style={{ color: 'var(--primary)' }} /> Change Password
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">New Password <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(8-16 chars)</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={{ paddingRight: '2.5rem' }}
                placeholder="New password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 0 }}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                style={{ paddingRight: '2.5rem' }}
                placeholder="Confirm new password"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 0 }}>
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <div style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '0.5rem', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: '500', marginBottom: '0.375rem' }}>Password Requirements:</p>
            <ul style={{ fontSize: '0.75rem', color: '#3b82f6', paddingLeft: '1rem', lineHeight: 1.8 }}>
              <li>8 to 16 characters long</li>
              <li>At least one uppercase letter (A-Z)</li>
              <li>At least one special character (!@#$%^&*...)</li>
            </ul>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
