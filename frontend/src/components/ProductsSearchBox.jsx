import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate} from 'react-router-dom';

const ProductsSearchBox = () => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = async (e) => {
        e.preventDefault();
        setKeyword('');
        
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <Form onSubmit={submitHandler} className='d-flex'>
            <Form.Control
                type='text'
                name='q'
                value={keyword}
                placeholder='Search Products...'
                onChange={(e) => setKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-5'
            />
            <Button type='submit' variant='outline-light' className='p-2 mx-2'>
                Search
            </Button>
        </Form>
    );
};

export default ProductsSearchBox;