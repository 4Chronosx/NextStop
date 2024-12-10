import React, { useState } from "react";
import Navbar from "../../ui/Navbar";
import "./page.css"; 

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

const CreateItinerary: React.FC = () => {
  const colors = ["#FFD700", "#FF4500", "#1E90FF", "#32CD32", "#FF69B4", "#8A2BE2"]; // Unique colors
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState<number | null>(null);
  const [newItinerary, setNewItinerary] = useState<Itinerary>({
    title: "",
    days: [],
  });

  const formatDateForInput = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return ""; 
    return parsedDate.toISOString().split("T")[0]; 
  };

  const [newActivity, setNewActivity] = useState<ActivityDetail>({
    date: "",
    title: "",
    type: "",
    duration: "",
    timeSlot: "",
    budget: "",
    location: "",
  });

  const [editingItinerary, setEditingItinerary] = useState<number | null>(null); 
  const [editingActivity, setEditingActivity] = useState<ActivityDetail | null>(null); 

  const activityTypes = ["Leisure", "Outdoor Adventure", "Travel", "Dining", "Sightseeing", "Shopping"];

  const addOrEditItinerary = () => {
    if (!newItinerary.title) {
      alert("Please provide a title for the itinerary.");
      return;
    }
  
    const dateRange = newItinerary.days[0]?.date;
    if (!dateRange || !dateRange.includes("to")) {
      alert("Please provide a valid date range (e.g., 'mm/dd/yyyy to mm/dd/yyyy').");
      return;
    }
  
    const itineraryWithDays = {
      ...newItinerary,
      days: newItinerary.days.length ? newItinerary.days : [{ date: dateRange, details: [] }],
    };
  
    if (editingItinerary !== null) {
      const updatedItineraries = [...itineraries];
      updatedItineraries[editingItinerary] = itineraryWithDays;
      setItineraries(updatedItineraries);
      setEditingItinerary(null);
    } else {
      setItineraries([...itineraries, itineraryWithDays]);
    }
  
    setNewItinerary({ title: "", days: [] });
  };

  const deleteItinerary = (index: number) => {
    const updatedItineraries = itineraries.filter((_, i) => i !== index);
    setItineraries(updatedItineraries);
    if (selectedItineraryIndex === index) setSelectedItineraryIndex(null);
  };

  const addOrEditActivity = () => {
    if (selectedItineraryIndex === null) {
      alert("Please select an itinerary before adding an activity.");
      return;
    }
  
    const itinerary = itineraries[selectedItineraryIndex];
    let day = itinerary.days.find((day) => day.date === newActivity.date);
  
    if (!day) {
      day = { date: newActivity.date, details: [] };
      itinerary.days.push(day);
    }
  
    if (editingActivity) {
      const activityIndex = day.details.findIndex(
        (activity) => activity.title === editingActivity.title 
      );
      if (activityIndex > -1) {
        day.details[activityIndex] = { ...newActivity };
      }
    } else {
      day.details.push({ ...newActivity });
    }
  
    setItineraries([...itineraries]);
  
    console.log("Updated itineraries:", itineraries);
  
    setNewActivity({
      title: "",
      type: "",
      duration: "",
      timeSlot: "",
      budget: "",
      location: "",
      date: "",
    });
    setEditingActivity(null);
  };

  const deleteActivity = (activity: ActivityDetail) => {
    if (selectedItineraryIndex === null) return;
  
    const confirmed = window.confirm(
      `Are you sure you want to delete the activity "${activity.title}"?`
    );
    if (!confirmed) return;
  
    const updatedItineraries = [...itineraries];
    const itinerary = updatedItineraries[selectedItineraryIndex];
  
    if (!itinerary || !itinerary.days) {
      console.error("Itinerary or days not found.");
      return;
    }
  
    itinerary.days.forEach((day) => {
      if (day.details) {
        day.details = day.details.filter((item) => item !== activity);
      }
    });
  
    setItineraries(updatedItineraries); 
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
  
    const dates = [];

    for (let i = 0; i < firstDay; i++) {
      dates.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      let highlightColor = "";
  
      itineraries.forEach((itinerary, index) => {
        const [startDate, endDate] = itinerary.days[0]?.date
          ?.split(" to ")
          .map((d) => new Date(d.trim())) || [null, null];
  
        if (startDate && endDate && new Date(date) >= startDate && new Date(date) <= new Date(endDate.setHours(23, 59, 59, 999))) {
          highlightColor = colors[index % colors.length];
        }
      });
  
      dates.push(
        <div
          key={i}
          className="calendar-day"
          style={{ backgroundColor: highlightColor }}
          onClick={() => handleDateClick(date)}
        >
          {i}
        </div>
      );
    }
  
    return <div className="calendar-grid">{dates}</div>;
  };

  const handleDateClick = (date: string) => {
    setCurrentDate(new Date(date));
    setNewActivity({ ...newActivity, date: new Date(date).toLocaleDateString("en-US") });
  };

  return (
    <>
      <Navbar />
      <div className="create-itinerary">
        <div className="left-section">
          <div className="calendar">
            <div className="calendar-header">
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&lt;</button>
              <h3>{`${currentDate.toLocaleString("default", { month: "long" })} ${currentDate.getFullYear()}`}</h3>
              <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>&gt;</button>
            </div>
            {renderCalendar()}
          </div>
        </div>

        <div className="right-section">
          <h2>Manage Itineraries</h2>

          {/* Add/Edit Itinerary */}
          <div>
            <h3>{editingItinerary !== null ? "Edit Itinerary" : "Add New Itinerary"}</h3>
            <input
              type="text"
              placeholder="Itinerary Title"
              value={newItinerary.title}
              onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
            />
            <input
              type="date"
              onChange={(e) => setNewItinerary({ 
                ...newItinerary, 
                days: [{ ...newItinerary.days[0], date: e.target.value + " to " + (newItinerary.days[0]?.date?.split(" to ")[1] || "") }] 
              })}
            />
            <input
              type="date"
              onChange={(e) => setNewItinerary({ 
                ...newItinerary, 
                days: [{ ...newItinerary.days[0], date: (newItinerary.days[0]?.date?.split(" to ")[0] || "") + " to " + e.target.value }] 
              })}
            />
            <button onClick={addOrEditItinerary}>
              {editingItinerary !== null ? "Save Changes" : "Add Itinerary"}
            </button>
          </div>

          {/* Itinerary List */}
          <div>
            <h3>Itineraries</h3>
            {itineraries.map((itinerary, index) => (
              <div
                key={index}
                className={`itinerary-item ${selectedItineraryIndex === index ? "selected" : ""}`}
                onClick={() => setSelectedItineraryIndex(index)} // Set selected itinerary
              >
                <p>{itinerary.title}</p>
                <p>{itinerary.days[0]?.date || "No Date Range"}</p>
                <button onClick={(e) => {
                  e.stopPropagation(); // Prevent onClick from selecting the itinerary
                  setEditingItinerary(index);
                }}>
                  Edit
                </button>
                <button onClick={(e) => {
                  e.stopPropagation();
                  deleteItinerary(index);
                }}>
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Add/Edit Activity */}
          {selectedItineraryIndex !== null && (
            <div>
              <h3>{editingActivity ? "Edit Activity" : "Add New Activity"}</h3>
              <input
                type="date"
                value={newActivity.date ? formatDateForInput(newActivity.date) : ""}
                onChange={(e) => {
                  const selectedDate = e.target.value; // YYYY-MM-DD
                  if (new Date(selectedDate).toString() !== "Invalid Date") {
                    setNewActivity({ ...newActivity, date: selectedDate });
                  } else {
                    console.error("Invalid date format");
                  }
                }}
              />
              <input
                type="text"
                placeholder="Activity Title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
              >
                <option value="" disabled>Select Activity Type</option>
                {activityTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Duration"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
              />
              <input
                type="text"
                placeholder="Time Slot"
                value={newActivity.timeSlot}
                onChange={(e) => setNewActivity({ ...newActivity, timeSlot: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
              />
              <input
                type="number"
                placeholder="Budget"
                value={newActivity.budget}
                onChange={(e) => setNewActivity({ ...newActivity, budget: e.target.value })}
              />
              <button onClick={addOrEditActivity}>
                {editingActivity ? "Save Changes" : "Add Activity"}
              </button>
            </div>
          )}

          <div>
            <h3>Activities</h3>
            {selectedItineraryIndex !== null && itineraries[selectedItineraryIndex] ? (
              itineraries[selectedItineraryIndex].days.map((day, dayIndex) => (
                <div key={dayIndex} className="day-section">
                  <h4>{day.date}</h4>
                  {day.details && day.details.length > 0 ? (
                    day.details.map((activity, activityIndex) => (
                      <div key={activityIndex} className="activity-item">
                        <p><strong>{activity.title}</strong></p>
                        <p>
                          {activity.date} | {activity.type} | {activity.duration} | {activity.timeSlot}
                        </p>
                        <p>
                          {activity.location} | ${activity.budget}
                        </p>
                        <div className="activity-actions">
                          <button
                            onClick={() => {
                              setEditingActivity(activity); // Set the activity to edit
                              setNewActivity({ ...activity }); // Populate form with activity details
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteActivity(activity)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No activities available for this date.</p>
                  )}
                </div>
              ))
            ) : (
              <p>Select an itinerary to view activities.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateItinerary;
