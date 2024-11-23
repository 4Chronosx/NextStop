import { useState, useRef, useCallback } from "react";
import { LatLngLiteral, DirectionsResult } from "./mapTypes";

// Custom hook to manage map-related state and functionality
export function useMap() {
  // State to store the list of places (LatLngLiteral[]), initially empty
  const [places, setPlaces] = useState<LatLngLiteral[]>([]);

  // State to store directions result from Google Maps API, initially null
  const [directions, setDirections] = useState<DirectionsResult | null>(null);

  // State to store the selected travel mode for directions (e.g., DRIVING, WALKING)
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    google.maps.TravelMode.DRIVING
  );

  // Ref to store the reference to the Google Map object
  const mapRef = useRef<google.maps.Map | null>(null);

  // Function to add a new place to the list of places
  const addPlace = (position: LatLngLiteral) => {
    setPlaces((prevPlaces) => [...prevPlaces, position]);
  };

  // Function to remove a place from the list of places by index
  const removePlace = (index: number) => {
    setPlaces((prevPlaces) => {
      // Filter out the place at the specified index
      const newPlaces = prevPlaces.filter((_, i) => i !== index);

      // If there are less than two places, reset the directions to null
      if (newPlaces.length <= 1) {
        setDirections(null);
      }

      return newPlaces;
    });
  };

  // Function to fetch the route using Google Maps Directions API
  const fetchRoute = () => {
    if (places.length < 2) return; // Must have at least two places to fetch directions

    const service = new google.maps.DirectionsService();
    // Prepare the waypoints, excluding the first and last place
    const waypoints = places.slice(1, places.length - 1).map((place) => ({
      location: new google.maps.LatLng(place), // Convert each place to a LatLng object
      stopover: true, // Mark each waypoint as a stopover
    }));

    // Request directions from the Directions API
    service.route(
      {
        origin: new google.maps.LatLng(places[0]), // Starting point (first place)
        destination: new google.maps.LatLng(places[places.length - 1]), // Ending point (last place)
        waypoints, // Intermediate waypoints
        travelMode: travelMode, // Selected travel mode (DRIVING, WALKING, etc.)
      },
      (result, status) => {
        if (status === "OK") {
          // If the route is successfully fetched, set the directions state
          setDirections(result);
        }
      }
    );
  };

  // Callback function to set the map reference when the map is loaded
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map; // Store the map reference
  }, []);

  // Function to update a place at a specific index with a new position
  const updatePlace = (index: number, position: LatLngLiteral) => {
    setPlaces((prevPlaces) => {
      const updatedPlaces = [...prevPlaces];
      updatedPlaces[index] = position; // Update the place at the given index
      return updatedPlaces;
    });
  };

  // Return the state and functions so they can be used in the component
  return {
    places,
    directions,
    travelMode,
    setTravelMode,
    addPlace,
    removePlace,
    fetchRoute,
    onLoad,
    updatePlace,
  };
}
