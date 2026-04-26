import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Droplets, Waves, Database } from 'lucide-react';
import { RESERVOIRS, RESERVOIR_DATA, Reservoir } from '@shared/const';
import ReservoirInfo from './ReservoirInfo';
import MapVisualization from './MapVisualization';
import MonitoringCharts from './MonitoringCharts';
import { WeatherData } from '@/hooks/useWeather';

interface Props {
  weather?: WeatherData | null;
}
export default function MonitoringDashboard({ weather }: Props) {
  const [selectedReservoirId, setSelectedReservoirId] = useState('r1');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedReservoir = useMemo(
    () => RESERVOIRS.find((r: Reservoir) => r.id === selectedReservoirId) || RESERVOIRS[0],
    [selectedReservoirId]
  );

  const reservoirData = RESERVOIR_DATA[selectedReservoirId];
  const reservoirTitle = `${selectedReservoir.name}基本信息`;

  return (
    <div className="h-full flex overflow-hidden">

      {/* ── 左列：基本信息（固定宽度，flex布局不滚动） ── */}
      <div className="w-[22%] border-r border-accent/10 bg-gradient-to-b from-[#0a1628] to-[#0d1a30] flex flex-col overflow-hidden">

        {/* 水库选择区 */}
        <div className="px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-1.5 h-5 bg-accent rounded-full shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
            <span className="text-sm font-bold text-accent tracking-wide">{reservoirTitle}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-4 py-2.5 bg-[#0f1d35] border border-accent/20 rounded-lg text-base text-foreground flex items-center justify-between hover:border-accent/50 hover:bg-[#132240] transition-all duration-200"
            >
              <span className="font-medium">{selectedReservoir.name}</span>
              <ChevronDown className={`w-4 h-4 text-accent/60 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f1d35] border border-accent/30 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
                {RESERVOIRS.map((reservoir: Reservoir) => (
                  <button
                    key={reservoir.id}
                    onClick={() => { setSelectedReservoirId(reservoir.id); setShowDropdown(false); }}
                    className={`w-full px-4 py-3 text-left text-base transition-all duration-150 border-b border-accent/5 last:border-b-0 ${
                      selectedReservoirId === reservoir.id
                        ? 'bg-accent/15 text-accent font-semibold'
                        : 'text-foreground/80 hover:bg-accent/10 hover:text-accent'
                    }`}
                  >
                    {reservoir.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 基本信息详情（flex-1 撑满剩余高度） */}
        <div className="flex-1 overflow-hidden px-4 pb-4">
          <ReservoirInfo reservoir={selectedReservoir} data={reservoirData} />
        </div>
      </div>

      {/* ── 中列：地图和核心指标 ── */}
      <div className="flex-1 overflow-hidden bg-[#0b1526] px-4 py-4 flex flex-col gap-3">

        {/* 顶部核心指标卡片 */}
        <div className="grid grid-cols-3 gap-4 flex-shrink-0">
          {[
            { label: '24h降雨量', unit: 'mm', icon: Droplets, color: 'from-cyan-500/20 to-blue-600/10', value: weather?.rain24h ?? '--' },
            { label: '库水位', unit: 'm', icon: Waves, color: 'from-blue-500/20 to-indigo-600/10', value: '--' },
            { label: '蓄水量', unit: '万m³', icon: Database, color: 'from-teal-500/20 to-cyan-600/10', value: '--' },
          ].map((item, i) => (
            <div key={i} className={`bg-gradient-to-br ${item.color} border border-accent/15 rounded-xl p-4 text-center relative overflow-hidden group hover:border-accent/30 transition-all duration-300`}>
              <div className="absolute top-3 right-3 opacity-15 group-hover:opacity-25 transition-opacity">
                <item.icon className="w-10 h-10 text-accent" />
              </div>
              <div className="text-base text-muted-foreground mb-1 tracking-wide">{item.label}</div>
              <div className="text-5xl font-bold text-accent/60 font-mono leading-none my-1">{item.value}</div>
              <div className="text-sm text-muted-foreground/60 mt-1">{item.unit}</div>
            </div>
          ))}
        </div>

        {/* 地图区域（撑满剩余高度） */}
        <div className="flex-1 min-h-0 overflow-hidden rounded-xl border border-accent/10">
          <MapVisualization selectedReservoirId={selectedReservoirId} onSelectReservoir={setSelectedReservoirId} />
        </div>
      </div>

      {/* ── 右列：图表（固定宽度，flex布局不滚动） ── */}
      <div className="w-[30%] border-l border-accent/10 bg-gradient-to-b from-[#0a1628] to-[#0d1a30] flex flex-col overflow-hidden px-4 py-4">
        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
          <div className="w-1.5 h-5 bg-accent rounded-full shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
          <span className="text-base font-bold text-accent tracking-wide">{selectedReservoir.name}监测信息</span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <MonitoringCharts reservoirData={reservoirData} currentTime={currentTime} weather={weather} />
        </div>
      </div>

    </div>
  );
}
