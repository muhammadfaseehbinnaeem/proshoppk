import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {  FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
    useGetUsersQuery,
    useDeleteUserMutation
} from '../../slices/usersApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import TableSearchBox from '../../components/TableSearchBox';
import Meta from '../../components/Meta';

const UserListScreen = () => {
    const pageSize = 10;
    const { keyword, pageNumber } = useParams();

    const { data, refetch, isLoading, error } = useGetUsersQuery({ keyword, pageSize, pageNumber });
    const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete user?')) {
            try {
                const result = await deleteUser(id);

                if (result.error) {
                    toast.error(result?.error?.data?.message || result?.error.error);
                } else {
                    toast.success('User deleted successfully');
                }

                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <Meta title='Users' />
            <h1>Users</h1>
            <Row className=''>
                <Col md={4}>
                    <TableSearchBox
                        placeholderText='Search Name, Email, Phone Number...'
                        isAdmin={true}
                        route='/userlist'
                    />
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {
                isLoading ? <Loader /> :
                error ? <Message variant='danger'>{error}</Message> :
                (
                    <>
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>EMAIL</th>
                                    <th>PHONE NUMBER</th>
                                    <th>ADMIN</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.users.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td>
                                                <a href={`mailto:${user.email}`}>
                                                    {user.email}
                                                </a>
                                            </td>
                                            <td>{user.phoneNumber}</td>
                                            <td>
                                                {
                                                    user.isAdmin ?
                                                    <FaCheck style={{ color: 'green' }} /> :
                                                    <FaTimes style={{ color: 'red' }} />
                                                }
                                            </td>
                                            <td>
                                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                    <Button variant='light' className='btn-sm'>
                                                        <FaEdit />
                                                    </Button>
                                                </LinkContainer>
                                                <Button
                                                    variant='danger'
                                                    className='btn-sm'
                                                    onClick={() => deleteHandler(user._id)}
                                                >
                                                    <FaTrash style={{ color: 'white' }} />
                                                </Button>
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
                            route='/userlist'
                        />
                    </>
                )
            }
        </>
    );
};

export default UserListScreen;