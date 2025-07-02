import { useMemberstack } from "../context/MemberstackProvider";

const useApi = () => {
  const apiUrl = import.meta.env.VITE_API_URL!;
  const memberstack = useMemberstack();

  const fetchData = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      let token: string | undefined = undefined;

      if (memberstack && typeof memberstack.getMemberCookie === "function") {
        token = await memberstack.getMemberCookie();
        console.log("Memberstack token:", token);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "GET",
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      if (error instanceof Error) throw error;
      throw new Error(String(error));
    }
  };

  return { fetchData };
};

export default useApi;
