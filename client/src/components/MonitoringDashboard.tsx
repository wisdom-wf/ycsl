import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { RESERVOIRS, RESERVOIR_DATA, MONITORING_POINTS, Reservoir } from '@shared/const';
import ReservoirInfo from './ReservoirInfo';
import MapVisualization from './MapVisualization';
import MonitoringCharts from './MonitoringCharts';

export default function MonitoringDashboard() {
  const [selectedReservoirId, setSelectedReservoirId] = useState('r1');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedReservoir = useMemo(
    () => RESERVOIRS.find((r: Reservoir) => r.id === selectedReservoirId) || RESERVOIRS[0],
    [selectedReservoirId]
  );

  const reservoirData = RESERVOIR_DATA[selectedReservoirId];

  return (
    <div className="h-full flex overflow-hidden">
      {/* 左列：基本信息（约20%） */}
      <div className="w-1/5 border-r border-border overflow-y-auto bg-background p-4 space-y-4">
        {/* 水库选择 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">基本信息</label>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-3 py-2 bg-card border border-border rounded text-sm text-foreground flex items-center justify-between hover:border-accent transition-colors"
            >
              <span>{selectedReservoir.name}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded shadow-lg z-10">
                {RESERVOIRS.map((reservoir: Reservoir) => (
                  <button
                    key={reservoir.id}
                    onClick={() => {
                      setSelectedReservoirId(reservoir.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-accent/10 transition-colors ${
                      selectedReservoirId === reservoir.id ? 'bg-accent/20 text-accent' : 'text-foreground'
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

      {/* 中列：地图和核心指标（约60%） */}
      <div className="flex-1 border-r border-border overflow-y-auto bg-background p-4 flex flex-col">
        {/* 顶部核心指标 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-card border border-border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">24h降雨量</div>
            <div className="text-2xl font-bold text-accent">{reservoirData.rainfall24h.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">mm</div>
          </div>
          <div className="bg-card border border-border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">库水位</div>
            <div className="text-2xl font-bold text-accent">{reservoirData.waterLevel.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">m</div>
          </div>
          <div className="bg-card border border-border rounded p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">蓄水量</div>
            <div className="text-2xl font-bold text-accent">{reservoirData.storageVolume}</div>
            <div className="text-xs text-muted-foreground">万m³</div>
          </div>
        </div>

        {/* 地图区域 */}
        <div className="flex-1 min-h-0">
          <MapVisualization monitoringPoints={MONITORING_POINTS} />
        </div>
      </div>

      {/* 右列：监测图表（约20%） */}
      <div className="w-1/5 border-l border-border overflow-y-auto bg-background p-4">
        <MonitoringCharts reservoirData={reservoirData} />
      </div>
    </div>
  );
}
