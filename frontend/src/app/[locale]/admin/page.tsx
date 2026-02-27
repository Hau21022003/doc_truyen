"use client";

import { FilterBar } from "@/features/filter/components/filter-bar";
import { FILTER_TYPE } from "@/features/filter/filter.constants";
import { AnyFilterConfig } from "@/features/filter/filter.types";

const filterConfigs: AnyFilterConfig[] = [
  {
    key: "textFilter",
    label: "Text Filter",
    type: FILTER_TYPE.TEXT,
    defaultVisible: true,
    onChange(value) {},
  },
  {
    key: "selectFilter",
    label: "Select Filter 111111111111111",
    type: "select",
    defaultVisible: false,
    popoverSize: "md",
    options: [
      { label: "Option 1111111111111111111111111111", value: "option1" },
      { label: "Option 2", value: "option2" },
    ],
    onChange(value) {
      console.log("selectFilter", value);
    },
  },
  {
    key: "comboboxFilter",
    label: "Combobox Filter",
    type: "combobox",
    defaultVisible: false,
    options: Array.from({ length: 50 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `User ${i + 1}11111111111111111111111111111111111111111`,
      avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=1111${i + 1}`,
    })).map((user) => ({
      label: user.name,
      value: user.id,
      render: () => {
        return (
          <div className="flex items-center justify-start w-full">
            <img
              src={user.avatar}
              alt="User Icon"
              className="w-4 h-4 mr-2 shrink-0"
            />
            <span className="truncate line-clamp-1">{user.name}</span>
          </div>
        );
      },
    })),
    onChange(value) {
      console.log("comboboxFilter", value);
    },
  },
  {
    key: "dateRangeFilter",
    label: "Date Range Filter",
    type: FILTER_TYPE.DATE_RANGE,
    defaultVisible: false,
    onChange(value) {
      console.log("comboboxFilter", value);
    },
  },
];

// const filterConfigs = [dateRangeFilterConfig];
export default function DashboardPage() {
  return (
    <div>
      <FilterBar configs={filterConfigs} />
    </div>
  );
}
