import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import tableDataReducer from "./slices/tableDataSlice";
import filtersReducer from "./slices/filtersSlice";
import paginationReducer from "./slices/paginationSlice";
import sortReducer from "./slices/sortSlice";
import editingReducer from "./slices/editingSlice";

const customLocalStorage = {
  getItem: async (key: string) => {
    try {
      const value = window.localStorage.getItem(key);
      return Promise.resolve(value);
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
      return Promise.resolve(null);
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
      return Promise.reject(error);
    }
  },
  removeItem: async (key: string) => {
    try {
      window.localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
      return Promise.reject(error);
    }
  },
};

const tableDataPersistConfig = {
  key: "tableData",
  storage: customLocalStorage,
};

const filtersPersistConfig = {
  key: "filters",
  storage: customLocalStorage,
};

const paginationPersistConfig = {
  key: "pagination",
  storage: customLocalStorage,
};

const sortPersistConfig = {
  key: "sort",
  storage: customLocalStorage,
};

export const store = configureStore({
  reducer: {
    tableData: persistReducer(tableDataPersistConfig, tableDataReducer),
    filters: persistReducer(filtersPersistConfig, filtersReducer),
    pagination: persistReducer(paginationPersistConfig, paginationReducer),
    sort: persistReducer(sortPersistConfig, sortReducer),
    editing: editingReducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PURGE",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
