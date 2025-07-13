
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: 'Message Sent',
      description: 'Thank you for contacting us. We will get back to you soon.'
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const departments = [
    { name: 'General Inquiry', email: 'info@biratnagarmun.gov.np' },
    { name: 'Tax Department', email: 'tax@biratnagarmun.gov.np' },
    { name: 'Engineering Department', email: 'engineering@biratnagarmun.gov.np' },
    { name: 'Health Department', email: 'health@biratnagarmun.gov.np' },
    { name: 'Education Department', email: 'education@biratnagarmun.gov.np' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={`text-4xl font-bold text-municipal-blue mb-4 ${currentLanguage === 'ne' ? 'nepali' : ''}`}>
          {t('contact')}
        </h1>
        <p className="text-xl text-municipal-gray max-w-3xl mx-auto">
          Get in touch with us for any questions, suggestions, or assistance with municipal services.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="municipal-card p-6">
            <h3 className="text-xl font-bold text-municipal-blue mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-municipal-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-municipal-gray">
                    Biratnagar Metropolitan City<br />
                    Main Road, Biratnagar<br />
                    Province 1, Nepal
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-municipal-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-municipal-gray">+977-21-525252</p>
                  <p className="text-sm text-municipal-gray">+977-21-525253</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-municipal-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-municipal-gray">info@biratnagarmun.gov.np</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-municipal-blue mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Office Hours</p>
                  <p className="text-sm text-municipal-gray">
                    Sunday - Thursday: 10:00 AM - 5:00 PM<br />
                    Friday: 10:00 AM - 3:00 PM<br />
                    Saturday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Department Contacts */}
          <div className="municipal-card p-6">
            <h3 className="text-xl font-bold text-municipal-blue mb-4">Department Contacts</h3>
            <div className="space-y-3">
              {departments.map((dept, index) => (
                <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                  <p className="font-medium text-sm">{dept.name}</p>
                  <p className="text-xs text-municipal-gray">{dept.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="municipal-card p-6">
            <h3 className="text-xl font-bold text-municipal-blue mb-6">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="municipal-input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="municipal-input w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="municipal-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="municipal-input w-full"
                    required
                  >
                    <option value="">Select Subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="complaint">Complaint</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="tax">Tax Related</option>
                    <option value="permit">Permit/License</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="municipal-input w-full resize-none"
                  placeholder="Please describe your inquiry in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                className="municipal-button flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>

          {/* Map Placeholder */}
          <div className="municipal-card p-6 mt-6">
            <h3 className="text-xl font-bold text-municipal-blue mb-4">Location</h3>
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Interactive Map (Leaflet integration)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
