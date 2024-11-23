import { getGeocode, getLatLng } from "use-places-autocomplete";

// Get latitude and longitude from an address
export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const results = await getGeocode({ address });
    if (results.length === 0) {
      throw new Error("No geocode results found");
    }
    return getLatLng(results[0]); // Convert the first result to LatLng
  } catch (error) {
    console.error("Error getting coordinates from address:", error);
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
