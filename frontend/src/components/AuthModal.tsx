import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, User, AlertCircle, ArrowRight, Shield, Trees } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMembership: () => void;
  initialMode?: 'login' | 'register';
  securityNotice?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMembership,
  initialMode = 'login',
  securityNotice = null,
}) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: '#94a3b8',
            padding: '4px',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #15803d, #166534)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 6px 16px rgba(22, 101, 52, 0.25)'
          }}>
            <Trees size={28} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#14532d', marginBottom: '6px' }}>
            Welcome to Vanseva
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Sign in to access your membership profile and donation history
          </p>
        </div>

        {/* Security Session Ended Alert */}
        {securityNotice && (
          <div style={{
            background: '#fffbeb',
            border: '1.5px solid #fde047',
            color: '#854d0e',
            padding: '14px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '0.86rem',
            lineHeight: 1.5,
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(234, 179, 8, 0.12)'
          }}>
            <Shield size={20} color="#ca8a04" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#713f12', marginBottom: '2px' }}>Session Security Protection</div>
              <span>{securityNotice}</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Enter username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
              <Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '14px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Vanseva'}
          </button>
        </form>


        {/* Register Prompt */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '20px',
          fontSize: '0.88rem',
          color: '#64748b'
        }}>
          Don't have an environmental membership yet?{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToMembership();
            }}
            style={{ color: '#15803d', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            Register as a Member <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
