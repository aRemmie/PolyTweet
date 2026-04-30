import $api from '../app/api/api';
import type {
    InternalFeaturesAuthTransportHttpProfileResponse,
    InternalFeaturesAuthTransportHttpUpdateProfileRequest,
    InternalFeaturesAuthTransportHttpUpdateProfileResp,
    InternalFeaturesAuthTransportHttpUploadAvatarResponse,
    GithubComTryingmyb3StPolyTweetInternalCoreDomainPost,
} from '../generated/data-contracts';

interface UserPostsResponse {
    posts: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[];
    pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
}

export class UserService {
    static async getProfile(
        userId: string,
    ): Promise<InternalFeaturesAuthTransportHttpProfileResponse> {
        const response = await $api.get(`/users/${userId}/profile`);
        return response.data;
    }

    static async getUserPosts(
        userId: string,
        page: number = 1,
        pageSize: number = 15,
    ): Promise<UserPostsResponse> {
        const response = await $api.get<UserPostsResponse>(`/users/${userId}/posts`, {
            params: {
                page,
                page_size: pageSize,
            },
        });
        return response.data;
    }

    static async updateProfile(
        data: InternalFeaturesAuthTransportHttpUpdateProfileRequest,
    ): Promise<InternalFeaturesAuthTransportHttpUpdateProfileResp> {
        const response = await $api.put('/profile/update', data);
        return response.data;
    }

    static async uploadAvatar(
        file: File,
    ): Promise<InternalFeaturesAuthTransportHttpUploadAvatarResponse> {
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
