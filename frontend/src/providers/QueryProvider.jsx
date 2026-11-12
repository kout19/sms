// frontend/src/providers/QueryProvider.jsx
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then(
        ({ ReactQueryDevtools: Devtools }) => ({ default: Devtools }),
      ),
    )
  : null;

// One QueryClient instance for the whole app. Sensible SMS-wide defaults:
// - staleTime: data doesn't refetch on every component mount within 30s,
//   since most school data (teachers, classes) doesn't change second-to-second
// - retry: 1, not the default 3 - fail fast and let error UI show, rather
//   than silently retrying 3x on a real backend error (e.g. 403)
// - refetchOnWindowFocus: false - a School Admin tabbing back in shouldn't
//   trigger a burst of refetches across every open panel
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0, // never auto-retry a create/update/delete - could double-submit
    },
  },
});

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
