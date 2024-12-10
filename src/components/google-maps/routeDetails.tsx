import { DirectionsResult } from "../../api/googleMaps/mapTypes";
import { formatRouteDetails } from "../../api/googleMaps/directionsUtils"; // Import the utility function

type RouteDetailsProps = {
  directions: DirectionsResult;
};

export default function RouteDetails({ directions }: RouteDetailsProps) {
  const { legs, totalDistance, totalDuration } = formatRouteDetails(directions); // Get formatted details from the utility function

  return (
    <div className="route-details">
      <h2>Route Details</h2>
      <ul>
        {legs.map((leg, index) => (
          <li key={index}>
            <p>{leg.stop}:</p>
            <p>
              Distance: {leg.distance}, Duration: {leg.duration}
            </p>
          </li>
        ))}
      </ul>
      <h3>Total</h3>
      <p>
        Distance: {totalDistance}, Duration: {totalDuration}
      </p>
    </div>
  );
}
