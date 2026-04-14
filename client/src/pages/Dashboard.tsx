import { useState, useEffect } from 'react';
import { Droplets, MapPin, Clock, Wind, AlertTriangle } from 'lucide-react';
import MonitoringDashboard from '@/components/MonitoringDashboard';
import MaintenanceDashboard from '@/components/MaintenanceDashboard';
import { useWeather } from '@/hooks/useWeather';

type DashboardType = 'monitoring' | 'maintenance';

// 预警等级对应颜色配置
const alertColors: Record<string, { bg: string; border: string; text: string; glow: string; badge: string }> = {
  '红色': {
    bg: 'from-red-950 via-red-900 to-red-950',
    border: 'border-red-500/60',
    text: 'text-red-300',
    glow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]',
    badge: 'bg-red-600 text-white',
  },
  '橙色': {
    bg: 'from-orange-950 via-orange-900 to-orange-950',
    border: 'border-orange-500/60',
    text: 'text-orange-300',
    glow: 'drop-shadow-[0_0_12px_rgba(249,115,22,0.8)]',
    badge: 'bg-orange-500 text-white',
  },
  '黄色': {
    bg: 'from-yellow-950 via-yellow-900 to-yellow-950',
    border: 'border-yellow-500/60',
    text: 'text-yellow-300',
    glow: 'drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]',
    badge: 'bg-yellow-500 text-black',
  },
  '蓝色': {
    bg: 'from-blue-950 via-blue-900 to-blue-950',
    border: 'border-blue-400/60',
    text: 'text-blue-300',
    glow: 'drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]',
    badge: 'bg-blue-500 text-white',
  },
};

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

  const hasAlert = weather?.hasAlert ?? false;
  const alertLevel = weather?.alertLevel ?? '';
  const alertStyle = hasAlert && alertLevel ? alertColors[alertLevel] : null;

  // 正常状态下的标题颜色
  const normalHeaderBg = 'from-[#0a1628] via-[#0d1f3c] to-[#0a1628]';
  const normalBorder = 'border-accent/20';

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* 顶部导航栏 */}
      <header
        className={`border-b sticky top-0 z-50 flex-shrink-0 transition-all duration-700 ${
          alertStyle
            ? `bg-gradient-to-r ${alertStyle.bg} ${alertStyle.border}`
            : `bg-gradient-to-r ${normalHeaderBg} ${normalBorder}`
        } ${hasAlert ? 'alert-breathing' : ''}`}
        style={hasAlert ? {
          animation: 'alertBreathing 2s ease-in-out infinite',
        } : {}}
      >
        {/* 呼吸灯CSS动画注入 */}
        {hasAlert && (
          <style>{`
            @keyframes alertBreathing {
              0%, 100% { box-shadow: 0 0 0 0 ${
                alertLevel === '红色' ? 'rgba(239,68,68,0)' :
                alertLevel === '橙色' ? 'rgba(249,115,22,0)' :
                alertLevel === '黄色' ? 'rgba(234,179,8,0)' :
                'rgba(96,165,250,0)'
              }, inset 0 0 0 0 ${
                alertLevel === '红色' ? 'rgba(239,68,68,0)' :
                alertLevel === '橙色' ? 'rgba(249,115,22,0)' :
                alertLevel === '黄色' ? 'rgba(234,179,8,0)' :
                'rgba(96,165,250,0)'
              }; }
              50% { box-shadow: 0 0 30px 8px ${
                alertLevel === '红色' ? 'rgba(239,68,68,0.5)' :
                alertLevel === '橙色' ? 'rgba(249,115,22,0.5)' :
                alertLevel === '黄色' ? 'rgba(234,179,8,0.5)' :
                'rgba(96,165,250,0.5)'
              }, inset 0 0 40px 4px ${
                alertLevel === '红色' ? 'rgba(239,68,68,0.15)' :
                alertLevel === '橙色' ? 'rgba(249,115,22,0.15)' :
                alertLevel === '黄色' ? 'rgba(234,179,8,0.15)' :
                'rgba(96,165,250,0.15)'
              }; }
            }
          `}</style>
        )}

        <div className="px-4 py-2.5 flex items-center justify-between">
          {/* 左侧：天气信息（单行） */}
          <div className="flex items-center gap-3 min-w-[320px]">
            {loading ? (
              <div className="text-sm text-muted-foreground">加载天气中...</div>
            ) : weather ? (
              <div className="flex items-center gap-2.5">
                <span className="text-2xl flex-shrink-0">{weather.weatherIcon}</span>
                <span className={`font-bold text-base flex-shrink-0 ${alertStyle ? alertStyle.text : 'text-accent'}`}>{weather.weather} {weather.temp}℃</span>
                <span className="text-muted-foreground/60 text-sm">|</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                  <Wind className="w-3.5 h-3.5 text-blue-400" />
                  {weather.windDirection} {weather.windSpeed}
                </span>
                <span className="text-muted-foreground/60 text-sm">|</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  {weather.humidity}
                </span>
                <span className="text-muted-foreground/60 text-sm">|</span>
                <span className="text-sm text-muted-foreground flex-shrink-0">24h {weather.rain24h}mm</span>
                <span className="text-muted-foreground/60 text-sm">|</span>
                <span className="text-sm text-muted-foreground flex-shrink-0">AQI {weather.aqi}</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">天气数据获取失败</div>
            )}
          </div>

          {/* 中间：标题 + 预警标签 */}
          <div className="flex flex-col items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MapPin className={`w-6 h-6 ${alertStyle ? alertStyle.text : 'text-accent'} ${alertStyle ? alertStyle.glow : 'drop-shadow-[0_0_6px_rgba(0,212,255,0.6)]'}`} />
              </div>
              <h1 className={`text-3xl font-bold tracking-wider ${
                alertStyle
                  ? `${alertStyle.text} drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]`
                  : 'bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,212,255,0.3)]'
              }`}>
                宜川县水利工程运行管理平台
              </h1>
            </div>
            {/* 预警标签 */}
            {hasAlert && weather && (
              <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${alertStyle?.badge}`}
                style={{ animation: 'alertBreathing 2s ease-in-out infinite' }}>
                <AlertTriangle className="w-3 h-3" />
                {alertLevel}预警 · {weather.alertText}
              </div>
            )}
          </div>

          {/* 右侧：时间（单行） */}
          <div className="flex items-center gap-2.5 min-w-[320px] justify-end">
            <Clock className={`w-4 h-4 flex-shrink-0 ${alertStyle ? alertStyle.text + '/60' : 'text-accent/60'}`} />
            <span className={`text-base font-mono tracking-wider flex-shrink-0 ${alertStyle ? alertStyle.text : 'text-accent'}`}>{formatTime(currentTime)}</span>
            <span className="text-muted-foreground/60 text-sm">|</span>
            <span className="text-sm text-muted-foreground flex-shrink-0">{formatDate(currentTime)}</span>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="px-4 flex gap-0.5">
          <button
            onClick={() => setActiveDashboard('monitoring')}
            className={`px-6 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative border-b-2 ${
              activeDashboard === 'monitoring'
                ? `border-${alertStyle ? alertLevel === '红色' ? 'red-400' : alertLevel === '橙色' ? 'orange-400' : alertLevel === '黄色' ? 'yellow-400' : 'blue-400' : 'accent'} ${alertStyle ? alertStyle.text : 'text-accent'} bg-gradient-to-b from-accent/15 to-transparent`
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/5'
            }`}
          >
            监测信息
            {activeDashboard === 'monitoring' && (
              <div className={`absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent ${alertStyle ? `via-${alertLevel === '红色' ? 'red' : alertLevel === '橙色' ? 'orange' : alertLevel === '黄色' ? 'yellow' : 'blue'}-400` : 'via-accent'} to-transparent`} />
            )}
          </button>
          <button
            onClick={() => setActiveDashboard('maintenance')}
            className={`px-6 py-2 text-sm font-bold tracking-wide transition-all duration-300 relative border-b-2 ${
              activeDashboard === 'maintenance'
                ? `${alertStyle ? alertStyle.text : 'text-accent'} border-accent bg-gradient-to-b from-accent/15 to-transparent`
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
