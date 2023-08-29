import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';

import { useGetCarouselProductsQuery } from '../slices/productsApiSlice';
import Mesaage from './Message';
import { CURRENCY } from '../constants';

const ProductCarousel = () => {
    const { data: products, isLoading, error } = useGetCarouselProductsQuery();

    return (
        isLoading ? '' :
        error ? <Mesaage variant='danger'>{error}</Mesaage> :
        (
            <Carousel pause='hover' className='bg-primary mb-5'>
                {
                    products.map((product) => (
                        <Carousel.Item key={product._id}>
                            <Link to={`/product/${product._id}`} className='d-flex'>
                                <Image src={product.image} alt={product.name} className='carousel-image' />
                                <div className='carousel-content'>
                                    <h2>{product.name}</h2>
                                    <div className='mt-4'>
                                        <h5>{product.brand}</h5>
                                        <h5>{CURRENCY}{product.price}/-</h5>
                                    </div>
                                </div>
                                {/* <Carousel.Caption className='carousel-caption'>
                                    <h2>{product.name} ({CURRENCY}{product.price})</h2>
                                </Carousel.Caption> */}
                            </Link>
                        </Carousel.Item>
                    ))
                }
            </Carousel>
        )
    );
};

export default ProductCarousel;