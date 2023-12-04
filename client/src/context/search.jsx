import { useState, useContext, createContext } from "react";

const SearchContext = createContext();

// eslint-disable-next-line react/prop-types
function SearchProvider({ children }) {
  const [auth, setAuth] = useState({
    keyword: null,
    results: [],
  });

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom Hook
const useSearch = () => useContext(SearchContext);

// eslint-disable-next-line react-refresh/only-export-components
export { useSearch, SearchProvider };
