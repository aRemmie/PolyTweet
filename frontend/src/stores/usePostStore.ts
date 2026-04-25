import { create } from 'zustand';
import { PostService } from '../services/PostService';
import type { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../generated/data-contracts';

interface PostState {
    posts: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[];
    total: number;
    isLoading: boolean;
    error: string | null;
    likedPosts: Set<string>;

    fetchFeed: (page?: number, pageSize?: number) => Promise<void>;
    createPost: (
        content: string,
        image_url?: string,
        parent_id?: string,
        reply_to?: string,
    ) => Promise<GithubComTryingmyb3StPolyTweetInternalCoreDomainPost | void>;
    createReply: (
        content: string,
        parentId: string,
        image_url?: string,
    ) => Promise<GithubComTryingmyb3StPolyTweetInternalCoreDomainPost | void>;
    deletePost: (id: string) => Promise<void>;
    likePost: (postId: string) => Promise<void>;
    unlikePost: (postId: string) => Promise<void>;
    clearPosts: () => void;
}

const initialState: Pick<PostState, 'posts' | 'total' | 'isLoading' | 'error' | 'likedPosts'> = {
    posts: [],
    total: 0,
    isLoading: false,
    error: null,
    likedPosts: new Set(),
};

export const usePostStore = create<PostState>()((set, get) => ({
    ...initialState,

    async fetchFeed(page: number = 1, pageSize: number = 15) {
        try {
            set({ isLoading: true, error: null });
            const response = await PostService.getFeed(page, pageSize);

            set({
                posts: response.posts || [],
                total: response.pagination?.total || 0,
                isLoading: false,
            });
        } catch (error: any) {
            console.error('Failed to fetch feed:', error);
            set({
                error: error.response?.data?.message || 'Failed to load feed',
                isLoading: false,
            });
            throw error;
        }
    },

    async createPost(content: string, image_url?: string, parent_id?: string, reply_to?: string) {
        try {
            set({ isLoading: true, error: null });
            const newPost = await PostService.createPost(content, image_url, parent_id, reply_to);

            const createdPost: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost = {
                id: newPost.id || '',
                user_id: newPost.user_id || '',
                content: newPost.content || content,
                created_at: newPost.created_at || new Date().toISOString(),
                parent_id: parent_id,
                reply_to: reply_to,
            };

            set((state) => ({
                posts: [createdPost, ...state.posts],
                total: state.total + 1,
                isLoading: false,
            }));

            return createdPost;
        } catch (error: any) {
            console.error('Failed to create post:', error);
            set({
                error: error.response?.data?.message || 'Failed to create post',
                isLoading: false,
            });
            throw error;
        }
    },

    async createReply(content: string, parentId: string, image_url?: string) {
        return get().createPost(content, image_url, parentId, parentId);
    },

    async deletePost(id: string) {
        try {
            set({ isLoading: true, error: null });
            await PostService.deletePost(id);

            set((state) => ({
                posts: state.posts.filter((post) => post.id !== id),
                total: Math.max(0, state.total - 1),
                isLoading: false,
            }));
        } catch (error: any) {
            console.error('Failed to delete post:', error);
            set({
                error: error.response?.data?.message || 'Failed to delete post',
                isLoading: false,
            });
            throw error;
        }
    },

    async likePost(postId: string) {
        try {
            await PostService.likePost(postId);
            set((state) => ({
                likedPosts: new Set(state.likedPosts).add(postId),
                posts: updateLikesCount(state.posts, postId, 1),
            }));
        } catch (error: any) {
            console.error('Failed to like post:', error);
            throw error;
        }
    },

    async unlikePost(postId: string) {
        try {
            await PostService.unlikePost(postId);
            set((state) => {
                const newLikedPosts = new Set(state.likedPosts);
                newLikedPosts.delete(postId);
                return {
                    likedPosts: newLikedPosts,
                    posts: updateLikesCount(state.posts, postId, -1),
                };
            });
        } catch (error: any) {
            console.error('Failed to unlike post:', error);
            throw error;
        }
    },

    clearPosts: () => set(initialState),
}));

function updateLikesCount(posts: any[], postId: string, delta: number) {
    return posts.map((post) =>
        post.id === postId
            ? { ...post, likes_count: Math.max(0, (post.likes_count || 0) + delta) }
            : post,
    );
}
