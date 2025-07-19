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
    { key: 'pothole', label: 'Road/Pothole Issues', category: 'pothole' },
    { key: 'streetlight', label: 'Street Lighting', category: 'others' },
    { key: 'garbage', label: 'Garbage Collection', category: 'garbage' },
    { key: 'water', label: 'Water Supply Issues', category: 'others' },
    { key: 'drainage', label: 'Drainage Problems', category: 'others' },
    { key: 'traffic', label: 'Traffic Issues', category: 'others' },
    { key: 'noise', label: 'Noise Pollution', category: 'others' },
    { key: 'construction', label: 'Illegal Construction', category: 'others' },
    { key: 'other', label: 'Other', category: 'others' }
  ];

  // Function to determine final category
  const getFinalCategory = () => {
    // If user manually selected something, use that (respect user choice)
    if (manualIssueType) {
      const selectedType = issueTypes.find(type => type.key === manualIssueType);
      return selectedType ? selectedType.category : 'others';
    }
    
    // If AI classified something, use that
    if (classification) {
      // Map AI classification to supported categories
      if (classification === 'pothole') return 'pothole';
      if (classification === 'garbage') return 'garbage';
      return 'others'; // Any other AI classification goes to others
    }
    
    // Default fallback
    return 'others';
  };

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

    // Determine final category
    const finalCategory = getFinalCategory();
    const finalClassification = manualIssueType || classification || 'others';

    // Build FormData
    const formData = new FormData();
    formData.append('image', capturedImage);
    formData.append('location_lat', String(location.lat));
    formData.append('location_lng', String(location.lng));
    formData.append('address', location.address || '');
    formData.append('description', description);
    formData.append('urgency', urgency);
    formData.append('contact', contact);
    formData.append('classification', finalClassification);
    formData.append('category', finalCategory);

    console.log('Submitting report with:');
    console.log('- AI Classification:', classification);
    console.log('- Manual Selection:', manualIssueType);
    console.log('- Final Category:', finalCategory);
    console.log('- Final Classification:', finalClassification);

    try {
      const res = await fetch('/api/submit-report', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to submit report');
      }

      const result = await res.json();
      
      toast({
        title: t('success'),
        description: `Your ${finalCategory} report has been submitted successfully`,
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
    } catch (err: any) {
      toast({
        title: t('error'),
        description: err.message || 'Failed to submit report',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
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
              
              {/* Photo Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <details className="group">
                  <summary className="cursor-pointer list-none">
                    <h4 className="font-semibold text-blue-800 mb-3 flex items-center group-open:mb-3">
                      📸 Photo Guidelines for Better AI Detection
                      <span className="ml-auto text-blue-600 group-open:hidden">(Click to expand)</span>
                      <span className="ml-auto text-blue-600 hidden group-open:inline">(Click to collapse)</span>
                    </h4>
                  </summary>
                  <div className="space-y-3 text-sm text-blue-700">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">🕳️ Potholes:</span>
                      <span>Stand 2-3 meters away, ensure the entire pothole and surrounding road surface is visible. Include road markings or edges for context.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">🗑️ Garbage:</span>
                      <span>Capture from 3-4 meters away showing the garbage pile and surrounding area. Include landmarks or street signs for location context.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">💡 Street Lights:</span>
                      <span>Take photo from 5-6 meters away showing the light pole and surrounding street area. Include road or sidewalk for context.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">🚰 Water Issues:</span>
                      <span>Stand 2-3 meters away capturing the water problem and affected area. Include pipes, drains, or street context.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">🌊 Drainage:</span>
                      <span>Capture from 2-3 meters showing the blocked drain and surrounding area. Include street or sidewalk for context.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">🚦 Traffic Issues:</span>
                      <span>Take photo from 5-6 meters showing the traffic problem and road intersection. Include traffic signs or signals if relevant.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 font-medium">🏗️ Construction:</span>
                      <span>Capture from 4-5 meters showing the construction site and surrounding area. Include street context and any safety issues.</span>
                    </div>
                    <div className="mt-3 p-2 bg-blue-100 rounded border-l-4 border-blue-400">
                      <strong>💡 General Tips:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Ensure good lighting (avoid shadows covering the issue)</li>
                        <li>• Keep camera steady and level</li>
                        <li>• Include surrounding context (road, sidewalk, buildings)</li>
                        <li>• Avoid extreme angles or close-ups</li>
                        <li>• Make sure the issue is clearly visible and identifiable</li>
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
              
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
                  
                  {/* Photo Quality Reminder */}
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 text-lg">✅</span>
                      <div className="text-sm text-green-800">
                        <strong>Photo Captured!</strong>
                        <div className="mt-1 space-y-1">
                          <div>• Make sure the issue is clearly visible</div>
                          <div>• Check that surrounding context is included</div>
                          <div>• If unclear, retake the photo following the guidelines above</div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <option value="">Select issue type manually (optional)</option>
                {issueTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label} → {type.category.charAt(0).toUpperCase() + type.category.slice(1)}
                  </option>
                ))}
              </select>
              
              {/* Show AI vs Manual selection status */}
              <div className="space-y-2">
                {classification && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>🤖 AI Detection:</strong> {classification}
                    </p>
                  </div>
                )}
                
                {manualIssueType && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>👤 Manual Selection:</strong> {issueTypes.find(t => t.key === manualIssueType)?.label}
                      {classification && classification !== manualIssueType && (
                        <span className="block text-xs text-green-600 mt-1">
                          ⚠️ Overriding AI detection ({classification})
                        </span>
                      )}
                    </p>
                  </div>
                )}
                
                {!classification && !manualIssueType && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      <strong>ℹ️ No classification:</strong> Will be categorized as "Others"
                    </p>
                  </div>
                )}
              </div>
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
