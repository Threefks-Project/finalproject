
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Image, 
  Calendar, 
  MapPin, 
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
}

const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&h=600&fit=crop",
      title: "भिरभिरे बगैंचा",
      description: "शहरका सुन्दर हरियाली क्षेत्रहरू",
      date: "2024-01-15",
      location: "बिराटनगर-१",
      category: "environment"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
      title: "पुल निर्माण",
      description: "नयाँ पुल निर्माण परियोजना",
      date: "2024-02-20",
      location: "बिराटनगर-५",
      category: "infrastructure"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop",
      title: "फूल महोत्सव",
      description: "वार्षिक फूल महोत्सव कार्यक्रम",
      date: "2024-03-10",
      location: "नगर हल",
      category: "events"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&h=600&fit=crop",
      title: "प्राकृतिक सुन्दरता",
      description: "बिराटनगरको प्राकृतिक दृश्यहरू",
      date: "2024-01-28",
      location: "बिराटनगर-७",
      category: "nature"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&h=600&fit=crop",
      title: "सामुदायिक कार्यक्रम",
      description: "स्थानीय समुदायिक कार्यक्रम",
      date: "2024-02-14",
      location: "बिराटनगर-३",
      category: "community"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=600&fit=crop",
      title: "सडक सुधार",
      description: "सडक सुधार र मर्मत कार्य",
      date: "2024-03-05",
      location: "बिराटनगर-२",
      category: "infrastructure"
    }
  ];

  const categories = [
    { key: 'all', label: t('all') },
    { key: 'environment', label: t('environment') },
    { key: 'infrastructure', label: t('infrastructure') },
    { key: 'events', label: t('events') },
    { key: 'nature', label: t('nature') },
    { key: 'community', label: t('community') }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="hero-section relative py-16 rounded-2xl mb-8 overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-bounce-in">
                <Image className="inline-block mr-4 h-12 w-12 animate-float" />
                {t('photo_gallery')}
              </h1>
              <p className="text-xl text-white/90 animate-slide-in-right">
                {t('beautiful_moments')}
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 stagger-animation">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.key
                    ? 'municipal-button animate-pulse-glow'
                    : 'municipal-button-secondary'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="municipal-card municipal-card-hover group cursor-pointer overflow-hidden"
              onClick={() => openModal(image)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between">
                      <Eye className="h-6 w-6" />
                      <span className="text-sm">View Details</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-municipal-blue mb-2 group-hover:gradient-text transition-all duration-300">
                  {image.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {image.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-municipal-green" />
                    {new Date(image.date).toLocaleDateString('ne-NP')}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-municipal-blue" />
                    {image.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16 animate-scale-in">
            <Image className="h-24 w-24 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              {t('no_images_found')}
            </h3>
            <p className="text-gray-400">
              {t('no_images_category')}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={() => navigateImage('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={() => navigateImage('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            <div className="relative">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg animate-scale-in"
              />
              
              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
                  <p className="text-white/90 mb-4">{selectedImage.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(selectedImage.date).toLocaleDateString('ne-NP')}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedImage.location}
                      </div>
                    </div>
                    
                    <button className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white hover:bg-white/30 transition-colors flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      {t('download')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
