import * as data from "domains/data";
import { useState } from "react";

type Tab = "Browser Rows" | "Insert Row" | "Modify";

export function TableSection() {
  const [selectedTab, setSelectedTab] = useState<Tab>("Browser Rows");
  const { selectedItem } = data.useData();

  const tabs: Tab[] = ["Browser Rows", "Insert Row", "Modify"];

  return (
    <div>
      <div className="p-4 pb-0">
        <p className="text-xs text-gray-500">
          You are here: {selectedItem?.location}
        </p>
        <p className="mt-3 text-lg font-bold text-gray-700">
          {selectedItem?.name}
        </p>

        <div className="flex gap-4 mt-4">
          {tabs.map((tab) => (
            <button
              className={`relative px-4 py-3 text-sm rounded-t-md z-10 border-t-4 text-gray-700 ${
                selectedTab === tab
                  ? "bg-gray-100 border border-b-0 border-t-yellow-400 after:block after:absolute after:h-px after:-bottom-px after:left-0 after:bg-gray-100 after:w-full font-bold border-gray-300"
                  : "bg-gray-200 border-t-gray-200 hover:bg-gray-400 hover:border-t-gray-400 hover:text-white transition"
              }`}
              type="button"
              onClick={() => {
                setSelectedTab(tab);
              }}
              key={tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full pr-6 h-[1px] bg-gray-300" />

      <data.BrowserRows />
    </div>
  );
}
