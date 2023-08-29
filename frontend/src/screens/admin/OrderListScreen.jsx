import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaTimes, FaMinus } from 'react-icons/fa';

import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import TableSearchBox from '../../components/TableSearchBox';
import Meta from '../../components/Meta';
import { CURRENCY } from '../../constants';

const OrderListScreen = () => {
    const pageSize = 10;
    const { keyword, pageNumber } = useParams();

    const { data, isLoading, error } = useGetOrdersQuery({ keyword, pageSize, pageNumber });
    
    return (
        <>
            <Meta title='Orders' />
            <h1>Orders</h1>
            <Row className=''>
                <Col md={4}>
                    <TableSearchBox
                        placeholderText='Search User...'
                        isAdmin={true}
                        route='/orderlist'
                    />
                </Col>
            </Row>
            {
                isLoading ? <Loader /> :
                error ? <Message variant='danger'>{error}</Message> :
                (
                    <>
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>USER</th>
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
                                            <td>{order.userName}</td>
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
                            isAdmin={true}
                            keyword={keyword ? keyword : ''}
                            route='/orderlist'
                        />
                    </>
                )
            }
        </>
    );
};

export default OrderListScreen;