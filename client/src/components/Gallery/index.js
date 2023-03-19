import products from "../../data/products";
import GalleryCard from "./GalleryCard";

const GalleryGrid = () => {
  return (
    <div>
      <h1 className="title">Shop the Gallery! </h1>
      <div className="d-flex flex-wrap justify-content-evenly ">
        {products.map((gallery) => {
          return <GalleryCard gallery={gallery} />;
        })}
      </div>
    </div>
  );
};

export default GalleryGrid;
