import { createContext, useContext, useEffect, useState } from "react";
import memberstack from "@memberstack/dom";

const MemberstackContext = createContext<any>(null);

export const MemberstackProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [ms, setMs] = useState<any>(null);

  useEffect(() => {
    const initMemberstack = async () => {
      const msInstance = await memberstack.init({
        publicKey: import.meta.env.VITE_MEMBERSTACK_PUBLIC_KEY!,
        useCookies: true,
      });
      setMs(msInstance);
    };

    initMemberstack();
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

export const useMemberstackReady = () => {
  const ms = useMemberstack();
  return ms !== null && typeof ms.getMemberCookie === "function";
}
