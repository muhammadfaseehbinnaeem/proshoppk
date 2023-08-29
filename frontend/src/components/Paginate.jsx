import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', route = '' }) => {
    return (
        pages > 1 &&
        (
            <Pagination>
                {
                    [...Array(pages).keys()].map((x) => (
                        <LinkContainer
                            key={x + 1}
                            to={
                                keyword ?
                                (
                                    isAdmin ?
                                    `/admin${route}/search/${keyword}/page/${x + 1}` :
                                    `${route}/search/${keyword}/page/${x + 1}`
                                ) :
                                (
                                    isAdmin ?
                                    `/admin${route}/page/${x + 1}` :
                                    `${route}/page/${x + 1}`
                                )
                            }
                        >
                            <Pagination.Item active={x + 1 === page}>
                                {x + 1}
                            </Pagination.Item>
                        </LinkContainer>
                    ))
                }
            </Pagination>
        )
    );
};

export default Paginate;