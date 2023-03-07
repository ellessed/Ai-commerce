import { Link } from 'react-router-dom';

const CheckoutLinks = ({total}) => {

  return (
    <div>
      <div className='category-link p-5 m-3'>
        {total > 0 ? (
          <>Total: £{total}</>
          ): (
            <>Your cart is empty</>
          )}
        </div>
        <div className='category-link border p-5 m-3 btn-primary'>
          <Link to="/checkout">Checkout</Link>
        </div>
        <div className='category-link border p-5 m-3'>
          <Link to="/">Continue Shopping</Link>
        </div>
    </div>
  )
}

export default CheckoutLinks
