import React, { createContext } from "react";
import { initFirebase } from "./Utils";

import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export const UserContext = createContext(null);

const app = initFirebase();

export const auth = getAuth(app);

export default function UserProvider({ children }) {
    const [user] = useAuthState(auth);

    return (
      <UserContext.Provider value={user}>
          {children}
      </UserContext.Provider>
    );
}