const useApi = () => {
  const apiUrl = import.meta.env.VITE_API_URL!;

  const fetchData = async <T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 1
  ): Promise<T> => {
    try {
      const token = localStorage.getItem('accessToken');

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${apiUrl}${endpoint}`, {
        ...options,
        method: options.method ?? "GET",
        credentials: "include",
        headers,
      });

      if ((response.status === 401) && token) {
        if (retryCount === 0) {
          console.error("Session expired, redirecting to login.");
          localStorage.clear();
          window.location.href = '/auth/login';
          throw new Error("Session expired.");
        }

        const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!refreshResponse.ok) {
          localStorage.clear();
          window.location.href = '/auth/login';
        }

        const data = await refreshResponse.json();
        localStorage.setItem('accessToken', data.accessToken);

        return fetchData<T>(endpoint, options, retryCount - 1);
      }

      if (!response.ok) {
        const errorData = await response.json();
        return Promise.reject({ error: errorData || "An error occurred" });
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  };

  return { fetchData };
};

export default useApi;
