import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trees, Heart, UserPlus, Image as ImageIcon, Shield, LogOut, User, FolderKanban } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenAuth }) => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #15803d, #166534)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(22, 101, 52, 0.3)'
          }}>
            <Trees size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#14532d', letterSpacing: '-0.02em' }}>VANSEVA</span>
              <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>Ecology NGO</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Green Earth & Plantation Platform</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[
            { id: 'home', label: 'Home' },
            { id: 'campaigns', label: 'Campaigns', icon: <FolderKanban size={16} /> },
            { id: 'donate-plants', label: 'Sponsor Trees', icon: <Trees size={16} /> },
            { id: 'donate-money', label: 'Donate Funds', icon: <Heart size={16} /> },
            { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.92rem',
                fontWeight: currentPage === item.id ? 700 : 500,
                color: currentPage === item.id ? '#166534' : '#334155',
                borderBottom: currentPage === item.id ? '2px solid #16a34a' : '2px solid transparent',
                padding: '8px 4px',
                transition: 'all 0.2s ease',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User / Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {user.role === 'ROLE_ADMIN' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="btn btn-sm btn-amber"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Shield size={16} />
                  Admin Dashboard
                </button>
              )}

              <button
                onClick={() => onNavigate('my-donations')}
                className="btn btn-sm btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Heart size={15} />
                My Donations
              </button>

              <button
                onClick={() => onNavigate('my-account')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#1e293b',
                }}
              >
                <User size={16} color="#15803d" />
                <span>{user.fullName || user.username}</span>
              </button>

              <button
                onClick={logout}
                title="Sign Out"
                style={{
                  padding: '8px',
                  borderRadius: '8px',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn btn-sm btn-outline"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('membership')}
                className="btn btn-sm btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <UserPlus size={16} />
                Become a Member
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
