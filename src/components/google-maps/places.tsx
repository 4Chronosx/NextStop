import { useState } from "react";
import { getCoordinatesFromAddress } from "../../api/googleMaps/placesUtils"; // Import utility function

type PlacesProps = {
  setOrigin: (position: google.maps.LatLngLiteral) => void;
  initialPosition?: google.maps.LatLngLiteral;
};

export default function Places({ setOrigin, initialPosition }: PlacesProps) {
  const [address, setAddress] = useState<string>("");

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleSelect = async () => {
    try {
      const { lat, lng } = await getCoordinatesFromAddress(address);
      setOrigin({ lat, lng });
    } catch (error) {
      console.error("Error selecting address:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Enter address"
        className="address-input"
      />
      <button onClick={handleSelect}>Set Origin</button>
      {initialPosition && (
        <div>
          <p>{`Initial Position: ${initialPosition.lat}, ${initialPosition.lng}`}</p>
        </div>
      )}
    </div>
  );
}
