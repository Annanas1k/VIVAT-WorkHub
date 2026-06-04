import type { ReactNode } from 'react';
import { useAuth } from "../hooks/useAuth";
import { BrowserRouter, Navigate, Routes, Route } from "react-router";
import { AuthPage } from '../pages/AuthPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { MainLayout } from '../layouts/MainLayout';
import { DashBoardPage } from '../pages/DashBoardPage';
import { TeamPage } from '../pages/TeamPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';

const PrivateRoute = ({children}: { children: ReactNode}) =>{
    const {user} = useAuth()
    return user ? children : <Navigate to='/auth' replace />
}

const PublicRoute = ({children}: {children: ReactNode}) =>{
    const {user} = useAuth()
    return !user ? children : <Navigate to='/dashboard' replace />
}


export const AppRouter = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to='/dashboard' replace />} />
                <Route 
                    path='/auth' element={
                        <PublicRoute>
                            <AuthPage />
                        </PublicRoute>
                    }
                />
                <Route element={
                <PrivateRoute> 
                    <MainLayout />
                </PrivateRoute>
                }>
                <Route path='/profile/:id' element={<ProfilePage />} />
                <Route path='/dashboard' element={<DashBoardPage />} />
                <Route path='/team' element={<TeamPage />} />


                <Route path='/settings' element={<SettingsPage />}/>
                <Route path='*' element={<NotFoundPage />} />

                </Route>
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}