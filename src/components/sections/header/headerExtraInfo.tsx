"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CountriesList = {
  country: string;
  code: string;
  symbol: string;
};

const countriesList: CountriesList[] = [
  {
    country: "United States",
    code: "USD",
    symbol: "$",
  },
  {
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
          className={`w-20 h-8 px-2.5 rounded-full border border-border bg-transparent text-gray-1-foreground text-sm font-normal capitalize flex hover:border-secondary-foreground transition-colors duration-300`}
        >
          <SelectValue>
            <span>{selectedCurrency.code}</span>
            <span className="ml-1">{selectedCurrency.symbol}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className={`border-none bg-background`}>
          {countriesList.map(({ code, symbol }) => {
            return (
              <SelectItem
                key={code}
                value={code}
                className="text-sm focus:bg-home-bg-1 focus:text-inherit pl-2 cursor-pointer capitalize"
              >
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
