import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { RESERVOIRS, RESERVOIR_DATA, MAINTENANCE_STATS, Reservoir } from '@shared/const';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MaintenanceDashboard() {
  const [selectedReservoirId, setSelectedReservoirId] = useState('r1');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedReservoir = useMemo(
    () => RESERVOIRS.find((r: Reservoir) => r.id === selectedReservoirId) || RESERVOIRS[0],
    [selectedReservoirId]
  );

  const reservoirData = RESERVOIR_DATA[selectedReservoirId];
  const maintenanceStats = MAINTENANCE_STATS[selectedReservoirId];

  // 运维统计数据
  const maintenanceOverview = [
    { name: '巡视检查', value: maintenanceStats.inspectionCount, fill: '#00d4ff' },
    { name: '维修养护', value: maintenanceStats.maintenanceCount, fill: '#0088ff' },
    { name: '库区清洁', value: maintenanceStats.cleaningCount, fill: '#00ff88' },
  ];

  // 问题险情处理
  const issueHandling = [
    { name: '问题处理', value: Math.round(maintenanceStats.issueCount * maintenanceStats.issueResolutionRate / 100), fill: '#00d4ff' },
    { name: '险情处理', value: maintenanceStats.issueCount - Math.round(maintenanceStats.issueCount * maintenanceStats.issueResolutionRate / 100), fill: '#ff6600' },
  ];

  // 任务统计
  const taskStats = [
    { month: '3月上', completed: 12, pending: 3 },
    { month: '3月中', completed: 15, pending: 2 },
    { month: '3月下', completed: 10, pending: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* 顶部选择和核心指标 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：水库选择 */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-semibold text-accent mb-2">选择水库</label>
          <div className="relative">
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
        </div>

        {/* 右侧：核心指标 */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">完成率</div>
              <div className="text-3xl font-bold text-accent">{maintenanceStats.completionRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">任务完成</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">问题数量</div>
              <div className="text-3xl font-bold text-accent">{maintenanceStats.issueCount}</div>
              <div className="text-xs text-muted-foreground mt-1">待处理</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">解决率</div>
              <div className="text-3xl font-bold text-accent">{maintenanceStats.issueResolutionRate}%</div>
              <div className="text-xs text-muted-foreground mt-1">问题处理</div>
            </div>
          </div>
        </div>
      </div>

      {/* 中部：统计图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 运维综合统计 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-accent mb-4 pb-2 border-b border-border">运维综合统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={maintenanceOverview}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {maintenanceOverview.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '1px solid #1a3a52' }}
                labelStyle={{ color: '#e0e8ff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-xs">
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

        {/* 巡检任务统计 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-accent mb-4 pb-2 border-b border-border">巡检任务统计</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="month" stroke="#8ab4ff" style={{ fontSize: '12px' }} />
              <YAxis stroke="#8ab4ff" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '1px solid #1a3a52' }}
                labelStyle={{ color: '#e0e8ff' }}
              />
              <Legend wrapperStyle={{ color: '#8ab4ff', fontSize: '12px' }} />
              <Bar dataKey="completed" fill="#00d4ff" name="已完成" />
              <Bar dataKey="pending" fill="#ff6600" name="待完成" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 问题险情处理 */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-accent mb-4 pb-2 border-b border-border">问题险情处理</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={issueHandling}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {issueHandling.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '1px solid #1a3a52' }}
                labelStyle={{ color: '#e0e8ff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-xs">
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

      {/* 底部：责任人信息和操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold text-accent mb-4 pb-2 border-b border-border">责任人信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">行政责任人</span>
              <span className="text-foreground">{selectedReservoir.contacts.adminName} {selectedReservoir.contacts.adminPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">技术责任人</span>
              <span className="text-foreground">{selectedReservoir.contacts.techName} {selectedReservoir.contacts.techPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">巡查责任人</span>
              <span className="text-foreground">{selectedReservoir.contacts.inspectionName} {selectedReservoir.contacts.inspectionPhone}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex items-center justify-center">
          <button className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
            查看工单
          </button>
        </div>
      </div>
    </div>
  );
}
