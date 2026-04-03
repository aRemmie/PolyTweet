import {create} from "zustand";
import {persist} from "zustand/middleware/persist";
import AuthService from "@services/AuthService";


interface AuthState {
    isAuth: boolean;
    userId: number | null;
    email: string | null;
    isLoading: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, group_name: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    userId: null,
    email: null,
    isAuth: false,
    isLoading: false,

    async login(email: string, password: string) {
        try {
            set({isLoading: true});
            const { data } = await AuthService.login(email, password);
            localStorage.setItem('token', data.access_token);
            set({email: email, isAuth: true});
        } catch (e) {
            console.log(e)
        } finally {
            set({isLoading: false});
        }
    },

    async register(email: string, password: string, group_name: string) {
        try {
            set({isLoading: true});
            console.log(email, password, group_name);
            const { data } = await AuthService.register(email, password, group_name);
            console.log(data);
            set({ userId: data.id })
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            set({isLoading: false});
        }
    }

}))