import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon once
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ 
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const BaseMap = ({
    center = [47.66277, -122.42265], // default center
    zoom = 13,
    children,
    height = '400px',
    draggable = true,
    scrollWheelZoom = true,
    zoomControl = true,
}) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ width: '100%', height }}
            dragging={draggable}
            scrollWheelZoom={scrollWheelZoom}
            zoomControl={zoomControl}
        >
        <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
        </MapContainer>
    );
};

export default BaseMap;
