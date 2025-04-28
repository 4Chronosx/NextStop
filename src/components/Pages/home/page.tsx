import Navbar from "../../ui/Navbar";
import "../home/page.css";
import Carousel from '../../ui/Carousel';
import { Link } from "react-router-dom";
 

function HomePage() {
  return (
    <>
      <Navbar></Navbar>
      <header className="bg-light text-center bg-img">
        <div className="container">
          <h1 className="display-1 headliner">Where is your <Link style={{textDecoration:"none"}}to={"/create-itinerary"}><span className="brandname-home">NextStop</span></Link> ?</h1>
          <p className="lead">
            Your Smart Travel Guide
          </p>
          <p className="guide-detail">Seamlessly plan every journey, from local escapes to global adventures, with <br />your perfect itinerary companion.</p>
          
        </div>
      </header>
      <section id="itineraries" className="py-5 bg-light">
      <h1 className="display-5 text-center itinerary-section-title">My Itineraries</h1>
        <Carousel></Carousel>
      </section>
      
    </>
  );
}

export default HomePage;