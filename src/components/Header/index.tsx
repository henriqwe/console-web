import { Icon } from "@iconify/react";
import { ReactNode } from "react";

export function Header() {
  const headerSections = [
    {
      title: "API",
      icon: <Icon icon="icomoon-free:lab" className="w-4 h-4" />,
      legend: "Test the Ycodify API",
      active: true,
    },
    {
      title: "DATA",
      icon: <Icon icon="dashicons:database" className="w-5 h-5" />,
      legend: "Data & Schema management",
      active: false,
    },
  ];

  return (
    <div className="relative flex items-start w-full bg-gray-600">
      <div className="flex items-center gap-4 w-[20%] px-6 py-1.5">
        <img
          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
          alt="Logo"
        />
        <p className="text-gray-200">Version 1.0.0</p>
      </div>
      <div className="flex items-start justify-start flex-grow pt-6 border-l-2 border-gray-400">
        {headerSections.map((section) => (
          <HeaderSection
            title={section.title}
            icon={section.icon}
            legend={section.legend}
            active={section.active}
          />
        ))}
      </div>
    </div>
  );
}

export function HeaderSection({
  title,
  icon,
  legend,
  active,
}: {
  icon: ReactNode;
  title: string;
  legend: string;
  active: boolean;
}) {
  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 px-4 pb-6 cursor-pointer ${
          active
            ? "after:block after:absolute after:h-1.5 after:bottom-0 after:left-0 after:bg-yellow-400 after:w-full text-yellow-400 "
            : "text-gray-200"
        }`}
        title={legend}
      >
        {icon}
        <p>{title}</p>
      </div>
    </div>
  );
}
// #43495A
