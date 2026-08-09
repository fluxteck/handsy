"use client";

import { EmptyState, Panel, PanelHeading } from "@/components/sections/account/panel";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethodType } from "@/types/accountType";
import { CreditCard, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const emptyForm = { brand: "Visa", last4: "", expiry: "" };

// Card capture is intentionally minimal (brand + last 4 + expiry only, no full PAN field) — full
// card details must never be collected/stored outside a PCI-compliant gateway (e.g. Stripe,
// Razorpay). Wire this dialog to that provider's tokenized card-element before going live.
const PaymentMethodsContent = ({ initialPaymentMethods }: { initialPaymentMethods: PaymentMethodType[] }) => {
    const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setPaymentMethods((prev) => [
            ...prev,
            { id: `pm_${Date.now()}`, type: "card", brand: form.brand, last4: form.last4, expiry: form.expiry },
        ]);
        toast.success("Payment method added");
        setForm(emptyForm);
        setIsOpen(false);
    };

    const handleDelete = (id: string) => {
        setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
        toast.success("Payment method removed");
    };

    const handleSetDefault = (id: string) => {
        setPaymentMethods((prev) => prev.map((pm) => ({ ...pm, isDefault: pm.id === id })));
    };

    return (
        <Panel>
            <PanelHeading
                title="Payment Methods"
                description="Manage the cards and UPI IDs saved to your account."
                action={
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="size-4" />
                                Add Card
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Card</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="grid gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="brand">Card Brand</Label>
                                    <Input
                                        id="brand"
                                        required
                                        placeholder="Visa, Mastercard..."
                                        value={form.brand}
                                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="last4">Last 4 Digits</Label>
                                    <Input
                                        id="last4"
                                        required
                                        maxLength={4}
                                        pattern="\d{4}"
                                        placeholder="4821"
                                        value={form.last4}
                                        onChange={(e) => setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                                    <Input
                                        id="expiry"
                                        required
                                        placeholder="09/28"
                                        value={form.expiry}
                                        onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Add Card</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                }
            />

            {paymentMethods.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {paymentMethods.map((pm) => (
                        <div key={pm.id} className="rounded-xl border border-border p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2 font-medium text-secondary-foreground">
                                    <CreditCard className="size-4" />
                                    {pm.type === "upi" ? "UPI" : pm.brand}
                                </span>
                                {pm.isDefault && (
                                    <span className="rounded-full bg-home-bg-2 px-3 py-1 text-xs font-medium text-secondary-foreground">
                                        Default
                                    </span>
                                )}
                            </div>
                            {pm.type === "upi" ? (
                                <p className="text-sm text-gray-1-foreground">{pm.upiId}</p>
                            ) : (
                                <>
                                    <p className="text-sm text-gray-1-foreground">•••• •••• •••• {pm.last4}</p>
                                    <p className="mt-1 text-sm text-gray-1-foreground">Expires {pm.expiry}</p>
                                </>
                            )}
                            <div className="-mx-2 mt-3 flex flex-wrap items-center gap-1 text-sm">
                                <button
                                    type="button"
                                    onClick={() => handleDelete(pm.id)}
                                    className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-1-foreground transition-all duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground active:scale-95"
                                >
                                    <Trash2 className="size-3.5" />
                                    Remove
                                </button>
                                {!pm.isDefault && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(pm.id)}
                                        className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-1-foreground transition-all duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground active:scale-95"
                                    >
                                        <Star className="size-3.5" />
                                        Set as default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={CreditCard}
                    title="No payment methods saved"
                    description="Add a card to check out faster next time."
                />
            )}
        </Panel>
    );
};

export default PaymentMethodsContent;
