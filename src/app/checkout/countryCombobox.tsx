"use client";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* A plain list of country names — the field just needs a truthful string to
   send as the shipping address's country, same as the select it replaces. */
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
  "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
  "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia",
  "Cameroon", "Canada", "Chad", "Chile", "China", "Colombia", "Costa Rica", "Croatia",
  "Cuba", "Cyprus", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
  "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hong Kong",
  "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel",
  "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malaysia", "Maldives", "Mali", "Malta", "Mauritius", "Mexico",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Myanmar", "Namibia",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
  "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia",
  "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tunisia",
  "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe",
];

const CountryCombobox = ({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((country) => country.toLowerCase().includes(q));
  }, [query]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls="country-combobox-list"
          className="h-9 w-full flex items-center justify-between gap-1 rounded-full border-[1.5px] border-[#999796] bg-background px-3 text-xs text-gray-1-foreground mt-1.5"
        >
          <span className={cn("truncate", value ? "text-gray-1-foreground" : "text-muted-foreground")}>
            {value || "Select"}
          </span>
          <ChevronDown className="size-3.5 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-0">
        <div className="p-1.5 border-b">
          <Input
            autoFocus
            placeholder="Search country"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 px-3 text-xs rounded-md"
          />
        </div>
        <div id="country-combobox-list" role="listbox" className="max-h-48 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-gray-1-foreground px-2 py-1.5">No matches</p>
          ) : (
            filtered.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  onChange(country);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "w-full text-left text-xs px-2 py-1.5 rounded-sm hover:bg-accent transition-colors",
                  country === value && "bg-accent font-medium",
                )}
              >
                {country}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CountryCombobox;
