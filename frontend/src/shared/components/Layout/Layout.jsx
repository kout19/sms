import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

/**
 * Layout Component - Main App Layout Wrapper
 * ==========================================
 *
 * Combines Header and Sidebar into a complete layout
 * Manages sidebar open/close state
 * Handles responsive behavior
 *
 * Usage:
 * <Layout>
 *   <YourPageContent />
 * </Layout>
 */
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header onMenuToggle={handleMenuToggle} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 ml-72 transition-all duration-300 md:ml-60 lg:ml-72 sm:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
