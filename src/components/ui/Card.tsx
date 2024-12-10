
interface Props {
    img: string;
    title: string;
    content: string;
}

const Card = ({img, title, content} : Props) => {
  return (
    <>
      <div className="card m-3" style={{ width: "18rem"}}>
        <img src={img} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">
            {content}
          </p>
          <a href="#" className="btn custom-button1">
            view
          </a>
        </div>
      </div>
    </>
  );
};

export default Card;
