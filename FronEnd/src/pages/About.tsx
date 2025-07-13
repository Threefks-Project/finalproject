import React from 'react';
import mayorImage from "../images/mayor.jpg";
import deputyMayorImage from '../images/deputy-mayor.jpg'; 
import chiefExecutiveImage from '../images/chief-executive.jpg';
type Leader = {
  name: string;
  post: string;
  contact: string;
  image: string; // will hold imported image
};
 const leaders: Leader[] = [
  {
    name: 'आशुतोष उpu भट्टराई',
    post: 'नगर प्रमुख',
    contact: '9801234567',
    image: mayorImage,
  },
  {
    name: 'अर्जुन उpu दाहाल',
    post: 'उप–प्रमुख',
    contact: '9807654321',
    image: deputyMayorImage,
  },
  {
    name: 'प्रवेश जैC ओझा',
    post: 'प्रमुख प्रशासकीय अधिकृत',
    contact: '9812345678',
    image: chiefExecutiveImage,
  }
];
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Users, Award, Target } from 'lucide-react';

// Import your images here
// Make sure these paths are correct relative to your project's public folder or assets directory



const About: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const stats = [
    { icon: Users, label: 'Population', value: '244,750', description: 'Total Citizens' },
    { icon: MapPin, label: 'Area', value: '192.24', description: 'Square Kilometers' },
    { icon: Award, label: 'Wards', value: '19', description: 'Administrative Divisions' },
    { icon: Target, label: 'Services', value: '50+', description: 'Digital Services' }
  ];
   const wardLeaders = [
     { name: 'शंकर खड्का', ward: 1, contact: '९८०१००००१' },
    { name: 'मनिषा थापा', ward: 2, contact: '९८०१००००२' },
    { name: 'राजेन्द्र राई', ward: 3, contact: '९८०१००००३' },
    { name: 'रेश्मा कार्की', ward: 4, contact: '९८०१००००४' },
    { name: 'ध्रुव घिमिरे', ward: 5, contact: '९८०१००००५' },
    { name: 'सुमन लामा', ward: 6, contact: '९८०१००००६' },
    { name: 'हरिकला गुरुङ', ward: 7, contact: '९८०१००००७' },
    { name: 'कमल बुढा', ward: 8, contact: '९८०१००००८' },
    { name: 'सरिता बोहरा', ward: 9, contact: '९८०१००००९' },
    { name: 'विनोद कार्की', ward: 10, contact: '९८०१०००१०' },
    { name: 'जया भुजेल', ward: 11, contact: '९८०१०००११' },
    { name: 'रमेश बोगटी', ward: 12, contact: '९८०१०००१२' },
    { name: 'सरोज केसी', ward: 13, contact: '९८०१०००१३' },
    { name: 'अनिता पौडेल', ward: 14, contact: '९८०१०००१४' },
    { name: 'गोविन्द चौधरी', ward: 15, contact: '९८०१०००१५' },
    { name: 'सिता चौधरी', ward: 16, contact: '९८०१०००१६' },
    { name: 'प्रकाश खत्री', ward: 17, contact: '९८०१०००१७' },
    { name: 'राधा गुरुङ', ward: 18, contact: '९८०१०००१८' },
    { name: 'दिनेश सापकोटा', ward: 19, contact: '९८०१०००१९' },
  ];

  return (
    
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <section className="py-10 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-municipal-blue">Leadership Panel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {leaders.map((leader, index) => (
              <div
                  key={index}
                     className="rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col items-center p-6 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 text-black
"
                >
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-64 h-64 rounded-full object-cover mx-auto mb-4 border-4 border-white"
                  />
                  <h3 className="text-3xl font-semibold text-blue-900">{leader.name}</h3>
                  <p className="text-xl font-semibold">{leader.post}</p>
                  <p className="text-lg mt-1">📞 {leader.contact}</p>
                </div>
            ))}
          </div>
        </div>
      </section>
      <h3 className="text-2xl font-semibold mt-16 mb-6 text-center text-municipal-blue">
        वडाध्यक्षहरू
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wardLeaders.map((leader, index) => (
          <div
            key={index}
            className="rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col items-center p-6 bg-gradient-to-r from-white via-gray-100 to-white text-black"
          >
            <h3 className="text-lg font-semibold mb-1">{leader.name}</h3>
            <p className="text-sm">वडा नं. {leader.ward}</p>
            <p className="text-sm">📞 {leader.contact}</p>
          </div>
        ))}
      </div>

        <h1 className={`text-4xl font-bold text-municipal-blue mb-4 ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
          {t('about')} - {t('city_name')}
        </h1>
        <p className="text-xl text-municipal-gray max-w-3xl mx-auto">
          Biratnagar Metropolitan City is the largest city in Province No. 1 of Nepal and serves as an important commercial and industrial hub in the eastern region.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="municipal-card p-6 text-center">
            <div className="w-12 h-12 bg-municipal-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-municipal-blue mb-2">{stat.value}</h3>
            <p className="font-medium text-gray-800 mb-1">{stat.label}</p>
            <p className="text-sm text-municipal-gray">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* About Content */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold text-municipal-blue mb-6">Our Vision</h2>
          <p className="text-municipal-gray leading-relaxed mb-6">
            To develop Biratnagar Metropolitan City as a model smart city that provides efficient, 
            transparent, and citizen-friendly services through digital transformation and sustainable 
            urban development practices.

          </p>
          
          <h2 className="text-2xl font-bold text-municipal-blue mb-6">Our Mission</h2>
          <p className="text-municipal-gray leading-relaxed">
            To serve the citizens of Biratnagar with integrity, transparency, and efficiency by 
            leveraging modern technology and best practices in municipal governance to improve 
            quality of life and promote sustainable development.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-municipal-blue mb-6">Key Objectives</h2>
          <ul className="space-y-4 text-municipal-gray">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-municipal-green rounded-full mt-2 flex-shrink-0"></div>
              <span>Provide efficient and transparent municipal services to all citizens</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-municipal-green rounded-full mt-2 flex-shrink-0"></div>
              <span>Implement digital governance solutions for improved service delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-municipal-green rounded-full mt-2 flex-shrink-0"></div>
              <span>Promote sustainable urban development and environmental conservation</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-municipal-green rounded-full mt-2 flex-shrink-0"></div>
              <span>Foster economic growth and improve infrastructure development</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-municipal-green rounded-full mt-2 flex-shrink-0"></div>
              <span>Ensure participatory governance and citizen engagement</span>
            </li>
          </ul>
        </div>
      </div>

      
   </div>
  );
};

export default About;