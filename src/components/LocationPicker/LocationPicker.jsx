import { Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import BaseMap from '../BaseMap/BaseMap';
import { reverseGeocode } from '../../services/geocodingService';

const LocationMarker = ({ formData, setFormData }) => {
    const [position, setPosition] = useState(
        formData.location_lat && formData.location_long
            ? [formData.location_lat, formData.location_long]
            : null
    );

    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);

            try {
                const data = await reverseGeocode(lat, lng);

                const city =
                    data.address?.city ||
                    data.address?.town ||
                    data.address?.village ||
                    data.address?.hamlet ||
                    '';
                const state = data.address?.state || '';
                const country = data.address?.country || '';
                const locationName = [city, state, country].filter(Boolean).join(', ');

                setFormData(prev => ({
                    ...prev,
                    location_lat: lat,
                    location_long: lng,
                    location_name: locationName,
                }));
            } catch (error) {
                console.error('Reverse geocoding failed', error);
                setFormData(prev => ({
                    ...prev,
                    location_lat: lat,
                    location_long: lng,
                    location_name: '',
                }));
            }
        },
    });

    return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ formData, setFormData }) => {
    const defaultCenter = formData.location_lat && formData.location_long
        ? [formData.location_lat, formData.location_long]
        : [47.66277, -122.42265]; // Discovery Park, Seattle

    return (
        <BaseMap center={defaultCenter} zoom={13} height="400px">
            <LocationMarker formData={formData} setFormData={setFormData} />
        </BaseMap>
    );
};

export default LocationPicker;
