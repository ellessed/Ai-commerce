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
    <form onSubmit={handlePayment} className="payment-form">
      <CardNumberElement />
      <CardExpiryElement />
      <CardCvcElement />
      <button>Confirm Payment</button>
    </form>
  );
};

export default Checkout;
