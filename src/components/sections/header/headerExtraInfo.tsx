"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CountriesList = {
  flag: React.ReactNode;
  country: string;
  code: string;
  symbol: string;
};

const IndiaFlag = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="16"
    viewBox="0 0 24 16"
    className={className}
  >
    <rect width="24" height="16" fill="#F0F0F0" />
    <rect width="24" height="5.33" fill="#FF9933" />
    <rect y="10.67" width="24" height="5.33" fill="#138808" />
    <circle
      cx="12"
      cy="8"
      r="2"
      fill="none"
      stroke="#000080"
      strokeWidth="0.4"
    />
    <circle cx="12" cy="8" r="0.4" fill="#000080" />
  </svg>
);

const countriesList: CountriesList[] = [
  {
    flag: (
      <Image
        src="/images/flag/us.png"
        width={24}
        height={16}
        alt="United States flag"
        className="inline -inset -mt-1 mr-2"
      />
    ),
    country: "United States",
    code: "USD",
    symbol: "$",
  },
  {
    flag: <IndiaFlag className="inline -inset -mt-1 mr-2" />,
    country: "India",
    code: "INR",
    symbol: "₹",
  },
];

const HeaderExtraInfo = () => {
  const [currencyCode, setCurrencyCode] = useState<string>("INR");
  const selectedCurrency =
    countriesList.find(({ code }) => code === currencyCode) ?? countriesList[0];

  return (
    <div className="flex lg:flex-row flex-col lg:items-center gap-5 mt-5 lg:mt-0">
      <Select value={currencyCode} onValueChange={setCurrencyCode}>
        <SelectTrigger
          aria-label="currency"
          className={`w-30 h-9 px-3 rounded-full border border-border bg-transparent text-gray-1-foreground font-normal capitalize flex hover:border-secondary-foreground transition-colors duration-300`}
        >
          <SelectValue>
            {selectedCurrency.flag}
            <span>{selectedCurrency.code}</span>
            <span className="ml-1">{selectedCurrency.symbol}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className={`border-none bg-background`}>
          {countriesList.map(({ code, flag, symbol }) => {
            return (
              <SelectItem
                key={code}
                value={code}
                className="text-lg focus:bg-home-bg-1 focus:text-inherit pl-2 cursor-pointer capitalize"
              >
                {flag}
                <span>{code}</span>
                <span className="ml-1">{symbol}</span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeaderExtraInfo;
