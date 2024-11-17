import Card from "./card"; // Import your Card component
import "./Carousel.css";
import { useState, useEffect } from "react";

const Carousel = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Update the state when the window is resized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true); // If width is <= 768px, set isMobile to true
      } else {
        setIsMobile(false); // Else, set isMobile to false
      }
    };

    // Add event listener for resizing the window
    window.addEventListener("resize", handleResize);

    // Run the function on component mount
    handleResize();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let carouselItems = [];
  for (let i = 0; i < 6; i++) {
    carouselItems.push({
      title: "Card Title",
      img: "src/assets/paris.jpg",
      content:
        "Some quick example text to build on the card title and make up the bulk of the card's content.",
    });
  }

  return (
    <div className="container" style={{ maxWidth: "80%" }}>
      <div
        id="carouselExample"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {/* Render carousel items */}
          <div className="carousel-item active">
            <div className="row justify-content-center">
              {isMobile
                ? carouselItems.slice(0, 1).map((item, index) => (
                    <div
                      className="col-12 d-flex justify-content-center"
                      key={index}
                    >
                      <Card
                        title={item.title}
                        content={item.content}
                        img={item.img}
                      />
                    </div>
                  ))
                : carouselItems.slice(0, 3).map((item, index) => (
                    <div className="col-12 col-md-4" key={index}>
                      <Card
                        title={item.title}
                        content={item.content}
                        img={item.img}
                      />
                    </div>
                  ))}
            </div>
          </div>

          <div className="carousel-item">
            <div className="row justify-content-center">
              {isMobile
                ? carouselItems.slice(1, 2).map((item, index) => (
                    <div
                      className="col-12 d-flex justify-content-center"
                      key={index}
                    >
                      <Card
                        title={item.title}
                        content={item.content}
                        img={item.img}
                      />
                    </div>
                  ))
                : carouselItems.slice(3, 6).map((item, index) => (
                    <div className="col-12 col-md-4" key={index}>
                      <Card
                        title={item.title}
                        content={item.content}
                        img={item.img}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
