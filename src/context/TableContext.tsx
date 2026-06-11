import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { Employee } from "../types/employee";
import { generateData } from "../data/generateData";

interface TableContextType {
  rows: Employee[];
  setRows: React.Dispatch<React.SetStateAction<Employee[]>>;
}

const TableContext = createContext<TableContextType | null>(null);
interface TableProviderProps {
  children: ReactNode;
}

export const TableProvider = ({ children, }: TableProviderProps) => {
  const [rows, setRows] = useState<Employee[]>(generateData(10000));
  return (
    <TableContext.Provider
      value={{
        rows,
        setRows,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) { throw new Error("useTable must be used inside TableProvider"); }
  return context;
};