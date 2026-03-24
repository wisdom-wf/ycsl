import { useState } from 'react';
import { X } from 'lucide-react';
import { WORK_ORDERS, WorkOrder } from '@shared/const';

interface Props {
  reservoirId: string;
  onClose: () => void;
}

type TabType = 'inspection' | 'maintenance' | 'cleaning' | 'safety';

export default function WorkOrderModal({ reservoirId, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('inspection');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  const tabs = [
    { id: 'inspection', label: '巡视检查' },
    { id: 'maintenance', label: '养护维修' },
    { id: 'cleaning', label: '水库保洁' },
    { id: 'safety', label: '安全巡检' },
  ];

  const filteredOrders = WORK_ORDERS.filter(
    (order) => order.type === activeTab && order.reservoirId === reservoirId
  );

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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-card border border-accent/30 rounded-lg w-11/12 h-5/6 flex flex-col max-w-6xl shadow-2xl shadow-accent/20 animate-in scale-in-95 duration-200">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-accent/20 bg-gradient-to-r from-accent/10 to-transparent">
          <h2 className="text-lg font-bold text-accent">查看水库运维工单</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent/30 rounded transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex gap-1 px-6 border-b border-accent/20 bg-card/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setSelectedWorkOrder(null);
              }}
              className={`px-4 py-3 border-b-2 transition-all duration-300 text-sm font-semibold relative ${
                activeTab === tab.id
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-accent/50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent via-accent to-transparent"></div>
              )}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden flex">
          {/* 工单列表 */}
          <div className="w-1/3 border-r border-border overflow-y-auto bg-background p-4">
            <h3 className="text-sm font-semibold text-accent mb-3">工单列表</h3>
            <div className="space-y-2">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedWorkOrder(order)}
                    className={`w-full p-3 rounded border transition-all duration-200 text-left text-sm hover:scale-105 origin-left ${
                      selectedWorkOrder?.id === order.id
                        ? 'border-accent bg-gradient-to-r from-accent/20 to-accent/5 shadow-lg shadow-accent/20'
                        : 'border-border bg-card hover:border-accent/50 hover:shadow-md hover:shadow-accent/10'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground truncate">{order.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{order.planTime}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">暂无工单</div>
              )}
            </div>
          </div>

          {/* 工单详情 */}
          <div className="flex-1 overflow-y-auto bg-background p-6">
            {selectedWorkOrder ? (
              <div className="space-y-6">
                {/* 标题和状态 */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{selectedWorkOrder.title}</h2>
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
                    <div className="text-foreground text-sm">{selectedWorkOrder.planTime}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">执行人</div>
                    <div className="text-foreground text-sm">{selectedWorkOrder.executor}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">位置</div>
                    <div className="text-foreground text-sm">{selectedWorkOrder.location}</div>
                  </div>
                  {selectedWorkOrder.actualTime && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">完成时间</div>
                      <div className="text-foreground text-sm">{selectedWorkOrder.actualTime}</div>
                    </div>
                  )}
                </div>

                {/* 详细描述 */}
                <div>
                  <h3 className="text-sm font-semibold text-accent mb-2">工单详情</h3>
                  <p className="text-sm text-foreground leading-relaxed">{selectedWorkOrder.description}</p>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t border-accent/20">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-accent to-blue-400 text-accent-foreground rounded font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all duration-200 text-sm hover:scale-105">
                    工单详情
                  </button>
                  <button className="flex-1 px-4 py-2 border border-accent text-accent rounded font-semibold hover:bg-accent/20 transition-all duration-200 text-sm hover:scale-105">
                    处理流程
                  </button>
                  <button className="flex-1 px-4 py-2 border border-accent text-accent rounded font-semibold hover:bg-accent/20 transition-all duration-200 text-sm hover:scale-105">
                    视频监控
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">请选择工单查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
