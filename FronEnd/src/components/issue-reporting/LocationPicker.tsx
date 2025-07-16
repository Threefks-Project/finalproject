import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import * as exifr from 'exifr';
import { X, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address?: string }) => void;
  onClose: () => void;
  currentLocation?: { lat: number; lng: number; address?: string } | null;
  imageFile?: File | null;  // Added this line
}

const LocationMarker: React.FC<{
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}> = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} icon={defaultIcon} /> : null;
};

const getExifGPS = async (file: File): Promise<{ lat: number; lng: number } | null> => {
  try {
    const gps = await exifr.gps(file);
    if (gps?.latitude && gps?.longitude) {
      return { lat: gps.latitude, lng: gps.longitude };
    }
    return null;
  } catch (err) {
    console.warn("EXIF error", err);
    return null;
  }
};

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  onClose,
  currentLocation = null,
  imageFile = null
}) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState<[number, number] | null>(
    currentLocation ? [currentLocation.lat, currentLocation.lng] : null
  );
  const [locationSource, setLocationSource] = useState<"exif" | "browser" | "manual" | null>(null);
  const biratnagar: [number, number] = [26.4525, 87.2718];

  useEffect(() => {
    const tryExifThenBrowser = async () => {
      if (imageFile) {
        const exifLocation = await getExifGPS(imageFile);
        if (exifLocation) {
          setPosition([exifLocation.lat, exifLocation.lng]);
          setLocationSource("exif");
          return;
        }
      }

      // Ask to use browser location
      const confirmed = window.confirm(
        "No GPS data found in image. Use your device's location?"
      );
      if (confirmed) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition([pos.coords.latitude, pos.coords.longitude]);
            setLocationSource("browser");
          },
          () => {
            alert("Browser location failed. Please pin location manually.");
            setLocationSource("manual");
          }
        );
      } else {
        setLocationSource("manual");
      }
    };

    tryExifThenBrowser();
  }, [imageFile]);

  const confirmLocation = () => {
    if (position) {
      onLocationSelect({
        lat: position[0],
        lng: position[1],
        address: `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-municipal-blue">
            {t("select_location")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Map */}
        <div className="relative" style={{ height: "400px" }}>
          <MapContainer
            center={position || biratnagar}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>

          {/* Instruction overlay */}
          {!position && (
            <div className="absolute top-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 z-[1000] text-sm text-center">
              {t("click_map_to_pin")}
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-municipal-blue bg-opacity-90 text-white rounded-lg p-3 z-[1000] text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>
                {t("biratnagar")} {t("municipality_map")} —{" "}
                {locationSource || t("loading")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          {position && (
            <div className="text-sm text-gray-600">
              {t("selected_location")}: {position[0].toFixed(6)},{" "}
              {position[1].toFixed(6)}
            </div>
          )}
          <div className="flex gap-3 ml-auto">
            <button onClick={onClose} className="municipal-button-secondary">
              {t("cancel")}
            </button>
            <button
              onClick={confirmLocation}
              disabled={!position}
              className="municipal-button disabled:opacity-50"
            >
              {t("confirm_location")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
