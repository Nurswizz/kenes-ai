import { createContext, useContext, useEffect, useState } from "react";
import memberstack from "@memberstack/dom";

const MemberstackContext = createContext<any>(null);

export const MemberstackProvider = ({ children }: { children: React.ReactNode }) => {
  const [ms, setMs] = useState<any>(null);

  useEffect(() => {
    const msInstance = memberstack.init({
      publicKey: import.meta.env.VITE_MEMBERSTACK_PUBLIC_KEY!,
      useCookies: true,
    });
    setMs(msInstance);
  }, []);

  return (
    <MemberstackContext.Provider value={ms}>
      {children}
    </MemberstackContext.Provider>
  );
};

export const useMemberstack = () => {
  return useContext(MemberstackContext);
};
