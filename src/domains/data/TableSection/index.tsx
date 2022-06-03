import * as data from "domains/data";

export function TableSection() {
  const { selectedItem } = data.useData();
  return (
    <div>
      <p className="text-xs text-gray-500">
        You are here: {selectedItem?.location}
      </p>
      <p>Table</p>
    </div>
  );
}
