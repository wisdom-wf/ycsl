import { useState, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { RESERVOIRS, RESERVOIR_DATA, MAINTENANCE_STATS, WORK_ORDERS, Reservoir, WorkOrder } from '@shared/const';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const maintenanceStats = MAINTENANCE_STATS[selectedReservoirId];

  const maintenanceOverview = [
    { name: '巡视检查', value: maintenanceStats.inspectionCount, fill: '#00d4ff' },
    { name: '维修养护', value: maintenanceStats.maintenanceCount, fill: '#0088ff' },
    { name: '库区清洁', value: maintenanceStats.cleaningCount, fill: '#00ff88' },
  ];

  const issueHandling = [
    { name: '问题处理', value: Math.round(maintenanceStats.issueCount * maintenanceStats.issueResolutionRate / 100), fill: '#00d4ff' },
    { name: '险情处理', value: maintenanceStats.issueCount - Math.round(maintenanceStats.issueCount * maintenanceStats.issueResolutionRate / 100), fill: '#ff6600' },
  ];

  const taskStats = [
    { month: '3月上', completed: 12, pending: 3 },
    { month: '3月中', completed: 15, pending: 2 },
    { month: '3月下', completed: 10, pending: 5 },
  ];

  return (
    <div className="h-full flex overflow-hidden">
      {/* 左列：运维统计（约20%） */}
      <div className="w-1/5 border-r border-border overflow-y-auto bg-background p-4 space-y-4">
        {/* 水库选择 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">区县运维信息</label>
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

        {/* 运维综合统计 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">运维综合统计</label>
          <div className="bg-card border border-border rounded p-2">
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={maintenanceOverview}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {maintenanceOverview.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 text-xs mt-2">
              {maintenanceOverview.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-foreground font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 巡检任务统计 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">巡检任务统计</label>
          <div className="bg-card border border-border rounded p-2">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={taskStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
                <XAxis dataKey="month" stroke="#8ab4ff" style={{ fontSize: '9px' }} />
                <YAxis stroke="#8ab4ff" style={{ fontSize: '9px' }} />
                <Bar dataKey="completed" fill="#00d4ff" />
                <Bar dataKey="pending" fill="#ff6600" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 问题险情统计 */}
        <div>
          <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">问题险情统计</label>
          <div className="bg-card border border-border rounded p-2">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={[{ name: '问题', value: maintenanceStats.issueCount }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
                <XAxis dataKey="name" stroke="#8ab4ff" style={{ fontSize: '9px' }} />
                <YAxis stroke="#8ab4ff" style={{ fontSize: '9px' }} />
                <Bar dataKey="value" fill="#ff3333" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 中列：地图（约60%） */}
      <div className="flex-1 border-r border-border overflow-hidden bg-background p-4">
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
        <div className="h-[calc(100%-80px)]">
          <MapVisualization monitoringPoints={[]} />
        </div>
      </div>

      {/* 右列：运维信息和工单按钮（约20%） */}
      <div className="w-1/5 border-l border-border overflow-y-auto bg-background p-4 flex flex-col">
        {/* 运维信息标题 */}
        <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">运维信息</label>

        {/* 运维统计进度条 */}
        <div className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-2 mb-3 shadow-lg shadow-accent/10">
          <div className="text-xs text-muted-foreground mb-2 font-semibold">完成率</div>
          <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden border border-accent/30">
            <div 
              className="h-full bg-gradient-to-r from-accent to-blue-400 rounded-full transition-all duration-500" 
              style={{ width: `${maintenanceStats.completionRate}%` }}
            ></div>
          </div>
          <div className="text-xs text-accent font-bold mt-1">{maintenanceStats.completionRate}%</div>
        </div>

        {/* 问题险情处理 */}
        <div className="mb-3">
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">问题险情处理</label>
          <div className="bg-card border border-border rounded p-2">
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie
                  data={issueHandling}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {issueHandling.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 text-xs mt-2">
              {issueHandling.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-foreground font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 责任人信息 */}
        <div className="mb-3">
          <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">责任人信息</label>
          <div className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-2 space-y-1 text-xs shadow-lg shadow-accent/10">
            <div>
              <div className="text-muted-foreground">行政责任人</div>
              <div className="text-foreground">{selectedReservoir.contacts.adminName}</div>
            </div>
            <div>
              <div className="text-muted-foreground">技术责任人</div>
              <div className="text-foreground">{selectedReservoir.contacts.techName}</div>
            </div>
            <div>
              <div className="text-muted-foreground">巡查责任人</div>
              <div className="text-foreground">{selectedReservoir.contacts.inspectionName}</div>
            </div>
          </div>
        </div>

        {/* 查看工单按钮 */}
        <button
          onClick={() => setShowWorkOrderModal(true)}
          className="mt-auto px-4 py-2 bg-gradient-to-r from-accent to-blue-400 text-accent-foreground rounded font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all duration-200 text-sm hover:scale-105 active:scale-95"
        >
          查看工单
        </button>
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
