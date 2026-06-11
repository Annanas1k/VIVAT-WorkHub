import type { ReactNode } from 'react';
import { useAuth } from "../hooks/useAuth";
import { BrowserRouter, Navigate, Routes, Route } from "react-router";
import { AuthPage }           from '../pages/AuthPage';
import { NotFoundPage }       from '../pages/NotFoundPage';
import { MainLayout }         from '../layouts/MainLayout';
import { DashBoardPage }      from '../pages/DashBoardPage';
import { TeamPage }           from '../pages/TeamPage';
import { SettingsPage }       from '../pages/SettingsPage';
import { ProfilePage }        from '../pages/ProfilePage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage }     from '../pages/admin/AdminUsersPage';
import { LogsPage }           from '../pages/admin/LogsPage';
import { LogDetailsPage }     from '../pages/admin/LogDetailsPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminProjectsPage }  from '../pages/admin/AdminProjectsPage';
import { AdminTasksPage }     from '../pages/admin/AdminTasksPage';
import { CustomerPage } from '../pages/CustomerPage';
import { ProjectPage } from '../pages/projects/ProjectPage';
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage';
import { ProjectDetailOverview } from '../pages/projects/ProjectDetailOverview';
import { AddProjectPage } from '../pages/projects/AddProjectPage';
import { ProjectTasksPage } from '../pages/projects/ProjectTaskPage';
import { ProjectBoardPage } from '../pages/projects/ProjectBoardPage';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to='/auth' replace />;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to='/dashboard' replace />;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        <Route path='/auth' element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />

        <Route element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route path='/profile/:id' element={<ProfilePage />} />
          <Route path='/dashboard'   element={<DashBoardPage />} />
          <Route path="/projects">
            <Route index element={<ProjectPage />} />
            <Route path='add' element={<AddProjectPage />} />
            <Route path=":id" element={<ProjectDetailPage />}>
              <Route index path='overview' element={<ProjectDetailOverview />} /> 
              <Route path='tasks' element={<ProjectTasksPage/>} />
              <Route path='board' element={<ProjectBoardPage />} />
            </Route>
          </Route>
          <Route path='/team'        element={<TeamPage />} />
          <Route path='/customers'   element={<CustomerPage />} />
          <Route path='/customers/:id' element={<CustomerPage />} />
          <Route path='/settings'    element={<SettingsPage />} />

          <Route path='/admin'>
            <Route index element={<AdminDashboardPage />} />
            <Route path='users'        element={<AdminUsersPage />} />
            <Route path='customers'    element={<AdminCustomersPage />} />
            <Route path='projects'     element={<AdminProjectsPage />} />
            <Route path='tasks'        element={<AdminTasksPage />} />
            <Route path='logs'         element={<LogsPage />} />
            <Route path='logs/:id'     element={<LogDetailsPage />} />
          </Route>

          <Route path='*' element={<NotFoundPage />} />
        </Route>

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};