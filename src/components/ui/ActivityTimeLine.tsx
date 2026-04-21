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
import './ActivityTimeLine.css';


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





// Helper function to map activity types to icons
const getIconForActivityType = (type: string) => {
  switch (type) {
    case "Dining":
      return <FastfoodIcon />;
    case "Sightseeing":
      return <LandscapeIcon />;
    case "Leisure":
      return ;
    case "Outdoor Adventure":
      return <DirectionsRunIcon />;
    case "Travel":
      return <CommuteIcon />;
    case "Shopping":
      return <ShoppingCartIcon />;
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

const ActivityTimeline = ({ details }: DayItinerary) => {
  return (
    <Timeline position="alternate">
      {details.map((activity, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align={index % 2 === 0 ? 'right' : 'left'}
            variant="body2"
            color="#3871c1"
          >
            {activity.timeSlot}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color={getDotColor(index)}>
              {getIconForActivityType(activity.type)}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span" className='activity-title'>
              {activity.title}
            </Typography>
            <Typography className="activity-subdetails"
              sx={{ fontSize: '0.875rem', color: 'gray', mt: 0.5 }}
            >
              {activity.type}, {activity.duration}
            </Typography>
            <Typography className="activity-subdetails"
              sx={{ fontSize: '0.875rem', color: 'gray', mt: 0.5 }}
            >
              Location: {activity.location}
            </Typography>
            <Typography className="activity-subdetails"
              sx={{ fontSize: '0.875rem', color: 'gray', mt: 0.5 }}
            >
              Budget: {activity.budget}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ActivityTimeline;
