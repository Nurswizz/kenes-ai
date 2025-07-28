interface headers {
  [key: string]: string;
}

const useApi = () => {
  const apiUrl = import.meta.env.VITE_API_URL!;

  const fetchData = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    try {
      const token = localStorage.getItem('accessToken');

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      } as headers;

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "GET",
        ...options,
        credentials: "include",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
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
