import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './views/Dashboard';
import { Projects } from './views/Projects';
import { Settings } from './views/Settings';
import { Help } from './views/Help';
import { Account } from './views/Account';
import { Chat } from './views/Chat';
import { View, Dataset, Message } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'sonner';

const initialDatasets: Dataset[] = [];

export default function App() {
  const [activeView, setActiveView] = useState<View>('projects');
  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '您好！我是您的 AI 数据助手。我已经准备好分析您上传的数据集了。您可以询问有关数据趋势、异常检测或合并建议的任何问题。',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [stats, setStats] = useState({
    optimized: 0,
    models: 3,
    reports: 0
  });

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard datasets={datasets} stats={stats} />;
      case 'projects':
        return <Projects datasets={datasets} setDatasets={setDatasets} stats={stats} setStats={setStats} />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      case 'account':
        return <Account />;
      case 'chat':
        return <Chat datasets={datasets} setDatasets={setDatasets} setStats={setStats} messages={messages} setMessages={setMessages} />;
      default:
        return <Dashboard datasets={datasets} stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster position="top-right" richColors />
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar onAccountClick={() => setActiveView('account')} />
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Background Decorative Elements */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      </main>
    </div>
  );
}
