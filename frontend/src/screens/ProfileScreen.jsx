import { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTimes, FaMinus } from 'react-icons/fa';

import { setCredentials } from '../slices/authSlice';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { CURRENCY } from '../constants';

const ProfileScreen = () => {
    const pageSize = 10;
    const { pageNumber } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);
    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
    const { data, isLoading, error } = useGetMyOrdersQuery({ pageSize, pageNumber });

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
            setPhoneNumber(userInfo.phoneNumber);
        }
    }, [userInfo, userInfo.name, userInfo.email, userInfo.phoneNumber]);

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
                    phoneNumber,
                    password
                }).unwrap();

                dispatch(setCredentials(res));
                toast.success('Profile updated successfully');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <Meta title='Profile' />
            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email' className='my-2'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email address'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='phoneNumber' className='my-2'>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter phone number'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='password' className='my-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='confirmPassword' className='my-2'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary' className='my-2'>
                            Update
                        </Button>
                        { loadingUpdateProfile && <Loader />}
                    </Form>
                </Col>
                <Col md={9}>
                    <h2>My Orders</h2>
                    {
                        isLoading ? <Loader /> :
                        error ?
                        (
                            <Message variant='danger'>
                                {error?.data?.message || error.error}
                            </Message>
                        ) :
                        (
                            <>
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>DATE</th>
                                            <th>TOTAL ({CURRENCY})</th>
                                            {/* <th>PAID</th> */}
                                            <th>DELIVERED</th>
                                            <th>CANCELED</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data.orders.map((order) => (
                                                <tr key={order._id}>
                                                    <td>{order._id}</td>
                                                    <td>{order.createdAt.substring(0, 10)}</td>
                                                    <td>{order.totalPrice}</td>
                                                    {/* <td>
                                                        {
                                                            order.isPaid ?
                                                            order.paidAt.substring(0, 10) :
                                                            <FaTimes style={{ color: 'red' }} />
                                                        }
                                                    </td> */}
                                                    <td>
                                                        {
                                                            order.isDelivered ?
                                                            order.deliveredAt.substring(0, 10) :
                                                            !order.isCanceled ?
                                                            <FaTimes style={{ color: 'red' }} /> :
                                                            <FaMinus />
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            order.isCanceled ?
                                                            order.canceledAt.substring(0, 10) :
                                                            !order.isDelivered ?
                                                            <FaTimes style={{ color: 'red' }} /> :
                                                            <FaMinus />
                                                        }
                                                    </td>
                                                    <td>
                                                        <LinkContainer to={`/order/${order._id}`}>
                                                            <Button className='btn-sm' variant='light'>
                                                                Details
                                                            </Button>
                                                        </LinkContainer>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
                                <Paginate
                                    pages={data.pages}
                                    page={data.page}
                                    route='/profile'
                                />
                            </>
                        )
                    }
                </Col>
            </Row>
        </>
    );
};

export default ProfileScreen;