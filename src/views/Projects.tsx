import React, { useState } from 'react';
import { 
  CloudUpload, 
  Database, 
  Sparkles, 
  LineChart, 
  FileText, 
  Table as TableIcon, 
  FileJson,
  Download,
  BarChart2,
  Trash2,
  ExternalLink,
  Plus,
  Search,
  Filter as FilterIcon,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  FileDown,
  Loader2,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Dataset } from '../types';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { toast } from 'sonner';

interface ProjectsProps {
  datasets: Dataset[];
  setDatasets: React.Dispatch<React.SetStateAction<Dataset[]>>;
  stats: { optimized: number; models: number; reports: number };
  setStats: React.Dispatch<React.SetStateAction<{ optimized: number; models: number; reports: number }>>;
}

export function Projects({ datasets, setDatasets, stats, setStats }: ProjectsProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisStatus, setAnalysisStatus] = React.useState<'idle' | 'processing' | 'success'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const [usedStorage, setUsedStorage] = useState(() => 
    datasets.reduce((acc, d) => acc + d.sizeBytes, 0)
  );

  const MAX_STORAGE = 1024 * 1024 * 1024; // 1GB

  const filteredDatasets = datasets.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    toast.loading('正在上传文件...', { id: 'upload' });
    
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
        toast.error('存储空间不足 (1GB 限制)', { id: 'upload' });
        setIsUploading(false);
        return;
      }

      setDatasets(prev => [...newDatasets, ...prev]);
      setUsedStorage(prev => prev + totalNewSize);
      setIsUploading(false);
      toast.success(`成功上传 ${files.length} 个文件`, { id: 'upload' });
      
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

  const deleteDataset = (id: string) => {
    const datasetToDelete = datasets.find(d => d.id === id);
    if (datasetToDelete) {
      setUsedStorage(prev => prev - datasetToDelete.sizeBytes);
      setDatasets(prev => prev.filter(d => d.id !== id));
      toast.success(`已移除数据集 "${datasetToDelete.name}"`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleViewSuggestions = async () => {
    setIsGeneratingSuggestions(true);
    setSuggestions(null);
    setStats(prev => ({ ...prev, reports: prev.reports + 1 }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "分析以下两个数据集：'Q4_财务报告.csv' 和 '库存水平数据.csv'。它们之间存在 87% 的时间维度重合。请提供详细的合并建议，包括合并后的潜在商业价值、建议的合并键（如日期、产品ID等）、以及合并后可以进行的具体分析（如跨维度盈亏分析）。请用专业、简洁的中文回答，并使用 Markdown 格式。",
        config: {
          systemInstruction: "你是一个资深数据架构师，擅长发现数据集之间的关联并提供战略性合并建议。",
        }
      });
      setSuggestions(response.text || "无法生成建议，请稍后再试。");
    } catch (error) {
      console.error("Gemini Error:", error);
      setSuggestions("生成建议时出错，请检查网络连接。");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const handleDeepAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisStatus('processing');
    
    // Simulate AI analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `针对已上传的数据集（${datasets.map(d => d.name).join(', ')}）生成一份深度的关联分析报告。包含：数据集之间的潜在关联点、建议的数据整合策略、以及整合后可以挖掘的商业洞察。请使用 Markdown 格式，语气专业且富有前瞻性。`,
      });
      setSuggestions(response.text || "分析已完成，但未生成具体建议。");
    } catch (error) {
      console.error("Deep Analysis Error:", error);
    } finally {
      setAnalysisStatus('success');
      setTimeout(() => {
        setAnalysisStatus('idle');
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
      {/* Hero Upload Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary-container to-primary p-12 text-on-primary shadow-2xl shadow-primary/20">
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md border border-white/10"
            >
              <Sparkles size={14} />
              <span>新功能: AI 自动模式识别已上线</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-headline font-extrabold text-5xl mb-6 tracking-tight leading-[1.1]"
            >
              构建您的<br />智能数据架构
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-on-primary-container/80 text-xl mb-10 font-light leading-relaxed"
            >
              Synthetix Data 帮助您将杂乱无章的原始数据转化为结构化的商业洞察。
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
            </motion.div>
          </div>
          
          {/* Upload Zone */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className={cn(
              "w-full lg:w-96 group relative flex flex-col items-center justify-center border-2 border-dashed border-white/30 bg-white/5 hover:bg-white/10 rounded-[2rem] p-12 transition-all duration-500 cursor-pointer backdrop-blur-md",
              isUploading && "opacity-50 pointer-events-none"
            )}
          >
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-inner border border-white/10">
              {isUploading ? <Loader2 size={40} className="animate-spin" /> : <CloudUpload size={40} />}
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl mb-2">{isUploading ? "正在上传..." : "上传数据集"}</p>
              <p className="text-sm text-primary-fixed/60 max-w-[200px] mx-auto">支持 CSV, Excel, JSON, PDF (最大 500MB)</p>
            </div>
            <input 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              type="file" 
              accept=".csv,.xlsx,.xls,.json,.pdf" 
              multiple
              onChange={handleFileChange}
            />
          </motion.div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-tertiary/20 rounded-full blur-[100px]" />
      </section>

      {/* Stats Layer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickStat icon={Database} label="内存使用" value={`${(usedStorage / (1024 * 1024)).toFixed(1)} MB`} sub="共 1.0 GB" color="text-primary" />
        <QuickStat icon={Sparkles} label="已分析数据集" value={stats.optimized.toString()} sub="本会话处理" color="text-tertiary" />
        <QuickStat icon={LineChart} label="活跃模型" value={stats.models.toString()} sub="系统运行中" color="text-purple-600" />
        <QuickStat icon={FileText} label="AI 建议" value={stats.reports.toString()} sub="本会话生成" color="text-orange-500" />
      </div>

      {/* Datasets Management Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-headline font-bold text-2xl text-on-surface">我的数据集</h3>
            <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/10">
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === 'list' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface")}
              >
                <ListIcon size={18} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface")}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {datasets.length > 0 && (
              <button 
                onClick={() => {
                  setDatasets([]);
                  setUsedStorage(0);
                  toast.success('已清空所有数据集');
                }}
                className="px-4 py-2 bg-error/10 text-error rounded-xl text-xs font-bold hover:bg-error/20 transition-all flex items-center gap-2"
              >
                <Trash2 size={14} /> 清空全部
              </button>
            )}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input 
                type="text" 
                placeholder="搜索数据集..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-outline-variant/20 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <button className="p-2.5 bg-white border border-outline-variant/20 rounded-xl text-on-surface-variant hover:bg-surface-container transition-all">
              <FilterIcon size={18} />
            </button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10"
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low/50 border-b border-outline-variant/10">
                    <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label">文件名</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label">上传日期</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label">状态</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label">大小</th>
                    <th className="px-8 py-5 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest font-label text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredDatasets.map((dataset) => (
                    <tr key={dataset.id} className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-surface-container rounded-xl group-hover:scale-110 transition-transform">
                            {getFileIcon(dataset.name)}
                          </div>
                          <span className="font-bold text-on-surface">{dataset.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">{dataset.date}</td>
                      <td className="px-8 py-5">
                        <StatusBadge status={dataset.status} progress={dataset.progress} />
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant tabular-nums font-medium">{dataset.size}</td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <ActionButton icon={BarChart2} tooltip="分析" />
                          <ActionButton icon={Download} tooltip="下载" />
                          <ActionButton icon={ExternalLink} tooltip="预览" />
                          <ActionButton icon={Trash2} tooltip="删除" danger onClick={() => deleteDataset(dataset.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDatasets.map((dataset) => (
                <div key={dataset.id} className="bg-white p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-surface-container rounded-2xl group-hover:bg-primary/5 transition-colors">
                      {getFileIcon(dataset.name)}
                    </div>
                    <StatusBadge status={dataset.status} progress={dataset.progress} />
                  </div>
                  <h4 className="font-bold text-lg text-on-surface mb-1 truncate">{dataset.name}</h4>
                  <p className="text-xs text-on-surface-variant font-medium mb-6">{dataset.date} • {dataset.size}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                    <button className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                      立即处理 <ChevronRight size={14} />
                    </button>
                    <div className="flex gap-1">
                      <ActionButton icon={Download} tooltip="下载" small />
                      <ActionButton icon={Trash2} tooltip="删除" small danger onClick={() => deleteDataset(dataset.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* AI Smart Integration Banner */}
      <section className="relative overflow-hidden bg-surface-container-low rounded-[2.5rem] p-10 border border-outline-variant/10 shadow-sm">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Sparkles size={16} fill="currentColor" />
              <span className="font-bold text-[10px] uppercase tracking-[0.2em]">AI 智能建议</span>
            </div>
            <h4 className="font-headline font-bold text-3xl text-on-surface">
              {datasets.length === 0 ? "开始您的数据之旅" : 
               datasets.length === 1 ? "深入挖掘数据价值" : 
               "发现数据关联性"}
            </h4>
            <p className="text-on-surface-variant leading-relaxed text-lg max-w-2xl font-light">
              {datasets.length === 0 ? (
                "上传您的第一个数据集，让我们的 AI 引擎为您揭示隐藏在数字背后的商业逻辑。"
              ) : datasets.length === 1 ? (
                <>我们已准备好对 <span className="font-bold text-on-surface">{datasets[0].name}</span> 进行全方位扫描。点击下方按钮获取深度分析建议。</>
              ) : (
                <>
                  我们的 AI 引擎注意到 <span className="font-bold text-on-surface">{datasets[0].name}</span> 与 <span className="font-bold text-on-surface">{datasets[1].name}</span> 之间可能存在关联。
                  建议进行<span className="text-primary font-bold">跨维度分析</span>以获取更全面的洞察。
                </>
              )}
            </p>
          </div>
          {datasets.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {datasets.length >= 2 && (
                <button 
                  onClick={handleDeepAnalysis}
                  disabled={isAnalyzing}
                  className="px-10 py-4 bg-primary text-on-primary font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 min-w-[200px]"
                >
                  {analysisStatus === 'processing' ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      正在分析关联...
                    </>
                  ) : analysisStatus === 'success' ? (
                    <>
                      <CheckCircle2 size={20} />
                      分析完成
                    </>
                  ) : (
                    "获取 AI 关联建议"
                  )}
                </button>
              )}
              <button 
                onClick={handleViewSuggestions}
                disabled={isGeneratingSuggestions}
                className="px-10 py-4 bg-white border border-outline-variant/20 text-on-surface font-bold rounded-2xl hover:bg-surface-container transition-all whitespace-nowrap flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isGeneratingSuggestions ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    扫描中...
                  </>
                ) : (
                  "查看 AI 建议"
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Suggestions Modal */}
      <AnimatePresence>
        {suggestions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl max-h-[80vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary text-on-primary rounded-xl">
                    <Sparkles size={20} fill="currentColor" />
                  </div>
                  <h3 className="font-headline font-bold text-2xl">AI 详细合并建议</h3>
                </div>
                <button 
                  onClick={() => setSuggestions(null)}
                  className="p-2 hover:bg-surface-container rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar prose prose-slate max-w-none">
                <div className="markdown-body">
                  <Markdown>{suggestions}</Markdown>
                </div>
              </div>
              <div className="p-6 bg-surface-container-low border-t border-outline-variant/10 flex justify-end gap-4">
                <button 
                  onClick={() => setSuggestions(null)}
                  className="px-6 py-3 text-on-surface-variant font-bold hover:text-on-surface transition-all"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    setSuggestions(null);
                    handleDeepAnalysis();
                  }}
                  className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                >
                  获取深度关联报告
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, sub, color }: { icon: any, label: string, value: string, sub: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] flex flex-col gap-4 shadow-sm border border-outline-variant/10 hover:shadow-md transition-all">
      <div className={cn("w-12 h-12 bg-surface-container flex items-center justify-center rounded-2xl shadow-inner", color)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="font-headline font-bold text-3xl text-on-surface mb-1">{value}</p>
        <p className="text-xs text-on-surface-variant/70 font-medium">{sub}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, tooltip, danger, small, onClick }: { icon: any, tooltip: string, danger?: boolean, small?: boolean, onClick?: () => void }) {
  return (
    <button 
      title={tooltip}
      onClick={onClick}
      className={cn(
        "transition-all rounded-xl flex items-center justify-center",
        small ? "p-1.5" : "p-2.5",
        danger 
          ? "text-on-surface-variant hover:text-error hover:bg-error/5" 
          : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
      )}
    >
      <Icon size={small ? 16 : 20} />
    </button>
  );
}

function StatusBadge({ status, progress }: { status: Dataset['status'] | 'reading', progress?: number }) {
  const configs = {
    cleaned: { label: '已处理', color: 'bg-tertiary/10 text-tertiary', dot: 'bg-tertiary' },
    processing: { label: 'AI 读取中', color: 'bg-secondary/10 text-secondary', dot: 'bg-secondary animate-pulse' },
    reading: { label: '正在分析', color: 'bg-primary/10 text-primary', dot: 'bg-primary animate-bounce' },
    error: { label: '错误', color: 'bg-error/10 text-error', dot: 'bg-error' },
  };
  const config = configs[status as keyof typeof configs] || configs.processing;
  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      <span className={cn("inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit", config.color)}>
        <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
        {status === 'processing' && progress !== undefined ? `${config.label} ${progress}%` : config.label}
      </span>
      {status === 'processing' && progress !== undefined && (
        <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-secondary"
          />
        </div>
      )}
    </div>
  );
}

function getFileIcon(name: string) {
  if (name.endsWith('.csv')) return <FileText size={24} className="text-primary" />;
  if (name.endsWith('.xlsx')) return <TableIcon size={24} className="text-primary" />;
  if (name.endsWith('.json')) return <FileJson size={24} className="text-primary" />;
  if (name.endsWith('.pdf')) return <FileDown size={24} className="text-rose-500" />;
  return <FileText size={24} className="text-primary" />;
}
