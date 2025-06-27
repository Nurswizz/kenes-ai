const useApi = () => {
    const apiUrl = import.meta.env.VITE_API_URL!;
    
    const fetchData = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
        try {
        const response = await fetch(`${apiUrl}${endpoint}`, {
            ...options,
            headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            },
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return await response.json();
        } catch (error: unknown) {
        console.error('Fetch error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(String(error));
        }
    };
    
    return { fetchData };
}

export default useApi;