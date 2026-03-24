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
    <div className="space-y-6">
      {/* 顶部水库选择和核心指标 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：水库选择和基本信息 */}
        <div className="lg:col-span-1 space-y-4">
          {/* 水库选择下拉框 */}
          <div className="relative">
            <label className="block text-sm font-semibold text-accent mb-2">选择水库</label>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground flex items-center justify-between hover:border-accent transition-colors"
            >
              <span>{selectedReservoir.name}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
                {RESERVOIRS.map((reservoir: Reservoir) => (
                  <button
                    key={reservoir.id}
                    onClick={() => {
                      setSelectedReservoirId(reservoir.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors ${
                      selectedReservoirId === reservoir.id ? 'bg-accent/20 text-accent' : 'text-foreground'
                    }`}
                  >
                    {reservoir.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 基本信息 */}
          <ReservoirInfo reservoir={selectedReservoir} data={reservoirData} />
        </div>

        {/* 右侧：核心指标 */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">24h降雨量</div>
              <div className="text-3xl font-bold text-accent">{reservoirData.rainfall24h.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">mm</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">库水位</div>
              <div className="text-3xl font-bold text-accent">{reservoirData.waterLevel.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">m</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">蓄水量</div>
              <div className="text-3xl font-bold text-accent">{reservoirData.storageVolume}</div>
              <div className="text-xs text-muted-foreground mt-1">万m³</div>
            </div>
          </div>
        </div>
      </div>

      {/* 中部：地图和右侧监测信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 地图区域 */}
        <div className="lg:col-span-2">
          <MapVisualization monitoringPoints={MONITORING_POINTS} />
        </div>

        {/* 右侧监测信息 */}
        <div className="lg:col-span-1">
          <MonitoringCharts reservoirData={reservoirData} />
        </div>
      </div>
    </div>
  );
}
