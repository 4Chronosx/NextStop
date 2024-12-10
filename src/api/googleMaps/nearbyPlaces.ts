// src/api/googleMaps/nearbyPlaces.ts

export interface Preferences {
  type: string;  // Example: 'restaurant', 'cafe', etc.
  preference?: string;  // General preference like 'vegan', 'family-friendly'
}

export interface Place {
  name: string;
  address: string;
  rating: number | undefined;
  types: string[];
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  website?: string;
  reviews?: Review[];
}

interface Review {
  author_name: string;
  rating: number;
  text: string;
}

export const fetchNearbyPlaces = async (
  latitude: number,
  longitude: number,
  radius: number,
  preferences: Preferences
): Promise<Place[]> => {
  const places: Place[] = [];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const typeFilter = preferences.type || '';
  const preferenceFilter = preferences.preference?.toLowerCase() || '';

  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&types=${typeFilter}&key=${apiKey}`;

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const rawResponse = await response.text();
    console.log('Raw Response:', rawResponse);

    if (!rawResponse) {
      throw new Error('Empty response');
    }

    const data = JSON.parse(rawResponse);
    console.log('API Response:', data);

    if (data.status === 'OK' && data.results) {
      for (const place of data.results) {
        // Filter places with a rating of 4 or higher
        if (place.rating && place.rating >= 4) {
          const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${apiKey}`;
          const detailsResponse = await fetch(proxyUrl + placeDetailsUrl);
          const detailsData = await detailsResponse.json();

          const detailedPlace: Place = {
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            types: place.types,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            phoneNumber: detailsData.result?.formatted_phone_number,
            website: detailsData.result?.website,
            reviews: detailsData.result?.reviews?.map((review: any) => ({
              author_name: review.author_name,
              rating: review.rating,
              text: review.text,
            })),
          };

          if (preferenceFilter && detailedPlace.name.toLowerCase().includes(preferenceFilter)) {
            places.push(detailedPlace);
          } else if (!preferenceFilter) {
            places.push(detailedPlace);
          }
        }
      }
    } else {
      console.error('Error: ' + data.status);
    }
  } catch (error) {
    console.error('Error fetching places:', error);
  }
  return places;
};
