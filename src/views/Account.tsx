import React from 'react';
import { 
  User, 
  ShieldCheck, 
  Key, 
  History, 
  Camera,
  Check,
  Zap,
  ExternalLink,
  Copy,
  Plus,
  Mail,
  MapPin,
  Globe,
  Twitter,
  Github,
  Linkedin,
  Smartphone,
  Laptop,
  Clock
} from 'lucide-react';
import { cn } from '../lib/utils';

export function Account() {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-10 custom-scrollbar">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm relative overflow-hidden">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden ring-8 ring-primary-container/30 shadow-2xl transition-transform group-hover:scale-105 duration-500">
            <img 
              className="w-full h-full object-cover" 
              alt="Profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8DF7Ficmu3v2M0VzfycWGQAfVNARxoYZEL_wzRvPkt7vAbS8A_XF6maTyc-ICT-uiFdwTEHwOYpW5wdGRvcUjJ6iOSvyQbC-xLY71CGhMbdTuYUYH7U8TfEQL7nsvTu1pFAjzmV63nXDFWreAZ5ferCuM43ftx2BcQyEmpaBSTgUHdL139jZ5W8MaHz5BUHS-lPLU6odsHbs9h6pKdgOutXdxr24J5CisGbvVNkXR4GTvykRhJ1Jje29XV9lrbX-4xgbp2vhpiEKf"
            />
          </div>
          <button className="absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-all active:scale-95 border-4 border-white">
            <Camera size={20} />
          </button>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
              <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">Alex Thompson</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                <Zap size={10} fill="currentColor" /> 首席架构师
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-on-surface-variant font-medium text-sm">
              <span className="flex items-center gap-1.5"><Mail size={14} /> a.thompson@example.com</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> 纽约, 美国</span>
              <span className="flex items-center gap-1.5"><Globe size={14} /> alex-t.dev</span>
            </div>
          </div>
          
          <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
            专注于大规模分布式系统和 AI 驱动的数据分析。目前在 Intelligence Bureau 负责核心架构设计与自动化分析引擎的优化。
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
            <button className="px-8 py-2.5 bg-primary text-on-primary font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95">
              编辑个人资料
            </button>
            <div className="flex gap-2">
              <SocialButton icon={Twitter} />
              <SocialButton icon={Github} />
              <SocialButton icon={Linkedin} />
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Security & API */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Details */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-3">
              <User className="text-primary" size={22} /> 详细信息
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoField label="全名" value="Alex Thompson" />
              <InfoField label="职位" value="Senior Data Architect" />
              <InfoField label="部门" value="Engineering & AI Research" />
              <InfoField label="入职日期" value="2022年3月15日" />
              <InfoField label="主要技能" value="Python, React, TensorFlow, SQL" />
              <InfoField label="办公地点" value="Remote / New York Office" />
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-surface-container rounded-2xl text-on-surface-variant">
                  <Key size={22} />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xl text-on-surface">API 密钥管理</h3>
                  <p className="text-xs text-on-surface-variant mt-1">用于集成外部服务和自动化脚本</p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-primary-container text-on-primary font-bold rounded-xl text-xs flex items-center gap-2 shadow-sm hover:opacity-90 transition-all">
                <Plus size={16} /> 创建新密钥
              </button>
            </div>
            
            <div className="space-y-4">
              <ApiKeyItem name="生产环境 (Read-Only)" keyStr="sk_live_••••••••••••••••4e2a" date="2023年8月12日" usage="1.2k 调用/日" />
              <ApiKeyItem name="开发测试 (Full Access)" keyStr="sk_test_••••••••••••••••9b1c" date="2023年10月05日" usage="45 调用/日" />
            </div>
          </div>
        </div>

        {/* Right Column: Security & Activity */}
        <div className="space-y-8">
          {/* Security Status */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-3">
              <ShieldCheck className="text-tertiary" size={22} /> 安全中心
            </h3>
            <div className="space-y-5">
              <SecurityCheck label="双重身份验证 (2FA)" status="已启用" active />
              <SecurityCheck label="最后一次密码修改" status="3个月前" />
              <SecurityCheck label="登录保护" status="高级模式" active />
              <div className="pt-4 space-y-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">受信任的设备</p>
                <TrustedDevice icon={Laptop} name="MacBook Pro 16\" location="New York, US" />
                <TrustedDevice icon={Smartphone} name="iPhone 15 Pro" location="New York, US" />
              </div>
            </div>
            <button className="w-full mt-8 py-3.5 border border-outline-variant text-on-surface font-bold rounded-2xl text-sm hover:bg-surface-container transition-all active:scale-95">
              修改安全设置
            </button>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <h3 className="font-headline font-bold text-xl text-on-surface mb-6 flex items-center gap-3">
              <History className="text-on-surface-variant" size={22} /> 活动日志
            </h3>
            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container">
              <ActivityLogItem icon={Check} label="成功导出 Q4 报告" time="2小时前" />
              <ActivityLogItem icon={Key} label="API 密钥已轮换" time="昨天 14:20" />
              <ActivityLogItem icon={ShieldCheck} label="新设备登录验证" time="2天前" />
              <ActivityLogItem icon={Clock} label="密码修改成功" time="3个月前" />
            </div>
            <button className="w-full mt-8 text-primary font-bold text-xs uppercase tracking-widest hover:underline text-center">
              查看完整审计日志
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialButton({ icon: Icon }: { icon: any }) {
  return (
    <button className="p-2.5 bg-surface-container-low text-on-surface-variant rounded-xl hover:text-primary hover:bg-primary/5 transition-all border border-outline-variant/10">
      <Icon size={18} />
    </button>
  );
}

function InfoField({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
      <p className="text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function ApiKeyItem({ name, keyStr, date, usage }: any) {
  return (
    <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/5 group hover:border-primary/20 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-sm font-bold text-on-surface block">{name}</span>
          <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">{usage}</span>
        </div>
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">创建于 {date}</span>
      </div>
      <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-outline-variant/10 shadow-inner">
        <code className="flex-1 text-xs font-mono text-on-surface-variant truncate">{keyStr}</code>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/5 rounded-lg">
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
}

function SecurityCheck({ label, status, active }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-on-surface-variant font-medium">{label}</span>
      <span className={cn(
        "text-xs font-bold px-2 py-1 rounded-lg",
        active ? "bg-tertiary/10 text-tertiary" : "bg-surface-container text-on-surface"
      )}>{status}</span>
    </div>
  );
}

function TrustedDevice({ icon: Icon, name, location }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-outline-variant/5">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-on-surface">{name}</p>
        <p className="text-[10px] text-on-surface-variant">{location}</p>
      </div>
      <div className="w-2 h-2 bg-tertiary rounded-full shadow-[0_0_8px_rgba(0,96,88,0.4)]" />
    </div>
  );
}

function ActivityLogItem({ icon: Icon, label, time }: any) {
  return (
    <div className="flex gap-4 relative z-10">
      <div className="w-8 h-8 bg-white border-2 border-surface-container rounded-full flex items-center justify-center text-primary shrink-0 shadow-sm">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-sm font-bold text-on-surface leading-tight">{label}</p>
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">{time}</p>
      </div>
    </div>
  );
}
