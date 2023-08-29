import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";

import { useResetPasswordMutation } from "../slices/usersApiSlice";
import { reset } from "../slices/resetPasswordSlice";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Meta from "../components/Meta";

const ResetPasswordScreen = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { verifiedEmail: email } = useSelector((state) => state.resetPassword);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else {
            try {
                await resetPassword({ email, password }).unwrap();
                dispatch(reset());
                toast.success('Password reset successfully');
                navigate('/login');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    };

    return (
        <>
            <Meta title='Reset Password' />
            <FormContainer>
                <h1>Reset Password</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="password" className="my-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId="confirmPassword" className="my-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-2">
                        Reset
                    </Button>
                    {isLoading && <Loader />}
                </Form>
            </FormContainer>
        </>
    );
};

export default ResetPasswordScreen;