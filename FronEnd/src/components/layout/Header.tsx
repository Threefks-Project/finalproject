
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + Shift + A for admin access
      if (e.altKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        // Only show admin login if user is not already an admin
        if (!user || user.role !== 'admin') {
          setShowAdminLoginModal(true);
        }
      }
      // Escape key to close mobile menu
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
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
  }, [user, isMenuOpen]);

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

  const handleMobileNavClick = (path: string) => {
    setIsMenuOpen(false);
    // Small delay to allow menu to close before navigation
    setTimeout(() => {
      window.location.href = path;
    }, 100);
  };

  return (
    <>
      <header className="bg-white shadow-md relative z-40">
        {/* Top bar with emergency numbers and language switcher */}
        <div className="bg-municipal-blue text-white py-1 sm:py-2">
          <div className="container mx-auto px-2 sm:px-4 flex flex-col sm:flex-row justify-between items-center text-xs gap-1 sm:gap-0">
            {/* Left side: Emergency numbers in Nepali - responsive layout */}
            <div className="flex flex-wrap gap-1 sm:gap-4 md:gap-6 justify-center sm:justify-start">
              <span className="whitespace-nowrap text-xs">एम्बुलेन्स: 9865266142</span>
              <span className="whitespace-nowrap text-xs">दमकल: 9865321455</span>
              <span className="whitespace-nowrap text-xs hidden sm:inline">ट्राफिक प्रहरी: 9865324578</span>
              <span className="whitespace-nowrap text-xs hidden lg:inline">नेपाल प्रहरी: 9865324512</span>
            </div>

            {/* Right side: Language switcher */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent border-none text-white text-xs focus:outline-none cursor-pointer"
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

        {/* Header content with background - responsive height */}
        <div className="relative w-full h-20 sm:h-28 lg:h-32 z-30 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={navbag}
              alt="Navbar Background"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-black opacity-30" />
          </div>

          <div className="container mx-auto px-2 sm:px-4 py-1 sm:py-3 relative z-10 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between">
              {/* Logo and Title - responsive sizing */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-full flex items-center justify-center bg-white bg-opacity-70">
                  <img src={logo} alt="City Logo" className="h-full w-full object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className={`text-sm sm:text-lg lg:text-2xl font-bold text-white truncate ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
                    {t('city_name')}
                  </h1>
                  <p className="text-xs sm:text-sm text-white hidden sm:block truncate">Digital Government Services</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-3 xl:gap-5">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className="nav-link text-white font-semibold text-sm xl:text-base tracking-wide hover:bg-white/20 px-2 py-1 rounded transition-all duration-300"
                  >
                    {t(item.key)}
                  </Link>
                ))}

                {/* E-Services Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="nav-link text-white font-semibold text-sm xl:text-base tracking-wide flex items-center gap-1 bg-transparent border-none focus:outline-none hover:bg-white/20 px-2 py-1 rounded transition-all duration-300">
                    {t('services')}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-md min-w-[200px] z-50">
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
                  <div className="flex items-center gap-2 xl:gap-3">
                    <span className="text-xs xl:text-sm text-white truncate max-w-24 xl:max-w-32">Welcome, {user.name}</span>
                    <button onClick={logout} className="municipal-button text-xs xl:text-sm px-3 py-2 bg-white/20 hover:bg-white/30 transition-colors">
                      {t('logout')}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="municipal-button text-xs xl:text-sm px-3 py-2 bg-white/20 hover:bg-white/30 transition-colors">
                    {t('login')}
                  </button>
                )}
              </nav>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="lg:hidden p-2 text-white hover:bg-white/20 rounded-md transition-colors z-50 relative"
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]" onClick={() => setIsMenuOpen(false)}>
            <div 
              className="mobile-menu-container absolute top-0 left-0 right-0 bg-municipal-blue/95 backdrop-blur-md border-t border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="container mx-auto px-4 py-6 max-h-screen overflow-y-auto">
                <div className="flex flex-col gap-3">
                  {/* Main Navigation */}
                  {navigationItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleMobileNavClick(item.path)}
                      className="mobile-nav-link text-white font-medium py-3 px-4 rounded-lg text-sm sm:text-base text-left hover:bg-white/20 transition-all duration-200 border border-transparent hover:border-white/30"
                    >
                      {t(item.key)}
                    </button>
                  ))}

                  {/* E-Services Mobile Section */}
                  <div className="border-t border-white/20 pt-4 mt-2">
                    <div className="text-white font-semibold mb-3 px-4 text-sm sm:text-base">{t('services')}</div>
                    <div className="flex flex-col gap-2 pl-2">
                      {eServicesItems.map((service) => (
                        <button
                          key={service.key}
                          onClick={() => handleMobileNavClick(service.path)}
                          className="mobile-nav-link text-white font-normal text-xs sm:text-sm py-2 px-4 rounded-lg text-left hover:bg-white/15 transition-all duration-200"
                        >
                          {service.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Section */}
                  {user ? (
                    <div className="flex flex-col gap-3 border-t border-white/20 pt-4 mt-2">
                      <span className="text-xs sm:text-sm text-white px-4">Welcome, {user.name}</span>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="municipal-button w-fit mx-4 text-xs sm:text-sm px-4 py-2 bg-red-500/80 hover:bg-red-600/80 transition-colors"
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
                      className="municipal-button w-fit mx-4 mt-4 text-xs sm:text-sm px-4 py-2 bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {t('login')}
                    </button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Login Modals - only show admin login if user is not already admin */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      {(!user || user.role !== 'admin') && (
        <AdminLoginModal isOpen={showAdminLoginModal} onClose={() => setShowAdminLoginModal(false)} />
      )}
    </>
  );
};

export default Header;
