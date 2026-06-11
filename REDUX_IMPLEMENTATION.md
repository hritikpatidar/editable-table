# Redux Implementation with Redux Persist

## Overview
This project now uses **Redux** for centralized state management with **Redux Persist** to automatically save and restore state from localStorage across page refreshes.

## Features Implemented ✅

### State Persistence
- **Filters** (nameFilter, emailFilter, salaryFilter) - Persisted
- **Pagination** (page, rowsPerPage) - Persisted  
- **Sorting** (sortField, sortDirection) - Persisted
- **Table Data** (rows, undoHistory) - Persisted
- **Editing State** - NOT persisted (temporary state only)

### Benefits
1. **Filters survive refresh** - User filters remain applied after page reload
2. **Pagination state preserved** - Current page and rows per page settings retained
3. **Sort order maintained** - Column sorting preference persists
4. **Data consistency** - Employee data and edit history preserved
5. **Automatic persistence** - No manual save required, uses localStorage

## Project Structure

```
src/
├── redux/
│   ├── store.ts                 # Redux store configuration with Redux Persist
│   ├── hooks.ts                 # Custom Redux hooks for cleaner component code
│   └── slices/
│       ├── tableDataSlice.ts    # Employee data & undo history
│       ├── filtersSlice.ts      # Filter states
│       ├── paginationSlice.ts   # Pagination states
│       ├── sortSlice.ts         # Sort states
│       └── editingSlice.ts      # Temporary editing states
├── components/
│   ├── EditableTable.tsx        # Main table using Redux hooks
│   ├── TableToolbar.tsx         # Filter controls
│   └── Pagination.tsx           # Pagination controls
├── App.tsx                      # Redux Provider & PersistGate wrapper
└── main.tsx                     # Entry point
```

## Redux Slices Explanation

### 1. **tableDataSlice**
```typescript
- State: rows (Employee[]), undoHistory (Employee[][])
- Actions: setRows, updateRow, addUndoHistory, undo, clearUndoHistory
```
Manages employee records and maintains undo history for edit operations.

### 2. **filtersSlice**
```typescript
- State: nameFilter, emailFilter, salaryFilter (strings)
- Actions: setNameFilter, setEmailFilter, setSalaryFilter, clearFilters
```
Controls all filter inputs. Persisted to localStorage.

### 3. **paginationSlice**
```typescript
- State: page (number), rowsPerPage (number)
- Actions: setPage, setRowsPerPage
```
Manages table pagination. Automatically resets to page 0 when rowsPerPage changes.

### 4. **sortSlice**
```typescript
- State: sortField (keyof Employee), sortDirection ("asc" | "desc")
- Actions: setSortField, setSortDirection, setSort
```
Tracks column sorting preferences.

### 5. **editingSlice**
```typescript
- State: editingRowId, draftRow, hasUnsavedChanges
- Actions: startEditing, updateDraftRow, cancelEditing, clearEditing
```
Temporary state for row editing - NOT persisted (cleared on refresh).

## Redux Persist Configuration

Located in `src/redux/store.ts`:

```typescript
// Custom async localStorage adapter
const customLocalStorage = {
  getItem: async (key) => Promise.resolve(window.localStorage.getItem(key)),
  setItem: async (key, value) => { window.localStorage.setItem(key, value); },
  removeItem: async (key) => { window.localStorage.removeItem(key); }
};

// Each reducer persisted independently
persistReducer(filtersPersistConfig, filtersReducer)
persistReducer(paginationPersistConfig, paginationReducer)
persistReducer(sortPersistConfig, sortReducer)
persistReducer(tableDataPersistConfig, tableDataReducer)
// Editing NOT persisted
```

## Custom Redux Hooks

File: `src/redux/hooks.ts`

Provides convenient hooks for components:

```typescript
// Use in components
const { nameFilter, setNameFilter, clearFilters } = useFilters();
const { page, rowsPerPage, setPage } = usePagination();
const { sortField, sortDirection, setSort } = useSort();
const { editingRowId, draftRow, startEditing } = useEditing();
const { rows, undoHistory, updateRow, undo } = useTableData();
```

## Component Integration

### App.tsx
```typescript
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  </PersistGate>
</Provider>
```

### EditableTable.tsx
```typescript
// Using Redux hooks instead of useState + Context
const filters = useFilters();
const pagination = usePagination();
const sort = useSort();
const editing = useEditing();
const tableData = useTableData();

// Dispatch actions on user interaction
const handleFilterChange = (name: string) => {
  dispatch(setNameFilter(name));
};
```

## Testing Persistence

1. **Open the app** - Initial load with all 10,000 employees
2. **Apply a filter** - E.g., type "Employee 5" in name filter
3. **Observe changes** - Table filters, total count updates
4. **Refresh page** - Press F5 or refresh button
5. **Verify persistence** - Filter value remains in input, filtered results show
6. **Clear filter** - Click "Clear" button to reset all filters

## localStorage Structure

After filtering, you'll see in DevTools > Application > LocalStorage:

```
filters: {
  "nameFilter": "Employee 5",
  "emailFilter": "",
  "salaryFilter": ""
}

pagination: {
  "page": 0,
  "rowsPerPage": 25
}

sort: {
  "sortField": "id",
  "sortDirection": "asc"
}

tableData: {
  "rows": [...],
  "undoHistory": [...]
}
```

## Middleware & Performance

Redux Toolkit middleware is configured with:
- **SerializableStateInvariantMiddleware** - Checks state is serializable
- **ImmutableStateInvariantMiddleware** - Ensures immutable updates
- **Custom serialization check** - Ignores persist actions (PERSIST, REHYDRATE, etc.)

**Note**: Development warnings about middleware timing >32ms are normal for 10,000 rows. Disabled in production builds.

## Benefits Over Previous Context API

| Feature | Context API | Redux + Persist |
|---------|------------|-----------------|
| **State Persistence** | Manual implementation needed | Automatic via Redux Persist |
| **Performance** | Re-renders entire provider tree | Selective subscriptions |
| **Undo/Redo** | Manual tracking in state | Built-in with Redux actions |
| **Time-travel Debugging** | Not possible | Redux DevTools support |
| **Middleware** | Not available | Extensible middleware system |

## Future Enhancements

1. **Redux DevTools Integration** - For time-travel debugging
2. **Selective Persistence** - Persist only specific fields
3. **Encryption** - Secure sensitive data in localStorage
4. **Sync Across Tabs** - Update state when data changes in another tab
5. **Offline Support** - Complete offline-first capabilities

## Package Versions

```json
{
  "@reduxjs/toolkit": "^1.x.x",
  "react-redux": "^8.x.x",
  "redux-persist": "^6.x.x"
}
```

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Persist Documentation](https://github.com/rt2zz/redux-persist)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
