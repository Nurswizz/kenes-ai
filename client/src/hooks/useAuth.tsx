import useApi from "./useApi";

interface AuthUser {
    accessToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

const useAuth = () => {
    const { fetchData } = useApi();
    const login = (user: AuthUser) => {
        localStorage.setItem('user', JSON.stringify(user.user));
        localStorage.setItem('accessToken', user.accessToken || '');
        localStorage.setItem('language', "ru");
    }

    const logout = async () => {
        await fetchData('/auth/logout', { method: 'POST' });
        localStorage.clear();
        window.location.href = '/auth/login';
    }

    const isAuthenticated = () => {
        const user = localStorage.getItem('user');
        return user !== null;
    }

    return { login, logout, isAuthenticated };
}

export default useAuth;