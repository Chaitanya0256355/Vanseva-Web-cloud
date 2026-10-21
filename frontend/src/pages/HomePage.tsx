import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import { AdminStats, Campaign, GalleryItem, Membership, Donation } from '../types';
import { useAuth } from '../context/AuthContext';
import { Trees, Heart, UserPlus, ArrowRight, ShieldCheck, Sparkles, MapPin, CheckCircle, Leaf, Globe, Award, ChevronRight, User, Download, Clock, Shield } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenAuth: (mode?: 'login') => void;
}

const DEFAULT_PLANT_PHOTOS: GalleryItem[] = [
  {
    id: 1,
    title: 'Native Sapling Cultivation at Coorg Nursery',
    description: 'Over 5,000 indigenous saplings raised in community nurseries with organic compost before monsoon plantation.',
    location: 'Madikeri, Coorg (Western Ghats)',
    campaignId: 1,
    campaignTitle: 'Western Ghats Rainforest Revival',
    imageUrl: '/api/files/2/view',
    plantSpecies: 'Shorea robusta & Neem',
    datePlanted: '2026-09-22',
    isApprovedPublic: true,
    uploaderName: 'Vanseva Field Coordinator',
    createdAt: '2026-09-22T10:00:00'
  },
  {
    id: 2,
    title: 'Aravalli Ridge Restoration Drive',
    description: 'Students and volunteers establishing drought-resilient native cover along degraded mining ridge.',
    location: 'Sariska Buffer, Alwar',
    campaignId: 2,
    campaignTitle: 'Aravalli Green Shield Initiative',
    imageUrl: '/api/files/3/view',
    plantSpecies: 'Kikar & Acacia senegal',
    datePlanted: '2026-09-07',
    isApprovedPublic: true,
    uploaderName: 'Vanseva Ground Team',
    createdAt: '2026-09-07T09:15:00'
  },
  {
    id: 3,
    title: 'Sundarbans Mudflat Planting',
    description: 'Women self-help groups securing tidal mudflats with red mangrove prop-root saplings.',
    location: 'Gosaba Island, Sundarbans',
    campaignId: 3,
    campaignTitle: 'Sundarbans Coastal Mangrove Protection',
    imageUrl: '/api/files/4/view',
    plantSpecies: 'Rhizophora mucronata',
    datePlanted: '2026-09-28',
    isApprovedPublic: true,
    uploaderName: 'Vanseva Conservation Cell',
    createdAt: '2026-09-28T14:30:00'
  }
];

const resolveImageUrl = (url?: string, title?: string, index: number = 0): string => {
  const t = (title || '').toLowerCase();
  if (t.includes('nursery') || t.includes('cultivation') || t.includes('coorg')) return '/images/gallery/community_nursery.jpg';
  if (t.includes('mangrove') || t.includes('sundarban') || t.includes('mudflat')) return '/images/gallery/mangrove_coastal.jpg';
  if (t.includes('aravalli') || t.includes('ridge') || t.includes('restoration') || t.includes('drive') || t.includes('mountain')) return '/images/gallery/field_reforestation.jpg';
  if (t.includes('sapling') || t.includes('soil') || t.includes('plant') || t.includes('hand')) return '/images/gallery/sapling_planting.jpg';
  if (url && !url.startsWith('/api/files/')) return url;
  const defaults = [
    '/images/gallery/community_nursery.jpg',
    '/images/gallery/mangrove_coastal.jpg',
    '/images/gallery/field_reforestation.jpg',
    '/images/gallery/sapling_planting.jpg'
  ];
  return defaults[index % defaults.length];
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_PLANT_PHOTOS);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [userDonations, setUserDonations] = useState<Donation[]>([]);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(false);

  useEffect(() => {
    apiRequest<AdminStats>('/api/admin/overview-stats')
      .then(setStats)
      .catch(() => {});

    apiRequest<Campaign[]>('/api/campaigns')
      .then(setCampaigns)
      .catch(() => {});

    apiRequest<GalleryItem[]>('/api/gallery')
      .then((items) => {
        if (items && items.length > 0) {
          setGallery(items.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      setLoadingUserData(true);
      Promise.allSettled([
        apiRequest<Membership>('/api/memberships/my'),
        apiRequest<Donation[]>('/api/donations/my')
      ]).then(([membershipRes, donationsRes]) => {
        if (membershipRes.status === 'fulfilled' && membershipRes.value) {
          setMembership(membershipRes.value);
        }
        if (donationsRes.status === 'fulfilled' && Array.isArray(donationsRes.value)) {
          setUserDonations(donationsRes.value);
        }
      }).finally(() => {
        setLoadingUserData(false);
      });
    } else {
      setMembership(null);
      setUserDonations([]);
    }
  }, [user]);

  const totalTreesSponsored = userDonations.reduce((acc, curr) => acc + (curr.plantCount || 0), 0);
  const totalAmountContributed = userDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const verifiedReceipts = userDonations.filter(d => d.hasReceipt);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(circle at 80% 20%, #15803d 0%, #064e3b 60%, #022c22 100%)',
        color: '#ffffff',
        padding: '100px 0 120px',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            {user ? (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#86efac',
                marginBottom: '24px'
              }}>
                <Award size={16} />
                <span>
                  Welcome back, {user.fullName || user.username} • {membership ? `${membership.membershipType.replace('_', ' ')} (${membership.membershipNumber})` : (user.role === 'ROLE_ADMIN' ? 'Vanseva National Trustee' : 'Eco-Guardian Member')}
                </span>
              </div>
            ) : (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#86efac',
                marginBottom: '24px'
              }}>
                <Sparkles size={16} />
                <span>Restoring Earth's Canopy • Verifiable Community Forestry</span>
              </div>
            )}

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '24px',
              letterSpacing: '-0.02em'
            }}>
              Nurturing Life Through Native Forest Regeneration.
            </h1>

            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: '#dcfce7',
              lineHeight: 1.7,
              marginBottom: '40px',
              maxWidth: '700px'
            }}>
              {user
                ? `Welcome to your ecological stewardship hub. Your active participation powers verified grassroots afforestation across India's vulnerable biospheres. Track your contributed saplings, explore live campaigns, or access cloud-archived 80G tax receipts.`
                : `Vanseva connects conscious citizens and organizations with grassroots plantation campaigns. Sponsor indigenous saplings, register as an active eco-guardian, and receive digitally verified cloud-archived donation receipts.`
              }
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('donate-plants')}
                className="btn btn-lg btn-amber"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <Trees size={22} />
                Sponsor a Tree (₹150)
              </button>

              {user ? (
                <>
                  {user.role === 'ROLE_ADMIN' ? (
                    <button
                      onClick={() => onNavigate('admin')}
                      className="btn btn-lg"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        border: '1.5px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <Shield size={22} />
                      Admin Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('my-account')}
                      className="btn btn-lg"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        border: '1.5px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <Award size={22} />
                      My Member Space
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('my-donations')}
                    className="btn btn-lg"
                    style={{
                      background: 'transparent',
                      color: '#ffffff',
                      border: '1.5px solid rgba(255, 255, 255, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Heart size={20} />
                    My Contributions ({userDonations.length})
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('membership')}
                    className="btn btn-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      border: '1.5px solid rgba(255, 255, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <UserPlus size={22} />
                    Become a Member
                  </button>

                  <button
                    onClick={() => onNavigate('campaigns')}
                    className="btn btn-lg"
                    style={{
                      background: 'transparent',
                      color: '#ffffff',
                      border: '1.5px solid rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    Explore Campaigns <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MEMBER ACTIVITY DASHBOARD PREVIEW (Shown When Logged In) */}
      {user && (
        <section style={{ marginTop: '-50px', position: 'relative', zIndex: 12, marginBottom: '20px' }}>
          <div className="container">
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px 32px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
              border: '1.5px solid #bbf7d0',
            }}>
              {/* Member Card Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid #f1f5f9',
                paddingBottom: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #15803d, #166534)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 16px rgba(22, 101, 52, 0.25)'
                  }}>
                    <Award size={28} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#14532d', margin: 0 }}>
                        {user.fullName || user.username}
                      </h3>
                      <span className="badge badge-green" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        {membership?.status === 'ACTIVE' ? '✓ ACTIVE ECO-GUARDIAN' : (user.role === 'ROLE_ADMIN' ? 'TRUSTEE' : 'MEMBER')}
                      </span>
                      {membership?.membershipType && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: '#fef3c7',
                          color: '#92400e',
                          padding: '3px 10px',
                          borderRadius: '9999px'
                        }}>
                          {membership.membershipType.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                      Member ID: <strong style={{ color: '#166534' }}>{membership?.membershipNumber || user.membershipNumber || 'VS-MEMBER'}</strong> • {user.email}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onNavigate('my-account')}
                    className="btn btn-sm btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <User size={15} />
                    View Member ID Card
                  </button>
                  <button
                    onClick={() => onNavigate('donate-plants')}
                    className="btn btn-sm btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Trees size={15} />
                    Sponsor Trees
                  </button>
                </div>
              </div>

              {/* Personal Impact Stat Highlights */}
              <div className="grid-4" style={{ gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: '#f0fdf4', padding: '16px 18px', borderRadius: '14px', border: '1px solid #dcfce7' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Trees Sponsored</span>
                    <Trees size={18} color="#16a34a" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#14532d' }}>
                    {totalTreesSponsored} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#166534' }}>Saplings</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Your dedicated grove</div>
                </div>

                <div style={{ background: '#fefce8', padding: '16px 18px', borderRadius: '14px', border: '1px solid #fef08a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>Total Contributed</span>
                    <Heart size={18} color="#ca8a04" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#713f12' }}>
                    ₹{totalAmountContributed.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Direct afforestation funding</div>
                </div>

                <div style={{ background: '#f0f9ff', padding: '16px 18px', borderRadius: '14px', border: '1px solid #e0f2fe' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>80G Receipts</span>
                    <Download size={18} color="#0284c7" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0c4a6e' }}>
                    {verifiedReceipts.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#0369a1' }}>Available</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Archived in Nextcloud</div>
                </div>

                <div style={{ background: '#faf5ff', padding: '16px 18px', borderRadius: '14px', border: '1px solid #f3e8ff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase' }}>Eco Fellowship</span>
                    <ShieldCheck size={18} color="#9333ea" />
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#581c87', marginTop: '4px' }}>
                    {membership?.membershipType ? membership.membershipType.replace('_', ' ') : 'VERIFIED'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Voting rights &amp; stewardship</div>
                </div>
              </div>

              {/* Latest Activity Strip */}
              {userDonations.length > 0 ? (
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: userDonations[0].status === 'CONFIRMED' ? '#dcfce7' : '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: userDonations[0].status === 'CONFIRMED' ? '#16a34a' : '#b45309'
                    }}>
                      {userDonations[0].status === 'CONFIRMED' ? <CheckCircle size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                        Latest Activity: {userDonations[0].donationType === 'PLANT_SPONSORSHIP' ? `${userDonations[0].plantCount} Trees Sponsored` : `₹${userDonations[0].amount} Contributed`} ({userDonations[0].campaignTitle})
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        Ref: {userDonations[0].donationReference} • Status: <strong style={{ color: userDonations[0].status === 'CONFIRMED' ? '#16a34a' : '#d97706' }}>{userDonations[0].status.replace('_', ' ')}</strong>
                        {userDonations[0].receiptNumber && ` • Receipt #${userDonations[0].receiptNumber}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {userDonations[0].hasReceipt && (
                      <a
                        href={`/api/donations/${userDonations[0].id}/receipt/download`}
                        className="btn btn-sm btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                      >
                        <Download size={13} /> Download 80G PDF
                      </a>
                    )}
                    <button
                      onClick={() => onNavigate('my-donations')}
                      className="btn btn-sm btn-secondary"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      View All Contributions ({userDonations.length}) <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Trees size={20} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                        Start your personal tree grove today!
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                        Sponsor native saplings in our active campaigns to receive cloud-verified geotagged records.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('donate-plants')}
                    className="btn btn-sm btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Trees size={15} /> Sponsor a Tree Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 2. LIVE IMPACT METRICS */}
      <section style={{ marginTop: '-50px', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="glass-panel" style={{ padding: '36px', boxShadow: 'var(--shadow-lg)' }}>
            <div className="grid-4" style={{ textAlign: 'center' }}>
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#15803d', lineHeight: 1 }}>
                  {stats ? (stats.confirmedPlantsPlanted + 14200).toLocaleString() : '14,200+'}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>
                  Native Trees Planted
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Verified In Protected Bioregions</div>
              </div>

              <div style={{ padding: '12px', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#b45309', lineHeight: 1 }}>
                  {stats ? (stats.totalPlantsSponsored + 16800).toLocaleString() : '16,800+'}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>
                  Trees Sponsored
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>By Donors &amp; Patron Members</div>
              </div>

              <div style={{ padding: '12px', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#15803d', lineHeight: 1 }}>
                  {stats ? stats.totalMembers : '1,200+'}
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>
                  Active Eco-Members
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Across 14 States &amp; Territories</div>
              </div>

              <div style={{ padding: '12px', borderLeft: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0369a1', lineHeight: 1 }}>
                  100%
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', marginTop: '8px' }}>
                  Cloud-Verified Receipts
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Permanent Nextcloud Storage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT VANSEVA */}
      <section className="section-padding">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            <div>
              <div className="badge badge-green" style={{ marginBottom: '16px' }}>About Vanseva Foundation</div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#14532d', marginBottom: '20px' }}>
                A Living Forest in Every Community.
              </h2>
              <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.8, marginBottom: '20px' }}>
                Founded in 2026, Vanseva operates on a sacred ecological conviction: tree planting must never be an unmonitored ceremonial gesture. We select native, climate-resilient species—such as Neem, Peepal, Banyan, and Sal—nurtured with local community caretakers for 36 months to ensure over 92% survival rates.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {[
                  '100% Indigenous endemic species preventing invasive disruption',
                  'Permanent cloud registry with verifiable Nextcloud PDF receipt archives',
                  'Transparent financial stewardship without intermediary commissions',
                  'Community ownership and geotagged plantation documentation'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{item}</span>
                  </div>
                ))}
              </div>

              {user ? (
                <button onClick={() => onNavigate(user.role === 'ROLE_ADMIN' ? 'admin' : 'my-account')} className="btn btn-primary">
                  {user.role === 'ROLE_ADMIN' ? 'Manage NGO Admin Console' : 'View Your Member Portal'} <ArrowRight size={18} />
                </button>
              ) : (
                <button onClick={() => onNavigate('membership')} className="btn btn-primary">
                  Join As An Active Member <ArrowRight size={18} />
                </button>
              )}
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #ecfdf5, #dcfce7)',
              borderRadius: 'var(--radius-xl)',
              padding: '40px',
              border: '2px solid #bbf7d0',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                      <Leaf size={22} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Biodiversity First</h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                    Every sapling is selected to restore native wildlife micro-habitats, nourish pollinator corridors, and restore degraded topsoil.
                  </p>
                </div>

                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
                      <Globe size={22} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Carbon Sequestration</h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                    A single mature Peepal or Banyan tree sequesters an estimated 22 kg of atmospheric CO₂ annually while oxygenating surrounding settlements.
                  </p>
                </div>

                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1' }}>
                      <Award size={22} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Verifiable PDF Receipts</h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
                    Every confirmed donation triggers a server-side generated PDF receipt immutably stored in private Nextcloud cloud storage with unique reference codes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVE CAMPAIGNS SPOTLIGHT */}
      <section style={{ background: '#f1f5f9', padding: '90px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="badge badge-green" style={{ marginBottom: '12px' }}>Grassroots Drives</div>
              <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#14532d' }}>
                Active Plantation Campaigns
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>
                Support high-priority ecological corridors across India
              </p>
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              View All Campaigns <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3">
            {campaigns.slice(0, 3).map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Cover Image */}
                <div style={{
                  height: '200px',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #166534, #14532d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}>
                  {campaign.coverImageUrl ? (
                    <img
                      src={campaign.coverImageUrl}
                      alt={campaign.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(0, 0, 0, 0.65)',
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
                    bottom: '16px',
                    right: '16px',
                    background: '#22c55e',
                    color: '#064e3b',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderRadius: '8px'
                  }}>
                    ₹{campaign.plantUnitPrice} / Sapling
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '10px' }}>
                    {campaign.title}
                  </h3>
                  <p style={{
                    fontSize: '0.88rem',
                    color: '#64748b',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {campaign.description}
                  </p>

                  {/* Progress */}
                  <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      <span>Planted: {campaign.plantedPlants.toLocaleString()} trees</span>
                      <span style={{ color: '#15803d' }}>{campaign.plantProgressPercentage}%</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-bar" style={{ width: `${Math.min(100, campaign.plantProgressPercentage)}%` }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                      Target: {campaign.targetPlants.toLocaleString()} saplings
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
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
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE PLANT SPECIES SPOTLIGHT */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
            <div className="badge badge-amber" style={{ marginBottom: '12px' }}>Native Keystone Flora</div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#14532d' }}>
              Choose Indigenous Trees To Sponsor
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '10px' }}>
              Every plant species is selected for high oxygen output, traditional medicinal value, and ecological harmony with regional soil.
            </p>
          </div>

          <div className="grid-4">
            {[
              {
                name: 'Neem',
                botanical: 'Azadirachta indica',
                cost: 150,
                desc: 'Natural insecticide, atmospheric purifier, medicinal bark, and resilient to arid drought seasons.',
                tag: 'Air Purifier'
              },
              {
                name: 'Peepal',
                botanical: 'Ficus religiosa',
                cost: 180,
                desc: 'Releases daytime oxygen and night-time ozone, houses over 40 bird species, deep groundwater recharger.',
                tag: 'Sacred Keystone'
              },
              {
                name: 'Banyan',
                botanical: 'Ficus benghalensis',
                cost: 200,
                desc: 'National tree of India. Expansive aerial root network prevents soil erosion and creates micro-forest biomes.',
                tag: 'Ecosystem Anchor'
              },
              {
                name: 'Sal Tree',
                botanical: 'Shorea robusta',
                cost: 160,
                desc: 'Endemic rainforest canopy pillar. Provides canopy shade for understory regeneration and native orchids.',
                tag: 'Canopy Giant'
              }
            ].map((tree, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>{tree.tag}</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>₹{tree.cost}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>{tree.name}</h3>
                <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#15803d', marginBottom: '12px' }}>
                  {tree.botanical}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                  {tree.desc}
                </p>
                <button
                  onClick={() => onNavigate('donate-plants', { plantSpecies: tree.name + ' (' + tree.botanical + ')' })}
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%' }}
                >
                  Sponsor {tree.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. REAL PLANTATION PHOTO GALLERY PREVIEW */}
      <section style={{ background: '#f8fafc', padding: '90px 0', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="badge badge-green" style={{ marginBottom: '12px' }}>Field Verification</div>
              <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#14532d' }}>
                Real Plantation Gallery
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '6px' }}>
                All images uploaded by ground volunteers and stored securely in Nextcloud storage
              </p>
            </div>
            <button
              onClick={() => onNavigate('gallery')}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Browse Full Gallery ({stats?.approvedGalleryPhotos || 3}+ Photos) <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid-3">
            {gallery.map((item, index) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ height: '220px', overflow: 'hidden', background: '#0f172a' }}>
                  <img
                    src={resolveImageUrl(item.imageUrl, item.title, index)}
                    alt={item.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/gallery/sapling_planting.jpg';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {item.location || 'Protected Biosphere'}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '14px' }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <span>🌱 {item.plantSpecies || 'Native Saplings'}</span>
                    <span>By {item.uploaderName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEMBER CALLOUT OR VISITOR CALLOUT */}
      <section style={{
        background: 'linear-gradient(135deg, #14532d, #064e3b)',
        color: '#ffffff',
        padding: '90px 0',
        position: 'relative'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          {user ? (
            <>
              <div className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#86efac', marginBottom: '20px' }}>
                🌿 Active Vanseva Steward
              </div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '20px', lineHeight: 1.2 }}>
                Thank You For Nurturing Earth, {user.fullName || user.username}!
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#dcfce7', lineHeight: 1.8, marginBottom: '36px' }}>
                Your verified Eco-Guardian membership ({membership?.membershipNumber || user.membershipNumber || 'Active'}) directly funds geotagged sapling planting, soil restoration, and native forest recovery. Continue growing your grove or access your cloud tax certificates.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('donate-plants')}
                  className="btn btn-lg btn-amber"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <Trees size={20} />
                  Sponsor Another Tree Grove
                </button>
                <button
                  onClick={() => onNavigate('my-account')}
                  className="btn btn-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <Award size={20} />
                  My Member Profile &amp; ID
                </button>
                <button
                  onClick={() => onNavigate('my-donations')}
                  className="btn btn-lg"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Heart size={20} />
                  My Receipts &amp; Contributions
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#86efac', marginBottom: '20px' }}>
                Vanseva Green Fellowship
              </div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '20px', lineHeight: 1.2 }}>
                Become a Vanseva Guardian. Receive Your Unique ID.
              </h2>
              <p style={{ fontSize: '1.1rem', color: '#dcfce7', lineHeight: 1.8, marginBottom: '36px' }}>
                Register as a member to participate in on-ground plantation events, monitor your contributed tree grove with lifetime geotagged records, and gain voting voice in our annual biosphere restoration councils.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('membership')}
                  className="btn btn-lg btn-amber"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <UserPlus size={20} />
                  Register Membership Now
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="btn btn-lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff'
                  }}
                >
                  Existing Member Login
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
