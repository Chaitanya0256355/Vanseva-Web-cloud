import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { Campaign, Donation } from '../types';
import { Heart, CheckCircle, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface MoneyDonationPageProps {
  initialCampaignId?: number;
  onNavigate: (page: string) => void;
}

export const MoneyDonationPage: React.FC<MoneyDonationPageProps> = ({
  initialCampaignId,
  onNavigate,
}) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState<number>(initialCampaignId || 0);
  const [donorName, setDonorName] = useState(user?.fullName || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState('');
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
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

  const finalAmount = isCustom ? Number(customAmount) || 0 : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (finalAmount <= 0) {
      setError('Please provide a positive donation amount.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('donorName', donorName);
      formData.append('donorEmail', donorEmail);
      if (donorPhone) formData.append('donorPhone', donorPhone);
      formData.append('campaignId', String(campaignId));
      formData.append('donationType', 'MONETARY');
      formData.append('amount', String(finalAmount));
      formData.append('paymentMethod', paymentMethod);
      if (notes) formData.append('transactionNotes', notes);
      if (proofFile) formData.append('proofDoc', proofFile);

      const response = await apiRequest<Donation>('/api/donations/pledge', {
        method: 'POST',
        body: formData,
      });

      setSubmittedDonation(response);
    } catch (err: any) {
      setError(err.message || 'Failed to submit donation pledge.');
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

            <span className="badge badge-green" style={{ marginBottom: '12px' }}>Pledge Confirmed</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#14532d', marginBottom: '12px' }}>
              Thank You For Your Contribution!
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
              Your pledge of <strong>INR {submittedDonation.amount.toLocaleString()}</strong> towards{' '}
              <strong>{submittedDonation.campaignTitle}</strong> is recorded under reference{' '}
              <strong>{submittedDonation.donationReference}</strong>.
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
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Amount:</span>
                <strong>INR {submittedDonation.amount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Verification Status:</span>
                <span className="badge badge-amber">{submittedDonation.status}</span>
              </div>
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '12px', marginTop: '12px', fontSize: '0.85rem', color: '#475569' }}>
                🛡️ <strong>Receipt Generation Notice:</strong> As soon as our trustees reconcile your transfer, your verified <strong>Vanseva Official PDF Receipt</strong> will be generated and archived into our private cloud repository. You can download it directly from your <strong>My Donations</strong> ledger.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => onNavigate('my-donations')} className="btn btn-primary">
                View My Donations
              </button>
              <button onClick={() => setSubmittedDonation(null)} className="btn btn-secondary">
                Make Another Gift
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding" style={{ background: '#f8fafc', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="badge badge-green" style={{ marginBottom: '12px' }}>Financial Stewardship</div>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#14532d', marginBottom: '12px' }}>
            Donate to Forest Restoration
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7 }}>
            Your direct funding empowers community nurseries, protective fencing, organic drip irrigation, and post-plantation sapling nurturing.
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
          {/* Preset Amounts */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Choose Contribution Amount (INR)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
              {[500, 1000, 2500, 5000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => {
                    setAmount(val);
                    setIsCustom(false);
                  }}
                  className={`btn ${!isCustom && amount === val ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="number"
                min="50"
                step="50"
                placeholder="Or enter custom amount in INR..."
                className="form-input"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setIsCustom(true);
                }}
                onFocus={() => setIsCustom(true)}
              />
            </div>
          </div>

          {/* Campaign Selector */}
          <div className="form-group">
            <label className="form-label">Select Target Campaign *</label>
            <select
              className="form-select"
              value={campaignId}
              onChange={(e) => setCampaignId(Number(e.target.value))}
              required
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.location}
                </option>
              ))}
            </select>
          </div>

          {/* Donor Information */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Your full legal name"
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
                placeholder="email@example.com"
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
              <label className="form-label">Fulfillment Mode</label>
              <select
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="OFFLINE_TRANSFER">Direct Bank Transfer / NEFT / RTGS</option>
                <option value="UPI_OFFLINE">UPI Transfer (donate@vanseva)</option>
                <option value="PLEDGE">CSR / Individual Formal Pledge</option>
              </select>
            </div>
          </div>

          {/* Optional Message */}
          <div className="form-group">
            <label className="form-label">Message or Transfer Reference</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="e.g. UTR reference number or dedication message..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Optional Proof Document */}
          <div className="form-group">
            <label className="form-label">Upload Transfer Slip / Receipt (Optional - Stored in Nextcloud)</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => setProofFile(e.target.files ? e.target.files[0] : null)}
              className="form-input"
              style={{ padding: '8px' }}
            />
          </div>

          {/* Bank Coordinates */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '0.82rem',
            color: '#475569',
            marginBottom: '24px'
          }}>
            <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>🏦 Official Vanseva Trust Bank Account:</div>
            <div>Bank: State Bank of India | Current Account: 409823109281 | IFSC: SBIN0001234</div>
            <div>UPI: donate@vanseva | Branch: New Delhi Parliament Street</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
          >
            {loading ? 'Submitting Donation Pledge...' : `Submit Donation Pledge (₹${finalAmount.toLocaleString()})`}
          </button>
        </form>
      </div>
    </div>
  );
};
