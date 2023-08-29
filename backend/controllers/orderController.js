import asyncHandler from '../middlewares/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc        Create new order
// @route       POST /api/orders
// @access      Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(404);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

// @desc        Get logged in user orders
// @route       GET /api/orders/myorders
// @access      Private
const getMyOrders = asyncHandler(async (req, res) => {
    const size = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1;
    
    const limit = size;
    const offset = limit * (page - 1);
    
    const count = await Order.countDocuments({ user: req.user._id });

    const orders = await Order
        .find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

    res.status(200).json({
        orders,
        page,
        pages: Math.ceil(count / limit)
    });
});

// @desc        Get order by ID
// @route       GET /api/orders/:id
// @access      Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email phoneNumber');

    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc        Update order to paid
// @route       PUT /api/orders/:id/pay
// @access      Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address
        };

        const updatedOrder = await order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc        Update order to delivered
// @route       PUT /api/orders/:id/deliver
// @access      Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc        Update order to delivered
// @route       PUT /api/orders/:id/deliver
// @access      Private/Admin
const updateOrderToCanceled = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isCanceled = true;
        order.canceledAt = Date.now();

        const updatedOrder = order.save();

        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc        Get all orders
// @route       GET /api/orders
// @access      Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const size = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword ? req.query.keyword : '';

    const limit = size;
    const offset = limit * (page - 1);

    const query = [
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $addFields: {
                userName: {
                    $arrayElemAt: [
                        '$userDetails.name',
                        0
                    ]
                }
            }
        },
        {
            $project: {
                userDetails: 0
            }
        },
        {
            $match: {
                userName: {
                    $regex: keyword,
                    $options: 'i'
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: offset
        },
        {
            $limit: limit
        }
    ];

    const countQuery = {
        $count: 'totalCount'
    };

    const orders = await Order.aggregate(query);
    
    query.pop();
    query.pop();
    query.push(countQuery);
    
    const ordersCount = await Order.aggregate(query);
    const count = ordersCount.length !== 0 && Number(JSON.stringify(ordersCount[0].totalCount));
    
    res.status(200).json({
        orders,
        page,
        pages: Math.ceil(count / limit)
    });
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderToCanceled,
    getOrders
};