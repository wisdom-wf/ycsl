import { Reservoir, ReservoirData } from '@shared/const';
import { Phone, User } from 'lucide-react';

interface Props {
  reservoir: Reservoir;
  data: ReservoirData;
}

export default function ReservoirInfo({ reservoir, data }: Props) {
  return (
    <div className="space-y-3">
      {/* 水库特征 */}
      <div>
        <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">水库特征</label>
        <div className="bg-card border border-border rounded p-2 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">水库规模</span>
            <span className="text-foreground">中型</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">工程规模</span>
            <span className="text-foreground">中型</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">正常蓄水位</span>
            <span className="text-foreground">{data.normalWaterLevel}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">汛限水位</span>
            <span className="text-foreground">{data.floodWaterLevel}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">校核洪水位</span>
            <span className="text-foreground">{data.checkFloodLevel}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">总库容</span>
            <span className="text-foreground">{data.totalCapacity}万m³</span>
          </div>
        </div>
      </div>

      {/* 视频监控 */}
      <div>
        <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">视频监控</label>
        <div className="bg-card border border-border rounded p-4 aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <div className="w-6 h-6 bg-accent rounded-full"></div>
            </div>
            <p className="text-xs text-muted-foreground">视频监控</p>
          </div>
        </div>
      </div>

      {/* 责任人信息 */}
      <div>
        <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">责任人信息</label>
        <div className="bg-card border border-border rounded p-2 space-y-2 text-xs">
          <div>
            <div className="text-muted-foreground">行政责任人</div>
            <div className="text-foreground">{reservoir.contacts.adminName}</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {reservoir.contacts.adminPhone}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">技术责任人</div>
            <div className="text-foreground">{reservoir.contacts.techName}</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {reservoir.contacts.techPhone}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">巡查责任人</div>
            <div className="text-foreground">{reservoir.contacts.inspectionName}</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {reservoir.contacts.inspectionPhone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
