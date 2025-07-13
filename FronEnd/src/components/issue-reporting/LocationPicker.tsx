
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { X, MapPin, Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationPickerProps {
  onLocationSelect: (location: {lat: number, lng: number, address?: string}) => void;
  onClose: () => void;
  currentLocation?: {lat: number, lng: number, address?: string} | null;
}

interface LocationMarkerProps {
  position: [number, number] | null;
  setPosition: (position: [number, number]) => void;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={defaultIcon} />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect, 
  onClose, 
  currentLocation 
}) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState<[number, number] | null>(
    currentLocation ? [currentLocation.lat, currentLocation.lng] : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Biratnagar center coordinates
  const biratnagar: [number, number] = [26.4525, 87.2718];
  const mapCenter = position || biratnagar;

  // Mock search function with Biratnagar locations
  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock results for Biratnagar municipality areas
    const mockResults = [
      { 
        display_name: `${query} - ${t('biratnagar')}`, 
        lat: 26.4525 + (Math.random() - 0.5) * 0.01, 
        lon: 87.2718 + (Math.random() - 0.5) * 0.01 
      },
      { 
        display_name: `${query} - ${t('morang')}`, 
        lat: 26.4525 + (Math.random() - 0.5) * 0.02, 
        lon: 87.2718 + (Math.random() - 0.5) * 0.02 
      },
      { 
        display_name: `${query} - Traffic Chowk`, 
        lat: 26.4589, 
        lon: 87.2750 
      },
      { 
        display_name: `${query} - Main Road`, 
        lat: 26.4511, 
        lon: 87.2701 
      },
      { 
        display_name: `${query} - Rani Pokhari`, 
        lat: 26.4567, 
        lon: 87.2698 
      }
    ];
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  const selectSearchResult = (result: any) => {
    const newPosition: [number, number] = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(newPosition);
    setSearchResults([]);
    setSearchQuery('');
  };

  const confirmLocation = () => {
    if (position) {
      onLocationSelect({
        lat: position[0],
        lng: position[1],
        address: `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-municipal-blue">{t('select_location')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_location')}
                className="w-full municipal-input pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="municipal-button px-4 disabled:opacity-50"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t('search')
              )}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white border rounded-lg shadow-lg max-h-32 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-municipal-blue" />
                    <span className="text-sm">{result.display_name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="relative" style={{ height: '400px' }}>
          <MapContainer
            center={mapCenter}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>

          {/* Instructions overlay */}
          {!position && (
            <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 z-[1000]">
              <p className="text-sm text-center text-gray-700">
                {t('click_map_to_pin')}
              </p>
            </div>
          )}

          {/* Biratnagar Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-municipal-blue bg-opacity-90 text-white rounded-lg p-3 z-[1000]">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">{t('biratnagar')} {t('municipality_map')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          {position && (
            <div className="text-sm text-gray-600">
              {t('selected_location')}: {position[0].toFixed(6)}, {position[1].toFixed(6)}
            </div>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="municipal-button-secondary"
            >
              {t('cancel')}
            </button>
            <button
              onClick={confirmLocation}
              disabled={!position}
              className="municipal-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('confirm_location')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
