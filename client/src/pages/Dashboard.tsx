import { useState } from 'react';
import { Monitor, Settings, Users, BarChart3, MapPin, AlertCircle } from 'lucide-react';
import MonitoringDashboard from '@/components/MonitoringDashboard';
import MaintenanceDashboard from '@/components/MaintenanceDashboard';
import WorkOrderList from '@/components/WorkOrderList';

type TabType = 'monitoring' | 'maintenance' | 'workorder';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('monitoring');

  const tabs = [
    { id: 'monitoring', label: '监测信息', icon: Monitor },
    { id: 'maintenance', label: '运维信息', icon: BarChart3 },
    { id: 'workorder', label: '工单管理', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 顶部导航栏 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold text-accent">宜川县水利工程运行管理平台</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>温度: 5.2℃</span>
            <span>{new Date().toLocaleString('zh-CN')}</span>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="px-6 border-t border-border flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="p-6">
        {activeTab === 'monitoring' && <MonitoringDashboard />}
        {activeTab === 'maintenance' && <MaintenanceDashboard />}
        {activeTab === 'workorder' && <WorkOrderList />}
      </main>
    </div>
  );
}
