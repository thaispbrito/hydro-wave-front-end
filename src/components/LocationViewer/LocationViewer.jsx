import { Marker, Popup } from 'react-leaflet';
import BaseMap from '../BaseMap/BaseMap';

const LocationViewer = ({ lat, lng, locationName, height = '300px', zoom = 13 }) => {
    if (!lat || !lng) return null;
    const position = [parseFloat(lat), parseFloat(lng)];

    return (
        <BaseMap center={position} zoom={zoom} height={height} draggable={false} scrollWheelZoom={false} zoomControl={false}>
            <Marker position={position}>
                {locationName && (
                    <Popup>
                        <strong>{locationName}</strong>
                        <br />
                        {position[0].toFixed(5)}, {position[1].toFixed(5)}
                    </Popup>
                )}
            </Marker>
        </BaseMap>
    );
};

export default LocationViewer;
