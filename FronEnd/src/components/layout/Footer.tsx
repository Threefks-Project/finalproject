
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <footer className="bg-municipal-blue text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
              {t('contact')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Biratnagar Metropolitan City, Province 1, Nepal
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">+977-21-525252</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">info@biratnagarmun.gov.np</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
              {t('quick_services')}
            </h3>
            <div className="space-y-2">
              <a href="/report" className="block text-sm hover:text-municipal-green transition-colors">
                {t('report_issue')}
              </a>
              <a href="/pay-taxes" className="block text-sm hover:text-municipal-green transition-colors">
                {t('pay_taxes')}
              </a>
              <a href="/my-applications" className="block text-sm hover:text-municipal-green transition-colors">
                {t('applications')}
              </a>
              <a href="/downloads" className="block text-sm hover:text-municipal-green transition-colors">
                {t('downloads')}
              </a>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
              Office Hours
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <div>Sunday - Thursday</div>
                  <div>10:00 AM - 5:00 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <div className="text-sm">
                  <div>Friday</div>
                  <div>10:00 AM - 3:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className={`font-bold text-lg mb-4 ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
              {t('about')}
            </h3>
            <p className="text-sm leading-relaxed">
              Biratnagar Metropolitan City is committed to providing efficient digital services to all citizens through our modern e-governance platform.
            </p>
          </div>
        </div>

        <hr className="my-6 border-municipal-blue-light" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © 2024 Biratnagar Metropolitan City. {t('all_rights_reserved')}.
          </p>
          <p className="text-sm">
            {t('developed_by')} Lovable AI Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
