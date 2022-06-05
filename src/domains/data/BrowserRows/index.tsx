import { Icon } from "@iconify/react";
import * as common from "common";

export function BrowserRows() {
  return (
    <div className="p-4 mt-2">
      <div className="flex w-full gap-4">
        <div className="flex-1 ">
          <p>Filter</p>
          <div className="grid grid-cols-12 gap-1 mt-4">
            <common.Select
              options={[
                { value: "option", name: "option" },
                { value: "option2", name: "option2" },
              ]}
              className="col-span-4"
            />
            <common.Select
              options={[
                { value: "option", name: "option" },
                { value: "option2", name: "option2" },
              ]}
              className="col-span-3"
            />
            <common.Input placeholder="-- value --" className="col-span-4" />
            <Icon icon="carbon:close" className={`w-7 h-7 cursor-pointer`} />
          </div>
        </div>

        <div className="flex-1">
          <p>Sort</p>
          <div className="grid grid-cols-12 gap-1 mt-4">
            <common.Select
              options={[
                { value: "option", name: "option" },
                { value: "option2", name: "option2" },
              ]}
              className="col-span-6"
            />
            <common.Select
              options={[
                { value: "option", name: "option" },
                { value: "option2", name: "option2" },
              ]}
              className="col-span-5"
            />
            <Icon icon="carbon:close" className={`w-7 h-7 cursor-pointer`} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          className="px-2 py-1 text-gray-600 bg-yellow-400 rounded-sm"
        >
          Run query
        </button>
        <button
          type="button"
          className="px-2 text-gray-600 bg-gray-200 rounded-sm outline-none py-1text-gray-600"
        >
          Export data
        </button>
      </div>
    </div>
  );
}
