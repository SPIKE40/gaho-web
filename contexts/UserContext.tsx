//import { createSupabaseClient } from "@/lib/supabase/client";
//import { User } from "@supabase/supabase-js";
import {
  createContext,
  //ReactNode,
  useContext,
  // useEffect,
  // useState,
} from "react";

export type User = {
  id: string;
};

type UserContentType = {
  getUser: () => Promise<User | undefined>;
  user: User | undefined;
  loading: boolean;
};

const testUser: UserContentType = {
  getUser: async () => {
    return {
      id: "test",
    };
  },
  user: {
    id: "test",
  },
  loading: false,
};

const UserContext = createContext<UserContentType | undefined>(testUser);

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User>();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user || typeof window === "undefined") return;

//     getUser();
//   }, []);

//   async function getUser() {
//     if (user) {
//       setLoading(false);
//       return user;
//     }

//     const supabase = createSupabaseClient();

//     const {
//       data: { user: supabaseUser },
//     } = await supabase.auth.getUser();
//     setUser(supabaseUser || undefined);
//     setLoading(false);
//     return supabaseUser || undefined;
//   }

//   const contextValue: UserContentType = {
//     getUser,
//     user,
//     loading,
//   };

//   return (
//     <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
//   );
// }

export function useUserContext() {
  const context = useContext(UserContext);
  console.log(context);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
