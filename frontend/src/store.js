import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authSliceReducer from "./slices/authSlice";
import resetPasswordSliceReducer from "./slices/resetPasswordSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,
        resetPassword: resetPasswordSliceReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

export default store;