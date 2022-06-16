import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
  Dispatch,
} from "react";
type DataContextProps = {
  selectedItem?: SelectedItem;
  setSelectedItem: Dispatch<SetStateAction<SelectedItem | undefined>>;
};

type SelectedItem = {
  type: "schema" | "table";
  name: string;
  location: string;
  id: string;
};

type ProviderProps = {
  children: ReactNode;
};

export const DataContext = createContext<DataContextProps>(
  {} as DataContextProps
);

export const DataProvider = ({ children }: ProviderProps) => {
  const [selectedItem, setSelectedItem] = useState<{
    type: "schema" | "table";
    name: string;
    location: string;
    id: string;
  }>();

  return (
    <DataContext.Provider
      value={{
        selectedItem,
        setSelectedItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
