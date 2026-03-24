import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import MonitoringDashboard from '@/components/MonitoringDashboard';
import MaintenanceDashboard from '@/components/MaintenanceDashboard';

type DashboardType = 'monitoring' | 'maintenance';

export default function Dashboard() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('monitoring');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 顶部导航栏 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold text-accent">宜川县水利工程运行管理平台</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            {/* 左侧天气信息 */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-accent/20 to-accent/10 px-4 py-2 rounded border border-accent/30">
              <div>
                <div className="text-xs text-muted-foreground">最新天气</div>
                <div className="text-accent font-bold">5.2℃ 晴</div>
                <div className="text-xs text-muted-foreground">24h降水概率: 10%</div>
              </div>
            </div>
            {/* 右侧时间 */}
            <div className="text-right text-muted-foreground">
              <div className="text-sm">{currentTime.toLocaleString('zh-CN')}</div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="px-6 border-t border-border flex gap-1">
          <button
            onClick={() => setActiveDashboard('monitoring')}
            className={`px-4 py-3 border-b-2 transition-all duration-300 font-semibold relative ${
              activeDashboard === 'monitoring'
                ? 'border-accent text-accent bg-gradient-to-b from-accent/20 to-transparent'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-accent/50'
            }`}
          >
            <span className="relative">监测信息</span>
            {activeDashboard === 'monitoring' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-transparent"></div>
            )}
          </button>
          <button
            onClick={() => setActiveDashboard('maintenance')}
            className={`px-4 py-3 border-b-2 transition-all duration-300 font-semibold relative ${
              activeDashboard === 'maintenance'
                ? 'border-accent text-accent bg-gradient-to-b from-accent/20 to-transparent'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-accent/50'
            }`}
          >
            <span className="relative">运维信息</span>
            {activeDashboard === 'maintenance' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-transparent"></div>
            )}
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-hidden animate-in fade-in duration-300">
        {activeDashboard === 'monitoring' && <MonitoringDashboard />}
        {activeDashboard === 'maintenance' && <MaintenanceDashboard />}
      </main>
    </div>
  );
}
