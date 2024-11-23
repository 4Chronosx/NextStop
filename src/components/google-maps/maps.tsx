// Map.tsx
import { useMemo, useRef, useCallback } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { MapOptions } from "../../api/googleMaps/mapTypes";
const Map = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Get API key from .env
  // Map's initial center (you can change it)
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

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map; // Store the map reference in the ref
  }, []);
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
          {/* Add markers or other components as needed */}
          <Marker position={center} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;
