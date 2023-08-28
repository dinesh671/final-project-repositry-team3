import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCarousel from './components/ProductCarousel';


const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isHomeScreen = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (expirationTime) {
      const currentTime = new Date().getTime();

      if (currentTime > expirationTime) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <>

      <ToastContainer />
        <Header />
        {isHomeScreen && <ProductCarousel />}
        <main className='py-3'>
          <Container>
            <Outlet />
          </Container>
          
          <ToastContainer/>
         
        </main>
        <Footer />
    </>
  );
};

export default App;
