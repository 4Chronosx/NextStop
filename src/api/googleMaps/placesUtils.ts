import { getGeocode, getLatLng } from "use-places-autocomplete";

export const getCoordinatesFromAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  if (!window.google || !window.google.maps) {
    throw new Error("Google Maps JavaScript API not loaded.");
  }

  const geocoder = new window.google.maps.Geocoder();
  try {
    const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results) {
          resolve(results);
        } else {
          reject(`Geocoding failed: ${status}`);
        }
      });
    });

    const location = results[0]?.geometry?.location;
    if (location) {
      return { lat: location.lat(), lng: location.lng() };
    } else {
      throw new Error("No location found.");
    }
  } catch (error) {
    console.error("Error during geocoding:", error);
    throw error;
  }
};
// Convert latitude and longitude to an address (reverse geocoding)
export const getAddressFromCoordinates = async (latLng: google.maps.LatLngLiteral) => {
  try {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ location: latLng });

    if (response.results.length === 0) {
      throw new Error("No address found");
    }
    return response.results[0].formatted_address;
  } catch (error) {
    console.error("Error getting address from coordinates:", error);
    throw error;
  }
};
