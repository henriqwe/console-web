import * as common from "common";
import * as apiDomains from "domains/api/Editor";

export function App() {
  return (
    <div className="App">
      <common.Header />
      <apiDomains.Editor />
    </div>
  );
}
