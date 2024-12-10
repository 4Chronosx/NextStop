import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import ActivityTimeLine from "./ActivityTimeLine";
import "./DialogBox.css";
import Map from "../google-maps/maps"; // Ensure Map is a React component
import { getCoordinatesFromAddress } from "../../api/googleMaps/placesUtils"; // Import the utility for geocoding

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

// Function to extract locations from itinerary
const extractLocations = async (data: DayItinerary) => {
  const locations: { lat: number; lng: number }[] = [];

  const areLocationsEqual = (
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ) => {
    const threshold = 0.0001; // Define a small threshold to consider the locations the same
    return (
      Math.abs(loc1.lat - loc2.lat) < threshold &&
      Math.abs(loc1.lng - loc2.lng) < threshold
    );
  };

  // Loop through each activity's location in the details array
  for (const activity of data.details) {
    const location = activity.Location; // Extract the location from each activity

    try {
      console.log(`Attempting to geocode: ${location}`); // Log the address being geocoded
      const coordinates = await getCoordinatesFromAddress(location);
      console.log(`Geocoded ${location}:`, coordinates); // Log the coordinates

      // Check if the location is already in the list based on coordinates
      const isDuplicate = locations.some((existingLocation) =>
        areLocationsEqual(existingLocation, coordinates)
      );

      if (!isDuplicate) {
        locations.push(coordinates); // Add new location if not a duplicate
      }
    } catch (error) {
      console.error(`Failed to geocode ${location}:`, error);
    }
  }
  return locations;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogBox = ({ details, date }: DayItinerary) => {
  const [open, setOpen] = React.useState(false);
  const [locationsArray, setLocationsArray] = React.useState<
    { lat: number; lng: number }[]
  >([]); // Renamed from locations

  const handleClickOpen = async () => {
    setOpen(true);
    // Fetch locations only when the dialog is opened
    const extractedLocations = await extractLocations({ details, date });
    console.log("Fetched locations array:", extractedLocations); // Log the locations array
    setLocationsArray(extractedLocations); // Set the extracted locations in state
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button className="dialogView-button" onClick={handleClickOpen}>
        View
      </button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Activities of the Day {date}
            </Typography>
          </Toolbar>
        </AppBar>
        <section className="dialog-content-container">
          <div className="timeline-container">
            <ActivityTimeLine date={date} details={details}></ActivityTimeLine>
          </div>
          <div className="maps-container">
            <Map locations={locationsArray} />{" "}
            {/* Pass the locationsArray to the Map component */}
          </div>
        </section>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogBox;

// hello
