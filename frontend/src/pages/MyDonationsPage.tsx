import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { Donation } from '../types';
import { Heart, Download, Trees, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface MyDonationsPageProps {
  onNavigate: (page: string) => void;
}

export const MyDonationsPage: React.FC<MyDonationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Donation[]>('/api/donations/my')
      .then(setDonations)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadReceipt = (donation: Donation) => {
    // Direct window download triggering server-side attachment stream
    window.location.href = `/api/donations/${donation.id}/receipt/download`;
  };

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-green" style={{ marginBottom: '8px' }}>Audited Ledger</div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#14532d' }}>
              My Donation History &amp; Receipts
            </h1>
            <p style={{ color: '#64748b' }}>
              Real-time audit log of all your monetary contributions and sponsored trees, with downloadable cloud receipts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => onNavigate('donate-plants')} className="btn btn-primary">
              <Trees size={16} /> Sponsor Trees
            </button>
            <button onClick={() => onNavigate('donate-money')} className="btn btn-secondary">
              <Heart size={16} /> Donate Funds
            </button>
          </div>
        </div>

        {/* Donations Table / Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            Loading donation records...
          </div>
        ) : donations.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '60px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0'
          }}>
            <Heart size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: '8px' }}>No contributions recorded yet</h3>
            <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              Every tree planted helps re-establish native habitat corridors. Begin by sponsoring your first indigenous sapling.
            </p>
            <button onClick={() => onNavigate('donate-plants')} className="btn btn-primary">
              Sponsor Your First Tree
            </button>
          </div>
        ) : (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569' }}>Reference</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569' }}>Campaign</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569' }}>Allocation</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569' }}>Amount</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569' }}>Status</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569' }}>Date</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569', textAlign: 'right' }}>Official Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                      <td style={{ padding: '18px 20px', fontWeight: 700, color: '#14532d', fontFamily: 'monospace' }}>
                        {d.donationReference}
                      </td>
                      <td style={{ padding: '18px 20px', fontWeight: 600, color: '#1e293b' }}>
                        {d.campaignTitle}
                      </td>
                      <td style={{ padding: '18px 20px', color: '#475569' }}>
                        {d.donationType === 'PLANT_SPONSORSHIP' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Trees size={15} color="#15803d" />
                            <span>{d.plantCount}x {d.plantSpecies || 'Native Trees'}</span>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Heart size={15} color="#d97706" />
                            <span>General Restoration Fund</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '18px 20px', fontWeight: 700, color: '#1e293b' }}>
                        ₹{d.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '18px 20px' }}>
                        {d.status === 'CONFIRMED' ? (
                          <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                            ✓ Verified &amp; Confirmed
                          </span>
                        ) : d.status === 'REJECTED' ? (
                          <span className="badge" style={{ background: '#fef2f2', color: '#b91c1c' }}>
                            Rejected
                          </span>
                        ) : (
                          <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                            ⏳ Awaiting Verification
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '18px 20px', color: '#64748b', fontSize: '0.85rem' }}>
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                        {d.status === 'CONFIRMED' ? (
                          <button
                            onClick={() => handleDownloadReceipt(d)}
                            className="btn btn-sm btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                          >
                            <Download size={14} /> Download PDF Receipt
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            Issued upon verification
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              background: '#f8fafc',
              padding: '16px 24px',
              borderTop: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>🛡️ All issued receipts are server-generated and stored in private Nextcloud storage.</span>
              <span>Showing {donations.length} records</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
