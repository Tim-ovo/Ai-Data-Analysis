import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Grid, CheckCircle2, AlertCircle, Zap, LayoutGrid, Database, Wand2, HelpCircle, Settings, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface TopBarProps {
  onAccountClick: () => void;
}

export function TopBar({ onAccountClick }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAppSwitcher, setShowAppSwitcher] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setShowAppSwitcher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'AI 分析完成', desc: 'Q4_财务报告.csv 已成功分析', time: '2分钟前', icon: CheckCircle2, color: 'text-tertiary', unread: true },
    { id: 2, title: 'AI 架构建议', desc: '检测到数据集中存在潜在的架构优化空间', time: '1小时前', icon: Zap, color: 'text-primary', unread: true },
    { id: 3, title: '异常数据预警', desc: '销售数据中发现 3 处显著离群值', time: '3小时前', icon: AlertCircle, color: 'text-error', unread: false },
  ];

  const apps = [
    { name: '仪表盘', icon: LayoutGrid, desc: '核心业务监控', color: 'bg-blue-500' },
    { name: '项目管理', icon: Database, desc: '数据集与资源', color: 'bg-purple-500' },
    { name: 'AI 对话', icon: Wand2, desc: '智能助手', color: 'bg-emerald-500' },
    { name: '系统设置', icon: Settings, desc: '偏好与配置', color: 'bg-slate-500' },
    { name: '帮助中心', icon: HelpCircle, desc: '文档与支持', color: 'bg-amber-500' },
    { name: '安全审计', icon: ShieldCheck, desc: '访问日志', color: 'bg-rose-500' },
  ];

  return (
    <header className="flex justify-between items-center w-full px-6 py-3 h-16 bg-surface-bright sticky top-0 z-40 border-b border-outline-variant/5">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
          <input 
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/50" 
            placeholder="搜索数据集、报告或 AI 见解..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) setHasUnread(false);
            }}
            className={cn(
              "p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all relative",
              showNotifications && "bg-surface-container text-primary"
            )}
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-surface-bright animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-outline-variant/10 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-outline-variant/5 flex justify-between items-center bg-surface-container-low">
                  <span className="font-headline font-bold text-sm">通知中心</span>
                  <button 
                    onClick={() => setHasUnread(false)}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    全部已读
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-4 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/5 last:border-none group">
                      <div className="flex gap-3">
                        <div className={cn("p-2 rounded-xl bg-surface-container group-hover:scale-110 transition-transform", n.color)}>
                          <n.icon size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h6 className="text-xs font-bold text-on-surface">{n.title}</h6>
                            {n.unread && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                          </div>
                          <p className="text-[10px] text-on-surface-variant mt-0.5 line-clamp-2">{n.desc}</p>
                          <span className="text-[9px] text-on-surface-variant/60 mt-1 block uppercase font-bold">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center bg-surface-container-lowest border-t border-outline-variant/5">
                  <button className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors">查看所有历史通知</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* App Switcher */}
        <div className="relative" ref={switcherRef}>
          <button 
            onClick={() => setShowAppSwitcher(!showAppSwitcher)}
            className={cn(
              "p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all",
              showAppSwitcher && "bg-surface-container text-primary"
            )}
          >
            <Grid size={20} />
          </button>

          <AnimatePresence>
            {showAppSwitcher && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-[2rem] shadow-2xl border border-outline-variant/10 p-6 z-50"
              >
                <div className="grid grid-cols-3 gap-4">
                  {apps.map((app) => (
                    <button key={app.name} className="flex flex-col items-center gap-2 p-2 hover:bg-surface-container-low rounded-2xl transition-all group">
                      <div className={cn("p-3 rounded-2xl text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform", app.color)}>
                        <app.icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold text-on-surface text-center leading-tight">{app.name}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/5 flex justify-center">
                  <button className="text-[10px] font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
                    管理所有应用 <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-outline-variant/20 mx-1" />

        <div 
          className="h-9 w-9 rounded-full bg-primary-container overflow-hidden ring-2 ring-surface-container-highest cursor-pointer hover:ring-primary transition-all ml-1"
          onClick={onAccountClick}
        >
          <img 
            className="w-full h-full object-cover" 
            alt="User"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8DF7Ficmu3v2M0VzfycWGQAfVNARxoYZEL_wzRvPkt7vAbS8A_XF6maTyc-ICT-uiFdwTEHwOYpW5wdGRvcUjJ6iOSvyQbC-xLY71CGhMbdTuYUYH7U8TfEQL7nsvTu1pFAjzmV63nXDFWreAZ5ferCuM43ftx2BcQyEmpaBSTgUHdL139jZ5W8MaHz5BUHS-lPLU6odsHbs9h6pKdgOutXdxr24J5CisGbvVNkXR4GTvykRhJ1Jje29XV9lrbX-4xgbp2vhpiEKf"
          />
        </div>
      </div>
    </header>
  );
}
