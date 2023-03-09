import { Link } from 'react-router-dom';

const BasketCard = ( props ) => {

    const {title, description, image, price, _id, onRemoveFromCart} = props;

  return (
    <div className='border p-5 m-2 flex'>
        <div>
            <img src={`/assets/${image}`} alt={title} className='product-image p-5' />
        </div>
        <div className='product-details'>
            <Link to={`/product/${_id}`}>{title}</Link>
            <div className='product-description'>
                <p className='text-sm'>{description}</p>
            </div>
            <div className='product-price'>
            <p className='text-lg mr-5'>£{price}</p>
                <button className='btn btn-primary' onClick={onRemoveFromCart}>Remove from Cart</button>
            </div>
        </div>
    </div>
 )
}

export default BasketCard
