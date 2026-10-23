import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** false on the server and during hydration, true once the client has taken over (no setState-in-effect). */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
