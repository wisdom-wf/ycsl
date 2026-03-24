import { MonitoringPoint } from '@shared/const';

interface Props {
  monitoringPoints: MonitoringPoint[];
}

export default function MapVisualization({ monitoringPoints }: Props) {
  return (
    <div className="bg-card border border-border rounded h-full w-full overflow-hidden flex flex-col">
      <div className="relative flex-1 min-h-0 flex items-center justify-center bg-background">
        {/* 地图图片背景 */}
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/96424428/ndB87EFGA8Wdoif5EKjKmt/pasted_file_7vyRfe_image_db3d1ff8.png"
          alt="地图"
          className="absolute inset-0 w-full h-full object-cover"
        />

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
                  <div className="absolute inset-0 bg-accent rounded-full animate-pulse opacity-50"></div>
                  <div className="w-3 h-3 bg-accent rounded-full relative z-10"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
