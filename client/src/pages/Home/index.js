// UI Components
import ProductCard from "../../components/ProductCard";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import "../Home/home.css";
import GalleryGrid from "../../components/Gallery";
// import { useQuery } from "@apollo/client";
// import { QUERY_FEATURED_PRODUCTS } from "../../utils/queries";

// Shopping Cart
import { useCart } from "../../context/CartContext";

import { FaSearch } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
//save artwork mutation
import { SAVE_ARTWORK } from "../../utils/mutations";
import { SAVE_PRODUCT } from "../../utils/mutations";
import { ADD_FAVOURITE } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";

//get user
import { QUERY_SEARCH } from "../../utils/queries";

//import auth
import Auth from "../../utils/auth";

const Home = () => {
  const { onAddToCart } = useCart();
  const [input, setInput] = useState("");
  //create state to hold the generated name
  const [artName, setArtName] = useState("");
  // create state to hold generated price
  const [price, setPrice] = useState("");
  // create state to hold generated image
  const [imageUrl, setImageUrl] = useState("");
  //get the current user's data

  const { data } = useQuery(QUERY_SEARCH);
  const userData = data?.recentArt || {};

  const [saveArtwork] = useMutation(SAVE_ARTWORK);
  const [addProduct] = useMutation(SAVE_PRODUCT);
  const [addFavourite] = useMutation(ADD_FAVOURITE);
  const onInputChange = (event) => {
    setInput(event.target.value);
    const inputWords = input.trim().split(/\s+/).length;
    setPrice(inputWords * 10);
  };

  const onButtonSubmit = () => {
    //generate a random adjective or noun
    const adjectives = [
      "mystical",
      "whimsical",
      "ethereal",
      "dreamy",
      "cosmic",
    ];
    const nouns = ["garden", "forest", "ocean", "mountain", "cloud"];
    const randomIndex = Math.floor(Math.random() * 5);
    const randomWord =
      Math.random() < 0.5 ? adjectives[randomIndex] : nouns[randomIndex];

    const newArtName = `${randomWord} ${input}`;
    axios

      .post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "image-alpha-001",
          prompt: `generate an image of ${input}`,
          num_images: 1,
          size: "512x512",
          response_format: "url",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      )
      .then((response) => {
        const newImageURL = response.data.data[0].url;
        const formData = new FormData();
        formData.append("file", newImageURL);
        formData.append("upload_preset", "ai-commerce");
        axios
          .post(
            "https://api.cloudinary.com/v1_1/dejnb8hlo/image/upload",
            formData
          )
          .then((response) => {
            const cloudinaryURl = response.data.secure_url;
            setImageUrl(cloudinaryURl);
            setArtName(newArtName);

            if (Auth.loggedIn()) {
              try {
                const data = saveArtwork({
                  variables: {
                    productName: newArtName,
                    imageUrl: cloudinaryURl,
                    price: price,
                  },
                });
              } catch (err) {
                console.error(err);
              }
            }
          });
      })
      .catch((err) => console.log(err));
  };

  const onAddFavourite = async (productName) => {
    try {
      const { data } = await addFavourite({
        variables: { productName },
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setArtName("");
  }, [input]);
  return (
    <>
      <div className="home-container">
        <div className="left-section">
          <h2 className="search-h">Search for art you want to see!</h2>
          <div className="search-containter">
            <input className="inputSearch" type="text" onChange={onInputChange} placeholder="Search" />
            <button className="searchButton" onClick={onButtonSubmit}>
              <FaSearch className="w-6 h-6 text-gray-400 search-icon" />
            </button>
          </div>
          <div className="searchedImage">
          {imageUrl && <img src={imageUrl} alt={artName} />}
          {artName && (
            <>
              <p>{artName}</p>
              <p>Price: ${price}</p>
            </>
          )}
          </div>
          <div className="cartButton">
          <button className="cartButton" onClick={onAddToCart}>Add to Cart</button>
          </div>
        </div>
        <div className="right-section">
          <h2 className="right-h">Your Recent Artwork!</h2>
        <div className="recent-img">
        {userData?.recentArt?.map((art, index) => (
          <ProductCard
            key={art.productName}
            {...art}
            onAddToCart={() => onAddToCart(art)}
          />
        ))}
        </div>
        </div>
      </div>

      <div>
        <h3 className="carousel-h">Browse Arty Intelligence's Maskarade Masterpieces!</h3>
      </div>
    <div className="carousel-container">
      <Carousel
      showStatus={false}
      showArrows={true}
      showThumbs={false}
      infiniteLoop={true}
      showIndicators={false}
      slidesToShow={3}>

          <div className="carousel">
            <img className="carousel-img" src="../assets/images/4.webp" />
            <div className="legend-section">
            <p className="price">{artName}${price}</p>
            <button className="cartButton" onClick={onAddToCart}>Add to Cart</button>
            </div>
          </div>
          <div className="carousel">
            <img className="carousel-img" src="../assets/images/5.webp" />
            <p className="price">{artName}${price}</p>
            <button className="cartButton" onClick={onAddToCart}>Add to Cart</button>
          </div>
          <div className="carousel">
            <img className="carousel-img" src="../assets/images/6.webp" />
            <p className="price">{artName}${price}</p>
            <button className="cartButton" onClick={onAddToCart}>Add to Cart</button>
          </div>
        </Carousel>
        </div>

        <div>
        <br /> {/* Add a page break here */}
        <GalleryGrid />
      </div>

      <div className="w-25 border m-2 p-5">
        {userData?.recentArt?.map((art, index) => (
          <ProductCard
            key={art.productName}
            {...art}
            onAddToCart={() => onAddToCart(art)}
            onAddFavourite={() => onAddFavourite(art.productName)}
          />
        ))}
      </div>

      <div></div>
    </>
  );
};

export default Home;
