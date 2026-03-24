import { useState } from 'react';
import { WORK_ORDERS, RESERVOIRS, WorkOrder } from '@shared/const';
import { ChevronDown, MapPin, Clock, User, FileText } from 'lucide-react';

type TabType = 'inspection' | 'maintenance' | 'cleaning' | 'safety';

export default function WorkOrderList() {
  const [activeTab, setActiveTab] = useState<TabType>('inspection');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  const tabs = [
    { id: 'inspection', label: '巡视检查' },
    { id: 'maintenance', label: '养护维修' },
    { id: 'cleaning', label: '库区保洁' },
    { id: 'safety', label: '安全巡检' },
  ];

  const filteredOrders = WORK_ORDERS.filter((order) => order.type === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'in_progress':
        return '进行中';
      case 'pending':
        return '待执行';
      case 'cancelled':
        return '已取消';
      default:
        return '未知';
    }
  };

  return (
    <div className="space-y-6">
      {/* 标签页 */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setSelectedWorkOrder(null);
            }}
            className={`px-4 py-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 工单列表 */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-accent">工单列表</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedWorkOrder(order)}
                  className={`w-full p-4 rounded-lg border transition-all text-left ${
                    selectedWorkOrder?.id === order.id
                      ? 'border-accent bg-accent/10'
                      : 'border-border bg-card hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate text-sm">{order.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{order.planTime}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">暂无工单</div>
            )}
          </div>
        </div>

        {/* 工单详情 */}
        <div className="lg:col-span-2">
          {selectedWorkOrder ? (
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              {/* 标题和状态 */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedWorkOrder.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{selectedWorkOrder.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(selectedWorkOrder.status)}`}>
                  {getStatusLabel(selectedWorkOrder.status)}
                </span>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">计划时间</div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="w-4 h-4 text-accent" />
                    {selectedWorkOrder.planTime}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">执行人</div>
                  <div className="flex items-center gap-2 text-foreground">
                    <User className="w-4 h-4 text-accent" />
                    {selectedWorkOrder.executor}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">位置</div>
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-4 h-4 text-accent" />
                    {selectedWorkOrder.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">所属水库</div>
                  <div className="flex items-center gap-2 text-foreground">
                    <FileText className="w-4 h-4 text-accent" />
                    {RESERVOIRS.find((r) => r.id === selectedWorkOrder.reservoirId)?.name}
                  </div>
                </div>
              </div>

              {/* 详细描述 */}
              <div>
                <h3 className="text-sm font-semibold text-accent mb-2">工单详情</h3>
                <p className="text-sm text-foreground leading-relaxed">{selectedWorkOrder.description}</p>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <button className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                  工单详情
                </button>
                <button className="flex-1 px-4 py-2 border border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-colors">
                  处理流程
                </button>
                <button className="flex-1 px-4 py-2 border border-accent text-accent rounded-lg font-semibold hover:bg-accent/10 transition-colors">
                  视频监控
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-12 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">请选择工单查看详情</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
