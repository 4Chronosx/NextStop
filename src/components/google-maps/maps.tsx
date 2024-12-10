import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { MapOptions } from "../../api/googleMaps/mapTypes";
import { formatRouteDetails } from "../../api/googleMaps/directionsUtils";
import "./maps.css";

interface Location {
  lat: number;
  lng: number;
}

const Map = ({ locations }: { locations: Location[] }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const center = useMemo(() => ({ lat: 10.31, lng: 123.88 }), []);
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "100c6734a08cac73",
      disableDefaultUI: true,
      clickableIcons: true,
    }),
    []
  );

  const removeDuplicateLocations = (places: Location[]): Location[] => {
    const uniquePlaces: Location[] = [];
    places.forEach((place) => {
      const isDuplicate = uniquePlaces.some(
        (uniquePlace) =>
          Math.abs(uniquePlace.lat - place.lat) < 0.00001 &&
          Math.abs(uniquePlace.lng - place.lng) < 0.00001
      );
      if (!isDuplicate) {
        uniquePlaces.push(place);
      }
    });
    return uniquePlaces;
  };

  const places = removeDuplicateLocations(locations);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [showRoute, setShowRoute] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [travelMode, setTravelMode] = useState<google.maps.TravelMode>(
    google.maps.TravelMode.DRIVING
  );

  const fetchRoute = useCallback(() => {
    if (places.length < 2 || !showRoute) return; // Prevent route fetching if showRoute is false
    console.log("Fetching route...");
    const directionsService = new google.maps.DirectionsService();

    const waypoints = places.slice(1, places.length - 1).map((place) => ({
      location: new google.maps.LatLng(place.lat, place.lng),
      stopover: true,
    }));

    // Log waypoints to debug
    console.log("Waypoints:", waypoints);

    directionsService.route(
      {
        origin: new google.maps.LatLng(places[0].lat, places[0].lng),
        destination: new google.maps.LatLng(
          places[places.length - 1].lat,
          places[places.length - 1].lng
        ),
        waypoints,
        travelMode: travelMode,
      },
      (result, status) => {
        console.log("Route result status:", status);
        console.log("Origin:", places[0]);
        console.log("Destination:", places[places.length - 1]);
        console.log("Waypoints:", places.slice(1, places.length - 1));

        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
          alert(
            "Failed to fetch route. Please check your input and try again."
          );
        }
      }
    );
  }, [places, travelMode, showRoute]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      if (places.length > 0) {
        const firstPlace = new google.maps.LatLng(places[0].lat, places[0].lng);
        map.setCenter(firstPlace); // Set the center to the first location without zooming
        map.setZoom(10); // Set a consistent zoom level to prevent automatic zoom adjustment

        if (showRoute && places.length > 1) {
          fetchRoute();
        }
      }
    },
    [places, showRoute, fetchRoute]
  );

  useEffect(() => {
    if (mapRef.current && places.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) =>
        bounds.extend(new google.maps.LatLng(place.lat, place.lng))
      );
      mapRef.current.fitBounds(bounds);
    }
  }, [places]);

  useEffect(() => {
    console.log("showRoute changed:", showRoute);
    if (showRoute) {
      fetchRoute();
    } else {
      setDirections(null); // Clear directions when hiding the route
    }
  }, [showRoute, fetchRoute]);

  const handleRouteToggle = () => {
    if (places.length < 2) return;
    setShowRoute((prev) => {
      const newShowRoute = !prev;
      console.log("Toggling showRoute:", newShowRoute); // Add this line to check the state
      if (!newShowRoute) {
        setDirections(null); // Clear directions when hiding the route
      }
      return newShowRoute;
    });
  };

  const handleDetailsToggle = () => {
    setShowDetails((prev) => !prev);
  };

  const handleTravelModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedMode = event.target.value as google.maps.TravelMode;
    setTravelMode(selectedMode);
  };

  const routeDetails = directions ? formatRouteDetails(directions) : null;

  return (
    <div className="map-container" style={{ height: "100%", width: "100%" }}>
      <GoogleMap
        key={showRoute ? "showRoute" : "hideRoute"} // Key changes based on showRoute
        zoom={10}
        center={center}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={options}
        onLoad={onLoad}
      >
        {!showRoute &&
          places.length > 0 &&
          places.map((place, index) => (
            <MarkerF key={index} position={place} />
          ))}

        {showRoute && directions && (
          <>
            <DirectionsRenderer directions={directions} />
          </>
        )}
      </GoogleMap>

      <div className="map-controls-container">
        <div className="map-button-container">
          <button onClick={handleRouteToggle} className="map-route-button">
            {showRoute ? "Hide Route" : "View Route"}
          </button>
          {showRoute && directions && (
            <button
              onClick={handleDetailsToggle}
              className="map-details-button"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          )}
        </div>

        <div className="map-travel-mode-selector">
          <label htmlFor="travel-mode">Choose Travel Mode: </label>
          <select
            id="travel-mode"
            value={travelMode}
            onChange={handleTravelModeChange}
          >
            <option value={google.maps.TravelMode.DRIVING}>Driving</option>
            <option value={google.maps.TravelMode.WALKING}>Walking</option>
            <option value={google.maps.TravelMode.BICYCLING}>Bicycling</option>
          </select>
        </div>

        {showDetails && routeDetails && (
          <div className="map-route-details-box">
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
    </div>
  );
};

export default Map;
