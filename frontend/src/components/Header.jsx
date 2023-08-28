import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaRegUserCircle } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Cart from '../assets/cart.svg';

import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // NOTE: here we need to reset cart state for when a user logs out so the next
      // user doesn't inherit the previous users cart and shipping
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <header className='sticky'>
      <Navbar expand='lg' className='w-10 ' collapseOnSelect>
        <Container>
          {isAuthPage && (
            <LinkContainer to='/'>
              <Navbar.Brand>
                <h2>
                  <b>DropShip.</b>
                </h2>
              </Navbar.Brand>
            </LinkContainer>
          )}
          {isAuthPage ? null : (
            <>
              <LinkContainer to='/'>
                <Navbar.Brand>
                  <h2>
                    <b>DropShip.</b>
                  </h2>
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <Nav className='ms-auto d-flex align-items-center'>
                  <SearchBox />
                  <LinkContainer to='/cart' variant='light' className='mx-3 '>
                    <Nav.Link className='position-relative'>
                      <div className='btn-light btn p-2 rounded-circle'>
                        <AiOutlineShoppingCart className='cart-btn d-flex align-items-center justify-content-center rounded-circle' />
                      </div>

                      <Badge
                        bg='dark'
                        style={{ right: '1px' }}
                        className='qty position-absolute rounded-circle text-white'
                      >
                        <b> {0 || cartItems.reduce((a, c) => a + c.qty, 0)}</b>
                      </Badge>
                    </Nav.Link>
                  </LinkContainer>
                  {userInfo ? (
                    <>
                      <NavDropdown
                        title={
                          <div className='btn-light btn p-2 rounded-circle'>
                            <FaRegUserCircle
                              variant='light'
                              className='profile-btn btn-light d-flex align-items-center justify-content-center rounded-circle'
                            />
                          </div>
                        }
                        id='username'
                      >
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>Profile</NavDropdown.Item>
                        </LinkContainer>
                        {userInfo && userInfo.isAdmin && (
                          <>
                            <LinkContainer to='/admin/productlist'>
                              <NavDropdown.Item>Products</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/orderlist'>
                              <NavDropdown.Item>Orders</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/userlist'>
                              <NavDropdown.Item>Users</NavDropdown.Item>
                            </LinkContainer>
                          </>
                        )}
                        <NavDropdown.Item onClick={logoutHandler}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  ) : (
                    <LinkContainer to='/login'>
                      <Nav.Link>
                        <div className='btn-light btn p-2 rounded-circle'>
                          <FaRegUserCircle
                            variant='light'
                            className='profile-btn d-flex align-items-center justify-content-center rounded-circle'
                          />
                        </div>
                      </Nav.Link>
                    </LinkContainer>
                  )}

                  {/* Admin Links */}
                  {/* {userInfo && userInfo.isAdmin && (
                    <NavDropdown title='Admin' id='adminmenu'>
                      <LinkContainer to='/admin/productlist'>
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )} */}
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
