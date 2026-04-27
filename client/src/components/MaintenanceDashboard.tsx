import { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Phone, Shield, Wrench, Eye, Droplets, Waves, Database, FileText } from 'lucide-react';
import { RESERVOIRS, RESERVOIR_DATA, Reservoir } from '@shared/const';
import MapVisualization from './MapVisualization';
import WorkOrderModal from './WorkOrderModal';

export default function MaintenanceDashboard() {
  const [selectedReservoirId, setSelectedReservoirId] = useState('r2');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
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

  // 圆形进度条组件
  const CircleProgress = ({ percentage, label, color = '#00d4ff' }: { percentage: number; label: string; color?: string }) => {
    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#1a2a45" strokeWidth="3" />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${color}40)`, transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-cyan-300 font-mono">{percentage}%</span>
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* 左列：运维统计信息（22%） */}
      <div className="w-[22%] border-r border-accent/10 overflow-y-auto bg-gradient-to-b from-[#0a1628] to-[#0d1a30] px-3 py-3 space-y-3 scrollbar-thin">
        {/* 水库选择 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">基本信息</span>
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

        {/* 区县运维情况基本信息 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">区县运维情况</span>
          </div>
          <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-3 gap-1">
              <CircleProgress percentage={100} label="巡视检查" color="#00d4ff" />
              <CircleProgress percentage={100} label="维修养护" color="#00ff88" />
              <CircleProgress percentage={100} label="库区清洁" color="#ffaa00" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-accent/10">
              {[
                { label: '工程数', value: '4' },
                { label: '小问题', value: '0' },
                { label: '问题数', value: '0' },
                { label: '完成率', value: '100%' },
              ].map((item, i) => (
                <div key={i} className="text-center py-1">
                  <div className="text-muted-foreground text-[10px]">{item.label}</div>
                  <div className="text-cyan-300 font-bold font-mono">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 运维综合统计 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">运维综合统计</span>
          </div>
          <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 text-xs space-y-2">
            {[
              { label: '巡视检查', value: '12' },
              { label: '维修养护', value: '8' },
              { label: '库区清洁', value: '5' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-0.5 border-b border-accent/5 last:border-b-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-cyan-300 font-bold font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 问题处理情况统计 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">问题处理统计</span>
          </div>
          <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 text-xs space-y-2">
            {[
              { label: '已处理', value: '20' },
              { label: '处理中', value: '0' },
              { label: '未处理', value: '0' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-0.5 border-b border-accent/5 last:border-b-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-cyan-300 font-bold font-mono">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 责任人信息 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">责任人信息</span>
          </div>
          <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 space-y-3 text-xs">
            {[
              { role: '行政责任人', name: selectedReservoir.contacts.adminName, phone: selectedReservoir.contacts.adminPhone, icon: Shield },
              { role: '技术责任人', name: selectedReservoir.contacts.techName, phone: selectedReservoir.contacts.techPhone, icon: Wrench },
              { role: '巡查责任人', name: selectedReservoir.contacts.inspectionName, phone: selectedReservoir.contacts.inspectionPhone, icon: Eye },
            ].map((person, i) => (
              <div key={i} className="flex items-start gap-2 pb-2 border-b border-accent/5 last:border-b-0 last:pb-0">
                <div className="w-6 h-6 bg-accent/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <person.icon className="w-3 h-3 text-accent/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-[10px]">{person.role}</div>
                  <div className="text-cyan-300 font-medium">{person.name}</div>
                  <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-2.5 h-2.5 text-accent/40" />
                    <span className="font-mono text-[10px]">{person.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 中列：地图和核心指标（56%） */}
      <div className="flex-1 overflow-hidden bg-[#0b1526] px-3 py-3 flex flex-col">
        {/* 顶部核心指标 - 空置 */}
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

      {/* 右列：运维信息和工单按钮（22%） */}
      <div className="w-[22%] border-l border-accent/10 overflow-y-auto bg-gradient-to-b from-[#0a1628] to-[#0d1a30] px-3 py-3 space-y-3 scrollbar-thin">
        {/* 区县水库运行信息 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">区县水库运行信息</span>
          </div>
          <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 text-xs space-y-2">
            {[
              { label: '库区水位', value: `${reservoirData.waterLevel.toFixed(1)} m` },
              { label: '入流', value: `${reservoirData.inflow.toFixed(1)} m³/s` },
              { label: '出流', value: `${reservoirData.outflow.toFixed(1)} m³/s` },
              { label: '蓄水量', value: `${reservoirData.storageVolume} 万m³` },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-0.5 border-b border-accent/5 last:border-b-0">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-cyan-300 font-bold font-mono text-[11px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 问题处理情况 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">问题处理情况</span>
          </div>
          <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <CircleProgress percentage={100} label="已处理完" color="#00ff88" />
              <CircleProgress percentage={0} label="处理中" color="#ff6b6b" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-accent/10">
              <div className="text-center">
                <div className="text-muted-foreground text-[10px]">已处理</div>
                <div className="text-cyan-300 font-bold font-mono">20</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-[10px]">处理中</div>
                <div className="text-cyan-300 font-bold font-mono">0</div>
              </div>
            </div>
          </div>
        </div>

        {/* 库区水情监测 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
            <span className="text-xs font-bold text-accent tracking-wide">库区水情监测</span>
          </div>
          <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 text-xs space-y-3">
            {[
              { role: '行政责任人', name: selectedReservoir.contacts.adminName, phone: selectedReservoir.contacts.adminPhone, icon: Shield },
              { role: '技术责任人', name: selectedReservoir.contacts.techName, phone: selectedReservoir.contacts.techPhone, icon: Wrench },
              { role: '巡查责任人', name: selectedReservoir.contacts.inspectionName, phone: selectedReservoir.contacts.inspectionPhone, icon: Eye },
            ].map((person, i) => (
              <div key={i} className="flex items-start gap-2 pb-2 border-b border-accent/5 last:border-b-0 last:pb-0">
                <div className="w-6 h-6 bg-accent/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <person.icon className="w-3 h-3 text-accent/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-muted-foreground text-[10px]">{person.role}</div>
                  <div className="text-cyan-300 font-medium">{person.name}</div>
                  <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-2.5 h-2.5 text-accent/40" />
                    <span className="font-mono text-[10px]">{person.phone}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 查看工单按钮 */}
            <button
              onClick={() => setShowWorkOrderModal(true)}
              className="w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 text-xs flex items-center justify-center gap-2 group"
            >
              <FileText className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
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
