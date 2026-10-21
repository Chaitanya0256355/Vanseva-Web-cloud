import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { Campaign } from '../types';
import { Trees, Heart, MapPin, Calendar, Search, Filter, ArrowRight } from 'lucide-react';

interface CampaignsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ onNavigate }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Campaign[]>('/api/campaigns/all')
      .then(setCampaigns)
      .finally(() => setLoading(false));
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 48px' }}>
          <div className="badge badge-green" style={{ marginBottom: '12px' }}>Ecological Corridors</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#14532d', marginBottom: '16px' }}>
            Tree Plantation Campaigns
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.7 }}>
            Explore verified plantation drives across diverse Indian biogeographical zones. Every sapling sponsored is tracked and backed by permanent cloud-archived verification records.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div style={{
          background: '#ffffff',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '36px'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search campaigns by name or region..."
              className="form-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            Loading active campaigns...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '16px' }}>
            <Trees size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#334155' }}>No campaigns found</h3>
            <p style={{ color: '#64748b', marginTop: '6px' }}>Try adjusting your search criteria or filter options.</p>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Cover Image */}
                <div style={{
                  height: '220px',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #166534, #14532d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {campaign.coverImageUrl && (
                    <img
                      src={campaign.coverImageUrl}
                      alt={campaign.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(6px)',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MapPin size={13} color="#4ade80" />
                    <span>{campaign.location}</span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: campaign.status === 'ACTIVE' ? '#22c55e' : '#64748b',
                    color: campaign.status === 'ACTIVE' ? '#064e3b' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}>
                    {campaign.status}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    {campaign.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                    {campaign.description}
                  </p>

                  {/* Plantation Progress */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <span>Planted: {campaign.plantedPlants.toLocaleString()} trees</span>
                      <span style={{ color: '#15803d' }}>{campaign.plantProgressPercentage}%</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${Math.min(100, campaign.plantProgressPercentage)}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                      <span>Goal: {campaign.targetPlants.toLocaleString()} saplings</span>
                      <span>Pledged: {campaign.pledgedPlants.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Funding Details */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Unit Cost: </span>
                      <strong style={{ color: '#15803d' }}>₹{campaign.plantUnitPrice} / tree</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Raised: </span>
                      <strong style={{ color: '#1e293b' }}>₹{campaign.collectedDonation.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => onNavigate('donate-plants', { campaignId: campaign.id })}
                      className="btn btn-sm btn-primary"
                      style={{ flex: 1 }}
                    >
                      <Trees size={16} /> Sponsor Trees
                    </button>
                    <button
                      onClick={() => onNavigate('donate-money', { campaignId: campaign.id })}
                      className="btn btn-sm btn-secondary"
                    >
                      <Heart size={16} /> Donate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
