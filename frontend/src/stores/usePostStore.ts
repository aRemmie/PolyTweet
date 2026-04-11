import { create } from "zustand";
import { PostService } from "../services/PostService";
import type { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from "../generated/data-contracts";

interface PostState {
    posts: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[];
    total: number;
    isLoading: boolean;
    error: string | null;
    
    fetchFeed: (page?: number, pageSize?: number) => Promise<void>;
    createPost: (content: string) => Promise<void>;
    deletePost: (id: string) => Promise<void>;
    clearPosts: () => void;
}

const initialState: Pick<PostState, 'posts' | 'total' | 'isLoading' | 'error'> = {
    posts: [],
    total: 0,
    isLoading: false,
    error: null,
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
                isLoading: false 
            });
        } catch (error: any) {
            console.error('Failed to fetch feed:', error);
            set({ 
                error: error.response?.data?.message || 'Failed to load feed',
                isLoading: false 
            });
            throw error;
        }
    },

    async createPost(content: string) {
        try {
            set({ isLoading: true, error: null });
            const newPost = await PostService.createPost(content);
            
            const createdPost: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost = {
                id: newPost.id || '',
                user_id: newPost.user_id || '',
                content: newPost.content || content,
                created_at: newPost.created_at || new Date().toISOString(),
            };
            
            set(state => ({ 
                posts: [createdPost, ...state.posts],
                total: state.total + 1,
                isLoading: false 
            }));
        } catch (error: any) {
            console.error('Failed to create post:', error);
            set({ 
                error: error.response?.data?.message || 'Failed to create post',
                isLoading: false 
            });
            throw error;
        }
    },

    async deletePost(id: string) {
        try {
            set({ isLoading: true, error: null });
            await PostService.deletePost(id);
            
            set(state => ({ 
                posts: state.posts.filter(post => post.id !== id),
                total: Math.max(0, state.total - 1),
                isLoading: false 
            }));
        } catch (error: any) {
            console.error('Failed to delete post:', error);
            set({ 
                error: error.response?.data?.message || 'Failed to delete post',
                isLoading: false 
            });
            throw error;
        }
    },

    clearPosts: () => set(initialState),
}));