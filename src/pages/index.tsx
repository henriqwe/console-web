import * as common from "common";
import CodeMirror from "@uiw/react-codemirror";
export default function Main() {
  return (
    <div>
      <common.Header />
      <div className="grid  grid-cols-12 mt-4 ring-1 ring-gray-300">
        {/* EXPLORER */}
        <div className="col-span-2 ">
          <div className="w-full flex justify-center items-center p-4 font-semibold ring-1 ring-gray-300">
            Explorer
          </div>
          <div className="bg-red-400"></div>
        </div>
        {/* EDITORS */}
        <div className="col-span-10">
          <div className="w-full flex  p-4  ring-1 ring-gray-300 bg-gray-200">
            YCode Console
          </div>
          <div className="border-2 bg-gray-200  flex flex-col">
            <div>
              <CodeMirror
                value={`# Looks like you do not have any tables.\n# Click on the 'Data' tab on top to create tables\n# Try out YCode queries here after you create tables;`}
                height="200px"
                onChange={(value, viewUpdate) => {
                  console.log("value:", value);
                }}
              />
            </div>
            <div className="w-full flex  p-2 pl-8  ring-1 ring-gray-300 bg-gray-200">
              Query variables
            </div>
            <div>
              <CodeMirror
                value=""
                height="200px"
                onChange={(value, viewUpdate) => {
                  console.log("value:", value);
                }}
              />
            </div>
          </div>
          <div className=""></div>
        </div>
      </div>
    </div>
  );
}
