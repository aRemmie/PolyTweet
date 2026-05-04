import $api from '../app/api/api';
import type {
    InternalFeaturesPostsTransportHttpCreatePostDTO,
    InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse,
    InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse,
    InternalFeaturesPostsTransportHttpDeletePostDTOResponse,
    InternalFeaturesPostsTransportHttpUploadImageDTOResponse,
    InternalFeaturesPostsTransportHttpSearchPostsDTOResponse,
} from '../generated/data-contracts';

export class PostService {
    static async getFeed(
        page: number = 1,
        pageSize: number = 15,
    ): Promise<InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse> {
        const response =
            await $api.get<InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse>(
                '/posts/all',
                { params: { page, page_size: pageSize } },
            );
        return response.data;
    }

    static async createPost(
        content: string,
        image_url?: string,
        parent_id?: string,
        reply_to?: string,
    ) {
        if (!content || content.trim().length === 0) {
            throw new Error('Post content cannot be empty');
        }
        const request: InternalFeaturesPostsTransportHttpCreatePostDTO = {
            content: content.trim(),
            image_url: image_url || undefined,
            parent_id: parent_id || undefined,
            reply_to: reply_to || undefined,
        };
        const response = await $api.post('/posts/create', request);
        return response.data;
    }

    static async uploadImage(
        file: File,
    ): Promise<InternalFeaturesPostsTransportHttpUploadImageDTOResponse> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await $api.post<InternalFeaturesPostsTransportHttpUploadImageDTOResponse>(
            '/posts/image',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        return response.data;
    }

    static async deletePost(
        postId: string,
    ): Promise<InternalFeaturesPostsTransportHttpDeletePostDTOResponse> {
        const response = await $api.delete(`/posts/${postId}/delete`);
        return response.data;
    }

    static async getPostById(
        postId: string,
    ): Promise<InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse> {
        const response = await $api.get(`/posts/${postId}`);
        return response.data;
    }

    static async getRepliesForPost(
        postId: string,
    ): Promise<InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse> {
        const response = await PostService.getFeed(1, 50);
        const filtered = (response.posts || []).filter(
            (p) => p.parent_id === postId || p.reply_to === postId,
        );
        return { posts: filtered, pagination: response.pagination };
    }

    static async searchPosts(
        query: string,
    ): Promise<InternalFeaturesPostsTransportHttpSearchPostsDTOResponse> {
        const response = await $api.get<InternalFeaturesPostsTransportHttpSearchPostsDTOResponse>(
            '/posts/search',
            { params: { query } },
        );
        return response.data;
    }

    static async getFollowFeed(): Promise<InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse> {
        const response =
            await $api.get<InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse>(
                '/posts/follow',
            );
        return response.data;
    }

    static async likePost(postId: string): Promise<void> {
        await $api.post(`/posts/${postId}/like`);
    }

    static async unlikePost(postId: string): Promise<void> {
        await $api.delete(`/posts/${postId}/like`);
    }
}
