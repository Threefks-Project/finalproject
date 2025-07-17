import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Camera, 
  MapPin, 
  Upload, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  X,
  Map as MapIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CameraCapture from '@/components/issue-reporting/CameraCapture';
import LocationPicker from '@/components/issue-reporting/LocationPicker';
import AIClassification from '@/components/issue-reporting/AIClassification';

import exifr from 'exifr';  // <--- Import exifr

const ReportIssue: React.FC = () => {
  const { t } = useTranslation();
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [contact, setContact] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsManualLocation, setNeedsManualLocation] = useState(false);
  const [classification, setClassification] = useState<string>('');
  const [manualIssueType, setManualIssueType] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urgencyOptions = [
    { key: 'low', label: t('low_priority'), color: 'text-green-600' },
    { key: 'medium', label: t('medium_priority'), color: 'text-yellow-600' },
    { key: 'high', label: t('high_priority'), color: 'text-red-600' }
  ];

  const issueTypes = [
    { key: 'pothole', label: 'Road/Pothole Issues' },
    { key: 'streetlight', label: 'Street Lighting' },
    { key: 'garbage', label: 'Garbage Collection' },
    { key: 'water', label: 'Water Supply Issues' },
    { key: 'drainage', label: 'Drainage Problems' },
    { key: 'traffic', label: 'Traffic Issues' },
    { key: 'noise', label: 'Noise Pollution' },
    { key: 'construction', label: 'Illegal Construction' },
    { key: 'other', label: 'Other' }
  ];

  // Extract EXIF GPS data from image using exifr
  const extractGPSFromImage = async (file: File): Promise<{lat: number, lng: number} | null> => {
    try {
      const exifData = await exifr.gps(file);
      if (exifData && exifData.latitude && exifData.longitude) {
        return {
          lat: exifData.latitude,
          lng: exifData.longitude,
        };
      }
    } catch (error) {
      console.error('EXIF GPS extraction error:', error);
    }
    return null;
  };

  // Get browser geolocation
  const getBrowserLocation = (): Promise<{lat: number, lng: number} | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  };

  // Handle image selection/capture
  const handleImageSelected = async (file: File) => {
    setCapturedImage(file);
    setShowCamera(false);
    
    // Try to get location from EXIF first
    const exifLocation = await extractGPSFromImage(file);
    
    if (exifLocation) {
      setLocation(exifLocation);
      setNeedsManualLocation(false);
      toast({
        title: t('success'),
        description: 'Location obtained from image EXIF data',
      });
    } else {
      // Try browser geolocation
      const browserLocation = await getBrowserLocation();
      if (browserLocation) {
        setLocation(browserLocation);
        setNeedsManualLocation(false);
        toast({
          title: t('success'),
          description: 'Location obtained from browser',
        });
      } else {
        setNeedsManualLocation(true);
        toast({
          title: 'Location needed',
          description: 'Please pin location on map',
          variant: 'destructive'
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageSelected(file);
    }
  };

  const handleLocationSelected = (selectedLocation: {lat: number, lng: number, address?: string}) => {
    setLocation(selectedLocation);
    setNeedsManualLocation(false);
    setShowLocationPicker(false);
    toast({
      title: t('success'),
      description: 'Location set successfully',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!capturedImage) {
      toast({
        title: t('error'),
        description: 'Please upload an image',
        variant: 'destructive'
      });
      return;
    }

    if (!location) {
      toast({
        title: t('error'),
        description: 'Please provide location',
        variant: 'destructive'
      });
      return;
    }

    if (needsManualLocation && !description.trim()) {
      toast({
        title: t('error'),
        description: 'Description is mandatory when location is selected manually',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: t('success'),
      description: 'Your report has been submitted successfully',
    });

    // Reset form
    setCapturedImage(null);
    setLocation(null);
    setDescription('');
    setUrgency('medium');
    setContact('');
    setClassification('');
    setManualIssueType('');
    setNeedsManualLocation(false);
    setIsSubmitting(false);
  };

  const removeImage = () => {
    setCapturedImage(null);
    setLocation(null);
    setClassification('');
    setManualIssueType('');
    setNeedsManualLocation(false);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="hero-section relative py-16 rounded-2xl mb-8 overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-bounce-in">
                <AlertCircle className="inline-block mr-4 h-12 w-12 animate-float" />
                {t('report_issue_title')}
              </h1>
              <p className="text-xl text-white/90 animate-slide-in-right">
                {t('report_issue_subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Report Form */}
        <div className="municipal-card animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-8 p-8">
            
            {/* Image Capture/Upload Section */}
            <div className="space-y-4 animate-slide-in-left">
              <label className="block text-lg font-semibold text-municipal-blue">
                {t('image_required')}
              </label>
              
              {!capturedImage ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="municipal-card p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Camera className="mx-auto h-12 w-12 text-municipal-blue mb-4" />
                    <h3 className="font-semibold text-municipal-blue mb-2">{t('use_camera')}</h3>
                    <p className="text-gray-600 text-sm">{t('take_photo_directly')}</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="municipal-card p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Upload className="mx-auto h-12 w-12 text-municipal-blue mb-4" />
                    <h3 className="font-semibold text-municipal-blue mb-2">{t('upload_file')}</h3>
                    <p className="text-gray-600 text-sm">{t('choose_from_gallery')}</p>
                  </button>
                </div>
              ) : (
                <div className="relative animate-scale-in">
                  <img
                    src={URL.createObjectURL(capturedImage)}
                    alt="Captured issue"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* AI Classification */}
            {capturedImage && (
              <AIClassification 
                image={capturedImage} 
                onClassification={setClassification}
              />
            )}

            {/* Manual Issue Type Selection */}
            <div className="space-y-4 animate-slide-in-left">
              <label className="block text-lg font-semibold text-municipal-blue">
                Issue Type (Manual Selection)
              </label>
              <select
                value={manualIssueType}
                onChange={(e) => setManualIssueType(e.target.value)}
                className="municipal-input w-full"
              >
                <option value="">Select issue type manually</option>
                {issueTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </select>
              {classification && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>AI Detection:</strong> {classification}
                  </p>
                </div>
              )}
            </div>

            {/* Location Section */}
            <div className="space-y-4 animate-slide-in-right">
              <label className="block text-lg font-semibold text-municipal-blue">
                {t('location')} {needsManualLocation && <span className="text-red-500">*</span>}
              </label>
              
              {location ? (
                <div className="municipal-card p-4 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">{t('location_set')}</p>
                        <p className="text-sm text-green-600">
                          {location.address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLocationPicker(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {t('change')}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(true)}
                  className="w-full municipal-card p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <MapIcon className="mx-auto h-12 w-12 text-municipal-blue mb-4" />
                  <h3 className="font-semibold text-municipal-blue mb-2">{t('select_location')}</h3>
                  <p className="text-gray-600 text-sm">{t('click_map_to_pin')}</p>
                </button>
              )}
            </div>

            {/* Description - Required only for manual location */}
            {needsManualLocation && (
              <div className="space-y-4 animate-slide-in-left">
                <label className="block text-lg font-semibold text-municipal-blue">
                  {t('issue_description_required')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="municipal-input w-full resize-none"
                  placeholder={t('describe_issue_detail')}
                  required
                />
                <p className="text-sm text-amber-600">
                  {t('manual_location_description_required')}
                </p>
              </div>
            )}

            {/* Optional Description when GPS available */}
            {!needsManualLocation && (
              <div className="space-y-4 animate-slide-in-left">
                <label className="block text-lg font-semibold text-municipal-blue">
                  {t('issue_description_optional')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="municipal-input w-full resize-none"
                  placeholder={t('additional_info')}
                />
              </div>
            )}

            {/* Urgency Selection */}
            <div className="space-y-4 animate-slide-in-right">
              <label className="block text-lg font-semibold text-municipal-blue">
                {t('priority')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {urgencyOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setUrgency(option.key)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                      urgency === option.key
                        ? 'border-municipal-blue bg-municipal-blue text-white'
                        : 'border-gray-200 hover:border-municipal-blue'
                    }`}
                  >
                    <div className={urgency === option.key ? 'text-white' : option.color}>
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 animate-slide-in-left">
              <label className="block text-lg font-semibold text-municipal-blue">
                {t('contact_info')}
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="municipal-input w-full"
                placeholder={t('phone_email_optional')}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 animate-bounce-in">
              <button
                type="submit"
                disabled={isSubmitting || !capturedImage || !location || (needsManualLocation && !description.trim())}
                className="municipal-button disabled:opacity-50 disabled:cursor-not-allowed px-12 py-4 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    {t('submit_report')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 stagger-animation">
          <div className="municipal-card p-6 text-center">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <Camera className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-municipal-blue mb-2">
              {t('smart_photo')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('ai_identifies_issue')}
            </p>
          </div>

          <div className="municipal-card p-6 text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <MapPin className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg text-municipal-blue mb-2">
              {t('automatic_location')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('auto_gps_data')}
            </p>
          </div>

          <div className="municipal-card p-6 text-center">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg text-municipal-blue mb-2">
              {t('quick_process')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('report_without_login')}
            </p>
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleImageSelected}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Location Picker Modal */}
      {showLocationPicker && (
        <LocationPicker
          onLocationSelect={handleLocationSelected}
          onClose={() => setShowLocationPicker(false)}
          currentLocation={location}
          imageFile={capturedImage}
        />
      )}
    </div>
  );
};

export default ReportIssue;
