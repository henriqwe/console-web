import * as data from "domains/data";

export function Main() {
  const { selectedItem } = data.useData();
  return (
    <div className="w-[80%] bg-slate-100 border-l-gray-300 border-l-2 p-7">
      {!selectedItem && (
        <div>
          <p className="text-xl">Select a schema to see the data</p>
        </div>
      )}
      {selectedItem?.type === "table" && <data.TableSection />}
      {selectedItem?.type === "schema" && <data.SchemaSection />}
    </div>
  );
}
