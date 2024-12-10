import View from "../../ui/View";
import { useLocation } from "react-router-dom";

function ViewPage() {
  const location = useLocation();
  const itinerary = location.state?.itinerary; // Access the itinerary data from state
  return (
    <>
      <View itinerary={itinerary}></View>
    </>
  );
}

export default ViewPage;
