// UI Components
import ProductCard from '../components/ProductCard'
import CategoriesLinks from '../components/CategoriesLinks'

import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_PRODUCT } from '../utils/queries';

// Shopping Cart
import { useCart } from '../context/CartContext'

const Product = () => {

  const { onAddToCart } = useCart()

  const params = useParams();
  const { productId } = useParams();

  console.log('params: ', params)

  const { loading, data } = useQuery(QUERY_SINGLE_PRODUCT, {
    // pass URL parameter
    variables: { productId: productId },
  });

  const product = data?.product || {};
  const productTitle = loading ? 'Loading Product...' : data?.product.title;
  console.log(`Product: products = ${data}`)

  return (
    <>
      <div className='p-5 m-2 border w-75'>
        <h1>{productTitle}</h1>
        <div className='section-title'>

          <ProductCard key={product.title} {...product} onAddToCart={() => onAddToCart(product)} />

        </div>
      </div>
      <div className='p-5 m-2 border w-25'>
        <div className='section-title'>
          Browse the Shop
        </div>
        <CategoriesLinks />
      </div>
    </>
  )
}

export default Product