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
import './DialogBox.css'



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
  


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogBox = ({ details, date } : DayItinerary) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log(date);

  return (
    <React.Fragment>
      <button className="dialogView-button" onClick={handleClickOpen}>view</button>
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
            Here is the maps section with its corresponding routes
          </div>
        </section>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogBox;

// hello
