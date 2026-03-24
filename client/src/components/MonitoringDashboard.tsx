import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Droplets, Waves, Database } from 'lucide-react';
import { RESERVOIRS, RESERVOIR_DATA, Reservoir } from '@shared/const';
import ReservoirInfo from './ReservoirInfo';
import MapVisualization from './MapVisualization';
import MonitoringCharts from './MonitoringCharts';

export default function MonitoringDashboard() {
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
      {/* 左列：基本信息（约20%） */}
      <div className="w-[22%] border-r border-accent/10 overflow-y-auto bg-gradient-to-b from-[#0a1628] to-[#0d1a30] px-3 py-3 space-y-3 scrollbar-thin">
        {/* 水库选择标题 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-accent rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">{reservoirTitle}</span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-3 py-2 bg-[#0f1d35] border border-accent/20 rounded text-sm text-foreground flex items-center justify-between hover:border-accent/50 hover:bg-[#132240] transition-all duration-200"
            >
              <span>{selectedReservoir.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-accent/60 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#0f1d35] border border-accent/30 rounded shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-10 overflow-hidden">
                {RESERVOIRS.map((reservoir: Reservoir) => (
                  <button
                    key={reservoir.id}
                    onClick={() => {
                      setSelectedReservoirId(reservoir.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-all duration-150 border-b border-accent/5 last:border-b-0 ${
                      selectedReservoirId === reservoir.id
                        ? 'bg-accent/15 text-accent font-medium'
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

        {/* 基本信息详情 */}
        <ReservoirInfo reservoir={selectedReservoir} data={reservoirData} />
      </div>

      {/* 中列：地图和核心指标（约56%） */}
      <div className="flex-1 overflow-hidden bg-[#0b1526] px-3 py-3 flex flex-col">
        {/* 顶部核心指标 - 空置不显示数据 */}
        <div className="grid grid-cols-3 gap-3 mb-3 flex-shrink-0">
          {[
            { label: '24h降雨量', unit: 'mm', icon: Droplets, color: 'from-cyan-500/20 to-blue-600/10' },
            { label: '库水位', unit: 'm', icon: Waves, color: 'from-blue-500/20 to-indigo-600/10' },
            { label: '蓄水量', unit: '万m³', icon: Database, color: 'from-teal-500/20 to-cyan-600/10' },
          ].map((item, i) => (
            <div key={i} className={`bg-gradient-to-br ${item.color} border border-accent/15 rounded-lg p-3 text-center relative overflow-hidden group hover:border-accent/30 transition-all duration-300`}>
              <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-30 transition-opacity">
                <item.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
              <div className="text-2xl font-bold text-accent/60 font-mono">--</div>
              <div className="text-xs text-muted-foreground/60">{item.unit}</div>
            </div>
          ))}
        </div>

        {/* 地图区域 */}
        <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-accent/10">
          <MapVisualization />
        </div>
      </div>

      {/* 右列：图表（约22%） */}
      <div className="w-[22%] border-l border-accent/10 overflow-y-auto bg-gradient-to-b from-[#0a1628] to-[#0d1a30] px-3 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-accent rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-xs font-bold text-accent tracking-wide">{selectedReservoir.name}监测信息</span>
        </div>
        <MonitoringCharts reservoirData={reservoirData} currentTime={currentTime} />
      </div>
    </div>
  );
}
