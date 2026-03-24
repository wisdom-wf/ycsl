import { MonitoringPoint } from '@shared/const';

interface Props {
  monitoringPoints: MonitoringPoint[];
}

export default function MapVisualization({ monitoringPoints }: Props) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 overflow-hidden">
      <div className="relative w-full h-96 bg-gradient-to-b from-blue-900/20 to-blue-950/40 rounded-lg flex items-center justify-center">
        {/* SVG地图背景 */}
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 w-full h-full opacity-30"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />
          {/* 地图轮廓 */}
          <path
            d="M 80 50 Q 120 40 150 50 Q 180 60 200 80 Q 220 100 210 130 Q 200 160 170 170 Q 140 180 110 160 Q 80 140 70 110 Q 60 80 80 50"
            fill="#0088ff"
            opacity="0.3"
            stroke="#00d4ff"
            strokeWidth="1"
          />
        </svg>

        {/* 监测点 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {monitoringPoints.map((point) => {
            const x = ((point.coordinates[0] - 109.4) / 0.3) * 60 + 20;
            const y = ((36.6 - point.coordinates[1]) / 0.3) * 60 + 20;
            return (
              <div
                key={point.id}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="relative">
                  {/* 脉冲动画 */}
                  <div className="absolute inset-0 bg-accent rounded-full animate-pulse opacity-50"></div>
                  {/* 中心点 */}
                  <div className="w-3 h-3 bg-accent rounded-full relative z-10"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 中心十字 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border border-accent/30 rounded-full"></div>
          <div className="absolute w-12 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
          <div className="absolute w-0.5 h-12 bg-gradient-to-b from-transparent via-accent to-transparent"></div>
        </div>

        {/* 顶部指标 */}
        <div className="absolute top-4 left-4 right-4 flex justify-around text-sm pointer-events-none">
          <div className="text-center">
            <div className="text-accent font-bold">1802.0mm</div>
            <div className="text-xs text-muted-foreground">24h降雨量</div>
          </div>
          <div className="text-center">
            <div className="text-accent font-bold">45m</div>
            <div className="text-xs text-muted-foreground">库水位</div>
          </div>
          <div className="text-center">
            <div className="text-accent font-bold">万m³</div>
            <div className="text-xs text-muted-foreground">蓄水量</div>
          </div>
        </div>
      </div>
    </div>
  );
}
