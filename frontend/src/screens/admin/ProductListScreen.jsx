import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation
} from '../../slices/productsApiSlice';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import TableSearchBox from '../../components/TableSearchBox';
import Meta from '../../components/Meta';
import { CURRENCY } from '../../constants';

const ProductListScreen = () => {
    const pageSize = 10;
    const { keyword, pageNumber } = useParams();

    const { data, isLoading, error, refetch } = useGetProductsQuery({ keyword, pageSize, pageNumber });
    const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
    const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

    const createProductHandler = async () => {
        if (window.confirm('Are you sure you want to create a new product?')) {
            try {
                await createProduct();
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete product?')) {
            try {
                await deleteProduct(id);
                toast.success('Product deleted successfully');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <Meta title='Products' />
            <h1>Prdoucts</h1>
            <Row className=''>
                <Col md={4}>
                    <TableSearchBox
                        placeholderText='Search Name, Category, Brand...'
                        isAdmin={true}
                        route='/productlist'
                    />
                </Col>
                <Col md={8} className='text-end'>
                    <Button
                        className='btn-sm mt-3 mb-3'
                        style={{ height: '35px' }}
                        onClick={createProductHandler}
                    >
                        <FaEdit /> Create Product
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader />}
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
                                    <th>PRICE ({CURRENCY})</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.products.map((product) => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>
                                            <td>
                                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                    <Button
                                                        variant='light'
                                                        className='btn-sm mx-2'
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                </LinkContainer>
                                                <Button
                                                    variant='danger'
                                                    className='btn-sm'
                                                    onClick={() => deleteHandler(product._id)}
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
                            route='/productlist'
                        />
                    </>
                )
            }
        </>
    );
};

export default ProductListScreen;