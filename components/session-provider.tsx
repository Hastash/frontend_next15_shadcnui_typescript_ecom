// app/components/SessionProvider.tsx
"use client";

import { createContext, useContext } from "react";

type SessionContextType = {
  user?: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
};

const SessionContext = createContext<SessionContextType | null>(null);

export function useSession() {
  return useContext(SessionContext);
}

export default function SessionProvider({
  session,
  children,
}: {
  session: SessionContextType;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
