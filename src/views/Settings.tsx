import { 
  Palette, 
  Bell, 
  Database, 
  Globe, 
  Shield, 
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Check,
  Key,
  Smartphone,
  History,
  Trash2,
  Download,
  Lock,
  Eye,
  UserPlus,
  Settings2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function Settings() {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-12 custom-scrollbar pb-24">
      <div className="space-y-2">
        <h2 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">系统设置</h2>
        <p className="text-on-surface-variant text-lg font-light">管理您的偏好设置、安全选项和数据源连接。</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Navigation Sidebar (Mobile Sticky or Desktop Side) */}
        <div className="lg:col-span-1 space-y-2">
          <SettingsNav icon={Palette} label="外观与主题" active />
          <SettingsNav icon={Bell} label="通知偏好" />
          <SettingsNav icon={Database} label="数据源集成" />
          <SettingsNav icon={Shield} label="安全与隐私" />
          <SettingsNav icon={Globe} label="语言与地区" />
          <SettingsNav icon={History} label="操作审计" />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Appearance Section */}
          <SettingsSection 
            icon={Palette} 
            title="外观" 
            description="自定义界面的视觉风格，以适应您的工作环境。"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <ThemeOption icon={Sun} label="浅色模式" active />
              <ThemeOption icon={Moon} label="深色模式" />
              <ThemeOption icon={Monitor} label="跟随系统" />
            </div>
          </SettingsSection>

          {/* Notifications Section */}
          <SettingsSection 
            icon={Bell} 
            title="通知" 
            description="配置您希望接收的警报和更新频率。"
          >
            <div className="space-y-6 mt-6">
              <ToggleOption label="数据处理完成" description="当您的数据集分析任务成功结束时通知您。" defaultChecked />
              <ToggleOption label="异常检测警报" description="当 AI 在实时流中发现重大异常或数据偏差时发送即时警报。" defaultChecked />
              <ToggleOption label="协作邀请" description="当其他团队成员邀请您加入项目或共享数据集时通知您。" defaultChecked />
              <ToggleOption label="系统维护更新" description="接收有关新功能发布、API 变更和计划维护的通知。" />
            </div>
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection 
            icon={Shield} 
            title="安全与隐私" 
            description="保护您的账户安全并管理数据访问权限。"
          >
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-tertiary/10 text-tertiary rounded-xl">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">双重身份验证 (2FA)</p>
                    <p className="text-xs text-on-surface-variant">通过手机验证码增加额外的安全保护层。</p>
                  </div>
                </div>
                <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline">立即开启</button>
              </div>
              
              <div className="space-y-4">
                <ToggleOption label="公开个人资料" description="允许其他组织成员在搜索中找到您的个人资料。" />
                <ToggleOption label="自动注销会话" description="在 30 分钟无操作后自动退出登录。" defaultChecked />
              </div>
            </div>
          </SettingsSection>

          {/* Data Sources Section */}
          <SettingsSection 
            icon={Database} 
            title="数据源集成" 
            description="连接并管理您的外部数据库、云存储和 API 终端。"
          >
            <div className="space-y-3 mt-6">
              <SourceItem name="AWS S3 Bucket (Production)" status="已连接" type="Amazon S3" />
              <SourceItem name="Google BigQuery (Analytics)" status="已连接" type="BigQuery" />
              <SourceItem name="PostgreSQL (Legacy DB)" status="连接失败" isDisconnected type="PostgreSQL" />
              <button className="w-full py-4 border-2 border-dashed border-outline-variant/20 rounded-2xl text-sm font-bold text-primary hover:bg-primary/5 transition-all mt-2 flex items-center justify-center gap-2">
                <UserPlus size={18} /> 添加新数据源
              </button>
            </div>
          </SettingsSection>

          {/* Data Management Section */}
          <SettingsSection 
            icon={Trash2} 
            title="数据管理" 
            description="导出您的个人数据或永久删除您的账户。"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center gap-2 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:bg-surface-container transition-all group">
                <Download size={18} className="text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-on-surface">导出所有数据</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-error/5 rounded-2xl border border-error/10 hover:bg-error/10 transition-all group">
                <Trash2 size={18} className="text-error group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-error">注销账户</span>
              </button>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 p-6 z-20">
        <div className="max-w-5xl mx-auto flex justify-end gap-4">
          <button className="px-8 py-3 text-on-surface-variant font-bold hover:bg-surface-container rounded-2xl transition-all">
            重置
          </button>
          <button className="px-12 py-3 bg-primary text-on-primary font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
            保存更改
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsNav({ icon: Icon, label, active }: any) {
  return (
    <button className={cn(
      "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
      active ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "hover:bg-surface-container-low text-on-surface-variant"
    )}>
      <div className="flex items-center gap-3">
        <Icon size={20} />
        <span className="text-sm font-bold">{label}</span>
      </div>
      <ChevronRight size={16} className={cn("transition-transform group-hover:translate-x-1", active ? "text-on-primary/50" : "text-on-surface-variant/30")} />
    </button>
  );
}

function SettingsSection({ icon: Icon, title, description, children }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm"
    >
      <div className="flex items-start gap-5 mb-4">
        <div className="p-3 bg-surface-container rounded-2xl text-primary shadow-inner">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-headline font-bold text-xl text-on-surface">{title}</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function ThemeOption({ icon: Icon, label, active }: any) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all cursor-pointer group",
      active 
        ? "border-primary bg-primary/5 text-primary shadow-sm" 
        : "border-outline-variant/10 hover:border-outline-variant/30 text-on-surface-variant"
    )}>
      <Icon size={32} className="group-hover:scale-110 transition-transform" />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      {active && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
    </div>
  );
}

function ToggleOption({ label, description, defaultChecked }: any) {
  return (
    <div className="flex items-center justify-between py-2 group">
      <div className="flex-1">
        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{label}</p>
        <p className="text-xs text-on-surface-variant">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-12 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
}

function SourceItem({ name, status, isDisconnected, type }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-surface-container-low rounded-2xl border border-outline-variant/5 hover:bg-white hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-on-surface-variant shadow-sm group-hover:scale-110 transition-transform">
          <Database size={20} />
        </div>
        <div>
          <span className="text-sm font-bold text-on-surface block">{name}</span>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{type}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className={cn(
          "text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest",
          isDisconnected ? "bg-error/10 text-error" : "bg-tertiary/10 text-tertiary"
        )}>
          {status}
        </span>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Settings2 size={18} />
        </button>
      </div>
    </div>
  );
}
