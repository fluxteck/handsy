import { getPaymentMethodsData } from "@/lib/data";
import { Metadata } from "next";
import PaymentMethodsContent from "./paymentMethodsContent";

export const metadata: Metadata = {
    title: "Payment Methods",
    description: "Manage your saved payment methods.",
};

const PaymentMethodsPage = async () => {
    const paymentMethods = await getPaymentMethodsData();
    return <PaymentMethodsContent initialPaymentMethods={paymentMethods} />;
};

export default PaymentMethodsPage;
