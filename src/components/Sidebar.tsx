import React from 'react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Eraser, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'projects', label: '项目', icon: FolderOpen },
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'chat', label: 'AI 对话', icon: MessageSquare },
  ] as const;

  const bottomItems = [
    { id: 'settings', label: '设置', icon: Settings },
    { id: 'help', label: '帮助', icon: HelpCircle },
  ] as const;

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-surface-container-low p-4 gap-2 border-r border-outline-variant/10">
      <div className="flex items-center gap-3 px-2 mb-8 mt-2 cursor-pointer" onClick={() => onViewChange('dashboard')}>
        <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="font-headline font-extrabold text-on-background leading-tight text-lg">情报局</h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Precision Data</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm text-left",
              activeView === item.id 
                ? "bg-surface-container-high text-primary font-semibold shadow-sm" 
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <item.icon size={20} className={cn(activeView === item.id && "fill-primary/10")} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-4 mt-4 border-t border-outline-variant/10 flex flex-col gap-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm text-left",
              activeView === item.id 
                ? "bg-surface-container-high text-primary font-semibold shadow-sm" 
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
