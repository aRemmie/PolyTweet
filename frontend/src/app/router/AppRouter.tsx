import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { routeConfig, RoutePath, AppRoutes } from './routeConfig';
import { useAuthStore } from '../../stores/useAuthStore';

const AppRouter = () => {
    const isAuth = useAuthStore((state) => state.isAuth);

    return (
        <BrowserRouter>
            <Routes>
                {Object.values(routeConfig).map((route) => (
                    <Route
                        key={route.path as string}
                        path={route.path}
                        element={route.element}
                    />
                ))}
                <Route 
                    path="*" 
                    element={<Navigate to={isAuth ? RoutePath.feed : RoutePath.auth} replace />} 
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;