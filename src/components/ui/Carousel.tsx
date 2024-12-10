import { useState, useEffect } from "react";
import { openDB } from "idb";
import Card from "./Card"; // Import your Card component
import "./Carousel.css";

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

const defaultItinerary: Itinerary[] = [
  {
    title: "myItinerary",
    days: [
      {
        date: "Day 1",
        details: [
          {
            "Activity Title": "Activity 1",
            "Activity Type": "Type 1",
            Duration: "2 hours",
            "Time slot": "Morning",
            "Budget for the Activity": "$100",
            Location: "Location 1",
          },
        ],
      },
    ],
  },
];

const Carousel = () => {
  const [data, setData] = useState<Itinerary[]>(defaultItinerary);

  const chunkData = (data: Itinerary[]) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 3) {
      chunks.push(data.slice(i, i + 3));
    }
    return chunks;
  };

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("MyDatabase", 6);
      const count = await db.count("data");
      if (count > 0) {
        const allData = await db.getAll("data");
        setData(allData); // Ensure consistent display order
      }
    };

    initDB();
  }, []);

  const chunkedData = chunkData(data);

  return (
    <div id="carouselExampleFade" className="carousel slide carousel-fade">
      <div className="carousel-inner">
        {chunkedData.map((chunk, index) => (
          <div
            className={`carousel-item ${index === 0 ? "active" : ""}`}
            key={`slide-${index}`}
          >
            {chunk.map((itinerary, idx) => (
              <div key={`card-${index}-${idx}`} className="mx-2">
                <Card itinerary={itinerary} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;