import { Row, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { useGetProductsQuery } from '../slices/productsApiSlice';
import ProductCarousel from '../components/ProductCarousel';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const HomeScreen = () => {
    const pageSize = 20;
    const { keyword, pageNumber } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageSize, pageNumber });

    return (
        <>
            {
                !keyword ? <ProductCarousel /> :
                (
                    <Link to='/' className='btn btn-light mb-4'>
                        Go Back
                    </Link>
                )
            }
            { 
                isLoading ? <Loader /> :
                error ?
                (
                    <Message variant='danger'>
                        { error?.data?.message || error.error }
                    </Message>
                ) :
                (
                    <>
                        <Meta />
                        <h1>Latest Products</h1>
                        <Row>
                            {data.products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate
                            pages={data.pages}
                            page={data.page}
                            keyword={keyword ? keyword : ''}
                        />
                    </>
                )
            }
        </>
    );
};

export default HomeScreen;