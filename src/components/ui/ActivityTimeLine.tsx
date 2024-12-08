import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LandscapeIcon from '@mui/icons-material/Landscape';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CommuteIcon from '@mui/icons-material/Commute';

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





// Helper function to map activity types to icons
const getIconForActivityType = (type: string) => {
  switch (type) {
    case "Dining":
      return <FastfoodIcon />;
    case "Sightseeing":
      return <LandscapeIcon />;
    case "Leisure":
      return <ShoppingCartIcon />;
    case "Outdoor Adventure":
      return <DirectionsRunIcon />;
    case "Travel":
      return <CommuteIcon />;
    default:
      return null;
  }
};

// Function to determine the color of the dot
const getDotColor = (index: number): "primary" | "secondary" | undefined => {
  if (index % 3 === 0) return undefined; // No color
  if (index % 3 === 1) return "primary";
  return "secondary";
};

const ActivityTimeline = ({ details, date }: DayItinerary) => {
  return (
    <Timeline position="alternate">
      {details.map((activity, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align={index % 2 === 0 ? 'right' : 'left'}
            variant="body2"
            color="text.secondary"
          >
            {activity["Time slot"]}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color={getDotColor(index)}>
              {getIconForActivityType(activity["Activity Type"])}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              {activity["Activity Title"]}
            </Typography>
            <Typography
              sx={{ fontSize: '0.875rem', color: 'gray', mt: 0.5 }}
            >
              {activity["Activity Type"]}, {activity.Duration}
            </Typography>
            <Typography
              sx={{ fontSize: '0.875rem', color: 'gray', mt: 0.5 }}
            >
              Location: {activity.Location}
            </Typography>
            <Typography
              sx={{ fontSize: '0.875rem', color: 'gray', mt: 0.5 }}
            >
              Budget: {activity["Budget for the Activity"]}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ActivityTimeline;
