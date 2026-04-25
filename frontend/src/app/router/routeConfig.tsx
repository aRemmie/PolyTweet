import { RouteProps } from 'react-router-dom';
import AuthenticationPageAsync from '@pages/AuthenticationPage/AuthenticationPage.async';
import FeedPageAsync from '@pages/FeedPage/FeedPage.async';
import PostDetailPageAsync from '@pages/PostDetailPage/PostDetailPage.async';
import ProfilePageAsync from '@pages/ProfilePage/ProfilePage.async';

export enum AppRoutes {
    AUTH = 'auth',
    FEED = 'feed',
    POST = 'post',
    PROFILE = 'profile',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.AUTH]: '/auth',
    [AppRoutes.FEED]: '/feed',
    [AppRoutes.POST]: '/post/:id',
    [AppRoutes.PROFILE]: '/profile',
};

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.AUTH]: {
        path: RoutePath.auth,
        element: <AuthenticationPageAsync />,
    },
    [AppRoutes.FEED]: {
        path: RoutePath.feed,
        element: <FeedPageAsync />,
    },
    [AppRoutes.POST]: {
        path: RoutePath.post,
        element: <PostDetailPageAsync />,
    },
    [AppRoutes.PROFILE]: {
        path: RoutePath.profile,
        element: <ProfilePageAsync />,
    },
};
