import products from "../../data/products";
import GalleryCard from "./GalleryCard";
import "../Gallery/gallery.css";

const GalleryGrid = () => {
  return (
    <div className ="gallery-container">
      <h1 className="gallery-h">Shop the Gallery! </h1>
      <div className="flex flex-wrap justify-content-evenly">
        {products.map((gallery) => {
          return <GalleryCard gallery={gallery} />;
        })}
      </div>
    </div>
  );
};

export default GalleryGrid;
