import React from 'react';
import { Trees, Heart, ShieldCheck, Mail, Phone, MapPin, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenAuth: (mode?: 'login') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer style={{
      background: '#09261a',
      color: '#e2e8f0',
      paddingTop: '64px',
      paddingBottom: '32px',
      borderTop: '4px solid #16a34a'
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '48px', gap: '36px' }}>
          {/* Col 1: About */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Trees size={22} />
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>VANSEVA</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '16px' }}>
              Vanseva Green Earth Foundation is a registered non-governmental environmental trust dedicated to restoring degraded biospheres, planting indigenous tree species, and connecting ecological benefactors with transparent, verifiable field initiatives.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '0.8rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Registered Environmental Trust: NGO-DL-2026-ENV-9081</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.02em' }}>EXPLORE INITIATIVES</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#cbd5e1' }}>
              <li>
                <button onClick={() => onNavigate('campaigns')} style={{ color: 'inherit', textAlign: 'left' }}>
                  → Active Plantation Drives
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donate-plants')} style={{ color: 'inherit', textAlign: 'left' }}>
                  → Sponsor Indigenous Saplings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donate-money')} style={{ color: 'inherit', textAlign: 'left' }}>
                  → Monetary Contributions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} style={{ color: 'inherit', textAlign: 'left' }}>
                  → Real Plantation Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('membership')} style={{ color: 'inherit', textAlign: 'left' }}>
                  → Environmental Membership
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cloud Verification & Transparency */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>TRANSPARENCY & CLOUD</h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
                <Award size={18} />
                <span>Verified Cloud Registry</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Every tree sponsorship, verified donation, and plantation photograph is immutably archived into our enterprise WebDAV cloud repository with tamper-evident digital receipts.
              </p>
            </div>
            <button
              onClick={() => onOpenAuth('login')}
              style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'underline' }}
            >
              Staff & Administrator Sign In
            </button>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>CONTACT SANCTUARY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Vanseva Sanctuary Campus, Eco Park Corridor, New Delhi 110001, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="#4ade80" style={{ flexShrink: 0 }} />
                <span>contact@vanseva.org</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#4ade80" style={{ flexShrink: 0 }} />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} Vanseva — Green Earth & Plantation Management Platform. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Environmental Ethics Policy</span>
            <span>Donor Transparency Protocol</span>
            <span>Privacy & Data Sovereignty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
