import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  MoreHorizontal, 
  Sparkles, 
  Send, 
  Bot,
  Zap,
  Search,
  ChevronRight,
  Loader2,
  RefreshCw,
  Calendar,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  Network,
  Database,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";

import { Dataset } from '../types';

const data = [
  { name: '1月', value: 400, uploads: 12 },
  { name: '2月', value: 600, uploads: 15 },
  { name: '3月', value: 800, uploads: 18 },
  { name: '4月', value: 1000, uploads: 22 },
  { name: '5月', value: 1800, uploads: 35 },
];

const systemHealth = [
  { name: 'API 响应', value: 98.2, color: '#2563eb' },
  { name: '数据库负载', value: 42.5, color: '#10b981' },
  { name: '存储空间', value: 65.8, color: '#f59e0b' },
  { name: '网络延迟', value: 12, color: '#06b6d4' },
];

const radarData = [
  { subject: '性能', A: 120, fullMark: 150 },
  { subject: '稳定性', A: 98, fullMark: 150 },
  { subject: '安全性', A: 86, fullMark: 150 },
  { subject: '可扩展性', A: 99, fullMark: 150 },
  { subject: '成本效率', A: 85, fullMark: 150 },
  { subject: '用户体验', A: 65, fullMark: 150 },
];

const quickActions = [
  { label: '压力测试', icon: Activity, color: 'text-primary' },
  { label: '安全扫描', icon: ShieldCheck, color: 'text-error' },
  { label: '缓存优化', icon: Zap, color: 'text-tertiary' },
  { label: '导出报告', icon: Layers, color: 'text-on-surface-variant' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DashboardProps {
  datasets: Dataset[];
  stats: { optimized: number; models: number; reports: number };
}

export function Dashboard({ datasets, stats }: DashboardProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: '您好！我是您的 AI 架构师助手。我已经完成了对当前系统拓扑和业务数据的全量扫描。目前系统运行在最佳状态，但我在 Stellar Systems 的数据流向中发现了一些潜在的优化空间。您想深入了解架构分析还是业务预测？',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const totalStorage = datasets.reduce((acc, d) => acc + d.sizeBytes, 0);
  const storageMB = (totalStorage / (1024 * 1024)).toFixed(1);
  const largestDatasets = [...datasets]
    .sort((a, b) => b.sizeBytes - a.sizeBytes)
    .slice(0, 5)
    .map((d, i) => ({
      name: d.name.length > 15 ? d.name.substring(0, 12) + '...' : d.name,
      size: d.sizeBytes,
      color: ['#2563eb', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'][i % 5]
    }));

  const [isLoading, setIsLoading] = useState(false);
  const trendData = datasets.length > 0 ? data : data.map(d => ({ ...d, value: 0, uploads: 0 }));
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: chatInput,
        config: {
          systemInstruction: "你是一个顶级系统架构师和数据科学家，名字叫 'Cortex Architect AI'。你的语气极其专业、冷静且富有前瞻性。你不仅分析业务数据（收入、用户、流失率），还关注系统底层架构（拓扑、负载、延迟）。你正在协助用户管理他们的 Intelligence Bureau 平台。背景数据：总收入240万美元（+12.5%），活跃用户1.82万（+4.2%），流失率1.2%（历史最低）。系统状态：API可用性99.99%，平均延迟45ms。请以架构师的视角提供建议，例如扩容、分片、缓存优化或业务增长策略。",
        }
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text || "抱歉，我无法处理您的请求。",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "连接 AI 服务时出现错误，请稍后再试。",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-6 gap-6">
      {/* Main Stats and Charts */}
      <section className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
        {/* Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard 
            title="已分析数据集" 
            value={stats.optimized.toString()} 
            trend="+2" 
            isUp={true} 
            icon={Sparkles}
            description="本会话深度处理"
          />
          <StatCard 
            title="内存占用" 
            value={`${storageMB} MB`} 
            trend={`${((totalStorage / (1024 * 1024 * 1024)) * 100).toFixed(1)}%`} 
            isUp={totalStorage < 512 * 1024 * 1024} 
            icon={Database}
            description="共 1.0 GB 限制"
          />
          <StatCard 
            title="AI 建议" 
            value={stats.reports.toString()} 
            trend="+100%" 
            isUp={true} 
            icon={Zap}
            description="基于最新数据生成"
          />
          <StatCard 
            title="活跃模型" 
            value={stats.models.toString()} 
            trend="稳定" 
            isUp={true} 
            icon={Cpu}
            description="分布式推理引擎"
          />
        </div>

        {/* Bento Grid Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Bar Chart: Largest Datasets */}
          <div className="xl:col-span-2 bg-white p-6 rounded-3xl flex flex-col shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-headline font-bold text-on-background">最大数据集排行</h4>
                <p className="text-xs text-on-surface-variant">基于文件占用内存大小</p>
              </div>
              <button className="p-2 hover:bg-surface-container rounded-xl transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="flex-1 min-h-[300px] flex items-center justify-center">
              {largestDatasets.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={largestDatasets} layout="vertical" margin={{ left: 20, right: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#4b5563' }}
                      width={100}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`${(value/(1024*1024)).toFixed(2)} MB`, '大小']}
                    />
                    <Bar dataKey="size" radius={[0, 8, 8, 0]} barSize={24}>
                      {largestDatasets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center space-y-2">
                  <Database className="mx-auto text-on-surface-variant/20" size={48} />
                  <p className="text-sm text-on-surface-variant font-medium">暂无数据，请先上传数据集</p>
                </div>
              )}
            </div>
          </div>

          {/* Improved System Topology Map */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl flex flex-col shadow-sm border border-outline-variant/10 relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div>
                <h4 className="font-headline font-bold text-on-background">系统拓扑图</h4>
                <p className="text-xs text-on-surface-variant">实时数据流向监控</p>
              </div>
              <div className="p-2 bg-primary/10 text-primary rounded-xl animate-pulse">
                <Network size={18} />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-8 relative z-10">
              <div className="flex justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2 w-32 cursor-pointer group/node"
                >
                  <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover/node:bg-primary group-hover/node:text-on-primary transition-colors"><Cpu size={20} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">API 网关</span>
                  <div className="w-full h-1 bg-tertiary rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-1/2 h-full bg-white/50"
                    />
                  </div>
                </motion.div>
              </div>
              
              <div className="flex justify-between px-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2 w-28 cursor-pointer group/node"
                >
                  <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg group-hover/node:bg-tertiary group-hover/node:text-on-tertiary transition-colors"><Database size={18} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">主数据库</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2 w-28 cursor-pointer group/node"
                >
                  <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover/node:bg-secondary group-hover/node:text-on-secondary transition-colors"><Zap size={18} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">缓存层</span>
                </motion.div>
              </div>

              <div className="flex justify-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col items-center gap-2 w-32 cursor-pointer group/node"
                >
                  <div className="p-2 bg-error/10 text-error rounded-lg group-hover/node:bg-error group-hover/node:text-on-error transition-colors"><ArrowRightLeft size={20} /></div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">外部集成</span>
                </motion.div>
              </div>

              {/* Connecting Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
                <motion.line 
                  x1="50%" y1="20%" x2="50%" y2="80%" 
                  stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" 
                  className="text-outline-variant"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.line 
                  x1="50%" y1="35%" x2="25%" y2="55%" 
                  stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" 
                  className="text-outline-variant"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <motion.line 
                  x1="50%" y1="35%" x2="75%" y2="55%" 
                  stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" 
                  className="text-outline-variant"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
              </svg>
            </div>

            <div className="mt-4 p-3 bg-white/50 rounded-2xl border border-outline-variant/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-on-surface-variant">所有节点运行正常</span>
              </div>
              <span className="text-[9px] font-bold text-primary uppercase">查看详情</span>
            </div>
          </div>
        </div>

        {/* Data Volume Trend & System Health Radar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white p-6 rounded-3xl flex flex-col relative overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-headline font-bold text-on-background">数据吞吐趋势</h4>
                <p className="text-xs text-on-surface-variant">2024年上半年处理量</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-container rounded-xl transition-colors">
                  <RefreshCw size={16} className="text-on-surface-variant" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }} 
                    formatter={(value: number) => [`${value} GB`, '处理量']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl flex flex-col shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-headline font-bold text-on-background">系统健康画像</h4>
                <p className="text-xs text-on-surface-variant">多维度架构评估</p>
              </div>
              <div className="p-2 bg-surface-container rounded-xl text-on-surface-variant">
                <Activity size={18} />
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="Cortex"
                    dataKey="A"
                    stroke="#2563eb"
                    fill="#2563eb"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Insights Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-surface-container-highest to-surface-container p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm relative overflow-hidden"
        >
          <div className="flex gap-5 items-start relative z-10">
            <div className="p-3 bg-primary text-on-primary rounded-2xl shadow-lg shadow-primary/20">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="font-headline font-bold text-on-background">Cortex 架构师洞察</h5>
                <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-full">深度分析</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {datasets.length > 0 ? (
                  <>
                    当前内存中存有 <span className="font-semibold text-on-surface">{datasets.length}</span> 个活跃数据集，
                    总占用 <span className="text-primary font-bold">{storageMB} MB</span>。
                    建议：针对 <span className="text-primary font-bold">{datasets[0].name}</span> 进行多维交叉分析，预计可发现 <span className="text-primary font-bold">15%</span> 的潜在成本优化点。
                  </>
                ) : (
                  "系统已就绪，正在等待数据输入。上传您的第一个数据集后，我将为您生成实时的架构洞察和优化建议。"
                )}
              </p>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
        </motion.div>
      </section>

      {/* AI Chat Interface (Side Panel) */}
      <aside className="w-full md:w-80 lg:w-96 flex flex-col bg-white rounded-[2.5rem] shadow-2xl border border-outline-variant/10 overflow-hidden">
        <div className="p-5 bg-surface-container-low flex items-center justify-between border-b border-outline-variant/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-on-primary rounded-xl shadow-md shadow-primary/10">
              <Bot size={20} />
            </div>
            <div>
              <span className="font-headline font-bold block text-sm">Cortex Architect AI</span>
              <span className="text-[10px] text-tertiary font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" />
                系统扫描中
              </span>
            </div>
          </div>
          <button className="p-2 hover:bg-surface-container rounded-xl transition-colors">
            <Layers size={18} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div className="p-4 grid grid-cols-2 gap-2 bg-surface-container-lowest border-b border-outline-variant/5">
          {quickActions.map((action) => (
            <button key={action.label} className="flex items-center gap-2 p-2 hover:bg-surface-container rounded-xl transition-all group text-left">
              <div className={cn("p-1.5 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform", action.color)}>
                <action.icon size={14} />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant">{action.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 custom-scrollbar">
          {messages.map((msg, idx) => (
            <ChatMessage 
              key={`msg-${idx}`}
              role={msg.role} 
              content={msg.content} 
              timestamp={msg.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium px-2">
              <Loader2 size={14} className="animate-spin" />
              正在进行架构扫描与数据建模...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-5 bg-white border-t border-outline-variant/5">
          <div className="relative flex items-center gap-2">
            <input 
              className="w-full bg-surface-container-low border-none rounded-2xl py-4 pl-5 pr-14 text-sm focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/50" 
              placeholder="询问架构建议或业务预测..." 
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isLoading}
              className="absolute right-2 p-2.5 bg-primary text-on-primary rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {['系统拓扑分析', '扩容建议', 'Q4收入预测', '异常流量检测'].map(tag => (
              <button 
                key={tag} 
                onClick={() => setChatInput(tag)}
                className="whitespace-nowrap px-4 py-2 bg-surface-container-low text-[10px] font-bold text-on-surface-variant rounded-full hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function StatCard({ title, value, trend, isUp, icon: Icon, description }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/10 group hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-surface-container rounded-xl text-on-surface-variant group-hover:text-primary transition-colors">
          <Icon size={20} />
        </div>
        <div className={cn(
          "flex items-center gap-1 font-bold text-xs px-2 py-1 rounded-lg",
          isUp ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"
        )}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trend}</span>
        </div>
      </div>
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{title}</p>
      <h3 className="font-headline font-extrabold text-2xl text-on-background mt-1">{value}</h3>
      <p className="text-[10px] text-on-surface-variant mt-2 font-medium">{description}</p>
    </div>
  );
}

const ChatMessage: React.FC<Message> = ({ role, content, timestamp }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "max-w-[90%] flex flex-col gap-1",
        role === 'user' ? "self-end items-end" : "self-start items-start"
      )}
    >
      <div className={cn(
        "p-4 rounded-3xl text-sm leading-relaxed shadow-sm",
        role === 'user' 
          ? "bg-primary text-on-primary rounded-tr-none" 
          : "bg-surface-container-low border border-outline-variant/10 rounded-tl-none text-on-surface"
      )}>
        {content}
      </div>
      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter px-2">{timestamp}</span>
    </motion.div>
  );
};
