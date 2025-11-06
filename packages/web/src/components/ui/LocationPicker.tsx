"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerProps {
  value: {
    latitude: number;
    longitude: number;
  };
  onChange: (location: { latitude: number; longitude: number }) => void;
  label?: string;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, label }) => {
  const [position, setPosition] = useState<L.LatLng | null>(
    value.latitude && value.longitude
      ? L.latLng(value.latitude, value.longitude)
      : L.latLng(35.6892, 51.389) // Default to Tehran
  );
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Add a small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => {
      clearTimeout(timer);
      setMounted(false);
      setIsReady(false);
    };
  }, []);

  useEffect(() => {
    if (position) {
      onChange({
        latitude: position.lat,
        longitude: position.lng,
      });
    }
  }, [position]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition(L.latLng(position.coords.latitude, position.coords.longitude));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("خطا در دریافت موقعیت مکانی");
        }
      );
    } else {
      alert("مرورگر شما از Geolocation پشتیبانی نمی‌کند");
    }
  };

  if (!mounted || !isReady) {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-bold mb-2">{label}</label>}
        <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-600">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold mb-2">{label}</label>}

      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-mblue text-white rounded-lg hover:bg-mblue/90 transition-colors text-sm"
        >
          📍 موقعیت فعلی من
        </button>
        {position && (
          <div className="text-xs text-gray-600">
            <span className="font-bold">مختصات:</span> {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </div>
        )}
      </div>

      <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-gray-300 relative">
        <MapContainer
          center={position || [35.6892, 51.389]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>

        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg z-[1000]">
          <p className="text-xs text-gray-700">
            💡 <strong>راهنما:</strong> روی نقشه کلیک کنید تا موقعیت مکانی را مشخص کنید
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
