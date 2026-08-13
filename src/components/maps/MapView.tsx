import 'leaflet/dist/leaflet.css';
import React, { Component, useEffect, type ErrorInfo, type ReactNode } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Safe standard default Leaflet marker icon for bundlers (without corrupting prototype chain)
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
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
 * Controller component to update map view center smoothly when coordinates change.
 */
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (map && Number.isFinite(center[0]) && Number.isFinite(center[1])) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

/**
 * Robust Error Boundary to ensure map rendering errors never crash the entire page.
 */
interface MapErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface MapErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  constructor(props: MapErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MapErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MapView error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 dark:bg-muted/40 rounded-xl border border-dashed p-6 text-center">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Map View Temporarily Unavailable</p>
            <p className="text-xs text-gray-500 mt-1">Please refresh the page to reload the map tiles.</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

/**
 * Base map component using react-leaflet.
 * Renders an OpenStreetMap tile map with custom pins, popups, and children.
 */
export function MapView({ center, zoom = 13, markers = [], className = '', children }: MapViewProps) {
  // Validate coordinates
  const validCenter: [number, number] =
    Number.isFinite(center[0]) && Number.isFinite(center[1]) ? center : [6.6005, 3.3505];

  const validMarkers = markers.filter(
    (m) => m && Array.isArray(m.position) && Number.isFinite(m.position[0]) && Number.isFinite(m.position[1])
  );

  return (
    <MapErrorBoundary>
      <MapContainer
        center={validCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        className={`h-full w-full rounded-xl ${className}`}
        style={{ minHeight: '350px', height: '100%', width: '100%' }}
      >
        <ChangeView center={validCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validMarkers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={marker.icon || defaultIcon}>
            {marker.label && <Popup>{marker.label}</Popup>}
          </Marker>
        ))}
        {children}
      </MapContainer>
    </MapErrorBoundary>
  );
}
