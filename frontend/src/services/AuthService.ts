import {AxiosResponse} from "axios";
import {LoginResponse} from "@models/response/LoginResponse";
import $api from "@api/api";
import {RegisterResponse} from "@models/response/RegisterResponse";


export default class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<LoginResponse>> {
        return $api.post<LoginResponse>('v1/auth/login', {email, password})
    }

    static async register(email: string, password: string, group_name: string): Promise<AxiosResponse<RegisterResponse>> {
        return $api.post<RegisterResponse>('v1/auth/register', {email, password, group_name})
    }

    static async logout(): Promise<AxiosResponse> {
        return $api.post('v1/auth/logout')
    }
}