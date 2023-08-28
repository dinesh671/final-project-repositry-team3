import { useState, useEffect } from 'react';
import { Form, Button, Col ,Row} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling
import { Country, State, City } from 'country-state-city';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [state, setState] = useState(shippingAddress.state || '');
  

  const [statesForSelectedCountry, setStatesForSelectedCountry] = useState([]);
  const [citiesForSelectedState, setCitiesForSelectedState] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (country) {
      const selectedCountryIsoCodeData = Country.getAllCountries().find(
        (c) => c.name === country
      );

      if (selectedCountryIsoCodeData) {
        const selectedCountryIsoCode = selectedCountryIsoCodeData.isoCode;
        const states = State.getStatesOfCountry(selectedCountryIsoCode);
        setStatesForSelectedCountry(states);
      }
    }
  }, [country]);

  useEffect(() => {
    if (country && state) {
      const selectedCountryIsoCodeData = Country.getAllCountries().find(
        (c) => c.name === country
      );

      if (selectedCountryIsoCodeData) {
        const selectedCountryIsoCode = selectedCountryIsoCodeData.isoCode;
        const selectedStateIsoCodeData = State.getStatesOfCountry(selectedCountryIsoCode).find(
          (s) => s.name === state
        );

        if (selectedStateIsoCodeData) {
          const selectedStateIsoCode = selectedStateIsoCodeData.isoCode;
          const cities = City.getCitiesOfState(selectedCountryIsoCode, selectedStateIsoCode);
          setCitiesForSelectedState(cities);
        }
      }
    }
  }, [country, state]);

  
  
const submitHandler = (e) => {
    e.preventDefault();

    // Basic validation checks
    if (!address || !city || !postalCode || !country || !state) {
      // Display an error message or handle the validation error
      toast.error('Please fill in all required fields.');
      return;
    }

    // Postal code validation
    const postalCodePattern = /^\d{6}$/; // Six digits pattern
    if (!postalCodePattern.test(postalCode)) {
      // Display an error message or handle the postal code validation error
      toast.error('Invalid postal code format.');
      return;
    }

    // Check if the country is valid
    const selectedCountryIsoCodeData = Country.getAllCountries().find((c) => c.name === country);
    const validCountries = Country.getAllCountries().map((country) => country.name);
    // console.log('country', validCountries);
      if (!validCountries.includes(country)) {
      toast.error('Selected country is not available.');
      return;
    }

    const selectedCountryIsoCode = selectedCountryIsoCodeData.isoCode;

    // Check if the state is valid
    const statesForSelectedCountry = State.getStatesOfCountry(selectedCountryIsoCode);
    // console.log('state', statesForSelectedCountry);
    const selectedStateIsoCodeData = State.getStatesOfCountry(selectedCountryIsoCode).find((s) => s.name === state);
    const validStateNames = statesForSelectedCountry.map((state) => state.name);
    if (!validStateNames.includes(state)) {
      toast.error('Selected state is not valid.');
      return;
    }
    const selectedStateIsoCode = selectedStateIsoCodeData.isoCode;

    // Check if the city is valid
    const citiesForSelectedState = City.getCitiesOfState(selectedCountryIsoCode, selectedStateIsoCode);
    const validCityNames = citiesForSelectedState.map((city) => city.name);
    // console.log('city', citiesForSelectedState);
    if (!validCityNames.includes(city)) {
      toast.error('Selected city is not available.');
      return;
    }

  

    // Fetch related data based on postal code using an API call
    fetch(`https://api.postalpincode.in/pincode/${postalCode}`)
      .then(response => response.json())
      .then(data => {
        if (data[0]?.Status === 'Success') {
          const validPostalCodes = data[0]?.PostOffice?.map(postOffice => postOffice.Pincode);
          if (!validPostalCodes.includes(postalCode)) {
            toast.error('Invalid postal code for India.');
            return;
          }
        } else {
          toast.error('Invalid postal code for India.');
          return;
        }

        // Continue with saving shipping address and navigating
        dispatch(saveShippingAddress({ address, city, postalCode, country, state }));
        navigate('/payment');
      })
      .catch(error => {
        toast.error('Error fetching postal code data.');
      });
  };

 


  return (
    <>
    <CheckoutSteps step1 step2 />
    <Row>
    <Col md={6}> 
  <img
    src="https://tapita.io/wp-content/uploads/2022/12/dropshipping-model.png"
    alt="image not found"
    style={{ width: '100%', height: '90%', marginTop:40 }}
  />
</Col>
    <Col md={6}>
    
    
     
    <h1 className="text-center">Shipping</h1>
    <Form onSubmit={submitHandler}>
      <Form.Group className='my-2' controlId='country'>
        <Form.Label>Country</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter country'
          value={country}
          onChange={(e) => setCountry(e.target.value.replace(/[^A-Za-z\s]/gi, ''))}
          list='countryList'
        />
      </Form.Group>

      <Form.Group className='my-2' controlId='state'>
        <Form.Label>State</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter state'
          value={state}
          onChange={(e) => setState(e.target.value.replace(/[^A-Za-z\s]/gi, ''))}
          list='stateList'
        />
        <datalist id='stateList'>
          {statesForSelectedCountry.map((state) => (
            <option key={state.isoCode} value={state.name} />
          ))}
        </datalist>
      </Form.Group>

      <Form.Group className='my-2' controlId='city'>
        <Form.Label>City</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter city'
          value={city}
          onChange={(e) => setCity(e.target.value.replace(/[^A-Za-z\s]/gi, ''))}
          list='cityList'
        />
        <datalist id='cityList'>
          {citiesForSelectedState.map((city) => (
            <option key={city.name} value={city.name} />
          ))}
        </datalist>
      </Form.Group>

      <Form.Group className='my-2' controlId='postalCode'>
        <Form.Label>Postal Code</Form.Label>
        <Form.Control
          type='number'
          placeholder='Enter postal code'
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.replace(/[^0-9]/g, ''))}
        />
      </Form.Group>

      <Form.Group className='my-2' controlId='address'>
        <Form.Label>Address</Form.Label>
        <Form.Control
          type='text'
          placeholder='Enter address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>

      <Button type='submit' variant='primary'>
        Continue
      </Button>
    </Form>
   
     
        
  
  </Col>
  </Row>
  </>
  );
};


export default ShippingScreen;
