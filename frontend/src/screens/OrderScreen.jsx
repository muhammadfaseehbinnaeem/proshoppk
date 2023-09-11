import { Link, useParams } from 'react-router-dom';
import { Row, Col, Button, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Message from '../components/Message';
import Loader from '../components/Loader';
import {
    useGetOrderDetailsQuery,
    useDeliverOrderMutation,
    // usePayOrderMutation,
    useCancelOrderMutation
} from '../slices/ordersApiSlice';
import { CURRENCY } from '../constants';
import whatsappIcon from '../assets/icons/whatsapp.png';
import gmailIcon from '../assets/icons/gmail.png';
import Meta from '../components/Meta';

const OrderScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { id: orderId } = useParams();
    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
    // const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();

    //  Test Pay Order Handler //
    // const testPayOrderHandler = async () => {
    //     await payOrder({ orderId, details: { payer: {} } });
    //     refetch();

    //     toast.success('Order paid successfully');
    // };

    const deliverHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order delivered successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    };

    const cancelHandler = async () => {
        try {
            await cancelOrder(orderId);
            refetch();
            toast.success('Order canceled successfully');
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    };

    return (
        isLoading ? <Loader /> :
        error ? <Message variant='danger'>{error}</Message> :
        (
            <>
                <Meta title={`Order ${orderId}`} />
                <h1>Order {orderId}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>{order.user.name}
                                </p>
                                <p>
                                    <strong>Email: </strong>{order.user.email}
                                </p>
                                <p>
                                    <strong>Phone Number: </strong>{order.user.phoneNumber}
                                </p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address},{' '}
                                    {order.shippingAddress.city}{' '}
                                    {order.shippingAddress.postalCode},{' '}
                                    {order.shippingAddress.country}
                                </p>
                                {
                                    order.isDelivered ?
                                    (
                                        <Message variant='success'>
                                            Delivered on {order.deliveredAt}
                                        </Message>
                                    ) :
                                    (
                                        <Message variant='danger'>
                                            Not Delivered
                                        </Message>
                                    )
                                }
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {
                                        order.paymentMethod === 'COD' ?
                                        'Cash on Delivery' : order.paymentMethod
                                    }
                                </p>
                                {/* {
                                    order.isPaid ?
                                    (
                                        <Message variant='success'>
                                            Paid on {order.paidAt}
                                        </Message>
                                    ) :
                                    (
                                        <Message variant='danger'>
                                            Not Paid
                                        </Message>
                                    )
                                } */}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {
                                    order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x {CURRENCY}{item.price} = {CURRENCY}{item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items:</Col>
                                        <Col>{CURRENCY}{order.itemsPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Shipping:</Col>
                                        <Col>{CURRENCY}{order.shippingPrice}</Col>
                                    </Row>
                                    <Row>
                                        <Col>Total:</Col>
                                        <Col>{CURRENCY}{order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                
                                {/* CHECKOUT PLACEHOLDER */}

                                {/* Test Pay Order  */}
                                {/* {                           
                                    !order.isPaid && paymentMethod === 'Advance' && (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            <div>
                                                <Button
                                                    style={{ marginBottom: '10px' }}
                                                    onClick={testPayOrderHandler}
                                                >
                                                    Test Pay Order
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                } */}

                                {loadingDeliver && <Loader />}
                                {loadingCancel && <Loader />}
                                {
                                    (
                                        (
                                            userInfo &&
                                            userInfo.isAdmin &&
                                            !order.isDelivered
                                        ) ||
                                        order.isCanceled
                                    ) &&
                                    (
                                        <ListGroup.Item>
                                            {
                                                order.isCanceled &&
                                                (
                                                    <Message variant='danger'>
                                                        Canceled on {order.canceledAt}
                                                    </Message>
                                                )
                                            }
                                            {
                                                userInfo &&
                                                userInfo.isAdmin &&
                                                // order.isPaid &&
                                                !order.isDelivered &&
                                                !order.isCanceled &&
                                                (
                                                    <Button
                                                        type='button'
                                                        className='btn btn-block my-1'
                                                        style={{ width: '10rem' }}
                                                        onClick={deliverHandler}
                                                    >
                                                        Mark as Delivered
                                                    </Button>
                                                )
                                            }
                                            {
                                                userInfo &&
                                                userInfo.isAdmin &&
                                                // !order.isPaid &&
                                                !order.isDelivered &&
                                                !order.isCanceled &&
                                                (
                                                    <Button
                                                        type='button'
                                                        style={{ width: '10rem' }}
                                                        className='btn btn-block my-1'
                                                        onClick={cancelHandler}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )
                                            }
                                        </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                        </Card>
                        {
                            userInfo && !userInfo.isAdmin &&
                            (
                                <Card className='mt-5'>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <strong>For queries and information about your order, contact us at:</strong>
                                            <Link
                                                to={`whatsapp://send?phone=${encodeURIComponent('923043332199')}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='d-flex mt-2'
                                            >
                                                    <img
                                                        src={whatsappIcon}
                                                        alt="WhatsApp Icon"
                                                        className="whatsapp-icon"
                                                    />
                                                    <strong>+92-304-3332199</strong>
                                            </Link>
                                            <Link
                                                to='mailto:contactproshoppk@gmail.com'
                                                className='d-flex mt-1'
                                            >
                                                    <img
                                                        src={gmailIcon}
                                                        alt="WhatsApp Icon"
                                                        className="gmail-icon"
                                                    />
                                                    <strong>contactproshoppk@gmail.com</strong>
                                            </Link>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            )
                        }
                    </Col>
                </Row>
            </>
        )
    );
};

export default OrderScreen;