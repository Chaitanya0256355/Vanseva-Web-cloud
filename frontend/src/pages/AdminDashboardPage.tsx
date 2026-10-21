import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { AdminStats, Donation, Membership, Campaign, GalleryItem, AuditLogItem, StorageHealth } from '../types';
import { Shield, CheckCircle, XCircle, Heart, Trees, Users, HardDrive, RefreshCw, Plus, FileText, Download, AlertCircle, ArrowUpRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'donations' | 'memberships' | 'campaigns' | 'gallery' | 'audit' | 'storage'>('donations');

  const [donations, setDonations] = useState<Donation[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [storageHealth, setStorageHealth] = useState<StorageHealth | null>(null);

  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // New Campaign Form State
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campTitle, setCampTitle] = useState('');
  const [campDesc, setCampDesc] = useState('');
  const [campLoc, setCampLoc] = useState('');
  const [campTargetPlants, setCampTargetPlants] = useState(10000);
  const [campUnitPrice, setCampUnitPrice] = useState(150);
  const [campTargetDonation, setCampTargetDonation] = useState(1500000);
  const [campCoverFile, setCampCoverFile] = useState<File | null>(null);

  const loadData = () => {
    setLoading(true);
    apiRequest<AdminStats>('/api/admin/overview-stats').then(setStats).catch(() => {});
    apiRequest<Donation[]>('/api/admin/donations').then(setDonations).catch(() => {});
    apiRequest<Membership[]>('/api/admin/memberships').then(setMemberships).catch(() => {});
    apiRequest<Campaign[]>('/api/campaigns/all').then(setCampaigns).catch(() => {});
    apiRequest<GalleryItem[]>('/api/admin/gallery').then(setGallery).catch(() => {});
    apiRequest<AuditLogItem[]>('/api/admin/audit-logs').then(setAuditLogs).catch(() => {});
    apiRequest<StorageHealth>('/api/admin/storage/health').then(setStorageHealth).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyDonation = async (donationId: number, status: 'CONFIRMED' | 'REJECTED') => {
    try {
      await apiRequest(`/api/admin/donations/${donationId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ status, notes: `Reconciled via Admin Dashboard by Trustee` }),
      });
      setActionMsg(`Donation #${donationId} status updated to ${status}. Real Nextcloud PDF receipt generated!`);
      loadData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    }
  };

  const handleUpdateMembershipStatus = async (membershipId: number, status: string) => {
    try {
      await apiRequest(`/api/admin/memberships/${membershipId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setActionMsg(`Membership #${membershipId} updated to ${status}`);
      loadData();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const handleToggleGalleryApproval = async (itemId: number, currentApproved: boolean) => {
    try {
      await apiRequest(`/api/admin/gallery/${itemId}/status?approved=${!currentApproved}`, {
        method: 'PATCH',
      });
      setActionMsg(`Photo #${itemId} public visibility updated to ${!currentApproved}`);
      loadData();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Photo approval update failed');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', campTitle);
      formData.append('description', campDesc);
      formData.append('location', campLoc);
      formData.append('targetPlants', String(campTargetPlants));
      formData.append('plantUnitPrice', String(campUnitPrice));
      formData.append('targetDonation', String(campTargetDonation));
      if (campCoverFile) formData.append('coverImage', campCoverFile);

      await apiRequest('/api/admin/campaigns', {
        method: 'POST',
        body: formData,
      });

      setShowCampaignModal(false);
      setActionMsg('Campaign created successfully with cover image uploaded to Nextcloud!');
      loadData();
      setTimeout(() => setActionMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to create campaign');
    }
  };

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '85vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} /> Restricted Access
              </span>
              <span className="badge badge-green">Live Trust Console</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#14532d', marginTop: '6px' }}>
              Vanseva Administrative Portal
            </h1>
          </div>

          <button
            onClick={loadData}
            className="btn btn-sm btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Refresh Operational Data
          </button>
        </div>

        {/* Action Notice */}
        {actionMsg && (
          <div style={{
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            color: '#065f46',
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <CheckCircle size={20} color="#15803d" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* 1. TOP STATS CARDS */}
        <div className="grid-4" style={{ marginBottom: '36px' }}>
          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#64748b' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Confirmed Funds</span>
              <Heart size={18} color="#15803d" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#14532d', marginTop: '8px' }}>
              ₹{stats ? stats.confirmedDonationsTotal.toLocaleString() : '0'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              Pledged: ₹{stats ? stats.totalDonationPledges.toLocaleString() : '0'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#64748b' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Trees Planted</span>
              <Trees size={18} color="#059669" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '8px' }}>
              {stats ? stats.confirmedPlantsPlanted.toLocaleString() : '0'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              Total Sponsored: {stats ? stats.totalPlantsSponsored.toLocaleString() : '0'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#64748b' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Pending Pledges</span>
              <ClockIcon />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', marginTop: '8px' }}>
              {stats ? stats.pendingDonationsCount : '0'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#b45309', marginTop: '4px' }}>
              Requires Bank Reconcile &amp; Receipt
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#64748b' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>Nextcloud Storage</span>
              <HardDrive size={18} color={stats?.nextcloudStorageConnected ? '#15803d' : '#b91c1c'} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stats?.nextcloudStorageConnected ? '#15803d' : '#b91c1c', marginTop: '8px' }}>
              {stats?.nextcloudStorageConnected ? 'Operational' : 'Degraded'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              {storageHealth ? `WebDAV ${storageHealth.latencyMs}ms Latency` : 'Checking...'}
            </div>
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '28px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {[
            { id: 'donations', label: `Donations (${donations.length})`, badge: stats?.pendingDonationsCount },
            { id: 'memberships', label: `Memberships (${memberships.length})` },
            { id: 'campaigns', label: `Campaigns (${campaigns.length})` },
            { id: 'gallery', label: `Gallery Photos (${gallery.length})` },
            { id: 'audit', label: `Audit Log (${auditLogs.length})` },
            { id: 'storage', label: 'Cloud Storage Health' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                fontWeight: 700,
                fontSize: '0.92rem',
                borderBottom: activeTab === tab.id ? '3px solid #16a34a' : '3px solid transparent',
                color: activeTab === tab.id ? '#15803d' : '#64748b',
                background: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              {tab.label}
              {tab.badge ? (
                <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem' }}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB 1: DONATIONS & VERIFICATION */}
        {activeTab === 'donations' && (
          <div className="glass-panel" style={{ background: '#ffffff', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
                Donations &amp; Plant Sponsorship Verification Queue
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Confirming a pledge triggers instant server-side PDF receipt generation into Nextcloud
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Ref #</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Donor</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Allocation</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Amount</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Status</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Actions &amp; Receipts</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#15803d', fontFamily: 'monospace' }}>
                        {d.donationReference}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{d.donorName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{d.donorEmail}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div>{d.campaignTitle}</div>
                        <div style={{ fontSize: '0.78rem', color: '#15803d' }}>
                          {d.donationType === 'PLANT_SPONSORSHIP' ? `${d.plantCount}x ${d.plantSpecies}` : 'Monetary Contribution'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 700 }}>
                        ₹{d.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {d.status === 'CONFIRMED' ? (
                          <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>Confirmed</span>
                        ) : d.status === 'REJECTED' ? (
                          <span className="badge" style={{ background: '#fef2f2', color: '#b91c1c', fontSize: '0.72rem' }}>Rejected</span>
                        ) : (
                          <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>Pending Review</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {d.status !== 'CONFIRMED' ? (
                            <>
                              <button
                                onClick={() => handleVerifyDonation(d.id, 'CONFIRMED')}
                                className="btn btn-sm btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                title="Verify transfer and generate Nextcloud PDF receipt"
                              >
                                ✓ Verify &amp; Generate Receipt
                              </button>
                              <button
                                onClick={() => handleVerifyDonation(d.id, 'REJECTED')}
                                className="btn btn-sm"
                                style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#fee2e2', color: '#991b1b' }}
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <a
                              href={`/api/donations/${d.id}/receipt/download`}
                              className="btn btn-sm btn-secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Download size={13} /> PDF Receipt
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERSHIPS */}
        {activeTab === 'memberships' && (
          <div className="glass-panel" style={{ background: '#ffffff', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
                Guardian Memberships Directory
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Membership ID</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Member Name</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Email &amp; Phone</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Category</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Status</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#15803d', fontFamily: 'monospace' }}>
                        {m.membershipNumber}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: '#1e293b' }}>
                        {m.fullName}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#64748b' }}>
                        <div>{m.email}</div>
                        <div style={{ fontSize: '0.78rem' }}>{m.phone || '—'}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className="badge badge-slate" style={{ fontSize: '0.72rem' }}>
                          {m.membershipType.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${m.status === 'ACTIVE' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          className="form-select"
                          style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                          value={m.status}
                          onChange={(e) => handleUpdateMembershipStatus(m.id, e.target.value)}
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="PENDING">PENDING</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CAMPAIGNS */}
        {activeTab === 'campaigns' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Plus size={18} /> Add New Campaign
              </button>
            </div>

            <div className="grid-3">
              {campaigns.map((c) => (
                <div key={c.id} style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span className="badge badge-green">{c.status}</span>
                    <span style={{ fontWeight: 700, color: '#15803d' }}>₹{c.plantUnitPrice}/tree</span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>{c.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px' }}>{c.location}</p>

                  <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '14px' }}>
                    <div>Goal: <strong>{c.targetPlants.toLocaleString()} trees</strong></div>
                    <div>Planted: <strong>{c.plantedPlants.toLocaleString()} ({c.plantProgressPercentage}%)</strong></div>
                    <div>Raised: <strong>₹{c.collectedDonation.toLocaleString()}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MODERATION */}
        {activeTab === 'gallery' && (
          <div className="glass-panel" style={{ background: '#ffffff', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
                Moderation Queue for Plantation Photos
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Image</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Title &amp; Location</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Uploader</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Public Status</th>
                    <th style={{ padding: '14px 20px', fontWeight: 700, color: '#475569' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gallery.map((g) => (
                    <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 20px', width: '90px' }}>
                        <img
                          src={g.imageUrl}
                          alt={g.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/gallery/sapling_planting.jpg';
                          }}
                          style={{ width: '70px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{g.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{g.location || 'Sanctuary'}</div>
                      </td>
                      <td style={{ padding: '12px 20px', color: '#64748b' }}>
                        {g.uploaderName}
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <span className={`badge ${g.isApprovedPublic ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                          {g.isApprovedPublic ? 'Publicly Visible' : 'Pending Approval'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <button
                          onClick={() => handleToggleGalleryApproval(g.id, g.isApprovedPublic)}
                          className={`btn btn-sm ${g.isApprovedPublic ? 'btn-secondary' : 'btn-primary'}`}
                          style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                        >
                          {g.isApprovedPublic ? 'Unpublish' : 'Approve Photo'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="glass-panel" style={{ background: '#ffffff', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
                Immutable Administrative &amp; Security Audit Trail
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Timestamp</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Event</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Description</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>User</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Resource</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '0.8rem' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                          {log.eventType}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#1e293b', fontWeight: 500 }}>
                        {log.description}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b' }}>
                        {log.userEmail || 'System'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b' }}>
                        {log.targetResource} #{log.recordId || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: NEXTCLOUD STORAGE HEALTH */}
        {activeTab === 'storage' && (
          <div className="glass-panel" style={{ padding: '36px', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                <HardDrive size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>
                  Nextcloud Private Cloud Storage Integration
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  Backend WebDAV storage diagnostics for receipts, member photos, and plantation evidence.
                </p>
              </div>
            </div>

            {storageHealth && (
              <div className="grid-2" style={{ gap: '24px', marginBottom: '32px' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>WebDAV Endpoint Status</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: storageHealth.healthy ? '#15803d' : '#b91c1c', marginTop: '4px' }}>
                    {storageHealth.healthy ? 'ONLINE & CONNECTED' : 'UNREACHABLE'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Latency: <strong>{storageHealth.latencyMs} ms</strong>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Storage Base Folder Structure</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                    {storageHealth.rootFolderStatus}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Engine: <strong>{storageHealth.version}</strong>
                  </div>
                </div>
              </div>
            )}

            <div style={{
              background: '#f1f5f9',
              borderRadius: '14px',
              padding: '24px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              color: '#334155'
            }}>
              <h4 style={{ fontWeight: 700, marginBottom: '10px' }}>Active Nextcloud Storage Hierarchy:</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
                <li>📁 <strong>/Vanseva/</strong> (Isolated NGO root container)</li>
                <li>├── 📁 <strong>Memberships/</strong> (Member profile photos)</li>
                <li>├── 📁 <strong>PlantationImages/</strong> (Geotagged verified field photos)</li>
                <li>├── 📁 <strong>DonationDocuments/</strong> (Supporting bank transfer slips)</li>
                <li>├── 📁 <strong>DonationReceipts/</strong> (Server-generated immutable PDF receipts)</li>
                <li>└── 📁 <strong>CampaignMedia/</strong> (High-resolution campaign covers)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCampaignModal && (
          <div className="modal-overlay" onClick={() => setShowCampaignModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#14532d', marginBottom: '20px' }}>
                Create New Plantation Campaign
              </h3>
              <form onSubmit={handleCreateCampaign}>
                <div className="form-group">
                  <label className="form-label">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={campTitle}
                    onChange={(e) => setCampTitle(e.target.value)}
                    placeholder="e.g. Himalayas Oak & Pine Restoration"
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Location / Bioregion *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={campLoc}
                      onChange={(e) => setCampLoc(e.target.value)}
                      placeholder="e.g. Almora Foothills, Uttarakhand"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit Cost Per Sapling (INR) *</label>
                    <input
                      type="number"
                      required
                      min="50"
                      className="form-input"
                      value={campUnitPrice}
                      onChange={(e) => setCampUnitPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Target Plants</label>
                    <input
                      type="number"
                      required
                      min="100"
                      className="form-input"
                      value={campTargetPlants}
                      onChange={(e) => setCampTargetPlants(Number(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Funding Goal (INR)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={campTargetDonation}
                      onChange={(e) => setCampTargetDonation(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    value={campDesc}
                    onChange={(e) => setCampDesc(e.target.value)}
                    placeholder="Details about ecological objectives and local community partners..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image (Uploaded to Nextcloud CampaignMedia)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCampCoverFile(e.target.files ? e.target.files[0] : null)}
                    className="form-input"
                    style={{ padding: '8px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button type="button" onClick={() => setShowCampaignModal(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
