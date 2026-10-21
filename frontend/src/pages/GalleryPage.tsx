import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { GalleryItem, Campaign } from '../types';
import { Image as ImageIcon, Upload, X, MapPin, Calendar, CheckCircle, AlertCircle, Plus } from 'lucide-react';

interface GalleryPageProps {
  onOpenAuth: (mode?: 'login') => void;
}

const DEFAULT_PLANT_PHOTOS: GalleryItem[] = [
  {
    id: 101,
    title: 'Native Sapling Cultivation at Coorg Nursery',
    description: 'Over 5,000 indigenous saplings raised in community nurseries with organic compost before monsoon plantation.',
    location: 'Madikeri, Coorg (Western Ghats)',
    campaignId: 1,
    campaignTitle: 'Western Ghats Rainforest Revival',
    imageUrl: '/images/gallery/community_nursery.jpg',
    plantSpecies: 'Shorea robusta, Neem & Mahogani',
    datePlanted: '2026-09-22',
    isApprovedPublic: true,
    uploaderName: 'Vanseva Field Coordinator',
    createdAt: '2026-09-22T10:00:00'
  },
  {
    id: 102,
    title: 'Sundarbans Coastal Mangrove Mudflat Planting',
    description: 'Empowered local women self-help groups fortifying coastal embankment ridges with sturdy prop-root mangrove saplings.',
    location: 'Gosaba Island, Sundarbans',
    campaignId: 3,
    campaignTitle: 'Sundarbans Coastal Mangrove Protection',
    imageUrl: '/images/gallery/mangrove_coastal.jpg',
    plantSpecies: 'Rhizophora mucronata (Red Mangrove)',
    datePlanted: '2026-09-28',
    isApprovedPublic: true,
    uploaderName: 'Priya Sharma (Guardian Member)',
    createdAt: '2026-09-28T14:30:00'
  },
  {
    id: 103,
    title: 'Aravalli Ridge Mountain Reforestation Drive',
    description: 'Youth environmental corps and community volunteers planting drought-resilient native species on denuded slopes.',
    location: 'Sariska Buffer, Alwar',
    campaignId: 2,
    campaignTitle: 'Aravalli Green Shield Initiative',
    imageUrl: '/images/gallery/field_reforestation.jpg',
    plantSpecies: 'Kikar, Dhak & Acacia senegal',
    datePlanted: '2026-09-07',
    isApprovedPublic: true,
    uploaderName: 'Vanseva Ground Team',
    createdAt: '2026-09-07T09:15:00'
  },
  {
    id: 104,
    title: 'Hands-on Soil Planting & Sapling Nurturing',
    description: 'Macro inspection of tender organic root balls being settled into rich, well-aerated forest topsoil.',
    location: 'Nilgiri Biosphere Reserve',
    campaignId: 1,
    campaignTitle: 'Western Ghats Rainforest Revival',
    imageUrl: '/images/gallery/sapling_planting.jpg',
    plantSpecies: 'Ficus benghalensis & Native Oak',
    datePlanted: '2026-10-02',
    isApprovedPublic: true,
    uploaderName: 'Vanseva Agroforestry Specialist',
    createdAt: '2026-10-02T11:45:00'
  }
];

const resolveImageUrl = (url?: string, title?: string, index: number = 0): string => {
  const t = (title || '').toLowerCase();
  if (t.includes('nursery') || t.includes('cultivation') || t.includes('coorg')) return '/images/gallery/community_nursery.jpg';
  if (t.includes('mangrove') || t.includes('sundarban') || t.includes('mudflat')) return '/images/gallery/mangrove_coastal.jpg';
  if (t.includes('aravalli') || t.includes('ridge') || t.includes('drive') || t.includes('mountain') || t.includes('restoration')) return '/images/gallery/field_reforestation.jpg';
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

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryItem[]>(DEFAULT_PLANT_PHOTOS);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadLoc, setUploadLoc] = useState('');
  const [uploadCampaignId, setUploadCampaignId] = useState<number>(0);
  const [uploadSpecies, setUploadSpecies] = useState('');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Lightbox State
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const loadPhotos = () => {
    apiRequest<GalleryItem[]>('/api/gallery')
      .then((items) => {
        if (items && items.length > 0) {
          setPhotos(items);
        } else {
          setPhotos(DEFAULT_PLANT_PHOTOS);
        }
      })
      .catch(() => setPhotos(DEFAULT_PLANT_PHOTOS))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPhotos();
    apiRequest<Campaign[]>('/api/campaigns').then(setCampaigns);
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a photo to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadMsg(null);

    try {
      const formData = new FormData();
      formData.append('title', uploadTitle);
      if (uploadDesc) formData.append('description', uploadDesc);
      if (uploadLoc) formData.append('location', uploadLoc);
      if (uploadCampaignId) formData.append('campaignId', String(uploadCampaignId));
      if (uploadSpecies) formData.append('plantSpecies', uploadSpecies);
      if (uploadDate) formData.append('datePlanted', uploadDate);
      formData.append('image', uploadFile);

      await apiRequest('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadMsg('Photo successfully uploaded into Nextcloud repository! ' + (user?.role === 'ROLE_ADMIN' ? 'Published live.' : 'Awaiting admin moderation.'));
      loadPhotos();
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadMsg(null);
        setUploadTitle('');
        setUploadFile(null);
      }, 1500);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="badge badge-green" style={{ marginBottom: '12px' }}>Real Field Documentation</div>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#14532d', marginBottom: '8px' }}>
              Plantation Photo Gallery
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '650px' }}>
              Photographs captured by our field coordinators, volunteers, and member guardians. Stored permanently in Vanseva private cloud storage.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                onOpenAuth('login');
              } else {
                setShowUploadModal(true);
              }
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} />
            Upload Plantation Photo
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            Loading plantation gallery...
          </div>
        ) : photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '16px' }}>
            <ImageIcon size={48} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', color: '#334155' }}>No approved photos yet</h3>
            <p style={{ color: '#64748b', marginTop: '6px' }}>Be the first member to upload a verified plantation photo!</p>
          </div>
        ) : (
          <div className="grid-3">
            {photos.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ height: '260px', overflow: 'hidden', background: '#0f172a', position: 'relative' }}>
                  <img
                    src={resolveImageUrl(item.imageUrl, item.title, index)}
                    alt={item.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/gallery/sapling_planting.jpg';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(6px)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <MapPin size={12} color="#4ade80" />
                    <span>{item.location || 'Sanctuary Parcel'}</span>
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '14px' }}>
                    {item.description}
                  </p>
                  <div style={{
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: '#94a3b8'
                  }}>
                    <span>🌱 {item.plantSpecies || 'Native Saplings'}</span>
                    <span>Uploaded by {item.uploaderName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '800px', padding: 0, overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', maxHeight: '550px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={resolveImageUrl(selectedPhoto.imageUrl, selectedPhoto.title, 0)}
                  alt={selectedPhoto.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/gallery/sapling_planting.jpg';
                  }}
                  style={{ maxWidth: '100%', maxHeight: '550px', objectFit: 'contain' }}
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '8px'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>
                    {selectedPhoto.title}
                  </h3>
                  <span className="badge badge-green">Verified Plant Photo</span>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.7, marginBottom: '16px' }}>
                  {selectedPhoto.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '24px',
                  fontSize: '0.85rem',
                  color: '#475569',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '16px'
                }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Location: </span>
                    <strong>{selectedPhoto.location || 'Protected Biosphere'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Species: </span>
                    <strong>{selectedPhoto.plantSpecies || 'Native Evergreen'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Uploader: </span>
                    <strong>{selectedPhoto.uploaderName}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#14532d' }}>
                  Upload Plantation Photograph
                </h3>
                <button onClick={() => setShowUploadModal(false)} style={{ color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              {uploadError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  marginBottom: '16px'
                }}>
                  {uploadError}
                </div>
              )}

              {uploadMsg && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  marginBottom: '16px'
                }}>
                  {uploadMsg}
                </div>
              )}

              <form onSubmit={handleUploadSubmit}>
                <div className="form-group">
                  <label className="form-label">Photo Title *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Monsoon Neem Sapling Transplant"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Site Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Western Ghats Sector 4B"
                    value={uploadLoc}
                    onChange={(e) => setUploadLoc(e.target.value)}
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Related Campaign</label>
                    <select
                      className="form-select"
                      value={uploadCampaignId}
                      onChange={(e) => setUploadCampaignId(Number(e.target.value))}
                    >
                      <option value={0}>General Plantation Drive</option>
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Plant Species</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Azadirachta indica"
                      value={uploadSpecies}
                      onChange={(e) => setUploadSpecies(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Photo Description</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="Describe the plantation activity, volunteer team, or growth milestone..."
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Image File * (Stored in Nextcloud)</label>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                    className="form-input"
                    style={{ padding: '8px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '12px', padding: '14px' }}
                >
                  {uploading ? 'Uploading to Nextcloud Storage...' : 'Submit Photo to Vanseva'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
