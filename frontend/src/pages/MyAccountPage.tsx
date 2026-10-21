import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { Membership } from '../types';
import { User, Award, ShieldCheck, MapPin, Calendar, Heart, Trees, Download } from 'lucide-react';

interface MyAccountPageProps {
  onNavigate: (page: string) => void;
}

export const MyAccountPage: React.FC<MyAccountPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Membership>('/api/memberships/my')
      .then(setMembership)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div className="section-padding" style={{ textAlign: 'center' }}>
        <h2>Please sign in to view your account.</h2>
      </div>
    );
  }

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="badge badge-green" style={{ marginBottom: '8px' }}>Member Portal</div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#14532d' }}>
            My Environmental Account
          </h1>
          <p style={{ color: '#64748b' }}>
            Manage your personal profile, review your membership status, and track your tree contributions.
          </p>
        </div>

        {/* Digital Membership ID Card */}
        <div style={{
          background: 'linear-gradient(135deg, #14532d 0%, #064e3b 60%, #022c22 100%)',
          borderRadius: '24px',
          color: '#ffffff',
          padding: '36px',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          {/* Subtle watermark */}
          <div style={{
            position: 'absolute',
            right: '-40px',
            bottom: '-40px',
            opacity: 0.08,
            pointerEvents: 'none'
          }}>
            <Trees size={320} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: membership?.profileFileUrl ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                overflow: 'hidden'
              }}>
                {membership?.profileFileUrl ? (
                  <img src={membership.profileFileUrl} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={32} />
                )}
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{user.fullName || user.username}</div>
                <div style={{ fontSize: '0.82rem', color: '#86efac' }}>
                  {membership ? membership.membershipType.replace('_', ' ') : user.role.replace('ROLE_', '')}
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-amber" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                {membership?.status || 'ACTIVE'}
              </span>
              <div style={{ fontSize: '0.72rem', color: '#a7f3d0', marginTop: '6px' }}>
                Nextcloud Private Cloud Verified
              </div>
            </div>
          </div>

          {/* Membership Number */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              OFFICIAL MEMBERSHIP NUMBER
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#fef3c7',
              fontFamily: 'monospace'
            }}>
              {membership?.membershipNumber || user.membershipNumber || 'VS-MEM-2026-ACTIVE'}
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '20px',
            fontSize: '0.85rem',
            color: '#dcfce7',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <span style={{ color: '#86efac', fontSize: '0.75rem', display: 'block' }}>Email Address</span>
              <strong>{user.email}</strong>
            </div>
            {membership?.city && (
              <div>
                <span style={{ color: '#86efac', fontSize: '0.75rem', display: 'block' }}>Sanctuary Region</span>
                <strong>{membership.city}</strong>
              </div>
            )}
            <div>
              <span style={{ color: '#86efac', fontSize: '0.75rem', display: 'block' }}>Registered Since</span>
              <strong>{membership?.createdAt ? new Date(membership.createdAt).toLocaleDateString() : '2026'}</strong>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="glass-panel" style={{ padding: '36px', background: '#ffffff', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
            Guardian Profile Information
          </h3>

          <div className="grid-2" style={{ gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Full Name</div>
              <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{user.fullName || user.username}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Account Email</div>
              <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{user.email}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Phone Number</div>
              <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>{membership?.phone || 'Not configured'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Residential Address</div>
              <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                {membership?.address ? `${membership.address}, ${membership.city || ''} ${membership.postalCode || ''}` : 'Not provided'}
              </div>
            </div>
          </div>

          {membership?.environmentalInterests && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '10px' }}>
                Environmental Focus Areas:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {membership.environmentalInterests.split(',').map((interest, idx) => (
                  <span key={idx} className="badge badge-green" style={{ fontSize: '0.78rem' }}>
                    🌱 {interest.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => onNavigate('my-donations')} className="btn btn-primary">
            <Heart size={18} /> View My Donation Ledger &amp; Receipts
          </button>
          <button onClick={() => onNavigate('donate-plants')} className="btn btn-secondary">
            <Trees size={18} /> Sponsor More Native Trees
          </button>
        </div>
      </div>
    </div>
  );
};
