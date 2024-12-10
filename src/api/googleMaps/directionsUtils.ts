import { DirectionsResult } from "./mapTypes";

// Get the details of the route
export const formatRouteDetails = (directions: DirectionsResult) => {
  const legs = directions.routes[0]?.legs || [];

  // Total distance and duration for the entire route
  const totalDistance = legs.reduce(
    (sum, leg) => sum + (leg.distance?.value || 0),
    0
  );
  const totalDuration = legs.reduce(
    (sum, leg) => sum + (leg.duration?.value || 0),
    0
  );

  return {
    // for each leg (leg: distance between each stop)
    legs: legs.map((leg, index) => ({
      stop: `Stop ${index + 1}`,
      distance: leg.distance?.text || "N/A",
      duration: leg.duration?.text || "N/A",
    })),
    // total distance and duration
    totalDistance: `${(totalDistance / 1000).toFixed(2)} km`,
    totalDuration: `${(totalDuration / 60).toFixed(2)} minutes`,
  };
};
