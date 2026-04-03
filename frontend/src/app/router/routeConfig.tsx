import { RouteProps } from "react-router-dom"
import {RegistrationPage} from "../../pages/RegistrationPage";


export enum AppRoutes {
    REGISTRATION = 'registration',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.REGISTRATION]: `/${AppRoutes.REGISTRATION}`,
}

export const routeConfig: Record<AppRoutes, RouteProps> = {
    [AppRoutes.REGISTRATION]: {
        path: RoutePath.registration,
        element: <RegistrationPage/>
    }
}