import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  Row,
  Col,
  Form,
  Button,
  Table,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setAddress1(userInfo.address1);
    setAddress2(userInfo.address2);
    setPhonenumber(userInfo.phonenumber);
  }, [
    userInfo.email,
    userInfo.name,
    userInfo.address1,
    userInfo.address2,
    userInfo.phonenumber,
  ]);

  const dispatch = useDispatch();

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleEditAddress = (field) => {
    if (field === 'address1') {
      setAddress1EditMode(true);
    } else if (field === 'address2') {
      setAddress2EditMode(true);
    }
  };

  const handleSaveAddress = async (field) => {
    if (field === 'address1') {
      setAddress1EditMode(false);
    } else if (field === 'address2') {
      setAddress2EditMode(false);
    }
  };

  const [isEditingAddress1, setAddress1EditMode] = useState(false);
  const [isEditingAddress2, setAddress2EditMode] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
          address1,
          address2,
          phonenumber,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row className='justify-content-center'>
      <h2 className='mb-4'>
        <b>Hi {userInfo.name}</b>,
      </h2>
      <Col md={8}>
        <Tabs
          defaultActiveKey='profile'
          id='profile-orders-tabs'
          className='mb-3'
        >
          <Tab eventKey='profile' title='Profile'>
            <h3>
              <b>Profile</b>
            </h3>
            <Form onSubmit={submitHandler}>
              <Form.Group className='my-2' controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className='my-2' controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>

              <Form.Group className='my-2' controlId='address1'>
                <Form.Label>Home Address</Form.Label>
                {isEditingAddress1 ? (
                  <>
                    <Form.Control
                      type='text'
                      as='textarea'
                      placeholder='Enter Home Address'
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                    <Button
                      variant='success'
                      className='mt-1'
                      onClick={() => handleSaveAddress('address1')}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Form.Control type='text' value={userInfo.address1} readOnly />
                    <Button variant='light' className='btn-sm my-2'>
                      <FaEdit />
                    </Button>
                  </>
                )}
              </Form.Group>

              <Form.Group className='my-2' controlId='address2'>
                <Form.Label>Office Address</Form.Label>
                {isEditingAddress2 ? (
                  <>
                    <Form.Control
                      type='text'
                      as='textarea'
                      placeholder='Enter Office Address'
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                    <Button
                      variant='success'
                      onClick={() => handleSaveAddress('address2')}
                      className='mt-1'
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Form.Control type='text' value={address2} readOnly />
                    <Button variant='light' className='btn-sm my-2'>
                      <FaEdit />
                    </Button>
                  </>
                )}
              </Form.Group>

              <Form.Group className='my-2' controlId='Phonenumber'>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Phone Number'
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                />
              </Form.Group>

              <Button type='submit' variant='primary'>
                Update
              </Button>
              {loadingUpdateProfile && <Loader />}
            </Form>
          </Tab>
          {!userInfo.isAdmin && (
            <Tab eventKey='orders' title='Orders' disabled={userInfo.isAdmin}>
              <Row>
                <Col>
                  <h2>My Orders</h2>
                  {isLoading ? (
                    <Loader />
                  ) : error ? (
                    <Message variant='danger'>
                      {error?.data?.message || error.error}
                    </Message>
                  ) : (
                    <Table striped hover responsive className='table-sm'>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>DATE</th>
                          <th>TOTAL</th>
                          <th>PAID</th>
                          <th>DELIVERED</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order._id}>
                            {/* <td>
                            <Image
                              src={order.image}
                              alt={order.name}
                              width={50}
                              height={50}
                              fluid
                              rounded
                            />
                          </td> */}
                            <td>{order._id}</td>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td>{order.totalPrice}</td>
                            <td>
                              {order.isPaid ? (
                                order.paidAt.substring(0, 10)
                              ) : (
                                <FaTimes style={{ color: 'red' }} />
                              )}
                            </td>
                            <td>
                              {order.isDelivered ? (
                                order.deliveredAt.substring(0, 10)
                              ) : (
                                <FaTimes style={{ color: 'red' }} />
                              )}
                            </td>
                            <td>
                              <LinkContainer to={`/order/${order._id}`}>
                                <Button className='btn-sm' variant='light'>
                                  Details
                                </Button>
                              </LinkContainer>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
            </Tab>
          )}
        </Tabs>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
