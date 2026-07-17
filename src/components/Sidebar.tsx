import { LayoutDashboard, ShieldAlert, TrendingUp, Database, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { ViewType } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ currentView, onViewChange, isCollapsed, setIsCollapsed }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '종합 대시보드' },
    { id: 'el', icon: ShieldAlert, label: 'EL 관리' },
    { id: 'forecast', icon: TrendingUp, label: '수요 예측' },
    { id: 'data', icon: Database, label: '데이터 관리' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="h-screen bg-surface border-r border-border flex flex-col z-20 relative"
    >
      <div className="p-6 flex items-center justify-between overflow-hidden">
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center font-bold text-background">KMI</div>
            <span className="font-bold text-xl tracking-tight whitespace-nowrap">K-Material</span>
          </motion.div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group",
              currentView === item.id 
                ? "bg-primary text-background font-semibold" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={cn(
              "shrink-0",
              currentView === item.id ? "text-background" : "group-hover:text-primary"
            )} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">AD</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">관리자</span>
              <span className="text-[10px] text-slate-500 uppercase font-mono">Operations</span>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
