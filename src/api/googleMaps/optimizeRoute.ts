const fetchOptimizedRoute = async (
  origin: string,
  destinations: string[],
  apiKey: string
) => {
  const waypoints = destinations.join('|');
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${origin}&waypoints=optimize:true|${waypoints}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.routes && data.routes[0]) {
    return data.routes[0].legs;
  }
  return [];
};

// Example usage
const origin = "37.7749,-122.4194";  // San Francisco
const destinations = [
  "37.7849,-122.4294",  // Place 2
  "37.7949,-122.4394",  // Place 3
  "37.8049,-122.4494"   // Place 4
];

fetchOptimizedRoute(origin, destinations, 'YOUR_GOOGLE_API_KEY')
  .then(route => console.log(route));
