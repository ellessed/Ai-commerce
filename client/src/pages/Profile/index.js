import React from "react";
import { Navigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";

import { QUERY_USER, QUERY_ME } from "../../utils/queries";

import Auth from "../../utils/auth";

const Profile = (props) => {
  const { username: userParam } = props;
  console.log(props);
  const { onAddToCart } = useCart();

  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  console.log(user);

  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
          Viewing {user.username}'s profile.
        </h2>

        <div className="col-12 col-md-10 mb-5"></div>
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: "1px dotted #1a1a1a" }}
        ></div>
        {user?.favourites?.map((fav, index) => (
          <ProductCard
            key={fav.productId._id}
            productName={fav.productId.productName}
            price={fav.productId.price}
            imageUrl={fav.productId.imageUrl}
            _id={fav.productId._id}
            onAddToCart={() => onAddToCart(fav.productId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
