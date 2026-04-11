import { RouteProps } from "react-router-dom";
import AuthenticationPage from "../../pages/AuthenticationPage/AuthenticationPage";
import FeedPage from "../../pages/FeedPage/FeedPage";

export enum AppRoutes {
    AUTH = 'auth',
    FEED = 'feed',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.AUTH]: '/auth',
    [AppRoutes.FEED]: '/feed',
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.AUTH]: {
        path: RoutePath.auth,
        element: <AuthenticationPage />
    },
    [AppRoutes.FEED]: {
        path: RoutePath.feed,
        element: <FeedPage />
    }
}