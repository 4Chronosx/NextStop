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

const getTitleFontSize = (title: string) => {
  const len = title.length;
  if (len < 20) return "x-large";
  if (len < 35) return "large";
  if (len < 50) return "medium";
  return "small";
};

const formatDate = (dateStr: string) => {
  // mm-dd-yyyy (AI / manual storage format)
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [mm, dd, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd}T12:00:00`).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }
  // yyyy-mm-dd (ISO / browser date input format) — append noon to avoid UTC offset shifting the day
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const Card = ({ itinerary }: ItineraryProps) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate("/view-itinerary", {
      state: { itinerary: itinerary },
    });
  };

  let startDate = itinerary.days[0]?.date || "";
  let endDate = itinerary.days[itinerary.days.length - 1]?.date || "";

  if (startDate.includes(" to ")) {
    const [s, e] = startDate.split(" to ");
    startDate = s;
    endDate = e;
  }
 

  const totalActivities = itinerary.days
    .reduce((sum, day) => sum + (day.details?.length || 0), 0);

  const dayCount =
    startDate && endDate
      ? Math.round(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  return (
    <div className="card m-3">
      <div className="card-accent-bar" />
      <div className="card-body">
        <div className="card-title-content-container">
          <h5
            className="card-title"
            style={{ fontSize: getTitleFontSize(itinerary.title) }}
          >
            {itinerary.title}
          </h5>
        </div>

        <div className="card-badges-row">
          {dayCount > 0 && (
            <span className="card-badge">
              {dayCount} {dayCount === 1 ? "day" : "days"}
            </span>
          )}
          {totalActivities > 0 && (
            <span className="card-badge">
              {totalActivities}{" "}
              {totalActivities === 1 ? "activity" : "activities"}
            </span>
          )}
        </div>

        <div className="card-date-row">
          <svg
            className="card-date-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="card-text">
            {formatDate(startDate)} → {formatDate(endDate)}
          </p>
        </div>

        <button onClick={handleView} className="custom-button1">
          VIEW
        </button>
      </div>
    </div>
  );
};

export default Card;
