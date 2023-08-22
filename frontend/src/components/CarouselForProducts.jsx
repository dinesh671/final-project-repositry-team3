import { Link ,useParams} from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';

const ProductCarouselProducts = () => {
    const { id: productId } = useParams();
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  return isLoading ? null : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause='hover' className='mb-4 rounded-4' style={{ maxWidth: '75%', margin: '0 auto' }}>
      
        <Carousel.Item  >
          
            <Image src={product.image_c1} alt={product.name}  fluid width='100%' />
            
         
        </Carousel.Item>

        <Carousel.Item  >
          
          <Image src={product.image_c2} alt={product.name}  fluid width='100%' />
          
       
      </Carousel.Item>
      <Carousel.Item  >
          
          <Image src={product.image_c3} alt={product.name}  fluid width='100%' />
          
       
      </Carousel.Item>
    
    </Carousel>
  );
};





export default ProductCarouselProducts;
