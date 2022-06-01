import OrdersView from "@/views/orders/OrdersView";
import OrderDetail from "@/views/orders/OrderDetail";

const ordersRoutes = [
    {
        name: 'Orders',
        path: '/orders',
        component: OrdersView
    },
    {
        name: 'Order',
        path: '/order',
        component: OrderDetail
    }
];

export const ordersRouter = ordersRoutes.filter(function (x) {
    return x !== null;
})
