import 'leaflet/dist/leaflet.css';
import React from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapMarker {
  id: string;
  position: [number, number];
  label?: string;
  icon?: L.Icon;
}

interface MapViewProps {
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  children?: React.ReactNode;
}

/**
 * Base map component using react-leaflet.
 * Renders a tile map with optional markers, popups, and additional children (e.g. Polyline).
 */
export function MapView({ center, zoom = 13, markers = [], className = '', children }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={`h-full w-full rounded-lg ${className}`}
      style={{ minHeight: '300px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position} icon={marker.icon}>
          {marker.label && <Popup>{marker.label}</Popup>}
        </Marker>
      ))}
      {children}
    </MapContainer>
  );
}
