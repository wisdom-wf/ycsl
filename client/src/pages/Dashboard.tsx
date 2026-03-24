import { useState, useEffect } from 'react';
import { Droplets, MapPin, Clock, Wind } from 'lucide-react';
import MonitoringDashboard from '@/components/MonitoringDashboard';
import MaintenanceDashboard from '@/components/MaintenanceDashboard';
import { useWeather } from '@/hooks/useWeather';

type DashboardType = 'monitoring' | 'maintenance';

export default function Dashboard() {
  const [activeDashboard, setActiveDashboard] = useState<DashboardType>('monitoring');
  const [currentTime, setCurrentTime] = useState(new Date());
  const { weather, loading } = useWeather();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const w = weekDays[date.getDay()];
    return `${y}-${m}-${d} 周${w}`;
  };

  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${min}:${s}`;
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* 顶部导航栏 */}
      <header className="border-b border-accent/20 bg-gradient-to-r from-[#0a1628] via-[#0d1f3c] to-[#0a1628] sticky top-0 z-50 flex-shrink-0">
        <div className="px-4 py-2.5 flex items-center justify-between">
          {/* 左侧：天气信息 */}
          <div className="flex items-center gap-4 min-w-[280px]">
            {loading ? (
              <div className="text-xs text-muted-foreground">加载天气中...</div>
            ) : weather ? (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-2xl">{weather.weatherIcon}</span>
                <div className="leading-tight">
                  <div className="text-accent font-bold text-sm">
                    {weather.weather} {weather.temp}℃
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Wind className="w-3 h-3 text-blue-400" />
                      {weather.windDirection} {weather.windSpeed}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Droplets className="w-3 h-3 text-blue-400" />
                      湿度 {weather.humidity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                    <span>24h降水: {weather.rain24h}mm</span>
                    <span>AQI: {weather.aqi}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">天气数据获取失败</div>
            )}
          </div>

          {/* 中间：标题 */}
          <div className="flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
            <div className="relative">
              <MapPin className="w-6 h-6 text-accent drop-shadow-[0_0_6px_rgba(0,212,255,0.6)]" />
            </div>
            <h1 className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,212,255,0.3)]">
              宜川县水利工程运行管理平台
            </h1>
          </div>

          {/* 右侧：时间 */}
          <div className="flex items-center gap-2 min-w-[260px] justify-end">
            <Clock className="w-4 h-4 text-accent/60" />
            <div className="text-right leading-tight">
              <div className="text-sm font-mono text-accent tracking-wider">{formatTime(currentTime)}</div>
              <div className="text-xs text-muted-foreground">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="px-4 flex gap-0.5">
          <button
            onClick={() => setActiveDashboard('monitoring')}
            className={`px-6 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative border-b-2 ${
              activeDashboard === 'monitoring'
                ? 'border-accent text-accent bg-gradient-to-b from-accent/15 to-transparent'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/5'
            }`}
          >
            监测信息
            {activeDashboard === 'monitoring' && (
              <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
            )}
          </button>
          <button
            onClick={() => setActiveDashboard('maintenance')}
            className={`px-6 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative border-b-2 ${
              activeDashboard === 'maintenance'
                ? 'border-accent text-accent bg-gradient-to-b from-accent/15 to-transparent'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/5'
            }`}
          >
            运维信息
            {activeDashboard === 'maintenance' && (
              <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
            )}
          </button>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-hidden">
        {activeDashboard === 'monitoring' && <MonitoringDashboard />}
        {activeDashboard === 'maintenance' && <MaintenanceDashboard />}
      </main>
    </div>
  );
}
