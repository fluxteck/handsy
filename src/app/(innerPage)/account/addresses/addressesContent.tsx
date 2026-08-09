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
import { AddressType } from "@/types/accountType";
import { MapPinned, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const emptyForm: Omit<AddressType, "id"> = {
    label: "",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
};

// No backend for addresses yet — this manages state locally so the UI is fully usable.
// TODO: replace the handlers below with real create/update/delete API calls once available.
const AddressesContent = ({ initialAddresses }: { initialAddresses: AddressType[] }) => {
    const [addresses, setAddresses] = useState(initialAddresses);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);

    const openAddDialog = () => {
        setEditingId(null);
        setForm(emptyForm);
        setIsOpen(true);
    };

    const openEditDialog = (address: AddressType) => {
        setEditingId(address.id);
        setForm(address);
        setIsOpen(true);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (editingId) {
            setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
            toast.success("Address updated");
        } else {
            setAddresses((prev) => [...prev, { ...form, id: `addr_${Date.now()}` }]);
            toast.success("Address added");
        }
        setIsOpen(false);
    };

    const handleDelete = (id: string) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address removed");
    };

    const handleSetDefault = (id: string) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    };

    return (
        <Panel>
            <PanelHeading
                title="Saved Addresses"
                description="Manage the addresses used for delivery."
                action={
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" onClick={openAddDialog}>
                                <Plus className="size-4" />
                                Add Address
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit Address" : "Add New Address"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="label">Address Label</Label>
                                    <Input
                                        id="label"
                                        required
                                        placeholder="Home, Office..."
                                        value={form.label}
                                        onChange={(e) => setForm({ ...form, label: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        required
                                        value={form.fullName}
                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        required
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <Label htmlFor="line1">Address Line 1</Label>
                                    <Input
                                        id="line1"
                                        required
                                        value={form.line1}
                                        onChange={(e) => setForm({ ...form, line1: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <Label htmlFor="line2">Address Line 2 (optional)</Label>
                                    <Input
                                        id="line2"
                                        value={form.line2}
                                        onChange={(e) => setForm({ ...form, line2: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        required
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        required
                                        value={form.state}
                                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        required
                                        value={form.postalCode}
                                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        required
                                        value={form.country}
                                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                                    />
                                </div>
                                <DialogFooter className="sm:col-span-2">
                                    <Button type="submit">{editingId ? "Save Changes" : "Add Address"}</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                }
            />

            {addresses.length ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                        <div key={address.id} className="rounded-xl border border-border p-5">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2 font-medium text-secondary-foreground">
                                    <MapPinned className="size-4" />
                                    {address.label}
                                </span>
                                {address.isDefault && (
                                    <span className="rounded-full bg-home-bg-2 px-3 py-1 text-xs font-medium text-secondary-foreground">
                                        Default
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-secondary-foreground">{address.fullName}</p>
                            <p className="mt-1 text-sm text-gray-1-foreground">
                                {address.line1}
                                {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state}{" "}
                                {address.postalCode}, {address.country}
                            </p>
                            <p className="mt-1 text-sm text-gray-1-foreground">{address.phone}</p>
                            <div className="-mx-2 mt-3 flex flex-wrap items-center gap-1 text-sm">
                                <button
                                    type="button"
                                    onClick={() => openEditDialog(address)}
                                    className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-1-foreground transition-all duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground active:scale-95"
                                >
                                    <Pencil className="size-3.5" />
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(address.id)}
                                    className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-gray-1-foreground transition-all duration-300 hover:bg-home-bg-1 hover:text-secondary-foreground active:scale-95"
                                >
                                    <Trash2 className="size-3.5" />
                                    Remove
                                </button>
                                {!address.isDefault && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(address.id)}
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
                    icon={MapPinned}
                    title="No saved addresses"
                    description="Add an address to speed up checkout next time."
                />
            )}
        </Panel>
    );
};

export default AddressesContent;
