// this is to be used when getting info on nearby places (to replace value of variables with user input)

import React, { useEffect, useState } from "react";
import {
  fetchNearbyPlaces,
  Place,
  Preferences,
} from "../../api/googleMaps/nearbyPlaces"; // Import the function

interface NearbyPlacesProps {
  latitude: number;
  longitude: number;
  radius: number;
  preferences: Preferences;
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({
  latitude,
  longitude,
  radius,
  preferences,
}) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const nearbyPlaces = await fetchNearbyPlaces(
          latitude,
          longitude,
          radius,
          preferences
        );
        setPlaces(nearbyPlaces);
      } catch (error) {
        console.error("Error fetching nearby places:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [latitude, longitude, radius, preferences]); // Fetch when props change

  return (
    <div>
      <h2>Nearby Places</h2>
      {loading ? (
        <p>Loading nearby places...</p>
      ) : places.length === 0 ? (
        <p>No nearby places found.</p>
      ) : (
        <ul>
          {places.map((place) => (
            <li key={place.name}>
              <h4>{place.name}</h4>
              <p>{place.address}</p>
              <p>Rating: {place.rating ? place.rating : "No rating"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NearbyPlaces;
