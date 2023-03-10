// UI Components
import ProductCard from "../../components/ProductCard";
import CategoriesLinks from "../../components/CategoriesLinks";
import React, { useEffect, useState } from "react";
import axios from "axios";

// import { useQuery } from "@apollo/client";
// import { QUERY_FEATURED_PRODUCTS } from "../../utils/queries";

// Shopping Cart
import { useCart } from "../../context/CartContext";

import { FaSearch } from "react-icons/fa";
//save artwork mutation
import { SAVE_ARTWORK } from "../../utils/mutations";
import { useQuery, useMutation } from "@apollo/client";

//get user
import { QUERY_ME } from "../../utils/queries";

//import auth
import Auth from "../../utils/auth";

const Home = () => {
  const { onAddToCart } = useCart();
  const [input, setInput] = useState("");
  //create state for holding the generated name
  const [artName, setArtName] = useState("");
  // create state for holding generated price
  const [price, setPrice] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  //get the current user's data
  const { data } = useQuery(QUERY_ME);
  const userData = data?.me || {};

  const [saveArtwork] = useMutation(SAVE_ARTWORK);
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
        const artData = {
          productName: newArtName,
          imageUrl: newImageURL,
          price: price,
        };
        setImageUrl(newImageURL);
        setArtName(newArtName);
        setInput("");
        if (Auth.loggedIn()) {
          try {
            const { data } = saveArtwork({
              variables: { artData: { ...artData } },
            });
          } catch (err) {
            console.error(err);
          }
        }
      })
      .catch((err) => console.log(err));

  };
  useEffect(() => {
    setArtName("");
  }, [input]);
  return (
    <>
      <div className="w-75 border m-2 p-5">
        <div className="section-title">
          <h2>Search for the art you want to see!</h2>
          <div className="relative w-64">
            <input type="text" onChange={onInputChange} placeholder="Search" />
            <button onClick={onButtonSubmit}>
              <FaSearch className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          {imageUrl && <img src={imageUrl} alt="input to image" />}
          {artName && (
            <>
              <p>{artName}</p>
              <p>Price: ${price}</p>
            </>
          )}
          <button onClick={onAddToCart}>Add to Cart</button>
        </div>
      </div>
      <div className="w-25 border m-2 p-5">
        {userData?.recentArt?.map((art, index) => (
          <div key={index}>
            <img src={art.imageUrl} alt={`generated ${art.productName}`} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
