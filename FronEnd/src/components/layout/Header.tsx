import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import AdminLoginModal from '../auth/AdminLoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    { key: 'gallery', path: '/gallery' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' }
  ];

  const eServicesItems = [
    { key: 'e_tax_payment', path: '/pay-taxes', label: 'E-Tax Payment' },
    { key: 'application_letter', path: '/my-applications', label: 'Application Letter' },
    { key: 'registration_portal', path: '/services', label: 'Registration Portal' }
  ];

  return (
    <>
      <header className="bg-white shadow-md">
        
            {/* Top bar with emergency numbers and language switcher */}
            <div className="bg-municipal-blue text-white py-2">
              <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-2 sm:gap-0">
                {/* Left side: Emergency numbers in Nepali */}
                <div className="flex flex-wrap gap-2 sm:gap-6 justify-center sm:justify-start">
                  <span className="whitespace-nowrap">एम्बुलेन्स: 9865266142</span>
                  <span className="whitespace-nowrap">दमकल: 9865321455</span>
                  <span className="whitespace-nowrap hidden sm:inline">ट्राफिक प्रहरी: 9865324578</span>
                  <span className="whitespace-nowrap hidden md:inline">नेपाल प्रहरी: 9865324512</span>
                </div>

                {/* Right side: Language switcher */}
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <select
                    value={currentLanguage}
                    onChange={(e) => changeLanguage(e.target.value)}
                    className="bg-transparent border-none text-white text-xs sm:text-sm focus:outline-none"
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
        <div className="relative w-full h-32 sm:h-36 z-10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={navbag}
              alt="Navbar Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black opacity-30" />
          </div>

          <div className="container mx-auto px-4 py-2 sm:py-3 relative z-10 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center gap-2 sm:gap-5">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-white bg-opacity-70">
                  <img src={logo} alt="City Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <h1 className={`text-lg sm:text-2xl font-bold text-white ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
                    {t('city_name')}
                  </h1>
                  <p className="text-xs sm:text-sm text-white">Digital Government Services</p>
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

                {/* E-Services Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="nav-link text-white font-semibold text-lg tracking-wide flex items-center gap-1 bg-transparent border-none focus:outline-none">
                    {t('services')}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-md min-w-[200px]">
                    {eServicesItems.map((service) => (
                      <DropdownMenuItem key={service.key} asChild>
                        <Link 
                          to={service.path}
                          className="block px-4 py-2 text-gray-800 hover:bg-municipal-blue hover:text-white transition-colors cursor-pointer"
                        >
                          {service.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

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
              <div className="lg:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/30 z-50">
                <nav className="container mx-auto px-4 py-4">
                  <div className="flex flex-col gap-3">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.key}
                        to={item.path}
                        className="mobile-nav-link text-white font-medium py-2 px-3 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t(item.key)}
                      </Link>
                    ))}

                    {/* E-Services Mobile Section */}
                    <div className="border-t border-white/20 pt-3 mt-2">
                      <div className="text-white font-medium mb-2 px-3">{t('services')}</div>
                      <div className="flex flex-col gap-2 pl-4">
                        {eServicesItems.map((service) => (
                          <Link
                            key={service.key}
                            to={service.path}
                            className="mobile-nav-link text-white font-normal text-sm py-2 px-3 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {user ? (
                      <div className="flex flex-col gap-2 border-t border-white/20 pt-3 mt-2">
                        <span className="text-sm text-white px-3">Welcome, {user.name}</span>
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="municipal-button w-fit mx-3"
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
                        className="municipal-button w-fit mx-3 mt-3"
                      >
                        {t('login')}
                      </button>
                    )}
                  </div>
                </nav>
              </div>
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
