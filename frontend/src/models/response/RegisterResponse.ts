export interface RegisterResponse {
    id: number,
    email: string,
    is_active: boolean,
    is_superuser: boolean,
    is_verified: boolean,
    group_name: string,
    group_id: string,
}