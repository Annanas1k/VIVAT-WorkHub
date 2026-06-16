import { Outlet } from 'react-router';
import { Sidebar } from '../components/main_layout/Sidebar';
import { Topbar } from '../components/main_layout/Topbar';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className=" overflow-y-auto h-screen" id="main-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};