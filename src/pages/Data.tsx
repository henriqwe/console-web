import * as commom from "common";
import * as data from "domains/data";

export function Data() {
  return (
    <data.DataProvider>
      <div className="h-screen">
        <commom.Header />
        <div className="flex w-full h-[91.5%]">
          <data.DataSideBar />
          <data.Main />
        </div>
      </div>
    </data.DataProvider>
  );
}
