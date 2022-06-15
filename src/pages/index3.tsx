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
        leftContent={<div className="bg-orange-300 ">
          k
        </div>}
        rightContent={<div className="w-full bg-blue-300">
          o
        </div>}
      />
    </data.DataProvider>
  );
}
