import DayCard from "./DayCard";
import "./View.css";

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

interface ItineraryProp {
  itinerary: Itinerary;
}



const View = ({ itinerary }: ItineraryProp) => {
  return (
    <>
      <div className="my-container">
        <div className="view-header-container">
          <h1>{itinerary.title}</h1>
        </div>
        <div className="view-dayCard-container">
          {itinerary.days.map((day, index) => {
            return (
              <div className="dayCard-wrapper">
                <DayCard dayNum={index + 1} dayItinerary={day}/>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default View;
