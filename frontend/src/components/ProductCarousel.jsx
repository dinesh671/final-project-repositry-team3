import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='mb-4 rounded-4' style={{ maxWidth: '75%', margin: '0 auto' }}>
      {products.map((product) => (
        <Carousel.Item key={product._id} className='rounded-4'>
          <Link to={`/product/${product._id}`} style={{ display: 'flex', justifyContent: 'center' }}>
            <Image src={product.image_c1} alt={product.name} className='rounded-4' fluid width='100%' />
            <Carousel.Caption className='carousel-caption text-center p-3'> 
              <h2 className='text-white fs-6 m-0'> 
                {product.name} (&#8377;{product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};





export default ProductCarousel;
