import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { RESERVOIRS, RESERVOIR_DATA, Reservoir } from '@shared/const';
import MapVisualization from './MapVisualization';
import WorkOrderModal from './WorkOrderModal';

export default function MaintenanceDashboard() {
  const [selectedReservoirId, setSelectedReservoirId] = useState('r1');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);

  const selectedReservoir = useMemo(
    () => RESERVOIRS.find((r: Reservoir) => r.id === selectedReservoirId) || RESERVOIRS[0],
    [selectedReservoirId]
  );

  const reservoirData = RESERVOIR_DATA[selectedReservoirId];

  // 圆形进度条组件
  const CircleProgress = ({ percentage, label }: { percentage: number; label: string }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1a3a52" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-accent">{percentage}%</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground mt-2">{label}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* 左列：运维统计信息（20%） */}
      <div className="w-1/4 border-r border-border overflow-y-auto bg-background p-4 space-y-4">
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

        {/* 区县运维情况基本信息 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
            区县运维情况基本信息
          </label>
          <div className="bg-card border border-border rounded p-3 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <CircleProgress percentage={45} label="巡视检查" />
              <CircleProgress percentage={60} label="维修养护" />
              <CircleProgress percentage={75} label="库区清洁" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-muted-foreground">工程数</div>
                <div className="text-accent font-bold">4</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">小问题</div>
                <div className="text-accent font-bold">2</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">问题数</div>
                <div className="text-accent font-bold">0</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">完成率</div>
                <div className="text-accent font-bold">85%</div>
              </div>
            </div>
          </div>
        </div>

        {/* 运维综合统计 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
            运维综合统计
          </label>
          <div className="bg-card border border-border rounded p-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">巡视检查</span>
              <span className="text-accent font-bold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">维修养护</span>
              <span className="text-accent font-bold">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">库区清洁</span>
              <span className="text-accent font-bold">5</span>
            </div>
          </div>
        </div>

        {/* 问题处理情况统计 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
            问题处理情况统计
          </label>
          <div className="bg-card border border-border rounded p-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">已处理</span>
              <span className="text-accent font-bold">15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">处理中</span>
              <span className="text-accent font-bold">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">未处理</span>
              <span className="text-accent font-bold">2</span>
            </div>
          </div>
        </div>

        {/* 责任人信息 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
            责任人信息
          </label>
          <div className="bg-card border border-border rounded p-3 text-xs space-y-2">
            <div>
              <div className="text-muted-foreground">行政责任人</div>
              <div className="text-accent font-bold">{selectedReservoir.contacts.adminName}</div>
              <div className="text-muted-foreground text-xs">{selectedReservoir.contacts.adminPhone}</div>
            </div>
            <div>
              <div className="text-muted-foreground">技术责任人</div>
              <div className="text-accent font-bold">{selectedReservoir.contacts.techName}</div>
              <div className="text-muted-foreground text-xs">{selectedReservoir.contacts.techPhone}</div>
            </div>
            <div>
              <div className="text-muted-foreground">巡查责任人</div>
              <div className="text-accent font-bold">{selectedReservoir.contacts.inspectionName}</div>
              <div className="text-muted-foreground text-xs">{selectedReservoir.contacts.inspectionPhone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 中列：地图和核心指标（60%） */}
      <div className="flex-1 border-r border-border overflow-hidden bg-background p-4 flex flex-col">
        {/* 顶部核心指标 */}
        <div className="grid grid-cols-3 gap-3 mb-4 flex-shrink-0">
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
        <div className="flex-1 min-h-0 overflow-hidden">
          <MapVisualization monitoringPoints={[]} />
        </div>
      </div>

      {/* 右列：运维信息和工单按钮（20%） */}
      <div className="w-1/4 border-l border-border overflow-y-auto bg-background p-4 flex flex-col space-y-4">
        {/* 区县水库运行信息 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
            区县水库运行信息
          </label>
          <div className="bg-card border border-border rounded p-3 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">库区水位</span>
              <span className="text-accent font-bold">{reservoirData.waterLevel.toFixed(1)} m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">入流</span>
              <span className="text-accent font-bold">{reservoirData.inflow.toFixed(1)} m³/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">出流</span>
              <span className="text-accent font-bold">{reservoirData.outflow.toFixed(1)} m³/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">蓄水量</span>
              <span className="text-accent font-bold">{reservoirData.storageVolume} 万m³</span>
            </div>
          </div>
        </div>

        {/* 问题处理情况 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
            问题处理情况
          </label>
          <div className="bg-card border border-border rounded p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <CircleProgress percentage={85} label="已处理完" />
              <CircleProgress percentage={15} label="处理中" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="text-muted-foreground">已处理</div>
                <div className="text-accent font-bold">17</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">处理中</div>
                <div className="text-accent font-bold">3</div>
              </div>
            </div>
          </div>
        </div>

        {/* 库区水情监测 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
            库区水情监测
          </label>
          <div className="bg-card border border-border rounded p-3 text-xs space-y-2 flex-1">
            <div>
              <div className="text-muted-foreground">行政责任人</div>
              <div className="text-accent font-bold">{selectedReservoir.contacts.adminName}</div>
              <div className="text-muted-foreground text-xs">{selectedReservoir.contacts.adminPhone}</div>
            </div>
            <div>
              <div className="text-muted-foreground">技术责任人</div>
              <div className="text-accent font-bold">{selectedReservoir.contacts.techName}</div>
              <div className="text-muted-foreground text-xs">{selectedReservoir.contacts.techPhone}</div>
            </div>
            <div>
              <div className="text-muted-foreground">巡查责任人</div>
              <div className="text-accent font-bold">{selectedReservoir.contacts.inspectionName}</div>
              <div className="text-muted-foreground text-xs">{selectedReservoir.contacts.inspectionPhone}</div>
            </div>
            
            {/* 查看工单按钮 */}
            <button
              onClick={() => setShowWorkOrderModal(true)}
              className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-accent to-blue-400 text-background font-bold rounded hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 text-xs"
            >
              查看工单
            </button>
          </div>
        </div>
      </div>

      {/* 工单弹窗 */}
      {showWorkOrderModal && (
        <WorkOrderModal
          reservoirId={selectedReservoirId}
          onClose={() => setShowWorkOrderModal(false)}
        />
      )}
    </div>
  );
}
