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
          <h1 className="display-4">Welcome to WanderMap</h1>
          <p className="lead">
            A smart intinerary companion to guide you on your travel
          </p>
          <Link className="btn custom-button1 btn-lg" to="/create-itinerary">Create Now</Link>
          
        </div>
      </header>
      <section id="itineraries" className="py-5 bg-light">
      <h1 className="display-5 text-center">My Itineraries</h1>
        <Carousel></Carousel>
      </section>
      
    </>
  );
}

export default HomePage;
