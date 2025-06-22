const useApi = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const fetchData = async (endpoint: string, options: RequestInit = {}) => {
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
        } catch (error) {
        console.error('Fetch error:', error);
        throw error;
        }
    };
    
    return { fetchData };
}

export default useApi;