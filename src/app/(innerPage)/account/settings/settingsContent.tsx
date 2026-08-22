"use client";

import { Panel, PanelHeading } from "@/components/sections/account/panel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMyProfile } from "@/lib/account/use-account";

// No account-settings API exists yet — both forms below only show a success toast on submit.
// Profile is wired to `users.update` via the SDK. There is no password to
// change — sign-in is an emailed one-time code.
const SettingsContent = () => {
    const { data: customer, loading, save } = useMyProfile();
    const [profile, setProfile] = useState({ name: "", email: "", phone: "" });

    // Adopt the fetched profile once it arrives (the form starts empty because
    // the read is owner-scoped and happens in the browser).
    useEffect(() => {
        if (customer) setProfile({ name: customer.name, email: customer.email, phone: customer.phone });
    }, [customer]);
    const [preferences, setPreferences] = useState({ orderUpdates: true, offers: true, wishlistAlerts: false });

    const handleProfileSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Name is stored as first/last on the server; split on the first space.
        /* Email is the account's identity — it's the address the sign-in code
           is sent to — and `UpdateCustomerInput` accepts only name and phone.
           Saying "updated" after someone edits it would be a lie, so say what
           actually happens instead. */
        if (customer && profile.email.trim() !== customer.email) {
            toast("Your email is your sign-in address and can't be changed here.");
        }
        /* Guard against saving the empty initial form: the read is
           owner-scoped and resolves in the browser, so submitting before it
           lands would overwrite the customer's stored name and phone with "". */
        if (loading) {
            toast("Still loading your profile — one moment.");
            return;
        }
        // Loaded but absent means the read failed; saying "still loading" would
        // send the customer back to a button that will never work.
        if (!customer) {
            toast.error("We couldn't load your profile. Please refresh and try again.");
            return;
        }
        const [firstName, ...rest] = profile.name.trim().split(" ");
        void save({
            firstName: firstName ?? "",
            lastName: rest.join(" "),
            phone: profile.phone,
        })
            .then(() => toast.success("Profile updated successfully"))
            .catch(() => toast.error("Couldn't save your profile. Please try again."));
    };

    /* This store is passwordless — sign-in is an emailed one-time code, so
       there is no password to change. Say so rather than reporting success for
       something that never happened. */
    const handlePasswordSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        toast("This store signs you in with an emailed code — there's no password to change.");
        (event.target as HTMLFormElement).reset();
    };

    return (
        <div className="flex flex-col gap-6">
            <Panel>
                <PanelHeading title="Profile Information" description="Update your personal details." />
                <form onSubmit={handleProfileSubmit} className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            required
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            required
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <Button type="submit" size="sm" disabled={loading}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Panel>

            <Panel>
                <PanelHeading title="Change Password" description="Choose a strong password you don't use elsewhere." />
                <form onSubmit={handlePasswordSubmit} className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" required autoComplete="current-password" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" required autoComplete="new-password" minLength={8} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" required autoComplete="new-password" minLength={8} />
                    </div>
                    <div className="sm:col-span-2">
                        <Button type="submit" size="sm">
                            Update Password
                        </Button>
                    </div>
                </form>
            </Panel>

            <Panel>
                <PanelHeading title="Notification Preferences" description="Choose what you'd like to hear about." />
                <div className="flex flex-col gap-4">
                    {[
                        { key: "orderUpdates" as const, label: "Order updates", description: "Shipping and delivery status changes." },
                        { key: "offers" as const, label: "Offers & promotions", description: "Sales, discounts and new arrivals." },
                        { key: "wishlistAlerts" as const, label: "Wishlist alerts", description: "When a wishlist item is back in stock." },
                    ].map((pref) => (
                        <label key={pref.key} className="flex cursor-pointer items-start gap-3">
                            <Checkbox
                                checked={preferences[pref.key]}
                                onCheckedChange={(checked) =>
                                    setPreferences((prev) => ({ ...prev, [pref.key]: checked === true }))
                                }
                                className="mt-0.5"
                            />
                            <span>
                                <span className="block text-sm font-medium text-secondary-foreground">{pref.label}</span>
                                <span className="block text-sm text-gray-1-foreground">{pref.description}</span>
                            </span>
                        </label>
                    ))}
                </div>
            </Panel>
        </div>
    );
};

export default SettingsContent;
