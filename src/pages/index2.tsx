/* This example requires Tailwind CSS v2.0+ */
import * as data from "domains/data";
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
  { name: "Home", href: "#", icon: HomeIcon },
  { name: "Data", href: "#", icon: DatabaseIcon },
  { name: "Users", href: "#", icon: UserIcon },
];

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <data.DataProvider>
      <div className="flex h-full min-h-[100vh]">
        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setMobileMenuOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex flex-col flex-1 w-full max-w-xs bg-white focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 pt-4 -mr-12">
                      <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="pt-5 pb-4">
                    <div className="flex items-center flex-shrink-0 px-4">
                      <img
                        className="w-auto h-8"
                        src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                        alt="Workflow"
                      />
                    </div>
                    <nav aria-label="Sidebar" className="mt-5">
                      <div className="px-2 space-y-1">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            title={item.name}
                            className="flex items-center p-2 text-base font-medium text-gray-600 rounded-md group hover:bg-gray-50 hover:text-gray-900"
                          >
                            <item.icon
                              className="w-6 h-6 mr-4 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </nav>
                  </div>
                  <div className="flex flex-shrink-0 p-4 border-t border-gray-200">
                    <a href="#" className="flex-shrink-0 block group">
                      <div className="flex items-center">
                        <div>
                          <img
                            className="inline-block w-10 h-10 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                            Account Settings
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-20">
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto bg-indigo-600">
              <div className="flex-1">
                <div className="flex items-center justify-center py-4 bg-indigo-700">
                  <img
                    className="w-auto h-8"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                    alt="Workflow"
                  />
                </div>
                <nav
                  aria-label="Sidebar"
                  className="flex flex-col items-center py-6 space-y-3"
                >
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center p-4 text-indigo-200 rounded-lg hover:bg-indigo-700"
                    >
                      <item.icon className="w-6 h-6" aria-hidden="true" />
                      <span className="sr-only">{item.name}</span>
                    </a>
                  ))}
                </nav>
              </div>
              <div className="flex flex-shrink-0 pb-5">
                <a href="#" className="flex-shrink-0 w-full">
                  <img
                    className="block w-10 h-10 mx-auto rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                  <div className="sr-only">
                    <p>{user.name}</p>
                    <p>Account settings</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Mobile top navigation */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-indigo-600 sm:px-6 lg:px-8">
              <div>
                <img
                  className="w-auto h-8"
                  src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
                  alt="Workflow"
                />
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-12 h-12 -mr-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <MenuIcon className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <main className="flex flex-1 overflow-hidden">
            {/* Primary column */}
            <section
              aria-labelledby="primary-heading"
              className="flex w-[80%] h-full min-w-0 overflow-y-auto lg:order-last"
            >
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
              {/* Your content */}
            </section>

            {/* Secondary column (hidden on smaller screens) */}

            <data.DataSideBar />
            {/* <aside className="w-[20%] bg-orange-300">
            <div className="relative flex flex-col h-full overflow-y-auto bg-white border-r border-gray-200">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
              laboriosam aspernatur maxime voluptates quae asperiores autem
              labore. Earum nemo aperiam ducimus officiis hic ipsam eaque, odio
              aliquam dolorem? Minus, corporis.
            </div>
          </aside> */}
          </main>
        </div>
      </div>
    </data.DataProvider>
  );
}
