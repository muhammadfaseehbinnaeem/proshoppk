import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    verifiedEmail: localStorage.getItem('verifiedEmail') ?
    JSON.parse(localStorage.getItem('verifiedEmail')) : ''
};

const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    reducers: {
        setVerifiedEmail: (state, action) => {
            state.verifiedEmail = action.payload;
            localStorage.setItem('verifiedEmail', JSON.stringify(action.payload));
        },
        reset: (state, action) => {
            state.verifiedEmail = '';
            localStorage.removeItem('verifiedEmail');
        }
    }
});

export const { setVerifiedEmail, reset } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;