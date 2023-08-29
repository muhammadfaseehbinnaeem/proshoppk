import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
                url: ORDERS_URL,
                method: 'POST',
                body: {...order}
            }),
        }),
        getOrderDetails: builder.query({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}`
            }),
            keepUnusedDataFor: 5
        }),
        payOrder: builder.mutation({
            query: ({ orderId, details }) => ({
                url: `${ORDERS_URL}/${orderId}/pay`,
                method: 'PUT',
                body: details,
            })
        }),
        getMyOrders: builder.query({
            query: ({ pageSize, pageNumber }) => ({
                url: `${ORDERS_URL}/myorders`,
                params: { pageSize, pageNumber }
            }),
            keepUnusedDataFor: 5
        }),
        getOrders: builder.query({
            query: ({ keyword, pageSize, pageNumber }) => ({
                url: ORDERS_URL,
                params: { keyword, pageSize, pageNumber }
            }),
            keepUnusedDataFor: 5
        }),
        deliverOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/deliver`,
                method: 'PUT'
            })
        }),
        cancelOrder: builder.mutation({
            query: (orderId) => ({
                url: `${ORDERS_URL}/${orderId}/cancel`,
                method: 'PUT'
            })
        })
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetMyOrdersQuery,
    useGetOrdersQuery,
    useDeliverOrderMutation,
    useCancelOrderMutation
} = ordersApiSlice;