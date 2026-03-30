import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  PlayCircle, 
  FileText, 
  ChevronRight,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Users,
  Code2,
  Cpu,
  LifeBuoy,
  Mail,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Help() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
      {/* Search Hero */}
      <section className="relative bg-surface-container-low py-24 px-8 text-center border-b border-outline-variant/10 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Cpu size={400} className="absolute -right-20 -top-20 rotate-12" />
          <Globe size={300} className="absolute -left-20 -bottom-20 -rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="font-headline font-extrabold text-5xl text-on-surface tracking-tight mb-4">我们能帮您什么？</h2>
            <p className="text-on-surface-variant text-xl font-light">搜索文档、观看教程或直接与我们的专家团队交流。</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={24} />
            <input 
              className="w-full bg-white border-none rounded-[2rem] py-6 pl-14 pr-6 text-lg focus:ring-4 focus:ring-primary/10 shadow-2xl shadow-primary/5 transition-all outline-none" 
              placeholder="搜索问题, 如 '如何连接 S3' 或 'AI 分析原理'..." 
              type="text"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-surface-container rounded-lg text-[10px] font-bold text-on-surface-variant border border-outline-variant/20">⌘ K</kbd>
            </div>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['连接数据库', '导出 CSV', 'API 密钥', '团队协作'].map(tag => (
              <button key={tag} className="px-4 py-1.5 bg-white rounded-full text-xs font-bold text-on-surface-variant border border-outline-variant/10 hover:border-primary hover:text-primary transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-8 lg:p-12 space-y-20">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HelpCategory 
            icon={BookOpen} 
            title="入门指南" 
            desc="了解 Synthetix Data 的核心概念，并在几分钟内开始您的第一个 AI 数据项目。" 
            color="text-primary"
            items={['快速开始', '核心架构', '数据导入指南']}
          />
          <HelpCategory 
            icon={PlayCircle} 
            title="视频教程" 
            desc="观看我们的专家演示如何使用高级 AI 数据分析、模式识别和预测建模功能。" 
            color="text-tertiary"
            items={['AI 分析实战', '高级筛选技巧', '仪表盘自定义']}
          />
          <HelpCategory 
            icon={Code2} 
            title="开发者资源" 
            desc="详细的 API 文档、SDK 参考和 Webhook 配置指南，用于深度集成。" 
            color="text-purple-600"
            items={['REST API 参考', 'Python SDK', '身份验证指南']}
          />
        </div>

        {/* FAQ Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-headline font-bold text-3xl text-on-surface tracking-tight">常见问题</h3>
            <p className="text-on-surface-variant leading-relaxed">
              这里有关于平台使用、安全性和计费的最常见问题的快速解答。
            </p>
            <button className="flex items-center gap-2 text-primary font-bold hover:underline underline-offset-4">
              查看所有 FAQ <ArrowRight size={18} />
            </button>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FaqItem question="如何导入超过 10GB 的超大型数据集？" />
            <FaqItem question="AI 数据分析的准确率是如何计算的？" />
            <FaqItem question="我可以将平台连接到私有 VPC 吗？" />
            <FaqItem question="如何与外部利益相关者共享动态报告？" />
            <FaqItem question="支持哪些高精度数据导出格式？" />
            <FaqItem question="我的数据在处理过程中是如何加密的？" />
          </div>
        </section>

        {/* Community & Support Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-low p-10 rounded-[3rem] border border-outline-variant/10 flex flex-col justify-between group hover:bg-white hover:shadow-xl transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h4 className="font-headline font-bold text-2xl text-on-surface">加入社区</h4>
              <p className="text-on-surface-variant leading-relaxed">
                与其他数据架构师交流经验，分享您的分析脚本，并获取来自社区的灵感。
              </p>
            </div>
            <button className="mt-8 flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
              访问论坛 <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="bg-surface-container-low p-10 rounded-[3rem] border border-outline-variant/10 flex flex-col justify-between group hover:bg-white hover:shadow-xl transition-all">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <LifeBuoy size={28} />
              </div>
              <h4 className="font-headline font-bold text-2xl text-on-surface">开发者支持</h4>
              <p className="text-on-surface-variant leading-relaxed">
                需要技术协助？我们的工程师团队可以为您提供关于 API 集成和复杂架构的指导。
              </p>
            </div>
            <button className="mt-8 flex items-center gap-2 text-tertiary font-bold group-hover:gap-3 transition-all">
              联系技术支持 <ChevronRight size={18} />
            </button>
          </div>
        </section>

        {/* Contact Support CTA */}
        <section className="relative overflow-hidden bg-on-background p-12 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4 text-center md:text-left">
            <h4 className="font-headline font-bold text-4xl tracking-tight">还没找到答案？</h4>
            <p className="text-white/60 text-lg font-light">我们的全球支持团队 24/7 全天候为您提供个性化帮助。</p>
          </div>
          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <button className="px-10 py-4 bg-white text-on-background font-bold rounded-2xl flex items-center gap-3 hover:scale-105 transition-all active:scale-95 shadow-xl">
              <MessageCircle size={20} fill="currentColor" /> 在线聊天
            </button>
            <button className="px-10 py-4 border border-white/20 text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all">
              <Mail size={20} /> 提交工单
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function HelpCategory({ icon: Icon, title, desc, color, items }: any) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white p-10 rounded-[3rem] border border-outline-variant/10 shadow-sm hover:shadow-2xl transition-all group cursor-pointer"
    >
      <div className={cn("w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner", color)}>
        <Icon size={32} />
      </div>
      <h4 className="font-headline font-bold text-2xl text-on-surface mb-3">{title}</h4>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-8 font-light">{desc}</p>
      
      <ul className="space-y-3 mb-8">
        {items.map((item: string) => (
          <li key={item} className="flex items-center gap-2 text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">
            <div className={cn("w-1.5 h-1.5 rounded-full", color.replace('text-', 'bg-'))} />
            {item}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
        浏览全部内容 <ChevronRight size={14} />
      </div>
    </motion.div>
  );
}

function FaqItem({ question }: { question: string }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-[1.5rem] border border-outline-variant/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group shadow-sm">
      <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors pr-4">{question}</span>
      <div className="text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
        <ChevronRight size={20} />
      </div>
    </div>
  );
}
