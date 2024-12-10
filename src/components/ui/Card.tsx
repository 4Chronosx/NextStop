import { useNavigate } from "react-router";
import "./Card.css";

interface ActivityDetail {
  "Activity Title": string;
  "Activity Type": string;
  Duration: string;
  "Time slot": string;
  "Budget for the Activity": string;
  Location: string;
}

interface DayItinerary {
  date: string;
  details: ActivityDetail[];
}

interface Itinerary {
  title: string;
  days: DayItinerary[];
}

interface ItineraryProps {
  itinerary: Itinerary;
}

const Card = ({ itinerary }: ItineraryProps) => {
  const navigate = useNavigate();
  console.log(itinerary);

  const handleView = () => {
    navigate("/view-itinerary", {
      state: { itinerary: itinerary }, // Pass the itinerary data as state
    });
  };

  return (
    <>
      <div className="card m-3">
        {/*<img className="card-img-top" alt="Some picture" /> */}
        <div className="card-body">
          <div className="card-title-content-container">
            <h5 className="card-title">{itinerary.title}</h5>
            <p className="card-text">
              Date: {itinerary.days[0].date} to {" "}
              {itinerary.days[itinerary.days.length - 1].date}
            </p>
          </div>
          <div className="card-button-container">
            <button onClick={handleView} className="btn custom-button1">
              view
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;