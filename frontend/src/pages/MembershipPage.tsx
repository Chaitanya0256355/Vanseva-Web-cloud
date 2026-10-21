import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import { UserPlus, CheckCircle, AlertCircle, ShieldCheck, Upload, ArrowRight, User } from 'lucide-react';

interface MembershipPageProps {
  onNavigate: (page: string) => void;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({ onNavigate }) => {
  const { refreshUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [membershipType, setMembershipType] = useState('INDIVIDUAL');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Native Afforestation',
    'Soil Rejuvenation',
  ]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [registeredMember, setRegisteredMember] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const availableInterests = [
    'Native Afforestation',
    'Soil Rejuvenation',
    'Miyawaki Dense Forests',
    'Wetland & Mangrove Restoration',
    'Geotagged Tree Tracking',
    'Community Nursery Cultivation',
    'Youth Environmental Education',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('Please agree to the Vanseva environmental ethics and privacy policy.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);
      if (phone) formData.append('phone', phone);
      if (address) formData.append('address', address);
      if (city) formData.append('city', city);
      if (postalCode) formData.append('postalCode', postalCode);
      formData.append('membershipType', membershipType);
      formData.append('environmentalInterests', selectedInterests.join(', '));
      formData.append('consentPrivacy', String(consent));
      if (profilePhoto) formData.append('profilePhoto', profilePhoto);

      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: formData,
      });

      setRegisteredMember(response);
      await refreshUser();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredMember) {
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

            <span className="badge badge-green" style={{ marginBottom: '12px' }}>Welcome To Vanseva</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#14532d', marginBottom: '12px' }}>
              Membership Successfully Registered!
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7, marginBottom: '28px' }}>
              Welcome aboard, <strong>{registeredMember.fullName}</strong>. Your official membership record and secure account have been established.
            </p>

            {/* Membership Card Preview */}
            <div style={{
              background: 'linear-gradient(135deg, #14532d 0%, #064e3b 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              textAlign: 'left',
              boxShadow: 'var(--shadow-lg)',
              marginBottom: '32px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.05em' }}>VANSEVA FOUNDATION</div>
                  <div style={{ fontSize: '0.75rem', color: '#86efac' }}>Official Environmental Member</div>
                </div>
                <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>Active Guardian</span>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', color: '#a7f3d0', textTransform: 'uppercase' }}>Unique Membership ID</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.08em', color: '#fef3c7' }}>
                  {registeredMember.membershipNumber}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Member Name</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{registeredMember.fullName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Cloud Storage Status</div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#86efac' }}>Nextcloud Archived</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={() => onNavigate('my-account')} className="btn btn-primary">
                View My Account Profile
              </button>
              <button onClick={() => onNavigate('donate-plants')} className="btn btn-secondary">
                Sponsor Your First Tree
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
          <div className="badge badge-green" style={{ marginBottom: '12px' }}>Green Guardians</div>
          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#14532d', marginBottom: '12px' }}>
            Become a Vanseva Member
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.7 }}>
            Receive your permanent backend-generated Membership ID, participate in regional plantation forums, and oversee our tree survivability registry.
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
          {/* Personal Information */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
            1. Personal &amp; Account Details
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Dr. / Mr. / Ms. Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="your.email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Desired Username *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. rahul.sharma"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Membership Category</label>
              <select
                className="form-select"
                value={membershipType}
                onChange={(e) => setMembershipType(e.target.value)}
              >
                <option value="INDIVIDUAL">Individual Eco Guardian (Annual)</option>
                <option value="STUDENT">Student Environmental Scholar (Subsidized)</option>
                <option value="PATRON">Patron Conservationist (Tree Sponsor)</option>
                <option value="LIFE_MEMBER">Life Member Trustee (Lifetime Council)</option>
              </select>
            </div>
          </div>

          {/* Address Details */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '28px 0 20px' }}>
            2. Residential &amp; City Details
          </h3>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="Apartment, suite, street name"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, Delhi, Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Postal / PIN Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 560001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          {/* Environmental Interests */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '28px 0 16px' }}>
            3. Areas of Environmental Interest
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
            {availableInterests.map((interest) => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: active ? '#15803d' : '#f1f5f9',
                    color: active ? '#ffffff' : '#334155',
                    border: active ? '1px solid #15803d' : '1px solid #cbd5e1',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {active ? '✓ ' : '+ '} {interest}
                </button>
              );
            })}
          </div>

          {/* Profile Photo (Saved to Nextcloud) */}
          <div className="form-group">
            <label className="form-label">Optional Profile Photograph (Saved in Nextcloud Storage)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files ? e.target.files[0] : null)}
              className="form-input"
              style={{ padding: '8px' }}
            />
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Your photo is archived into our private cloud repository and shown on your digital membership card.
            </span>
          </div>

          {/* Privacy Consent */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', margin: '24px 0' }}>
            <input
              type="checkbox"
              id="consentCheck"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ width: '18px', height: '18px', marginTop: '3px', accentColor: '#16a34a' }}
            />
            <label htmlFor="consentCheck" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
              I agree to the Vanseva Foundation environmental code of conduct, privacy policy, and confirm that my provided details are accurate for official membership registration.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }}
          >
            {loading ? 'Registering Membership...' : 'Complete Membership Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};
