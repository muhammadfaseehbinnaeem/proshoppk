import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const TableSearchBox = ({ placeholderText = 'Search...', isAdmin = false, route = '' }) => {
    const navigate = useNavigate();
    const { keyword: urlKeyword } = useParams();
    const [keyword, setKeyword] = useState(urlKeyword || '');

    const submitHandler = async (value) => {
        setKeyword(value);

        const baseRoute = isAdmin ? `/admin${route}` : route;
        
        if (value.trim()) {
            navigate(`${baseRoute}/search/${value}`);
        } else {
            navigate(baseRoute);
        }
    };

    return (
        <Form>
            <Form.Control
                type='text'
                name='q'
                value={keyword}
                placeholder={placeholderText}
                onChange={(e) => submitHandler(e.target.value)}
                className='mr-sm-2 ml-sm-5 mt-3 mb-3'
                style={{ height: '35px' }}
            />
        </Form>
    );
};

export default TableSearchBox;