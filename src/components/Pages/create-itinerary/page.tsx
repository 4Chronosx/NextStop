import React, { useState, useEffect } from "react";
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
  const colors = ["#6366f1", "#ec4899", "#8b5cf6", "#14b8a6", "#f59e0b", "#ef4444"];
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState<number | null>(null);
  const [newItinerary, setNewItinerary] = useState<Itinerary>({
    title: "",
    days: [],
  });

  // Load itineraries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('itineraries');
    if (saved) {
      try {
        setItineraries(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load itineraries:', error);
      }
    }
  }, []);

  // Save itineraries to localStorage whenever they change
  useEffect(() => {
    if (itineraries.length > 0) {
      localStorage.setItem('itineraries', JSON.stringify(itineraries));
    }
  }, [itineraries]);

  const formatDateForInput = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return ""; 
    return parsedDate.toISOString().split("T")[0]; 
  };

  const getItineraryDateRange = (itinerary: Itinerary | null) => {
    if (!itinerary || !itinerary.days[0]?.date) return { min: "", max: "" };
    
    const dateRange = itinerary.days[0].date;
    if (!dateRange.includes(" to ")) return { min: "", max: "" };
    
    const [startDateStr, endDateStr] = dateRange.split(" to ");
    return {
      min: formatDateForInput(startDateStr),
      max: formatDateForInput(endDateStr)
    };
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
    if (!newItinerary.title.trim()) {
      alert("Please provide a title for the itinerary.");
      return;
    }
  
    const dateRange = newItinerary.days[0]?.date;
    if (!dateRange || !dateRange.includes("to")) {
      alert("Please provide both start and end dates.");
      return;
    }

    const [startDateStr, endDateStr] = dateRange.split(" to ");
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Please provide valid dates.");
      return;
    }

    if (startDate > endDate) {
      alert("End date must be after start date.");
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
    
    // Clear localStorage if no itineraries remain
    if (updatedItineraries.length === 0) {
      localStorage.removeItem('itineraries');
    }
  };

  const addOrEditActivity = () => {
    if (selectedItineraryIndex === null) {
      alert("Please select an itinerary before adding an activity.");
      return;
    }

    if (!newActivity.title.trim()) {
      alert("Please provide an activity title.");
      return;
    }

    if (!newActivity.date) {
      alert("Please select a date for the activity.");
      return;
    }

    if (!newActivity.type) {
      alert("Please select an activity type.");
      return;
    }
  
    const updatedItineraries = [...itineraries];
    const itinerary = updatedItineraries[selectedItineraryIndex];

    // Validate activity date is within itinerary date range
    const dateRange = getItineraryDateRange(itinerary);
    const selectedActivityDate = new Date(newActivity.date);
    const minDate = new Date(dateRange.min);
    const maxDate = new Date(dateRange.max);

    if (selectedActivityDate < minDate || selectedActivityDate > maxDate) {
      alert(`Activity date must be between ${dateRange.min} and ${dateRange.max}`);
      return;
    }
    
    // Convert date to consistent format for comparison
    const activityDate = formatDateForInput(newActivity.date);
    let day = itinerary.days.find((d) => formatDateForInput(d.date) === activityDate);
  
    if (!day) {
      day = { date: activityDate, details: [] };
      itinerary.days.push(day);
    }
  
    if (editingActivity) {
      // Find and update the existing activity
      const activityIndex = day.details.findIndex(
        (activity) => activity === editingActivity
      );
      if (activityIndex > -1) {
        day.details[activityIndex] = { ...newActivity };
      }
    } else {
      day.details.push({ ...newActivity });
    }
  
    setItineraries(updatedItineraries);
  
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
    setNewActivity({ ...newActivity, date: date });
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  return (
    <>
      <Navbar />
      <div className="create-itinerary">
        {/* Left Section - Calendar */}
        <div className="left-section">
          <div className="calendar-card">
            <div className="calendar-header">
              <button 
                className="calendar-nav-btn" 
                onClick={handlePreviousMonth}
                aria-label="Previous month"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <h3 className="calendar-title">
                {`${currentDate.toLocaleString("default", { month: "long" })} ${currentDate.getFullYear()}`}
              </h3>
              <button 
                className="calendar-nav-btn" 
                onClick={handleNextMonth}
                aria-label="Next month"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday-label">{day}</div>
              ))}
            </div>
            {renderCalendar()}
          </div>

          {/* Legend */}
          {itineraries.length > 0 && (
            <div className="legend-card">
              <div className="legend-header">
                <svg className="legend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
                <h4 className="legend-title">Your Itineraries</h4>
              </div>
              <div className="legend-items">
                {itineraries.map((itinerary, index) => (
                  <div key={index} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="legend-text">{itinerary.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Management */}
        <div className="right-section">
          <div className="section-header">
            <h2 className="section-title">
              <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Manage Your Trip
            </h2>
            <p className="section-subtitle">Create and organize your travel plans</p>
          </div>

          {/* Add/Edit Itinerary Card */}
          <div className="itinerary-card-container">
            <div className="itinerary-card-header">
              <h3 className="itinerary-card-title">
                {editingItinerary !== null ? (
                  <>
                    <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Itinerary
                  </>
                ) : (
                  <>
                    <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create New Itinerary
                  </>
                )}
              </h3>
            </div>
            <div className="itinerary-card-body">
              {editingItinerary === null && (
                <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #dbeafe' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.5' }}>
                    <strong>Step 1:</strong> Fill in the form below with your trip title and dates, then click "Create Itinerary".
                  </p>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Itinerary Title <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter a name for your trip (e.g., Summer Vacation in Paris)"
                  value={newItinerary.title}
                  onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Start Date <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={newItinerary.days[0]?.date?.split(" to ")[0] || ""}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      const endDate = newItinerary.days[0]?.date?.split(" to ")[1] || "";
                      setNewItinerary({ 
                        ...newItinerary, 
                        days: [{ date: startDate + " to " + endDate, details: newItinerary.days[0]?.details || [] }] 
                      });
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    End Date <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={newItinerary.days[0]?.date?.split(" to ")[1] || ""}
                    onChange={(e) => {
                      const startDate = newItinerary.days[0]?.date?.split(" to ")[0] || "";
                      const endDate = e.target.value;
                      setNewItinerary({ 
                        ...newItinerary, 
                        days: [{ date: startDate + " to " + endDate, details: newItinerary.days[0]?.details || [] }] 
                      });
                    }}
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-primary" onClick={addOrEditItinerary}>
                  {editingItinerary !== null ? (
                    <>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Save Changes
                    </>
                  ) : (
                    <>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                      Create Itinerary
                    </>
                  )}
                </button>
                {editingItinerary !== null && (
                  <button 
                    className="btn-primary" 
                    style={{ background: '#6b7280' }}
                    onClick={() => {
                      setEditingItinerary(null);
                      setNewItinerary({ title: "", days: [] });
                    }}
                  >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Itinerary List */}
          <div className="itinerary-card-container">
            <div className="itinerary-card-header">
              <h3 className="itinerary-card-title">
                <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                Your Itineraries
              </h3>
              <span className="badge">{itineraries.length}</span>
            </div>
            <div className="itinerary-card-body">
              {itineraries.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <p className="empty-text">No itineraries yet</p>
                  <p className="empty-subtext">Create your first itinerary to get started!</p>
                </div>
              ) : (
                <div className="itinerary-list">
                  {itineraries.map((itinerary, index) => (
                    <div
                      key={index}
                      className={`itinerary-card ${selectedItineraryIndex === index ? "selected" : ""}`}
                      onClick={() => setSelectedItineraryIndex(index)}
                    >
                      <div 
                        className="itinerary-color-bar" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <div className="itinerary-content">
                        <h4 className="itinerary-title">{itinerary.title}</h4>
                        <p className="itinerary-date">
                          <svg className="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          {itinerary.days[0]?.date || "No Date Range"}
                        </p>
                      </div>
                      <div className="itinerary-actions">
                        <button 
                          className="btn-icon btn-edit" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItinerary(index);
                            setNewItinerary(itinerary);
                          }} 
                          title="Edit"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button 
                          className="btn-icon btn-delete" 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${itinerary.title}"?`)) deleteItinerary(index);
                          }} 
                          title="Delete"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {itineraries.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534', lineHeight: '1.5' }}>
                    <strong>Step 2:</strong> Click on an itinerary above to select it, then scroll down to add activities. 
                    Use the <strong>edit icon</strong> to modify or the <strong>delete icon</strong> to remove an itinerary.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add/Edit Activity */}
          {selectedItineraryIndex !== null && (
            <div className="itinerary-card-container">
              <div className="itinerary-card-header">
                <h3 className="itinerary-card-title">
                  {editingActivity ? (
                    <>
                      <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                      Edit Activity
                    </>
                  ) : (
                    <>
                      <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add New Activity
                    </>
                  )}
                </h3>
              </div>
              <div className="itinerary-card-body">
                {!editingActivity && (
                  <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fde68a' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', lineHeight: '1.5' }}>
                      <strong>Step 3:</strong> Add activities to <strong>{itineraries[selectedItineraryIndex]?.title}</strong>. 
                      Fill in the details below and click \"Add Activity\".
                    </p>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Date <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={newActivity.date ? formatDateForInput(newActivity.date) : ""}
                    min={selectedItineraryIndex !== null ? getItineraryDateRange(itineraries[selectedItineraryIndex]).min : ""}
                    max={selectedItineraryIndex !== null ? getItineraryDateRange(itineraries[selectedItineraryIndex]).max : ""}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      if (new Date(selectedDate).toString() !== "Invalid Date") {
                        setNewActivity({ ...newActivity, date: selectedDate });
                      }
                    }}
                  />
                  {selectedItineraryIndex !== null && (() => {
                    const range = getItineraryDateRange(itineraries[selectedItineraryIndex]);
                    return range.min && range.max ? (
                      <small style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280', fontSize: '0.75rem' }}>
                        Valid dates: {range.min} to {range.max}
                      </small>
                    ) : null;
                  })()}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                    Activity Title <span style={{color: '#ef4444'}}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Visit Eiffel Tower"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                    </svg>
                    Type <span style={{color: '#ef4444'}}>*</span>
                  </label>
                  <select
                    className="form-select"
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                  >
                    <option value="" disabled>Select type</option>
                    {activityTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Duration
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 2 hours"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Time Slot
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 10:00 AM"
                    value={newActivity.timeSlot}
                    onChange={(e) => setNewActivity({ ...newActivity, timeSlot: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Budget
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="0.00"
                    value={newActivity.budget}
                    onChange={(e) => setNewActivity({ ...newActivity, budget: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Location
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Champ de Mars, Paris"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-primary" onClick={addOrEditActivity}>
                  {editingActivity ? (
                    <>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Save Changes
                    </>
                  ) : (
                    <>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Activity
                    </>
                  )}
                </button>
                {editingActivity && (
                  <button 
                    className="btn-primary" 
                    style={{ background: '#6b7280' }}
                    onClick={() => {
                      setEditingActivity(null);
                      setNewActivity({
                        title: "",
                        type: "",
                        duration: "",
                        timeSlot: "",
                        budget: "",
                        location: "",
                        date: "",
                      });
                    }}
                  >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
          )}
          {/* Activities List */}
          <div className="itinerary-card-container">
            <div className="itinerary-card-header">
              <h3 className="itinerary-card-title">
                <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
                Activities Timeline
              </h3>
            </div>
            <div className="itinerary-card-body">
              {selectedItineraryIndex !== null && itineraries[selectedItineraryIndex] ? (
                itineraries[selectedItineraryIndex].days.length === 0 || 
                itineraries[selectedItineraryIndex].days.every(day => !day.details || day.details.length === 0) ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="empty-text">No activities scheduled</p>
                    <p className="empty-subtext">Add your first activity to start planning!</p>
                  </div>
                ) : (
                  <div className="activities-timeline">
                    {itineraries[selectedItineraryIndex].days.map((day, dayIndex) => (
                      day.details && day.details.length > 0 && (
                        <div key={dayIndex} className="day-section">
                          <div className="day-header">
                            <svg className="day-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <h4 className="day-title">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                            <span className="activity-count">{day.details.length} {day.details.length === 1 ? 'activity' : 'activities'}</span>
                          </div>
                          <div className="activity-list">
                            {day.details.map((activity, activityIndex) => (
                              <div key={activityIndex} className="activity-item">
                                <div className="activity-timeline-marker"></div>
                                <div className="activity-content">
                                  <div className="activity-main">
                                    <h5 className="activity-title">{activity.title}</h5>
                                    <div className="activity-meta">
                                      <span className="meta-item">
                                        <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                                        </svg>
                                        {activity.type}
                                      </span>
                                      <span className="meta-item">
                                        <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {activity.timeSlot}
                                      </span>
                                      <span className="meta-item">
                                        <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {activity.duration}
                                      </span>
                                    </div>
                                    <div className="activity-details">
                                      {activity.location && (
                                        <div className="detail-item">
                                          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                          </svg>
                                          {activity.location}
                                        </div>
                                      )}
                                      {activity.budget && (
                                        <div className="detail-item budget">
                                          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                          </svg>
                                          ${activity.budget}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="activity-actions">
                                    <button
                                      className="btn-icon btn-edit"
                                      onClick={() => {
                                        setEditingActivity(activity);
                                        setNewActivity({ ...activity });
                                      }}
                                      title="Edit activity"
                                    >
                                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                      </svg>
                                    </button>
                                    <button
                                      className="btn-icon btn-delete"
                                      onClick={() => deleteActivity(activity)}
                                      title="Delete activity"
                                    >
                                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )
              ) : (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <p className="empty-text">No itinerary selected</p>
                  <p className="empty-subtext">Select an itinerary to view and manage activities</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateItinerary;
