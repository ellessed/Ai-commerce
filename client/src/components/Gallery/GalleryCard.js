import "../Gallery/gallery.css";

const GalleryCard = (props) => {
  const { title, description, image } = props.gallery;
  console.log(props);
  return (
    <div className="card m-5 " style={{ width: "25rem" }}>
      <img src={image} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <button className="cartButton">Add to Cart</button>
      </div>
    </div>
  );
};

export default GalleryCard;
