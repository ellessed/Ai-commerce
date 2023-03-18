import { Link, useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const ProductCard = (props) => {
  const { productName, imageUrl, price, _id, onAddToCart, onAddFavourite } =
    props;

  const location = useLocation();

  return (
    <div className="border p-5 m-2 flex">
      <div>
        <img
          src={`${imageUrl}`}
          alt={productName}
          className="product-image p-5"
        />
      </div>
      <div className="product-details">
        <Link to={`/product/${_id}`}>{productName}</Link>
        <div className="product-price">
          <p className="text-lg mr-5">£{price}</p>
          <button className="btn btn-primary" onClick={onAddToCart}>
            Add to Cart
          </button>
          {location.pathname === "/" ? (
            <button className="btn btn-primary" onClick={onAddFavourite}>
              <FaHeart />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
