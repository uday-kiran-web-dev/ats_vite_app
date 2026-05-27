import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => setSidebarOpen((open) => !open);
  const handleCloseSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar onMenuClick={handleToggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:px-8 lg:py-6">
          <div className="w-full max-w-screen-2xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
