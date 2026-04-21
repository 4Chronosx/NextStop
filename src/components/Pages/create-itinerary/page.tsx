import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../ui/Navbar";
import Dialog from "../../ui/Dialog";

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
  const location = useLocation();
  const colors = ["#6366f1", "#ec4899", "#8b5cf6", "#14b8a6", "#f59e0b", "#ef4444"];

  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItineraryIndex, setSelectedItineraryIndex] = useState<number | null>(null);
  const [editingItinerary, setEditingItinerary] = useState<number | null>(null);
  const [editingActivity, setEditingActivity] = useState<ActivityDetail | null>(null);

  const [newItinerary, setNewItinerary] = useState<Itinerary>({ title: "", days: [] });
  const [newActivity, setNewActivity] = useState<ActivityDetail>({
    date: "", title: "", type: "", duration: "", timeSlot: "", budget: "", location: "",
  });

  const itineraryFormRef = useRef<HTMLDivElement>(null);
  const activityFormRef = useRef<HTMLDivElement>(null);

  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    message: string;
    onConfirm?: () => void;
  }>({ isOpen: false, type: "alert", message: "" });

  const showAlert = (message: string) =>
    setDialog({ isOpen: true, type: "alert", message });

  const showConfirm = (message: string, onConfirm: () => void) =>
    setDialog({ isOpen: true, type: "confirm", message, onConfirm });

  const closeDialog = () =>
    setDialog((prev) => ({ ...prev, isOpen: false }));

  const activityTypes = ["Leisure", "Outdoor Adventure", "Travel", "Dining", "Sightseeing", "Shopping"];

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("itineraries");
    if (saved) {
      try {
        const parsed: Itinerary[] = JSON.parse(saved);
        setItineraries(parsed);
        const editIndex = location.state?.editIndex;
        if (editIndex !== undefined && parsed[editIndex]) {
          setEditingItinerary(editIndex);
          setNewItinerary(parsed[editIndex]);
        }
      } catch (error) {
        console.error("Failed to load itineraries:", error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (itineraries.length > 0) {
      localStorage.setItem("itineraries", JSON.stringify(itineraries));
    }
  }, [itineraries]);

  // Scroll to itinerary form when editing starts
  useEffect(() => {
    if (editingItinerary !== null && itineraryFormRef.current) {
      itineraryFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingItinerary]);

  // Scroll to activity form when editing an activity
  useEffect(() => {
    if (editingActivity !== null && activityFormRef.current) {
      activityFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [editingActivity]);

  // Convert any date string to YYYY-MM-DD for <input type="date"> (handles mm-dd-yyyy and ISO)
  const formatDateForInput = (dateStr: string): string => {
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [mm, dd, yyyy] = dateStr.split("-");
      return `${yyyy}-${mm}-${dd}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Convert YYYY-MM-DD (browser input) to mm-dd-yyyy (AI/storage format)
  const toMMDDYYYY = (dateStr: string): string => {
    const d = new Date(dateStr + "T12:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // Generate one DayItinerary per calendar day in mm-dd-yyyy format, preserving existing activities
  const buildDays = (start: Date, end: Date, existingDays: DayItinerary[]): DayItinerary[] => {
    const result: DayItinerary[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      const dateStr = `${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}-${cur.getFullYear()}`;
      const match = existingDays.find((d) => formatDateForInput(d.date) === formatDateForInput(dateStr));
      result.push({ date: dateStr, details: match?.details || [] });
      cur.setDate(cur.getDate() + 1);
    }
    return result;
  };

  const getItineraryDateRange = (itinerary: Itinerary | null) => {
    if (!itinerary || !itinerary.days[0]?.date) return { min: "", max: "" };
    const firstDate = itinerary.days[0].date;
    const lastDate = itinerary.days[itinerary.days.length - 1].date;
    // Handle legacy range-string format
    if (firstDate.includes(" to ")) {
      const [s, e] = firstDate.split(" to ");
      return { min: formatDateForInput(s), max: formatDateForInput(e) };
    }
    return { min: formatDateForInput(firstDate), max: formatDateForInput(lastDate) };
  };

  const addOrEditItinerary = () => {
    if (!newItinerary.title.trim()) { showAlert("Please provide a title for the itinerary."); return; }
    const dateRange = newItinerary.days[0]?.date;
    if (!dateRange || !dateRange.includes("to")) { showAlert("Please provide both start and end dates."); return; }
    const [startDateStr, endDateStr] = dateRange.split(" to ");
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) { showAlert("Please provide valid dates."); return; }
    if (startDate > endDate) { showAlert("End date must be after start date."); return; }

    const existingDays = editingItinerary !== null ? itineraries[editingItinerary].days : [];
    const itineraryWithDays = {
      title: newItinerary.title,
      days: buildDays(startDate, endDate, existingDays),
    };

    if (editingItinerary !== null) {
      const updated = [...itineraries];
      updated[editingItinerary] = itineraryWithDays;
      setItineraries(updated);
      setEditingItinerary(null);
    } else {
      setItineraries([...itineraries, itineraryWithDays]);
    }
    setNewItinerary({ title: "", days: [] });
  };

  const deleteItinerary = (index: number) => {
    const updated = itineraries.filter((_, i) => i !== index);
    setItineraries(updated);
    if (selectedItineraryIndex === index) setSelectedItineraryIndex(null);
    if (updated.length === 0) localStorage.removeItem("itineraries");
  };

  const addOrEditActivity = () => {
    if (selectedItineraryIndex === null) { showAlert("Please select an itinerary first."); return; }
    if (!newActivity.title.trim()) { showAlert("Please provide an activity title."); return; }
    if (!newActivity.date) { showAlert("Please select a date for the activity."); return; }
    if (!newActivity.type) { showAlert("Please select an activity type."); return; }

    const updated = [...itineraries];
    const itinerary = updated[selectedItineraryIndex];
    const dateRange = getItineraryDateRange(itinerary);
    const selected = new Date(newActivity.date);
    if (selected < new Date(dateRange.min) || selected > new Date(dateRange.max)) {
      showAlert(`Activity date must be between ${dateRange.min} and ${dateRange.max}`);
      return;
    }

    const activityDateMMDDYYYY = toMMDDYYYY(newActivity.date);
    let day = itinerary.days.find((d) => formatDateForInput(d.date) === formatDateForInput(activityDateMMDDYYYY));
    if (!day) { day = { date: activityDateMMDDYYYY, details: [] }; itinerary.days.push(day); }

    if (editingActivity) {
      const idx = day.details.findIndex((a) => a === editingActivity);
      if (idx > -1) day.details[idx] = { ...newActivity, date: activityDateMMDDYYYY };
    } else {
      day.details.push({ ...newActivity, date: activityDateMMDDYYYY });
    }

    setItineraries(updated);
    setNewActivity({ title: "", type: "", duration: "", timeSlot: "", budget: "", location: "", date: "" });
    setEditingActivity(null);
  };

  const deleteActivity = (activity: ActivityDetail) => {
    if (selectedItineraryIndex === null) return;
    showConfirm(`Delete "${activity.title}"?`, () => {
      const updated = [...itineraries];
      updated[selectedItineraryIndex].days.forEach((day) => {
        day.details = day.details.filter((a) => a !== activity);
      });
      setItineraries(updated);
    });
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const dates = [];
    for (let i = 0; i < firstDay; i++) dates.push(<div key={`e${i}`} className="calendar-day empty" />);
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      let highlightColor = "";
      itineraries.forEach((itin, idx) => {
        const firstDate = itin.days[0]?.date;
        const lastDate = itin.days[itin.days.length - 1]?.date;
        if (!firstDate || !lastDate) return;
        const start = new Date(formatDateForInput(firstDate) + "T00:00:00");
        const end = new Date(formatDateForInput(lastDate) + "T23:59:59");
        const cur = new Date(date + "T12:00:00");
        if (cur >= start && cur <= end) highlightColor = colors[idx % colors.length];
      });
      dates.push(
        <div key={i} className="calendar-day" style={{ backgroundColor: highlightColor }} onClick={() => handleDateClick(date)}>{i}</div>
      );
    }
    return <div className="calendar-grid">{dates}</div>;
  };

  const handleDateClick = (date: string) => {
    setCurrentDate(new Date(date));
    setNewActivity((a) => ({ ...a, date }));
  };

  const handlePreviousMonth = () => setCurrentDate((d) => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; });
  const handleNextMonth = () => setCurrentDate((d) => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; });

  // The create/edit itinerary form is visible when:
  // - nothing is selected (user can create a new one)
  // - OR editing mode is active (user clicked Edit)
  const showItineraryForm = selectedItineraryIndex === null || editingItinerary !== null;

  return (
    <>
      <Navbar />
      <div className="create-itinerary">

        {/* Left — Calendar */}
        <div className="left-section">
          <div className="calendar-card">
            <div className="calendar-header">
              <button className="calendar-nav-btn" onClick={handlePreviousMonth} aria-label="Previous month">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <h3 className="calendar-title">{`${currentDate.toLocaleString("default", { month: "long" })} ${currentDate.getFullYear()}`}</h3>
              <button className="calendar-nav-btn" onClick={handleNextMonth} aria-label="Next month">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div className="calendar-weekdays">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d} className="weekday-label">{d}</div>)}
            </div>
            {renderCalendar()}
          </div>

          {itineraries.length > 0 && (
            <div className="legend-card">
              <div className="legend-header">
                <svg className="legend-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h4 className="legend-title">Your Itineraries</h4>
              </div>
              <div className="legend-items">
                {itineraries.map((itin, idx) => (
                  <div key={idx} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: colors[idx % colors.length] }} />
                    <span className="legend-text">{itin.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Management */}
        <div className="right-section">
          <div className="section-header">
            <h2 className="section-title">
              <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Manage Your Trip
            </h2>
            <p className="section-subtitle">Create and organize your travel plans</p>
          </div>

          {/* ── Your Itineraries ── */}
          <div className="itinerary-card-container">
            <div className="itinerary-card-header">
              <h3 className="itinerary-card-title">
                <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Your Itineraries
              </h3>
              <span className="badge">{itineraries.length}</span>
            </div>
            <div className="itinerary-card-body">
              {itineraries.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="empty-text">No itineraries yet</p>
                  <p className="empty-subtext">Use the form below to create your first itinerary or create with AI</p>
                </div>
              ) : (
                <div className="itinerary-list">
                  {itineraries.map((itin, index) => {
                    const isSelected = selectedItineraryIndex === index;
                    const isEditing = editingItinerary === index;
                    return (
                      <div
                        key={index}
                        className={`itinerary-card ${isSelected && !isEditing ? "selected" : ""} ${isEditing ? "editing" : ""}`}
                        onClick={() => {
                          if (!isEditing) {
                            setSelectedItineraryIndex(index);
                            setEditingItinerary(null);
                            setNewItinerary({ title: "", days: [] });
                          }
                        }}
                      >
                        <div className="itinerary-color-bar" style={{ backgroundColor: colors[index % colors.length] }} />
                        <div className="itinerary-content">
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <h4 className="itinerary-title">{itin.title}</h4>
                            {isEditing && <span className="mode-chip mode-chip-edit">Editing</span>}
                            {isSelected && !isEditing && <span className="mode-chip mode-chip-selected">Selected</span>}
                          </div>
                          <p className="itinerary-date">
                            <svg className="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {itin.days.length > 1
                              ? `${itin.days[0].date} → ${itin.days[itin.days.length - 1].date}`
                              : itin.days[0]?.date || "No Date Range"}
                          </p>
                        </div>
                        <div className="itinerary-actions">
                          <button
                            className="action-btn action-btn-edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstDay = itin.days[0]?.date || "";
                              const lastDay = itin.days[itin.days.length - 1]?.date || "";
                              setEditingItinerary(index);
                              setNewItinerary({
                                title: itin.title,
                                days: [{ date: `${formatDateForInput(firstDay)} to ${formatDateForInput(lastDay)}`, details: [] }],
                              });
                              setSelectedItineraryIndex(null);
                            }}
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            className="action-btn action-btn-delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              showConfirm(`Delete "${itin.title}"?`, () => deleteItinerary(index));
                            }}
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {selectedItineraryIndex === null && editingItinerary === null && (
                    <p className="step-hint">Click an itinerary to select it and manage its activities.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Create / Edit Itinerary form — only when nothing selected OR editing ── */}
          {showItineraryForm && (
            <div ref={itineraryFormRef} className={`itinerary-card-container ${editingItinerary !== null ? "card-mode-edit" : "card-mode-create"}`}>
              {/* Mode banner */}
              <div className={`mode-banner ${editingItinerary !== null ? "mode-banner-edit" : "mode-banner-create"}`}>
                {editingItinerary !== null ? (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editing — {itineraries[editingItinerary]?.title}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Creating a new itinerary
                  </>
                )}
              </div>

              <div className="itinerary-card-header">
                <h3 className="itinerary-card-title">
                  {editingItinerary !== null ? "Edit Itinerary" : "New Itinerary"}
                </h3>
              </div>

              <div className="itinerary-card-body">
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Itinerary Title <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Summer Vacation in Paris"
                    value={newItinerary.title}
                    onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Start Date {editingItinerary === null && <span style={{ color: "#ef4444" }}>*</span>}
                    </label>
                    {editingItinerary !== null ? (
                      <div className="form-input locked-date">{newItinerary.days[0]?.date?.split(" to ")[0] || "—"}</div>
                    ) : (
                      <input
                        type="date"
                        className="form-input"
                        value={newItinerary.days[0]?.date?.split(" to ")[0] || ""}
                        onChange={(e) => {
                          const start = e.target.value;
                          const end = newItinerary.days[0]?.date?.split(" to ")[1] || "";
                          setNewItinerary({ ...newItinerary, days: [{ date: `${start} to ${end}`, details: newItinerary.days[0]?.details || [] }] });
                        }}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      End Date {editingItinerary === null && <span style={{ color: "#ef4444" }}>*</span>}
                    </label>
                    {editingItinerary !== null ? (
                      <div className="form-input locked-date">{newItinerary.days[0]?.date?.split(" to ")[1] || "—"}</div>
                    ) : (
                      <input
                        type="date"
                        className="form-input"
                        value={newItinerary.days[0]?.date?.split(" to ")[1] || ""}
                        onChange={(e) => {
                          const start = newItinerary.days[0]?.date?.split(" to ")[0] || "";
                          const end = e.target.value;
                          setNewItinerary({ ...newItinerary, days: [{ date: `${start} to ${end}`, details: newItinerary.days[0]?.details || [] }] });
                        }}
                      />
                    )}
                  </div>
                </div>
                {editingItinerary !== null && (
                  <p className="locked-date-hint">Trip dates are locked while editing to keep your existing activities intact.</p>
                )}
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn-primary" onClick={addOrEditItinerary}>
                    {editingItinerary !== null ? (
                      <><svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Save Changes</>
                    ) : (
                      <><svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Create Itinerary</>
                    )}
                  </button>
                  {editingItinerary !== null && (
                    <button className="btn-secondary" onClick={() => { setEditingItinerary(null); setNewItinerary({ title: "", days: [] }); }}>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Add / Edit Activity — only when an itinerary is selected ── */}
          {selectedItineraryIndex !== null && (
            <div
              ref={activityFormRef}
              className={`itinerary-card-container ${editingActivity ? "card-mode-edit" : "card-mode-create"}`}
            >
              {/* Mode banner */}
              <div className={`mode-banner ${editingActivity ? "mode-banner-edit" : "mode-banner-create"}`}>
                {editingActivity ? (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editing activity — {editingActivity.title}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adding activity to — {itineraries[selectedItineraryIndex]?.title}
                  </>
                )}
              </div>

              <div className="itinerary-card-header">
                <h3 className="itinerary-card-title">
                  {editingActivity ? "Edit Activity" : "Add New Activity"}
                </h3>
              </div>

              <div className="itinerary-card-body">
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={newActivity.date ? formatDateForInput(newActivity.date) : ""}
                    min={getItineraryDateRange(itineraries[selectedItineraryIndex]).min}
                    max={getItineraryDateRange(itineraries[selectedItineraryIndex]).max}
                    onChange={(e) => {
                      if (new Date(e.target.value).toString() !== "Invalid Date")
                        setNewActivity({ ...newActivity, date: e.target.value });
                    }}
                  />
                  {(() => {
                    const range = getItineraryDateRange(itineraries[selectedItineraryIndex]);
                    return range.min && range.max ? (
                      <small style={{ display: "block", marginTop: "0.25rem", color: "#6b7280", fontSize: "0.75rem" }}>
                        Valid dates: {range.min} to {range.max}
                      </small>
                    ) : null;
                  })()}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Activity Title <span style={{ color: "#ef4444" }}>*</span>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      Type <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select className="form-select" value={newActivity.type} onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}>
                      <option value="" disabled>Select type</option>
                      {activityTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Duration
                    </label>
                    <input type="text" className="form-input" placeholder="e.g., 2 hours" value={newActivity.duration} onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Time Slot
                    </label>
                    <input type="text" className="form-input" placeholder="e.g., 10:00 AM" value={newActivity.timeSlot} onChange={(e) => setNewActivity({ ...newActivity, timeSlot: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Budget
                    </label>
                    <input type="number" className="form-input" placeholder="0.00" value={newActivity.budget} onChange={(e) => setNewActivity({ ...newActivity, budget: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Location
                  </label>
                  <input type="text" className="form-input" placeholder="e.g., Champ de Mars, Paris" value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="btn-primary" onClick={addOrEditActivity}>
                    {editingActivity ? (
                      <><svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Save Changes</>
                    ) : (
                      <><svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg> Add Activity</>
                    )}
                  </button>
                  {editingActivity && (
                    <button className="btn-secondary" onClick={() => { setEditingActivity(null); setNewActivity({ title: "", type: "", duration: "", timeSlot: "", budget: "", location: "", date: "" }); }}>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Activities Timeline ── */}
          {selectedItineraryIndex !== null && (
            <div className="itinerary-card-container">
              <div className="itinerary-card-header">
                <h3 className="itinerary-card-title">
                  <svg className="itinerary-card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Activities — {itineraries[selectedItineraryIndex]?.title}
                </h3>
              </div>
              <div className="itinerary-card-body">
                {itineraries[selectedItineraryIndex].days.length === 0 ||
                itineraries[selectedItineraryIndex].days.every((d) => !d.details || d.details.length === 0) ? (
                  <div className="empty-state">
                    <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="empty-text">No activities yet</p>
                    <p className="empty-subtext">Add your first activity using the form above!</p>
                  </div>
                ) : (
                  <div className="activities-timeline">
                    {itineraries[selectedItineraryIndex].days.map((day, dayIndex) =>
                      day.details && day.details.length > 0 ? (
                        <div key={dayIndex} className="day-section">
                          <div className="day-header">
                            <svg className="day-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h4 className="day-title">{new Date(day.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h4>
                            <span className="activity-count">{day.details.length} {day.details.length === 1 ? "activity" : "activities"}</span>
                          </div>
                          <div className="activity-list">
                            {day.details.map((activity, aIdx) => (
                              <div key={aIdx} className={`activity-item ${editingActivity === activity ? "activity-item-editing" : ""}`}>
                                <div className="activity-timeline-marker" />
                                <div className="activity-content">
                                  <div className="activity-main">
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                      <h5 className="activity-title" style={{ margin: 0 }}>{activity.title}</h5>
                                      {editingActivity === activity && <span className="mode-chip mode-chip-edit">Editing</span>}
                                    </div>
                                    <div className="activity-meta">
                                      <span className="meta-item">
                                        <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                                        {activity.type}
                                      </span>
                                      {activity.timeSlot && <span className="meta-item"><svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{activity.timeSlot}</span>}
                                      {activity.duration && <span className="meta-item"><svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{activity.duration}</span>}
                                    </div>
                                    <div className="activity-details">
                                      {activity.location && <div className="detail-item"><svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{activity.location}</div>}
                                      {activity.budget && <div className="detail-item budget"><svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>${activity.budget}</div>}
                                    </div>
                                  </div>
                                  <div className="activity-actions">
                                    <button
                                      className="action-btn action-btn-edit"
                                      onClick={() => { setEditingActivity(activity); setNewActivity({ ...activity, date: formatDateForInput(activity.date) }); }}
                                    >
                                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                      Edit
                                    </button>
                                    <button
                                      className="action-btn action-btn-delete"
                                      onClick={() => deleteActivity(activity)}
                                    >
                                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        type={dialog.type}
        message={dialog.message}
        onClose={closeDialog}
        onConfirm={dialog.onConfirm}
      />
    </>
  );
};

export default CreateItinerary;
