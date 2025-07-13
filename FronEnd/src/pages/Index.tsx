
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import gate from '../images/biratnagar gate.png'
import { 
  FileText, 
  CreditCard, 
  MapPin, 
  Download, 
  MessageSquare,
  Building2,
  Users,
  TrendingUp
} from 'lucide-react';

const Index: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const quickServices = [
    {
      icon: MessageSquare,
      title: t('report_issue'),
      description: 'Report civic issues with AI-powered classification',
      link: '/report',
      color: 'bg-municipal-red'
    },
    {
      icon: CreditCard,
      title: t('pay_taxes'),
      description: 'Secure online tax payment system',
      link: '/pay-taxes',
      color: 'bg-municipal-green'
    },
    {
      icon: FileText,
      title: t('applications'),
      description: 'Apply for municipal services online',
      link: '/my-applications',
      color: 'bg-municipal-blue'
    },
    {
      icon: Download,
      title: t('downloads'),
      description: 'Download forms and documents',
      link: '/downloads',
      color: 'bg-municipal-orange'
    }
  ];

  const stats = [
    { icon: Users, label: 'Registered Citizens', value: '45,234' },
    { icon: FileText, label: 'Applications Processed', value: '12,567' },
    { icon: MessageSquare, label: 'Issues Resolved', value: '8,943' },
    { icon: TrendingUp, label: 'Service Satisfaction', value: '94%' }
  ];

  return (
     <div className="min-h-screen font-sans">
      {/* Hero Section */}
      {/* Added bg-hero-image, bg-cover, bg-center, py-32 for increased height, text-shadow for readability */}
      
      <section 
        className="bg-hero-image bg-cover bg-center bg-no-repeat text-white py-32 md:py-48 relative overflow-hidden"
      >
        <img 
          src={gate}
          alt="Biratnagar Gate" 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Removed h1 and p tags as requested */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Using <a> tag instead of <Link> for self-contained example */}
            <a
              href="/report"
              className="bg-white text-municipal-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              {t('report_issue')}
            </a>
            {/* Using <a> tag instead of <Link> for self-contained example */}
            <a
              href="/pay-taxes"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-municipal-blue transition-colors shadow-lg"
            >
              {t('pay_taxes')}
            </a>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 text-municipal-blue ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
            {t('quick_services')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickServices.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="municipal-card group hover:scale-105 transition-all duration-300 p-6"
              >
                <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-municipal-blue">
                  {service.title}
                </h3>
                <p className="text-municipal-gray text-sm">
                  {service.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-municipal-gray-light">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 text-municipal-blue ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
            Our Impact
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="municipal-card text-center p-6">
                <div className="bg-municipal-blue w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-municipal-blue mb-2">
                  {stat.value}
                </h3>
                <p className="text-municipal-gray">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 text-municipal-blue ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
                About Biratnagar Metropolitan City
              </h2>
              <p className="text-municipal-gray leading-relaxed mb-6">
                Biratnagar Metropolitan City is committed to providing efficient, transparent, and citizen-centric services through our modern digital platform. Our AI-powered systems ensure quick resolution of civic issues while maintaining the highest standards of governance.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-municipal-green" />
                  <span className="text-sm">Smart City Initiative</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-municipal-green" />
                  <span className="text-sm">GPS-Enabled Services</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-municipal-green" />
                  <span className="text-sm">Digital Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-municipal-green" />
                  <span className="text-sm">AI-Powered Support</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-municipal-gradient rounded-lg p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Municipal Services</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Civic Issue Reporting</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Electronic Tax Payment</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Building Permits</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Citizenship Services</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Business Registration</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
