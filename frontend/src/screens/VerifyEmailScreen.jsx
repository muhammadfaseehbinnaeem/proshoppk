import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";

import { useVerifyEmailMutation } from "../slices/usersApiSlice";
import { setVerifiedEmail } from "../slices/resetPasswordSlice";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

const VerifyEmailScreen = () => {
    const [email, setEmail] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        
        try {
            const res = await verifyEmail({ email }).unwrap();
            dispatch(setVerifiedEmail(res.email));
            toast.success('Email verified successfully');
            navigate('/resetpassword');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <>
            <Meta title='Verify Email' />
            <FormContainer>
                <h1>Verify Email</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email" className="my-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-2">
                        Verify
                    </Button>
                    {isLoading && <Loader />}
                </Form>
            </FormContainer>
        </>
    );
};

export default VerifyEmailScreen;