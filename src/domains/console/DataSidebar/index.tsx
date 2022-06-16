import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import * as common from "common";
import * as data from "domains/console";
import axios from "axios";
import { getCookie, setCookie } from "utils/cookies";

export function DataSideBar() {
  const { setSelectedItem } = data.useData();
  const [tables, setTables] = useState<string[]>([]);
  const [activeSchema, setActiveSchema] = useState<string>();
  const [schemas, setSchemas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTable, setActiveTable] = useState<string>();

  async function loadSchemas() {
    const { data } = await axios.get("http://localhost:3000/api/schemas", {
      headers: {
        Authorization: `Bearer ${getCookie("access_key")}`,
      },
    });
    setSchemas(data.data);
  }

  async function loadTables() {
    const { data } = await axios.get(
      `http://localhost:3000/api/schema?schemaName=${activeSchema}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_key")}`,
        },
      }
    );
    setTables(Object.keys(data.data) as string[]);
    setLoading(false);
  }

  useEffect(() => {
    loadSchemas();
  }, []);

  useEffect(() => {
    if (activeSchema) {
      loadTables();
    }
  }, [activeSchema]);

  return (
    <div className="w-[20%] text-gray-600">
      <div className="flex w-full p-3 px-4 pl-8 bg-gray-200 ring-1 ring-gray-300">
        <p>Explorer</p>
      </div>

      <div className="px-6 mt-10">
        {schemas.map((schema) => (
          <div key={schema}>
            <div
              className={`flex items-center gap-2 pb-2 cursor-pointer ${
                activeSchema === `${schema}` && "text-orange-400"
              }`}
              onClick={() => {
                setSelectedItem({
                  type: "schema",
                  name: schema,
                  location: `${schema}`,
                  id: schema,
                });
                setActiveSchema(`${schema}`);
                setActiveTable(undefined);
                setLoading(true);
              }}
            >
              <Icon
                icon="bxs:right-arrow"
                className={`w-4 h-4 transition ${
                  activeSchema === `${schema}` && "rotate-90"
                }`}
              />

              {activeSchema === `${schema}` ? (
                <Icon
                  icon="ant-design:folder-open-filled"
                  className="w-5 h-5"
                />
              ) : (
                <Icon icon="ant-design:folder-filled" className="w-5 h-5" />
              )}
              <p className="text-sm">{schema}</p>
            </div>
            {loading}
            {activeSchema === schema &&
              (loading ? (
                <div className="w-5 h-5 ml-8">
                  <common.Spinner />
                </div>
              ) : (
                tables.map((table) => (
                  <div key={table}>
                    <div
                      className={`flex items-center gap-2 pb-2 ml-8 cursor-pointer ${
                        activeTable === `${schema}${table}` && "text-orange-400"
                      }`}
                      onClick={() => {
                        setSelectedItem({
                          type: "table",
                          name: table,
                          location: `${schema} > ${table}`,
                          id: table,
                        });
                        setActiveTable(`${schema}${table}`);
                      }}
                    >
                      <Icon icon="bi:table" className="w-4 h-4" />
                      <p className="text-sm">{table}</p>
                    </div>
                  </div>
                ))
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
