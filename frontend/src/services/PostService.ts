import $api from '../app/api/api';
import type { 
  InternalFeaturesPostsTransportHttpCreatePostDTO,
  InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse,
  InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse,
  InternalFeaturesPostsTransportHttpDeletePostDTOResponse
} from '../generated/data-contracts';

export class PostService {
  static async getFeed(page: number = 1, pageSize: number = 15): Promise<InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse> {
    const response = await $api.get<InternalFeaturesPostsTransportHttpGetLastWeekPostsDTOResponse>(
      '/posts/all',
      { 
        params: { 
          page: page, 
          page_size: pageSize 
        } 
      }
    );
    return response.data;
  }

  static async createPost(content: string, image_url?: string, parent_id?: string, reply_to?: string) {
    if (!content || content.trim().length === 0) {
      throw new Error('Post content cannot be empty');
    }
    
    const request: InternalFeaturesPostsTransportHttpCreatePostDTO = { 
      content: content.trim(),
      image_url: image_url || undefined,
      parent_id: parent_id || undefined,
      reply_to: reply_to || undefined
    };
    
    const response = await $api.post('/posts/create', request);
    return response.data;
  }

  static async deletePost(postId: string): Promise<InternalFeaturesPostsTransportHttpDeletePostDTOResponse> {
    const response = await $api.delete(`/posts/${postId}/delete`);
    return response.data;
  }

  static async getPostById(postId: string): Promise<InternalFeaturesPostsTransportHttpGetPostByIdDTOResponse> {
    const response = await $api.get(`/posts/${postId}`);
    return response.data;
  }
}