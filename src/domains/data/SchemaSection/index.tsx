import { Icon } from "@iconify/react";
import * as data from "domains/data";
import * as common from "common";
import { useEffect, useState } from "react";

export function SchemaSection() {
  const [tables, setTables] = useState<{ Name: string; Id: number }[]>();
  const { selectedItem } = data.useData();

  function getTables() {
    setTables([
      { Name: "Google", Id: 1 },
      { Name: "Apple", Id: 2 },
      { Name: "Microsoft", Id: 3 },
      { Name: "Amazon", Id: 4 },
      { Name: "Netflix", Id: 5 },
    ]);
  }

  useEffect(() => {
    setTimeout(() => {
      getTables();
    }, 1000);
  }, []);

  if (!tables) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-1/4 h-1/4">
          <common.Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="p-7">
      <p className="text-xs text-gray-500">
        You are here: {selectedItem?.location}
      </p>
      <p className="mt-3 text-xl font-bold text-gray-700">
        {selectedItem?.name}
      </p>
      <div className="mt-4">
        <p className="flex items-center gap-2 text-center text-gray-700">
          <Icon icon="bxs:down-arrow" className={`w-4 h-4 `} /> tables
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        {tables.map((table) => (
          <div className="flex gap-4" key={table.Id}>
            <p>{table.Name}</p>
            <common.Button>View</common.Button>
          </div>
        ))}
      </div>
    </div>
  );
}
