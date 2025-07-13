import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  CreditCard, 
  FileText, 
  Download,
  MessageSquare,
  Users,
  Building,
  Award,
  MapPin,
  Clock
} from 'lucide-react';

const Services: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const services = [
    {
      icon: AlertTriangle,
      title: t('report_issue'),
      description: 'Report civic issues like road damage, water supply problems, and public safety concerns',
      link: '/report',
      color: 'bg-red-500',
      category: 'Civic Services'
    },
    {
      icon: CreditCard,
      title: t('pay_taxes'),
      description: 'Pay property taxes, business licenses, and other municipal fees online',
      link: '/pay-taxes',
      color: 'bg-green-500',
      category: 'Financial Services'
    },
    {
      icon: FileText,
      title: t('applications'),
      description: 'Apply for certificates, permits, and other municipal documents',
      link: '/my-applications',
      color: 'bg-blue-500',
      category: 'Application Services'
    },
    {
      icon: Download,
      title: t('downloads'),
      description: 'Download forms, guidelines, and municipal documents',
      link: '/downloads',
      color: 'bg-purple-500',
      category: 'Information Services'
    },
    {
      icon: MessageSquare,
      title: t('my_complaints'),
      description: 'Track your reported issues and view complaint history',
      link: '/my-complaints',
      color: 'bg-orange-500',
      category: 'Support Services'
    }
  ];

  const applicationTypes = [
    { icon: Award, title: 'Birth Certificate', description: 'Apply for birth registration certificate' },
    { icon: Award, title: 'Marriage Certificate', description: 'Apply for marriage registration certificate' },
    { icon: Award, title: 'Death Certificate', description: 'Apply for death registration certificate' },
    { icon: Building, title: 'Building Permit', description: 'Apply for construction permits' },
    { icon: Users, title: 'Business License', description: 'Register your business and get license' },
    { icon: Award, title: 'Citizenship Certificate', description: 'Apply for citizenship documents' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold text-municipal-blue mb-4 ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
          {t('services')}
        </h1>
        <p className="text-xl text-municipal-gray max-w-3xl mx-auto">
          Access all municipal services online. Fast, efficient, and transparent digital services for citizens.
        </p>
      </div>

      {/* Quick Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-municipal-blue mb-6">Quick Access Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link key={index} to={service.link}>
              <div className="municipal-card p-6 h-full hover:shadow-lg transition-shadow group">
                <div className="flex items-start gap-4">
                  <div className={`${service.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-municipal-gray uppercase tracking-wide">{service.category}</span>
                    <h3 className="font-bold text-municipal-blue mb-2 group-hover:text-municipal-blue-dark transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-municipal-gray">{service.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Application Services */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-municipal-blue mb-6">Certificate & Permit Applications</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicationTypes.map((app, index) => (
            <div key={index} className="municipal-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-municipal-green p-2 rounded-lg">
                  <app.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-municipal-blue">{app.title}</h3>
              </div>
              <p className="text-sm text-municipal-gray mb-4">{app.description}</p>
              <Link 
                to="/my-applications" 
                className="text-sm text-municipal-blue hover:underline font-medium"
              >
                Apply Now →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Service Hours & Contact */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="municipal-card p-6">
          <h3 className="text-xl font-bold text-municipal-blue mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Service Hours
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-municipal-gray">Sunday - Thursday</span>
              <span className="font-medium">10:00 AM - 5:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-municipal-gray">Friday</span>
              <span className="font-medium">10:00 AM - 3:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-municipal-gray">Saturday</span>
              <span className="font-medium text-red-600">Closed</span>
            </div>
          </div>
        </div>

        <div className="municipal-card p-6">
          <h3 className="text-xl font-bold text-municipal-blue mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-municipal-gray">Phone:</span>
              <span className="font-medium ml-2">+977-21-525252</span>
            </div>
            <div>
              <span className="text-municipal-gray">Email:</span>
              <span className="font-medium ml-2">info@biratnagarmun.gov.np</span>
            </div>
            <div>
              <span className="text-municipal-gray">Address:</span>
              <span className="font-medium ml-2">Biratnagar Metropolitan City, Province 1, Nepal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
