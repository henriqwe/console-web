/* This example requires Tailwind CSS v2.0+ */
import * as data from "domains/data";
import * as common from "common";
import { Icon } from "@iconify/react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CodeMirror from "@uiw/react-codemirror";
import {
  HomeIcon,
  MenuIcon,
  DatabaseIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline";

const user = {
  name: "Emily Selman",
  email: "emily.selman@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Home", href: "http://localhost:3000/index2", icon: HomeIcon },
  { name: "Data", href: "#", icon: DatabaseIcon },
  { name: "Users", href: "http://localhost:3000/index3", icon: UserIcon },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <data.DataProvider>
      <common.Template
        menuItens={navigation}
        user={user}
        leftContent={<data.DataSideBar />}
        rightContent={
          <>
            <div className="w-[50%]">
              <div className="flex items-center w-full h-12 px-4 bg-gray-200 border-gray-300 ring-1 ring-gray-300 border-x">
                <p>YCode Console</p>
                <button className="p-2 ml-4 bg-gray-400 rounded-full">
                  <Icon
                    icon="bxs:right-arrow"
                    className={`w-4 h-4 transition`}
                  />
                </button>
              </div>
              <div className="flex flex-col bg-gray-200 border-2">
                <div>
                  <CodeMirror
                    value={`# Looks like you do not have any tables.\n# Click on the 'Data' tab on top to create tables\n# Try out YCode queries here after you create tables;`}
                    height="50vh"
                    onChange={(value, viewUpdate) => {
                      console.log("value:", value);
                    }}
                  />
                </div>
                <div className="flex w-full p-2 pb-0 pl-8 bg-gray-200 ring-1 ring-gray-300">
                  Query variables
                </div>
                <div>
                  <CodeMirror
                    value=""
                    height="35vh"
                    onChange={(value, viewUpdate) => {
                      console.log("value:", value);
                    }}
                  />
                </div>
              </div>
              <div className=""></div>
            </div>
            <div className="w-[50%]">
              <div className="flex w-full p-3 px-4 pl-8 bg-gray-200 ring-1 ring-gray-300">
                Response
              </div>
              <CodeMirror
                value=""
                height="90vh"
                onChange={(value, viewUpdate) => {
                  console.log("value:", value);
                }}
                editable={false}
              />
            </div>
          </>
        }
      />
    </data.DataProvider>
  );
}
