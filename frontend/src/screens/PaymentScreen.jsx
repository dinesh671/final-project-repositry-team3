import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='PayPal or Credit Card'
              id='PayPal'
              name='paymentMethod'
              value='PayPal'
              checked={paymentMethod === 'PayPal'}
              onChange={() => setPaymentMethod('PayPal')}
            ></Form.Check>

            <Form.Check
              className='my-2'
              type='radio'
              label='Debit Card'
              id='DebitCard'
              name='paymentMethod'
              value='CreditCard'
              checked={paymentMethod === 'CreditCard'}
              onChange={() => setPaymentMethod('CreditCard')}
            ></Form.Check>

            <Form.Check
              className='my-2'
              type='radio'
              label='Paytm'
              id='Paytm'
              name='paymentMethod'
              value='Paytm'
              checked={paymentMethod === 'Paytm'}
              onChange={() => setPaymentMethod('Paytm')}
            ></Form.Check>

            <Form.Check
              className='my-2'
              type='radio'
              label='Google Pay (GPay)'
              id='GooglePay'
              name='paymentMethod'
              value='GooglePay'
              checked={paymentMethod === 'GooglePay'}
              onChange={() => setPaymentMethod('GooglePay')}
            ></Form.Check>

            <Form.Check
              className='my-2'
              type='radio'
              label='UPI'
              id='UPI'
              name='paymentMethod'
              value='UPI'
              checked={paymentMethod === 'UPI'}
              onChange={() => setPaymentMethod('UPI')}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
