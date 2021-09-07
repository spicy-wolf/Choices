import { useLocation } from 'react-router-dom';

// https://reactrouter.com/web/example/query-parameters
export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
