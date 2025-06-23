import memberstackDOM from "@memberstack/dom";


const useAuthModal = () => {
    const memberstack = memberstackDOM.init({
        publicKey: import.meta.env.VITE_MEMBERSTACK_PUBLIC_KEY,
    })

    const register = async (email: string, password: string): Promise<any> => {
        try {
            const response = await memberstack.signupMemberEmailPassword({
                email: email,
                password: password,
            });
            return response;
        } catch (error) {
            console.error("Registration error:", error);
            return {error: error};
        }
    }

    const login = async (email: string, password: string): Promise<any> => {
        try {
            const response = await memberstack.loginMemberEmailPassword({
                email: email,
                password: password,
            });
            return response;
        } catch (error) {
            console.error("Login error:", error);
            return {error: error};
        }
    }

    const logout = async () => {
        try {
            await memberstack.logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    const isLoggedIn = () => {
        return memberstack.getCurrentMember() !== null;
    }

    return {
        register,
        login,
        logout,
        isLoggedIn,
        memberstack
    }

}

export default useAuthModal;