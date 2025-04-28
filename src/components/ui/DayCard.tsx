import "./DayCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import DialogBox from "./DialogBox";

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

interface DayItineraryProp {
  dayItinerary: DayItinerary;
}

interface Prop {
  dayNum: number;
}

const DayCard = ({ dayItinerary, dayNum }: DayItineraryProp & Prop) => {
  return (
    <div className="dayCard-container">
      <div className="dayCard-left">
        <div className="text-container">
          <p className="day-title">Day {dayNum}</p>
          <p className="preview-detail">
            {dayItinerary.details.length} activities
          </p>
        </div>
      </div>
      <div className="dayCard-right">
        <div className="icon">
          <FontAwesomeIcon icon={faCalendarDays as any} size="4x" style={{color:"#24265d"}} />
        </div>
        <div className="dayCard-button-container">
          <DialogBox
            date={dayItinerary.date}
            details={dayItinerary.details}
          ></DialogBox>
        </div>
      </div>
    </div>
  );
};

export default DayCard;
