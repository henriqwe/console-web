import { Icon } from "@iconify/react";
import { useState } from "react";
import * as data from "domains/data";

export function DataSideBar() {
  const { setSelectedItem } = data.useData();
  const [activeSchema, setActiveSchema] = useState<string>();
  const [activeTable, setActiveTable] = useState<string>();
  const Databases = [
    {
      id: "1",
      schema_name: "Mercado",
      schemas: [
        {
          id: "12",
          tag: "Franquias",
          Tables: [{ Name: "Funcionarios", id: "121" }],
        },
        {
          id: "13",
          tag: "Financeiro",
          Tables: [{ Name: "Contas", id: '131' }, { Name: "Assinaturas", id: "132" }],
        },
      ],
    },
  ];

  return (
    <div className="w-[20%] px-6 pt-10 text-gray-600">
      {Databases.map((database) => (
        <div key={database.schema_name}>
          <div className="flex items-center gap-2 pb-2 cursor-pointer">
            <Icon icon="bxs:down-arrow" className="w-4 h-4" />
            <Icon icon="dashicons:database" className="w-5 h-5" />
            <p className="text-base">{database.schema_name}</p>
          </div>

          {database.schemas.map((schema) => (
            <div key={schema.tag}>
              <div
                className={`flex items-center gap-2 pb-2 ml-4 cursor-pointer ${
                  activeSchema === `${database.schema_name}${schema.tag}` &&
                  "text-orange-400"
                }`}
                onClick={() => {
                  setSelectedItem({
                    type: "schema",
                    name: schema.tag,
                    location: `${database.schema_name} > ${schema.tag}`,
                    id: schema.id,
                  });
                  setActiveSchema(`${database.schema_name}${schema.tag}`);
                  setActiveTable(undefined);
                }}
              >
                <Icon
                  icon="bxs:right-arrow"
                  className={`w-4 h-4 transition ${
                    activeSchema === `${database.schema_name}${schema.tag}` &&
                    "rotate-90"
                  }`}
                />

                {activeSchema === `${database.schema_name}${schema.tag}` ? (
                  <Icon
                    icon="ant-design:folder-open-filled"
                    className="w-5 h-5"
                  />
                ) : (
                  <Icon icon="ant-design:folder-filled" className="w-5 h-5" />
                )}
                <p className="text-sm">{schema.tag}</p>
              </div>
              {activeSchema === `${database.schema_name}${schema.tag}` &&
                schema.Tables.map((table) => (
                  <div key={table.Name}>
                    <div
                      className={`flex items-center gap-2 pb-2 ml-14 cursor-pointer ${
                        activeTable ===
                          `${database.schema_name}${schema.tag}${table.Name}` &&
                        "text-orange-400"
                      }`}
                      onClick={() => {
                        setSelectedItem({
                          type: "table",
                          name: table.Name,
                          location: `${database.schema_name} > ${schema.tag} > ${table.Name}`,
                          id: table.id,
                        });
                        setActiveTable(
                          `${database.schema_name}${schema.tag}${table.Name}`
                        );
                      }}
                    >
                      <Icon icon="bi:table" className="w-4 h-4" />
                      <p className="text-sm">{table.Name}</p>
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
