/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ViewType } from './types';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ELView from './components/ELView';
import ForecastView from './components/ForecastView';
import DataView from './components/DataView';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'el': return <ELView />;
      case 'forecast': return <ForecastView />;
      case 'data': return <DataView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-slate-100 font-sans military-grid">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      
      <main className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="min-h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>

        {/* Decorative elements */}
        <div className="fixed top-4 right-8 pointer-events-none flex flex-col items-end opacity-20 font-mono text-[10px] tracking-widest uppercase">
          <span>K-MATERIAL INSIGHT</span>
          <span>V1.0.0-MVP</span>
          <span>SYSTEM_READY</span>
        </div>
      </main>
    </div>
  );
}
