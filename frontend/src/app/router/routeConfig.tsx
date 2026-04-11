import { RouteProps } from "react-router-dom";
import AuthenticationPageAsync from "@pages/AuthenticationPage/AuthenticationPage.async";
import FeedPageAsync from "@pages/FeedPage/FeedPage.async";

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
        element: <AuthenticationPageAsync />
    },
    [AppRoutes.FEED]: {
        path: RoutePath.feed,
        element: <FeedPageAsync />
    }
}