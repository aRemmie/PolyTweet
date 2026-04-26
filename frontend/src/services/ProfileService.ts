import $api from '../app/api/api';
import { Profile as ProfileApi } from '../generated/Profile'; // Путь может отличаться
import { Users as UsersApi } from '../generated/Users';

import { InternalFeaturesAuthTransportHttpUpdateProfileRequest } from '../generated/data-contracts';

const profileClient = new ProfileApi();
const usersClient = new UsersApi();

export class ProfileService {
    static async getProfile(userId: string) {
        const response = await $api.get(`/users/${userId}/profile`);
        return response.data;
    }

    static async updateProfile(data: InternalFeaturesAuthTransportHttpUpdateProfileRequest) {
        const response = await $api.put('/profile/update', data);
        return response.data;
    }

    static async uploadAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await $api.post('/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}
