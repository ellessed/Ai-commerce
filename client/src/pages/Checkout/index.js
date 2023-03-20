import React from "react";
import { useCart } from "../../context/CartContext";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { useMutation } from "@apollo/client";
import { CHECKOUT } from "../../utils/mutations";
import "./checkout.css";

const Checkout = () => {
  const { cartItems } = useCart();
  const [checkout, { error, data }] = useMutation(CHECKOUT);

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await checkout({
        variables: { amount: total },
      });

      // data.checkout.id;

      const confirmPayment = await stripe.confirmCardPayment(
        data.checkout.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
          },
        }
      );

      if ("error" in confirmPayment) {
        console.log(confirmPayment.error);
        return;
      }

      if (confirmPayment.paymentIntent.status === "succeeded") {
        console.log("Payment Confirmed");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="checkout-page">
      <form onSubmit={handlePayment} className="payment-form">
        <div className="form-group">
          <label> Card Number</label>
          <div
            className="form-control"
            style={{ height: "2.4em", paddingTop: ".7em" }}
          >
            <CardNumberElement />
          </div>
        </div>
        <div className="form-group">
          <label>Expire Date</label>
          <div
            className="form-control"
            style={{ height: "2.4em", paddingTop: ".7em" }}
          >
            <CardExpiryElement />
          </div>
        </div>
        <div className="form-group">
          <label> CVC</label>
          <div
            className="form-control"
            style={{ height: "2.4em", paddingTop: ".7em" }}
          >
            <CardCvcElement />
          </div>
        </div>

        <button>Confirm Payment</button>
      </form>

      <ol className="checkout_products">
        {cartItems.map((item) => {
          return (
            <li key={item.title}>
              <img src={item.imageUrl} alt="" />
              <div>
                <h4>{item.title}</h4>
                <p>${item.price}</p>
              </div>
            </li>
          );
        })}
        <li className="total">
          <h4>Total</h4> <p>${total}</p>
        </li>
      </ol>
    </div>
  );
};

export default Checkout;
