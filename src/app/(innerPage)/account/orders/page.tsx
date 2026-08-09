import { getOrdersData } from "@/lib/data";
import { Metadata } from "next";
import OrdersContent from "./ordersContent";

export const metadata: Metadata = {
    title: "My Orders",
    description: "View and track all your orders.",
};

const OrdersPage = async () => {
    const orders = await getOrdersData();
    return <OrdersContent orders={orders} />;
};

export default OrdersPage;
