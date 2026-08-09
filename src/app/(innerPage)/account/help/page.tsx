import { Panel, PanelHeading } from "@/components/sections/account/panel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { getFaqData } from "@/lib/data";
import { Call, Email, Location } from "@/lib/icon";
import { FaqDataType } from "@/db/faqData";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Help & Support",
    description: "Answers to common questions and ways to reach our support team.",
};

const HelpPage = async () => {
    const faqData: FaqDataType[] = await getFaqData();

    return (
        <div className="flex flex-col gap-6">
            <Panel>
                <PanelHeading title="Frequently Asked Questions" description="Quick answers to common questions." />
                <Accordion type="single" collapsible className="flex flex-col">
                    {faqData.slice(0, 6).map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                            <AccordionTrigger className="text-base text-secondary-foreground lg:text-lg">
                                {faq.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-1-foreground">{faq.ans}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Panel>

            <Panel>
                <PanelHeading title="Still need help?" description="Our support team is happy to assist." />
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-gray-1-foreground">
                            <Email className="size-5" />
                        </span>
                        <div>
                            <p className="font-medium text-secondary-foreground">Email</p>
                            <Link
                                href="mailto:info@yourdomin.com"
                                className="text-sm text-gray-1-foreground transition-all duration-300 hover:text-secondary-foreground"
                            >
                                info@yourdomin.com
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-gray-1-foreground">
                            <Call className="size-5" />
                        </span>
                        <div>
                            <p className="font-medium text-secondary-foreground">Call Us</p>
                            <Link
                                href="tel:2345 56789"
                                className="text-sm text-gray-1-foreground transition-all duration-300 hover:text-secondary-foreground"
                            >
                                (+0123) 2345 56789
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-home-bg-2 text-gray-1-foreground">
                            <Location className="size-5" />
                        </span>
                        <div>
                            <p className="font-medium text-secondary-foreground">Office Address</p>
                            <p className="text-sm text-gray-1-foreground">265 New Ave, Califonia City-100, USA.</p>
                        </div>
                    </div>
                </div>
                <Button asChild size="sm" className="mt-6">
                    <Link href="/contact-us">Contact Support</Link>
                </Button>
            </Panel>
        </div>
    );
};

export default HelpPage;
