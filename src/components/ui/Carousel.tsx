import { useState, useEffect } from "react";
import Card from "./Card"; // Import your Card component
import "./Carousel.css";

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

const Carousel = () => {
  const [data, setData] = useState<Itinerary[]>([]);

  const chunkData = (data: Itinerary[]) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += 3) {
      chunks.push(data.slice(i, i + 3));
    }
    return chunks;
  };

  useEffect(() => {
    // Load itineraries from localStorage
    const loadItineraries = () => {
      const saved = localStorage.getItem('itineraries');
      if (saved) {
        try {
          const itineraries = JSON.parse(saved);
          setData(itineraries);
        } catch (error) {
          console.error('Failed to load itineraries:', error);
          setData([]);
        }
      }
    };

    loadItineraries();

    // Listen for storage events to update when itineraries change
    const handleStorageChange = () => {
      loadItineraries();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event from same tab
    window.addEventListener('itinerariesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('itinerariesUpdated', handleStorageChange);
    };
  }, []);

  const chunkedData = chunkData(data);

  return (
    <div id="carouselExampleFade" className="carousel slide carousel-fade">
      {data.length === 0 ? (
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="empty-state-carousel">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '64px', height: '64px', margin: '0 auto 1rem', color: '#d1d5db' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>No itineraries yet</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Start planning your adventures in the Create Itinerary page!</p>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default Carousel;