import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { PlantDonationPage } from './pages/PlantDonationPage';
import { MoneyDonationPage } from './pages/MoneyDonationPage';
import { MembershipPage } from './pages/MembershipPage';
import { GalleryPage } from './pages/GalleryPage';
import { MyAccountPage } from './pages/MyAccountPage';
import { MyDonationsPage } from './pages/MyDonationsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Shield, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);
  const [securityToast, setSecurityToast] = useState<string | null>(null);

  const { user, expireSession } = useAuth();
  const prevUserRef = useRef(user);

  const navigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({ page, authenticated: !!user }, '', window.location.pathname);
  };

  const openAuth = (mode: 'login' | 'register' = 'login', notice: string | null = null) => {
    setAuthMode(mode);
    setSecurityNotice(notice);
    setAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setAuthModalOpen(false);
    setSecurityNotice(null);
  };

  // Safe session termination triggered by swipe-back, browser Back navigation, or leaving site
  const triggerSwipeBackSecurityLogout = useCallback(async (sourceText: string) => {
    await expireSession();

    setCurrentPage('home');
    const notice = `Your active session was expired immediately for security protection upon ${sourceText}. Please enter your credentials to log in again.`;
    setSecurityNotice(notice);
    setSecurityToast(`🔒 Session Expired: Ended upon ${sourceText}. Please sign in to resume.`);
    setAuthMode('login');
    setAuthModalOpen(true);

    // Reset browser history to root state to prevent forward/back cache leakage
    window.history.replaceState({ authenticated: false, page: 'home' }, '', window.location.pathname);
  }, [expireSession]);

  // Check if session was expired when returning to site
  useEffect(() => {
    if (sessionStorage.getItem('vanseva_session_expired') === 'true') {
      const notice = 'Your previous session was expired for security when you went back or navigated away from the site. Please sign in to access your account.';
      setSecurityNotice(notice);
      setSecurityToast('🔒 Session Expired: Please log in again to access your account.');
      setAuthMode('login');
      setAuthModalOpen(true);
      sessionStorage.removeItem('vanseva_session_expired');
    }
  }, []);

  // 1. Listen for browser Back / Swipe-back popstate event
  useEffect(() => {
    const onPopState = () => {
      if (user || sessionStorage.getItem('vanseva_auth_active') === 'true') {
        // Back navigation occurred while user was authenticated -> terminate session immediately
        triggerSwipeBackSecurityLogout('back navigation');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [user, triggerSwipeBackSecurityLogout]);

  // 2. Track login state to seed history stack with authentication checkpoint
  useEffect(() => {
    if (user && !prevUserRef.current) {
      window.history.pushState({ authenticated: true, page: currentPage }, '', window.location.pathname);
      setSecurityNotice(null);
      setSecurityToast(null);
    }
    prevUserRef.current = user;
  }, [user, currentPage]);

  // 3. Touch Edge Swipe Detection (Mobile / Touchpad swipe-back gesture)
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!user) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);
      const duration = Date.now() - touchStartTime;

      // Left-edge swipe right (starts within 60px of left edge, swipes right >= 75px, mostly horizontal, under 500ms)
      if (touchStartX <= 60 && deltaX >= 75 && deltaY < 65 && duration < 500) {
        triggerSwipeBackSecurityLogout('swipe-back gesture');
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [user, triggerSwipeBackSecurityLogout]);

  // 4. Auto-dismiss floating security toast after 7s
  useEffect(() => {
    if (securityToast) {
      const timer = setTimeout(() => {
        setSecurityToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [securityToast]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Floating Security Banner Toast */}
      {securityToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'linear-gradient(135deg, #7f1d1d, #991b1b)',
          color: '#ffffff',
          padding: '12px 22px',
          borderRadius: '12px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.88rem',
          fontWeight: 600,
          maxWidth: '92%',
          border: '1px solid rgba(254, 202, 202, 0.4)',
        }}>
          <Shield size={20} color="#fca5a5" style={{ flexShrink: 0 }} />
          <span>{securityToast}</span>
          <button
            onClick={() => setSecurityToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fecaca',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              marginLeft: '8px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        onOpenAuth={openAuth}
      />

      <main style={{ flex: 1 }}>
        {currentPage === 'home' && (
          <HomePage onNavigate={navigate} onOpenAuth={openAuth} />
        )}
        {currentPage === 'campaigns' && (
          <CampaignsPage onNavigate={navigate} />
        )}
        {currentPage === 'donate-plants' && (
          <PlantDonationPage
            initialCampaignId={pageParams.campaignId}
            initialSpecies={pageParams.plantSpecies}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'donate-money' && (
          <MoneyDonationPage
            initialCampaignId={pageParams.campaignId}
            onNavigate={navigate}
          />
        )}
        {currentPage === 'membership' && (
          <MembershipPage onNavigate={navigate} />
        )}
        {currentPage === 'gallery' && (
          <GalleryPage onOpenAuth={openAuth} />
        )}
        {currentPage === 'my-account' && (
          <MyAccountPage onNavigate={navigate} />
        )}
        {currentPage === 'my-donations' && (
          <MyDonationsPage onNavigate={navigate} />
        )}
        {currentPage === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      <Footer
        onNavigate={navigate}
        onOpenAuth={openAuth}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuth}
        initialMode={authMode}
        securityNotice={securityNotice}
        onNavigateToMembership={() => navigate('membership')}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
