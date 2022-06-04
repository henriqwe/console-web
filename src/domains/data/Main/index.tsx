import * as data from "domains/data";

export function Main() {
  const { selectedItem } = data.useData();
  return (
    <div className="w-[80%] bg-slate-100 border-l-gray-300 border-l-2">
      {!selectedItem && (
        <div className="p-7">
          <p className="text-xl">Select a schema to see the data</p>
        </div>
      )}
      {selectedItem?.type === "schema" && <data.SchemaSection />}
      {selectedItem?.type === "table" && <data.TableSection />}
    </div>
  );
}
