import { Icon } from "@iconify/react";
import { useState } from "react";

export function DataSideBar() {
  const [activeSchema, setActiveSchema] = useState<string>();
  const [activeTable, setActiveTable] = useState<string>();
  const Databases = [
    {
      Name: "Mercado",
      Schemas: [
        { Name: "Franquias", Tables: [{ Name: "Funcionarios" }] },
        {
          Name: "Financeiro",
          Tables: [{ Name: "Contas" }, { Name: "Assinaturas" }],
        },
      ],
    },
  ];

  return (
    <div className="w-[20%] px-6 pt-10 text-gray-600">
      {Databases.map((database) => (
        <div key={database.Name}>
          <div className="flex items-center gap-2 pb-2 cursor-pointer">
            <Icon icon="bxs:down-arrow" className="w-4 h-4" />
            <Icon icon="dashicons:database" className="w-6 h-6" />
            <p className="text-xl">{database.Name}</p>
          </div>

          {database.Schemas.map((schema) => (
            <div key={schema.Name}>
              <div
                className={`flex items-center gap-2 pb-2 ml-4 cursor-pointer ${
                  activeSchema === `${database.Name}${schema.Name}` &&
                  "text-orange-400"
                }`}
                onClick={() => {
                  setActiveSchema(`${database.Name}${schema.Name}`);
                  setActiveTable(undefined);
                }}
              >
                <Icon
                  icon="bxs:right-arrow"
                  className={`w-4 h-4 transition ${
                    activeSchema === `${database.Name}${schema.Name}` &&
                    "rotate-90"
                  }`}
                />

                {activeSchema === `${database.Name}${schema.Name}` ? (
                  <Icon
                    icon="ant-design:folder-open-filled"
                    className="w-6 h-6"
                  />
                ) : (
                  <Icon icon="ant-design:folder-filled" className="w-6 h-6" />
                )}
                <p className="text-lg">{schema.Name}</p>
              </div>
              {activeSchema === `${database.Name}${schema.Name}` &&
                schema.Tables.map((table) => (
                  <div key={table.Name}>
                    <div
                      className={`flex items-center gap-2 pb-2 ml-14 cursor-pointer ${
                        activeTable ===
                          `${database.Name}${schema.Name}${table.Name}` &&
                        "text-orange-400"
                      }`}
                      onClick={() => {
                        setActiveTable(
                          `${database.Name}${schema.Name}${table.Name}`
                        );
                      }}
                    >
                      <Icon icon="bi:table" className="w-5 h-5" />
                      <p className="text-lg">{table.Name}</p>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
