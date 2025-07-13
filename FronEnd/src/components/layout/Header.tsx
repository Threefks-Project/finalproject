import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import AdminLoginModal from '../auth/AdminLoginModal';
import logo from '../../images/logo.png';
import navbag from '../../images/navbag.jpeg';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminLoginModal(true);
      }
    };

    const handleCustomLoginEvent = () => {
      setShowLoginModal(true);
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('openLoginModal', handleCustomLoginEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('openLoginModal', handleCustomLoginEvent);
    };
  }, []);

  const navigationItems = [
    { key: 'home', path: '/' },
    { key: 'services', path: '/services' },
    { key: 'gallery', path: '/gallery' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' }
  ];

  return (
    <>
      <header className="bg-white shadow-md">
        
                    {/* Top bar with emergency numbers and language switcher */}
            <div className="bg-municipal-blue text-white py-2">
              <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                {/* Left side: Emergency numbers in Nepali */}
                <div className="flex gap-6">
                  <span>एम्बुलेन्स: 9865266142</span>
                  <span>दमकल: 9865321455</span>
                  <span>ट्राफिक प्रहरी: 9865324578</span>
                  <span>नेपाल प्रहरी: 9865324512</span>
                </div>

                {/* Right side: Language switcher */}
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="bg-transparent border-none text-white text-sm focus:outline-none"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="text-black">
                        {lang.nativeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>


        {/* Header content with background */}
        <div className="relative w-full h-36 z-10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={navbag}
              alt="Navbar Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black opacity-30" />
          </div>

          <div className="container mx-auto px-5 py-3 relative z-10 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-white bg-opacity-70">
                  <img src={logo} alt="City Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold text-white ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
                    {t('city_name')}
                  </h1>
                  <p className="text-sm text-white">Digital Government Services</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className="nav-link text-white font-semibold text-lg tracking-wide"
                  >
                    {t(item.key)}
                  </Link>
                ))}

                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-lg text-white">Welcome, {user.name}</span>
                    <button onClick={logout} className="municipal-button text-sm">
                      {t('logout')}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="municipal-button text-sm">
                    {t('login')}
                  </button>
                )}
              </nav>

              {/* Mobile Menu Toggle */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <nav className="lg:hidden mt-4 pb-4 border-t border-white/30">
                <div className="flex flex-col gap-3 pt-3">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.path}
                      className="mobile-nav-link text-white font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}

                  {user ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-white">Welcome, {user.name}</span>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="municipal-button w-fit"
                      >
                        {t('logout')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="municipal-button w-fit"
                    >
                      {t('login')}
                    </button>
                  )}
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Login Modals */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <AdminLoginModal isOpen={showAdminLoginModal} onClose={() => setShowAdminLoginModal(false)} />

      {/* Hover Styling */}
      <style>{`
        .nav-link {
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: scale(1.05);
        }

        .mobile-nav-link {
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover {
          background-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
      `}</style>
    </>
  );
};

export default Header;
