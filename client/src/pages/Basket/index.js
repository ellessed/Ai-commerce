// UI Components
import BasketCard from '../components/BasketCard'
import CheckoutLinks from '../components/CheckoutLinks'

// Shopping Cart
import { useCart } from '../context/CartContext'

const Basket = () => {
  
  const { cartItems, onRemoveFromCart } = useCart()

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  
  return (
    <>
      <div className='w-75 border m-2 p-5'>
        <div className='section-title'>
          {cartItems.map(product => (
            <BasketCard key={product.title} {...product} onRemoveFromCart={()=>onRemoveFromCart(product)} />
          ))}
        </div>
      </div>  
      <div className='w-25 border m-2 p-5'>
        <div className='section-title'>
            Checkout Options
        </div>
        <CheckoutLinks total={total} />
      </div>
    </>
  )
}

export default Basket