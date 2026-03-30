import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot,
  Sparkles,
  Loader2,
  Paperclip,
  Mic,
  History,
  Settings,
  MoreVertical,
  Trash2,
  Database,
  Download,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { GoogleGenAI } from "@google/genai";
import { Dataset, Message } from '../types';
import { toast } from 'sonner';

interface ChatProps {
  datasets: Dataset[];
  setDatasets: React.Dispatch<React.SetStateAction<Dataset[]>>;
  setStats: React.Dispatch<React.SetStateAction<{ optimized: number; models: number; reports: number }>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function Chat({ datasets, setDatasets, setStats, messages, setMessages }: ChatProps) {
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_STORAGE = 1024 * 1024 * 1024; // 1GB
  const usedStorage = datasets.reduce((acc, d) => acc + d.sizeBytes, 0);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (files: FileList | null) => {
    setIsDragOver(false);
    if (!files || files.length === 0) return;

    setIsUploading(true);
    toast.loading('正在上传文件...', { id: 'chat-upload' });
    
    // Simulate upload
    setTimeout(() => {
      const newDatasets: Dataset[] = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
        status: 'processing',
        size: file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(1)} KB`,
        sizeBytes: file.size,
        progress: 0
      }));

      const totalNewSize = newDatasets.reduce((acc, ds) => acc + ds.sizeBytes, 0);
      if (usedStorage + totalNewSize > MAX_STORAGE) {
        toast.error('存储空间不足 (1GB 限制)', { id: 'chat-upload' });
        setIsUploading(false);
        return;
      }

      setDatasets(prev => [...newDatasets, ...prev]);
      setIsUploading(false);
      toast.success(`成功上传 ${files.length} 个文件`, { id: 'chat-upload' });
      
      // Simulate processing completion for each file
      newDatasets.forEach(ds => {
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.random() * 20;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            
            // Update status to "Reading"
            setDatasets(current => current.map(item => 
              item.id === ds.id ? { ...item, status: 'reading', progress: 100 } : item
            ));
            
            // Complete analysis
            setTimeout(() => {
              setDatasets(current => current.map(item => 
                item.id === ds.id ? { ...item, status: 'cleaned' } : item
              ));
              setStats(prev => ({ ...prev, optimized: prev.optimized + 1 }));
              toast.success(`AI 已完成对 "${ds.name}" 的深度分析`, { 
                duration: 5000,
                icon: <Sparkles className="text-primary" size={16} />
              });
            }, 2000);
          } else {
            setDatasets(current => current.map(item => 
              item.id === ds.id ? { ...item, progress: Math.floor(currentProgress) } : item
            ));
          }
        }, 300);
      });
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleDownloadHistory = () => {
    const historyText = messages.map(msg => 
      `[${msg.timestamp}] ${msg.role === 'user' ? '用户' : '助手'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
      
      const datasetInfo = datasets.length > 0 
        ? `当前已上传的数据集有：${datasets.map(d => d.name).join(', ')}。`
        : "当前尚未上传任何数据集。";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: chatInput,
        config: {
          systemInstruction: `你是一个资深数据分析专家。你的任务是协助用户分析他们上传的数据集。${datasetInfo} 你的回答必须极其简明扼要，直接切中要点，避免冗长的解释和客套话。如果用户询问有关数据的问题，请结合已上传的文件名进行回答。`,
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
    <div className="flex-1 flex flex-col h-full bg-surface-container-lowest overflow-hidden">
      {/* Chat Header */}
      <header className="px-8 py-6 bg-white border-b border-outline-variant/10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-headline font-bold text-xl text-on-surface">AI 数据助手</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full animate-pulse" />
              <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">在线 • 已就绪</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface-container rounded-xl border border-outline-variant/10">
            <Database size={16} className="text-primary" />
            <span className="text-xs font-bold text-on-surface-variant">
              {datasets.length} 个活跃数据集
            </span>
          </div>
          <button 
            onClick={handleDownloadHistory}
            className="p-2.5 hover:bg-surface-container rounded-xl transition-all text-on-surface-variant"
            title="下载聊天记录"
          >
            <Download size={20} />
          </button>
          <button className="p-2.5 hover:bg-surface-container rounded-xl transition-all text-on-surface-variant">
            <History size={20} />
          </button>
          <button className="p-2.5 hover:bg-surface-container rounded-xl transition-all text-on-surface-variant">
            <Settings size={20} />
          </button>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="p-2.5 hover:bg-error/10 hover:text-error rounded-xl transition-all text-on-surface-variant"
            title="清空对话"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-white to-surface-container-lowest relative"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-primary m-4 rounded-3xl"
            >
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Paperclip size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">释放文件以上传</h3>
                  <p className="text-sm text-on-surface-variant mt-1">文件将自动同步到您的项目数据集中</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={`msg-${idx}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-4xl",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary"
              )}>
                {msg.role === 'user' ? <Sparkles size={18} /> : <Bot size={18} />}
              </div>
              
              <div className="space-y-2 max-w-[85%]">
                <div className={cn(
                  "p-5 rounded-3xl shadow-sm text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-secondary text-on-secondary rounded-tr-none" 
                    : "bg-white border border-outline-variant/10 rounded-tl-none text-on-surface"
                )}>
                  {msg.content}
                </div>
                <p className={cn(
                  "text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter px-2",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-primary font-bold text-xs px-14"
          >
            <Loader2 size={16} className="animate-spin" />
            <span>AI 正在深度扫描数据集并生成洞察...</span>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <footer className="p-8 bg-white border-t border-outline-variant/10">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative flex items-end gap-3 bg-surface-container-low rounded-[2rem] p-3 border border-outline-variant/10 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-3 hover:bg-white rounded-2xl text-on-surface-variant transition-all disabled:opacity-50"
              title="上传数据集"
            >
              {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
            </button>
            
            <textarea
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 py-3 px-2 text-sm resize-none custom-scrollbar max-h-40"
              placeholder="询问有关您的数据集的问题..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <div className="flex items-center gap-2">
              <button className="p-3 hover:bg-white rounded-2xl text-on-surface-variant transition-all">
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                className="p-3 bg-primary text-on-primary rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {['分析数据趋势', '检测异常值', '合并建议', '生成摘要报告'].map(tag => (
              <button 
                key={tag}
                onClick={() => setChatInput(tag)}
                className="px-4 py-2 bg-surface-container-low text-[10px] font-bold text-on-surface-variant rounded-full hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
