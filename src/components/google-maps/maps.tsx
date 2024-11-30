import { useState, useMemo, useRef, useCallback } from "react";
import {
  GoogleMap,
  MarkerF,
  LoadScript,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapOptions } from "../../api/googleMaps/mapTypes";
import { formatRouteDetails } from "../../api/googleMaps/directionsUtils"; // Import the utility function

const Map = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mapRef = useRef<google.maps.Map>();
  const center = useMemo(() => ({ lat: 10.31, lng: 123.88 }), []);
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "100c6734a08cac73",
      disableDefaultUI: true,
      clickableIcons: true,
    }),
    []
  );

  const places = [
    { lat: 10.31, lng: 123.88 },
    { lat: 10.3157, lng: 123.8854 },
    { lat: 10.3201, lng: 123.9011 },
  ];

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [showRoute, setShowRoute] = useState<boolean>(false); // State to toggle route visibility
  const [showDetails, setShowDetails] = useState<boolean>(false); // State to toggle route details

  // Function to fetch the route using Google Maps Directions API
  const fetchRoute = useCallback(() => {
    if (places.length < 2) return;

    const directionsService = new google.maps.DirectionsService();
    const waypoints = places.slice(1, places.length - 1).map((place) => ({
      location: new google.maps.LatLng(place.lat, place.lng),
      stopover: true,
    }));

    directionsService.route(
      {
        origin: new google.maps.LatLng(places[0].lat, places[0].lng),
        destination: new google.maps.LatLng(
          places[places.length - 1].lat,
          places[places.length - 1].lng
        ),
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      }
    );
  }, [places]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (showRoute) {
        fetchRoute();
      }

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) =>
        bounds.extend(new google.maps.LatLng(place.lat, place.lng))
      );
      map.fitBounds(bounds);
    },
    [fetchRoute, showRoute]
  );

  const handleRouteToggle = () => {
    if (showRoute) {
      setShowRoute(false);
      setDirections(null);
    } else {
      setShowRoute(true);
      fetchRoute();
    }
  };

  const handleDetailsToggle = () => {
    setShowDetails(!showDetails); // Toggle the visibility of route details
  };

  const routeDetails = directions ? formatRouteDetails(directions) : null; // Format route details if directions are available

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <div className="map-container" style={{ height: "100%", width: "100%" }}>
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={options}
          onLoad={onLoad}
        >
          {!showRoute &&
            places.map((place, index) => {
              return <MarkerF key={index} position={place} />;
            })}

          {showRoute && directions && (
            <DirectionsRenderer directions={directions} />
          )}
        </GoogleMap>

        {/* Toggle buttons for showing/hiding route and route details */}
        <div className="button-container">
          <button onClick={handleRouteToggle} className="button">
            {showRoute ? "Hide Route" : "View Route"}
          </button>
          {showRoute && directions && (
            <button onClick={handleDetailsToggle} className="button">
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          )}
        </div>

        {/* Route details section */}
        {showDetails && routeDetails && (
          <div className="route-details">
            <h3>Route Details</h3>
            <ul>
              {routeDetails.legs.map((leg, index) => (
                <li key={index}>
                  <strong>{leg.stop}:</strong> {leg.distance} ({leg.duration})
                </li>
              ))}
            </ul>
            <p>
              <strong>Total Distance:</strong> {routeDetails.totalDistance}
            </p>
            <p>
              <strong>Total Duration:</strong> {routeDetails.totalDuration}
            </p>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default Map;
