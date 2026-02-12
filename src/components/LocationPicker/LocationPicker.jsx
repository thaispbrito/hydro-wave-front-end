import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = ({ formData, setFormData }) => {
    const [position, setPosition] = useState(
    formData.location_lat && formData.location_long 
        ? [formData.location_lat, formData.location_long] 
        : null
    ); 
    
//     useMapEvents({
//         click(e) {
//             const { lat, lng } = e.latlng;
            
//             setPosition([lat, lng]);
            
//             // Update parent form
//             setFormData(prev => ({ ...prev, location_lat: lat, location_long: lng, }));
//         },
//     });
    
//     return position === null ? null : <Marker position={position} />;
// };


    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            
            setPosition([lat, lng]);

            try {
                const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );

                const data = await response.json();

                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village ||
                    data.address.hamlet ||
                    '';
            
                // Update parent form
                setFormData(prev => ({ ...prev, location_lat: lat, location_long: lng, location_name: city, }));
            } catch (error) {
                console.error('Reverse geocoding failed', error);
            }
        },
    });
    
    return position === null ? null : <Marker position={position} />;
};


const LocationPicker = ({ formData, setFormData }) => {
    const defaultCenter = formData.location_lat && formData.location_long 
        ? [formData.location_lat, formData.location_long] 
        : [47.66277, -122.42265]; // default (Discovery Park, Seattle)
    
    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: '400px', width: '100%', marginBottom: '1rem' }}
        >
        <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <LocationMarker formData={formData} setFormData={setFormData} />
        </MapContainer>
    );
};

export default LocationPicker;
