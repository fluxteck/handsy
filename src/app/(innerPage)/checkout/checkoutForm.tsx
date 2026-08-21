import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import RegisterForm from "./registerForm";

const CheckoutForm = () => {
  const submitForm = async (formData: FormData) => {
    "use server";
    console.log(formData);
  };

  const fieldClass =
    "border border-[#999796] text-sm text-gray-1-foreground font-medium px-3.5 py-2.5 mt-1.5";
  const labelClass = "text-gray-1-foreground w-full text-sm";

  return (
    <div className="rounded-xl border border-border p-5 sm:p-6">
      <p className="text-secondary-foreground font-semibold text-lg mb-5">
        Billing details
      </p>
      <form action={submitForm}>
        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-4">
            <label htmlFor="first_name" className={labelClass}>
              First name<span className="text-red-400">*</span>
              <Input
                className={fieldClass}
                type={"text"}
                name={"first_name"}
                id="first_name"
                required
              />
            </label>
            <label htmlFor="last_name" className={labelClass}>
              Last name<span className="text-red-400">*</span>
              <Input
                className={fieldClass}
                type={"text"}
                name={"last_name"}
                id="last_name"
                required
              />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-4">
            <label htmlFor="email" className={labelClass}>
              Email address<span className="text-red-400">*</span>
              <Input
                className={fieldClass}
                type={"email"}
                name={"email"}
                id="email"
                required
              />
            </label>
            <label htmlFor="phone" className={labelClass}>
              Phone<span className="text-red-400">*</span>
              <Input
                className={fieldClass}
                type={"number"}
                name={"phone"}
                id="phone"
                required
              />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-4">
            <div>
              <label htmlFor="country" className={labelClass}>
                Country/Region<span className="text-red-400">*</span>
              </label>
              <Select name="country" required>
                <SelectTrigger
                  id="country"
                  className="h-10 py-2 border border-[#999796] text-sm text-gray-1-foreground mt-1.5"
                >
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="py-[14px] bg-background ">
                  <SelectItem value="united-states" className="cursor-pointer">
                    United States
                  </SelectItem>
                  <SelectItem value="united-kingdom" className="cursor-pointer">
                    United Kingdom
                  </SelectItem>
                  <SelectItem value="bangladesh" className="cursor-pointer">
                    Bangladesh
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label htmlFor="town" className={labelClass}>
              Town / City<span className="text-red-400">*</span>
              <Input
                className={fieldClass}
                type={"text"}
                name={"town"}
                id="town"
                required
              />
            </label>
          </div>
          <div className="grid sm:grid-cols-[1fr_11rem] grid-cols-1 gap-x-4 gap-y-4">
            <label htmlFor="street" className={labelClass}>
              Street address<span className="text-red-400">*</span>
              <Input
                className={fieldClass}
                type={"text"}
                name={"street"}
                id="street"
                required
              />
            </label>
            <label htmlFor="zip" className={labelClass}>
              ZIP Code<span className="text-red-400">*</span>
              <Input
                className={fieldClass}
                type={"text"}
                name={"zip"}
                id="zip"
                required
              />
            </label>
          </div>
          <label htmlFor="notes" className={labelClass}>
            Additional information (optional)
            <Textarea
              className={fieldClass + " min-h-[80px]"}
              name={"notes"}
              id="notes"
            />
          </label>
        </div>
        <RegisterForm />
      </form>
    </div>
  );
};

export default CheckoutForm;
