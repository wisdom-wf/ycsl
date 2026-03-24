import { useState } from 'react';
import { X, ClipboardList, Calendar, MapPin, User, Clock, FileText, Video, GitBranch } from 'lucide-react';
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
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'in_progress':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30';
      case 'pending':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'cancelled':
        return 'bg-red-500/15 text-red-400 border border-red-500/30';
      default:
        return 'bg-gray-500/15 text-gray-400 border border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'in_progress': return '进行中';
      case 'pending': return '待执行';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#0a1628] border border-accent/20 rounded-xl w-11/12 h-5/6 flex flex-col max-w-6xl shadow-[0_0_60px_rgba(0,212,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-accent/15 bg-gradient-to-r from-[#0d1f3c] to-[#0a1628]">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">水库运维工单管理</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-accent/15 rounded-lg transition-all duration-200 group"
          >
            <X className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
          </button>
        </div>

        {/* 标签页 */}
        <div className="flex gap-0.5 px-6 border-b border-accent/10 bg-[#0d1a30]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                setSelectedWorkOrder(null);
              }}
              className={`px-5 py-2.5 border-b-2 transition-all duration-200 text-xs font-bold tracking-wide ${
                activeTab === tab.id
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden flex">
          {/* 工单列表 */}
          <div className="w-[35%] border-r border-accent/10 overflow-y-auto bg-[#0b1526] p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-3.5 bg-cyan-400 rounded-full" />
              <span className="text-xs font-bold text-accent">工单列表</span>
              <span className="text-[10px] text-muted-foreground ml-auto">{filteredOrders.length} 条</span>
            </div>
            <div className="space-y-2">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => setSelectedWorkOrder(order)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left text-xs ${
                      selectedWorkOrder?.id === order.id
                        ? 'border-accent/40 bg-gradient-to-r from-accent/15 to-accent/5 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                        : 'border-accent/10 bg-[#0f1d35] hover:border-accent/25 hover:bg-[#132240]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground/90 truncate text-[11px]">{order.title}</div>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1.5">
                          <Calendar className="w-3 h-3" />
                          <span className="text-[10px]">{order.planTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                          <User className="w-3 h-3" />
                          <span className="text-[10px]">{order.executor}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-accent/15 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-accent/30" />
                  </div>
                  <span className="text-xs text-muted-foreground/60">暂无工单</span>
                </div>
              )}
            </div>
          </div>

          {/* 工单详情 */}
          <div className="flex-1 overflow-y-auto bg-[#0b1526] p-5">
            {selectedWorkOrder ? (
              <div className="space-y-5">
                {/* 标题和状态 */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{selectedWorkOrder.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{selectedWorkOrder.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getStatusColor(selectedWorkOrder.status)}`}>
                    {getStatusLabel(selectedWorkOrder.status)}
                  </span>
                </div>

                {/* 基本信息卡片 */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Calendar, label: '计划时间', value: selectedWorkOrder.planTime },
                    { icon: User, label: '执行人', value: selectedWorkOrder.executor },
                    { icon: MapPin, label: '位置', value: selectedWorkOrder.location },
                    { icon: Clock, label: '完成时间', value: selectedWorkOrder.actualTime || '--' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#0f1d35] border border-accent/10 rounded-lg p-3 flex items-start gap-2.5">
                      <div className="w-7 h-7 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-3.5 h-3.5 text-accent/60" />
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground">{item.label}</div>
                        <div className="text-xs text-foreground/90 font-medium mt-0.5">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 详细描述 */}
                <div className="bg-[#0f1d35] border border-accent/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-3 bg-cyan-400 rounded-full" />
                    <span className="text-xs font-bold text-accent">工单详情</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{selectedWorkOrder.description}</p>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-3">
                  {[
                    { icon: FileText, label: '工单详情', primary: true },
                    { icon: GitBranch, label: '处理流程', primary: false },
                    { icon: Video, label: '视频监控', primary: false },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      className={`flex-1 px-4 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
                        btn.primary
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]'
                          : 'border border-accent/20 text-accent hover:bg-accent/10 hover:border-accent/40'
                      }`}
                    >
                      <btn.icon className="w-3.5 h-3.5" />
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-accent/10 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-accent/20" />
                  </div>
                  <p className="text-xs text-muted-foreground/60">请选择工单查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
