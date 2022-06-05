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
          </div>
        </div>
      </div>
    </div>
  );
}
