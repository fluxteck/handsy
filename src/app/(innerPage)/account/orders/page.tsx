import { Metadata } from "next";
import OrdersContent from "./ordersContent";

export const metadata: Metadata = {
    title: "My Orders",
    description: "View and track all your orders.",
};

const OrdersPage = () => {
    return <OrdersContent />;
};

export default OrdersPage;
