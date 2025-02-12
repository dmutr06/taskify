import { useContext } from "react";
import { createContext } from "react";
import type { User } from "types/user.interface";

export const AuthContext = createContext<{ token: string, user: User } | null>(null);

export function useAuth() {
  const data = useContext(AuthContext);
  
  return data!;
}
