import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import { getCouponsData } from "@/lib/data";
import { Metadata } from "next";
import CouponsContent from "./couponsContent";
import { Gift } from "lucide-react";

export const metadata: Metadata = {
    title: "Coupons & Offers",
    description: "Coupons and offers available on your account.",
};

const CouponsPage = async () => {
    const coupons = await getCouponsData();

    return (
        <Panel>
            <PanelHeading title="Coupons & Offers" description="Apply these at checkout to save on your order." />
            {coupons.length ? (
                <CouponsContent coupons={coupons} />
            ) : (
                <EmptyState icon={Gift} title="No coupons available" description="Check back soon for new offers." />
            )}
        </Panel>
    );
};

export default CouponsPage;
