// UI Components
import ProductCard from '../components/ProductCard'
import CategoriesLinks from '../components/CategoriesLinks'

import { useQuery } from '@apollo/client';
import { QUERY_FEATURED_PRODUCTS } from '../utils/queries';

// Shopping Cart
import { useCart } from '../context/CartContext'

const Home = () => {
  
  const { onAddToCart } = useCart()

  const { loading, data } = useQuery(QUERY_FEATURED_PRODUCTS);
  const products = data?.products || [];

  return (
    <>
      <div className='w-75 border m-2 p-5'>
        <div className='section-title'>
          {products.map(product => (
            <ProductCard key={product.title} {...product} onAddToCart={()=>onAddToCart(product)} />
          ))}
        </div>
      </div>  
      <div className='w-25 border m-2 p-5'>
        <div className='section-title'>
            Browse the Shop
        </div>
        <CategoriesLinks />
      </div>
    </>
  )
}

export default Home