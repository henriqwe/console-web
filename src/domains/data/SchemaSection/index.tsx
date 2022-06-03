import * as data from "domains/data";

export function SchemaSection() {
  const { selectedItem } = data.useData();
  return (
    <div>
      <p className="text-xs text-gray-500">
        You are here: {selectedItem?.location}
      </p>
      <p className="mt-3 text-xl font-bold text-gray-700">
        {selectedItem?.name}
      </p>
    </div>
  );
}
