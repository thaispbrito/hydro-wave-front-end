const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/geocode`;

// Reverse geocode: convert lat/lng to location name
const reverseGeocode = async (lat, lng) => {
    try {
        const res = await fetch(`${BASE_URL}/reverse?lat=${lat}&lng=${lng}`);
        return res.json();
    } catch (error) {
        console.log(error);
        return { error: "Reverse geocoding failed" };
    }
};

// Forward geocode: convert location name to lat/lng
const forwardGeocode = async (query) => {
    try {
        const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
        return res.json();
    } catch (error) {
        console.log(error);
        return [];
    }
};

export {
    reverseGeocode,
    forwardGeocode,
};