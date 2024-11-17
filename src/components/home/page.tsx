import Navbar from "../ui/Navbar";
import "../home/page.css";
import Carousel from '../ui/Carousel';

 

function HomePage() {
  let title:string = "Card Title";
  let img:string = "src/assets/paris.jpg";
  let content:string = "Some quick example text to build on the card title and make up the bulk of the card's content.";

  let carouselItems = [];
  for (let i = 0; i < 6; i++) {
    carouselItems.push({
      title:{title},
      img:{img},
      content:{content}
    });
  }

  return (
    <>
      <Navbar></Navbar>
      <header className="bg-light text-center bg-img">
        <div className="container">
          <h1 className="display-4">Welcome to WanderMap</h1>
          <p className="lead">
            A smart intinerary companion to guide you on your travel
          </p>
          <a href="#" className="btn custom-button1 btn-lg">
            Create now!
          </a>
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
