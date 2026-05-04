import { create } from 'zustand';
import { PostService } from '@services/PostService';
import { useProfileStore } from './useProfileStore';
import type { GithubComTryingmyb3StPolyTweetInternalCoreDomainPost } from '../generated/data-contracts';

interface PostState {
    posts: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost[];
    total: number;
    currentPage: number;
    hasMore: boolean;
    isLoading: boolean;
    isFetchingMore: boolean;
    error: string | null;
    likedPosts: Set<string>;

    fetchFeed: (page?: number, pageSize?: number) => Promise<void>;
    fetchMoreFeed: (pageSize?: number) => Promise<void>;
    fetchFollowFeed: () => Promise<void>;
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

const initialState: Pick<
    PostState,
    | 'posts'
    | 'total'
    | 'currentPage'
    | 'hasMore'
    | 'isLoading'
    | 'isFetchingMore'
    | 'error'
    | 'likedPosts'
> = {
    posts: [],
    total: 0,
    currentPage: 1,
    hasMore: true,
    isLoading: false,
    isFetchingMore: false,
    error: null,
    likedPosts: new Set(),
};

export const usePostStore = create<PostState>()((set, get) => ({
    ...initialState,

    async fetchFeed(page: number = 1, pageSize: number = 15) {
        try {
            set({ isLoading: true, error: null });
            const response = await PostService.getFeed(page, pageSize);
            const posts = response.posts || [];
            const total = response.pagination?.total || 0;
            const totalPages = response.pagination?.total_pages ?? Math.ceil(total / pageSize);

            set({
                posts,
                total,
                currentPage: page,
                hasMore: page < totalPages,
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

    async fetchMoreFeed(pageSize: number = 15) {
        const { currentPage, hasMore, isFetchingMore, isLoading } = get();
        if (!hasMore || isFetchingMore || isLoading) return;

        const nextPage = currentPage + 1;
        try {
            set({ isFetchingMore: true, error: null });
            const response = await PostService.getFeed(nextPage, pageSize);
            const newPosts = response.posts || [];
            const total = response.pagination?.total || 0;
            const totalPages = response.pagination?.total_pages ?? Math.ceil(total / pageSize);

            set((state) => ({
                posts: [...state.posts, ...newPosts],
                total,
                currentPage: nextPage,
                hasMore: nextPage < totalPages,
                isFetchingMore: false,
            }));
        } catch (error: any) {
            console.error('Failed to fetch more posts:', error);
            set({
                error: error.response?.data?.message || 'Failed to load more posts',
                isFetchingMore: false,
            });
        }
    },

    async fetchFollowFeed() {
        try {
            set({ isLoading: true, error: null });
            const response = await PostService.getFollowFeed();
            const posts = response.posts || [];
            set({
                posts,
                total: posts.length,
                currentPage: 1,
                hasMore: false, // follow feed не пагинируется пока
                isLoading: false,
            });
        } catch (error: any) {
            console.error('Failed to fetch follow feed:', error);
            set({
                error: error.response?.data?.message || 'Failed to load feed',
                isLoading: false,
            });
            throw error;
        }
    },

    async createPost(content: string, image_url?: string, parent_id?: string, reply_to?: string) {
        try {
            const newPost = await PostService.createPost(content, image_url, parent_id, reply_to);

            const profileState = useProfileStore.getState();
            const cachedProfile = profileState.profile;

            const createdPost: GithubComTryingmyb3StPolyTweetInternalCoreDomainPost = {
                id: newPost.id || '',
                user_id: newPost.user_id || '',
                username: newPost.username ?? cachedProfile?.username,
                avatar_url: newPost.avatar_url ?? cachedProfile?.avatar_url,
                content: newPost.content || content,
                created_at: newPost.created_at || new Date().toISOString(),
                likes_count: newPost.likes_count || 0,
                parent_id: newPost.parent_id ?? parent_id,
                reply_to: newPost.reply_to ?? reply_to,
                image_url: newPost.image_url ?? image_url,
            };

            set((state) => ({
                posts: [createdPost, ...state.posts],
                total: state.total + 1,
            }));

            return createdPost;
        } catch (error: any) {
            console.error('Failed to create post:', error);
            set({ error: error.response?.data?.message || 'Failed to create post' });
            throw error;
        }
    },

    async createReply(content: string, parentId: string, image_url?: string) {
        return get().createPost(content, image_url, parentId, parentId);
    },

    async deletePost(id: string) {
        try {
            await PostService.deletePost(id);
            set((state) => ({
                posts: state.posts.filter((post) => post.id !== id),
                total: Math.max(0, state.total - 1),
            }));
        } catch (error: any) {
            console.error('Failed to delete post:', error);
            set({ error: error.response?.data?.message || 'Failed to delete post' });
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
