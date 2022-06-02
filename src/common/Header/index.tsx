import { Icon } from "@iconify/react";
import { useLocation, Link } from "react-router-dom";
import { ReactNode } from "react";

export function Header() {
  const { pathname } = useLocation();
  const headerSections = [
    {
      title: "API",
      icon: <Icon icon="icomoon-free:lab" className="w-4 h-4" />,
      legend: "Test the Ycodify API",
      active: pathname === "/",
      route: "/",
    },
    {
      title: "DATA",
      icon: <Icon icon="dashicons:database" className="w-5 h-5" />,
      legend: "Data & Schema management",
      active: pathname === "/data",
      route: "/data",
    },
  ];

  return (
    <div className="relative flex items-start w-full bg-gray-600 h-[3.4rem]">
      <div className="flex items-center gap-4 w-[20%] px-6 py-1.5 ">
        <img
          src="http://www.ycodify.com/images/logo.png"
          className="w-[70%]"
          alt="Logo"
        />
        <p className="text-xs text-gray-200">V1.0.0</p>
      </div>
      <div className="flex items-center justify-center border-l border-gray-400 h-[3.4rem]">
        {headerSections.map((section) => (
          <HeaderSection
            key={section.title}
            title={section.title}
            icon={section.icon}
            legend={section.legend}
            active={section.active}
            route={section.route}
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
  route,
}: {
  icon: ReactNode;
  title: string;
  legend: string;
  active: boolean;
  route: string;
}) {
  return (
    <Link to={route} className="relative">
      <div
        className={`flex items-center gap-1 px-3 cursor-pointer h-[3.4rem] ${
          active
            ? "after:block after:absolute after:h-1 after:bottom-0 after:left-0 after:bg-yellow-400 after:w-full text-yellow-400 "
            : "text-gray-200"
        }`}
        title={legend}
      >
        {icon}
        <p className="text-xs">{title}</p>
      </div>
    </Link>
  );
}
// #43495A
