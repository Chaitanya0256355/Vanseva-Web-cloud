import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { Campaign, Donation } from '../types';
import { Trees, CheckCircle, Upload, ShieldCheck, AlertCircle, ArrowRight, Heart } from 'lucide-react';

interface PlantDonationPageProps {
  initialCampaignId?: number;
  initialSpecies?: string;
  onNavigate: (page: string) => void;
}

export const PlantDonationPage: React.FC<PlantDonationPageProps> = ({
  initialCampaignId,
  initialSpecies,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState<number>(initialCampaignId || 0);
  const [donorName, setDonorName] = useState(user?.fullName || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState('');
  const [plantCount, setPlantCount] = useState<number>(10);
  const [plantSpecies, setPlantSpecies] = useState(initialSpecies || 'Neem (Azadirachta indica)');
  const [paymentMethod, setPaymentMethod] = useState('OFFLINE_TRANSFER');
  const [notes, setNotes] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [submittedDonation, setSubmittedDonation] = useState<Donation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiRequest<Campaign[]>('/api/campaigns').then((data) => {
      setCampaigns(data);
      if (!campaignId && data.length > 0) {
        setCampaignId(initialCampaignId || data[0].id);
      }
    });
  }, [initialCampaignId]);

  useEffect(() => {
    if (user) {
      if (!donorName) setDonorName(user.fullName);
      if (!donorEmail) setDonorEmail(user.email);
    }
  }, [user]);

  const selectedCampaign = campaigns.find((c) => c.id === Number(campaignId));
  const unitPrice = selectedCampaign?.plantUnitPrice || 150;
  const totalAmount = unitPrice * plantCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('donorName', donorName);
      formData.append('donorEmail', donorEmail);
      if (donorPhone) formData.append('donorPhone', donorPhone);
      formData.append('campaignId', String(campaignId));
      formData.append('donationType', 'PLANT_SPONSORSHIP');
      formData.append('plantCount', String(plantCount));
      formData.append('plantSpecies', plantSpecies);
      formData.append('paymentMethod', paymentMethod);
      if (notes) formData.append('transactionNotes', notes);
      if (proofFile) formData.append('proofDoc', proofFile);

      const response = await apiRequest<Donation>('/api/donations/pledge', {
        method: 'POST',
        body: formData,
      });

      setSubmittedDonation(response);
    } catch (err: any) {
      setError(err.message || 'Failed to submit plant sponsorship.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedDonation) {
    return (
      <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', background: '#ffffff' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={36} />
            </div>

            <span className="badge badge-green" style={{ marginBottom: '12px' }}>Pledge Recorded</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#14532d', marginBottom: '12px' }}>
              Thank You For Sponsoring {submittedDonation.plantCount} Trees!
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
              Your pledge for <strong>{submittedDonation.plantSpecies}</strong> in{' '}
              <strong>{submittedDonation.campaignTitle}</strong> has been registered in our official NGO database.
            </p>

            <div style={{
              background: '#f1f5f9',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'left',
              marginBottom: '32px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Donation Reference:</span>
                <strong style={{ color: '#15803d' }}>{submittedDonation.donationReference}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Sponsorship Total:</span>
                <strong>INR {submittedDonation.amount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Status:</span>
                <span className="badge badge-amber">{submittedDonation.status}</span>
              </div>
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '12px', marginTop: '12px', fontSize: '0.85rem', color: '#475569' }}>
                ℹ️ <strong>Next Step:</strong> As part of our anti-fraud policy, donations submitted via pledge or offline transfer are reviewed by our trustees. Once confirmed, your <strong>Official PDF Receipt</strong> will be generated automatically into our private Nextcloud cloud repository and will appear in your donor dashboard.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => onNavigate('my-donations')} className="btn btn-primary">
                View My Donations
              </button>
              <button onClick={() => setSubmittedDonation(null)} className="btn btn-secondary">
                Sponsor More Plants
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge badge-green" style={{ marginBottom: '12px' }}>Keystone Sponsorship</div>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#14532d', marginBottom: '12px' }}>
            Sponsor Native Tree Saplings
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7 }}>
            Plant trees in high-priority restoration zones. Each sapling includes 36 months of organic care and survival monitoring.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '40px', background: '#ffffff' }}>
          {/* 1. Campaign Selection */}
          <div className="form-group">
            <label className="form-label">Select Target Plantation Campaign *</label>
            <select
              className="form-select"
              value={campaignId}
              onChange={(e) => setCampaignId(Number(e.target.value))}
              required
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.location} (₹{c.plantUnitPrice}/tree)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Plant Species */}
          <div className="form-group">
            <label className="form-label">Choose Native Tree Species *</label>
            <select
              className="form-select"
              value={plantSpecies}
              onChange={(e) => setPlantSpecies(e.target.value)}
              required
            >
              <option value="Neem (Azadirachta indica)">Neem (Azadirachta indica) — Air Purifier</option>
              <option value="Peepal (Ficus religiosa)">Peepal (Ficus religiosa) — Sacred Keystone</option>
              <option value="Banyan (Ficus benghalensis)">Banyan (Ficus benghalensis) — Ecosystem Anchor</option>
              <option value="Sal Tree (Shorea robusta)">Sal Tree (Shorea robusta) — Rainforest Canopy</option>
              <option value="Teak (Tectona grandis)">Teak (Tectona grandis) — Deep Soil Binder</option>
              <option value="Gulmohar (Delonix regia)">Gulmohar (Delonix regia) — Pollinator Haven</option>
              <option value="Mixed Native Rainforest Canopy">Mixed Native Rainforest Canopy (Recommended)</option>
            </select>
          </div>

          {/* 3. Plant Count */}
          <div className="form-group">
            <label className="form-label">Number of Trees to Sponsor: <strong>{plantCount} Trees</strong></label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[5, 10, 25, 50, 100].map((qty) => (
                <button
                  type="button"
                  key={qty}
                  onClick={() => setPlantCount(qty)}
                  className={`btn btn-sm ${plantCount === qty ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: '70px' }}
                >
                  {qty} Trees
                </button>
              ))}
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={plantCount}
              onChange={(e) => setPlantCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#16a34a' }}
            />
          </div>

          {/* 4. Cost Breakdown Banner */}
          <div style={{
            background: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>CALCULATED SPONSORSHIP</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#064e3b' }}>
                ₹{totalAmount.toLocaleString()} INR
              </div>
              <div style={{ fontSize: '0.78rem', color: '#047857' }}>
                ({plantCount} trees × ₹{unitPrice} per sapling)
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-green">3-Year Maintenance Included</span>
            </div>
          </div>

          {/* 5. Donor Details */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Donor / Sponsor Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Anand Mahindra"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="your.email@example.com"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+91 98765 43210"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contribution Mode</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="OFFLINE_TRANSFER">Direct Bank Transfer / NEFT / RTGS</option>
                <option value="UPI_OFFLINE">UPI Direct Transfer (@vanseva.org)</option>
                <option value="PLEDGE">Formal Environmental Pledge (Pay later)</option>
              </select>
            </div>
          </div>

          {/* 6. Optional Notes & Dedication */}
          <div className="form-group">
            <label className="form-label">Tree Dedication or Optional Message</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="e.g. Dedicated to clean air for our children, or reference of your bank transfer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* 7. Optional Proof Document */}
          <div className="form-group">
            <label className="form-label">Upload Proof Document or Photo (Optional - Saved to Nextcloud)</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
              className="form-input"
              style={{ padding: '8px' }}
            />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Supports transaction receipt screenshot, deed, or dedication certificate (Max 25MB).
            </span>
          </div>

          {/* Bank Transfer Details Box */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '0.82rem',
            color: '#475569',
            marginBottom: '24px'
          }}>
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>🏦 Vanseva Foundation Trust Bank Details:</div>
            <div>Bank: State Bank of India | Account No: 409823109281 | IFSC: SBIN0001234</div>
            <div>UPI ID: <strong>donate@vanseva</strong></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
          >
            {loading ? 'Submitting Pledge to Vanseva...' : `Confirm Plant Sponsorship (₹${totalAmount.toLocaleString()})`}
          </button>
        </form>
      </div>
    </div>
  );
};
