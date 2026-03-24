import { Reservoir, ReservoirData } from '@shared/const';
import { Phone, Video, Shield, Wrench, Eye } from 'lucide-react';

interface Props {
  reservoir: Reservoir;
  data: ReservoirData;
}

export default function ReservoirInfo({ reservoir, data }: Props) {
  return (
    <div className="space-y-3">
      {/* 水库特征 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-xs font-bold text-accent tracking-wide">水库特征</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 space-y-2 text-xs">
          {[
            { label: '水库规模', value: '中型' },
            { label: '工程规模', value: '中型' },
            { label: '正常蓄水位', value: `${data.normalWaterLevel}m` },
            { label: '汛限水位', value: `${data.floodWaterLevel}m` },
            { label: '校核洪水位', value: `${data.checkFloodLevel}m` },
            { label: '总库容', value: `${data.totalCapacity}万m³` },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-0.5 border-b border-accent/5 last:border-b-0">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-cyan-300 font-medium font-mono text-[11px]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 视频监控 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-xs font-bold text-accent tracking-wide">视频监控</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-4 aspect-video flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-accent/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
          <div className="text-center relative z-10">
            <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-accent/20 transition-all duration-300">
              <Video className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors" />
            </div>
            <p className="text-xs text-muted-foreground group-hover:text-accent/60 transition-colors">视频监控</p>
          </div>
          {/* 扫描线动画 */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-pulse" />
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
            { role: '行政责任人', name: reservoir.contacts.adminName, phone: reservoir.contacts.adminPhone, icon: Shield },
            { role: '技术责任人', name: reservoir.contacts.techName, phone: reservoir.contacts.techPhone, icon: Wrench },
            { role: '巡查责任人', name: reservoir.contacts.inspectionName, phone: reservoir.contacts.inspectionPhone, icon: Eye },
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
  );
}
