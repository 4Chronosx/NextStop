import { useNavigate } from "react-router";
import "./Card.css";

interface ActivityDetail {
  date: string;
  title: string;
  type: string;
  duration: string;
  timeSlot: string;
  budget: string;
  location: string;
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
          </div>
          <div className="card-button-container">
          <p className="card-text">
              Date: {itinerary.days[0].date} to {" "}
              {itinerary.days[itinerary.days.length - 1].date}
            </p>
            <button onClick={handleView} className="custom-button1">
              VIEW
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;