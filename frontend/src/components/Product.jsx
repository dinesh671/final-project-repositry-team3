import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { addToCart } from '../slices/cartSlice';
import { useDispatch } from 'react-redux';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = ({ product }) => {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    // navigate('/cart');
    toast.success('Item added to cart successfully');
  };
  return (
    <Card variant='light' className='my-3 p-0 border-0 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' className='card-img ' style={{ maxWidth: '80%' }} />
      </Link>
      
      <Card.Body >
        <Link to={`/product/${product._id}`} className='card-title' >
          <Card.Title as='div' className='product-title'>
            {product.name}
          </Card.Title>
        </Link>

        <Card.Text as='div' >
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text className='product-price'>&#8377;{product.price}</Card.Text>
        <Button

          className='btn-block bg-dark'
          type='button'
          disabled={product.countInStock === 0}
          onClick={addToCartHandler}
        >
          Add To Cart
        </Button>
                    

      </Card.Body>
    </Card>
  );
};

export default Product;
