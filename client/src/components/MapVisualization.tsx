import { MonitoringPoint } from '@shared/const';

interface Props {
  monitoringPoints: MonitoringPoint[];
}

export default function MapVisualization({ monitoringPoints }: Props) {
  return (
    <div className="h-full w-full overflow-hidden relative bg-[#0a1628]">
      {/* 旋转背景亮线 */}
      <style>{`
        @keyframes rotate-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
        .rotating-lines {
          animation: rotate-slow 30s linear infinite;
        }
        .pulse-lines {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* 旋转亮线层 */}
      <svg
        className="absolute rotating-lines pulse-lines"
        style={{ left: '50%', top: '50%', width: '140%', height: '140%', pointerEvents: 'none' }}
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g>
          <line x1="200" y1="0" x2="200" y2="400" stroke="url(#lineGrad2)" strokeWidth="0.5" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="url(#lineGrad1)" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="350" y2="350" stroke="url(#lineGrad1)" strokeWidth="0.4" />
          <line x1="350" y1="50" x2="50" y2="350" stroke="url(#lineGrad1)" strokeWidth="0.4" />
          <line x1="100" y1="0" x2="300" y2="400" stroke="url(#lineGrad2)" strokeWidth="0.3" />
          <line x1="300" y1="0" x2="100" y2="400" stroke="url(#lineGrad2)" strokeWidth="0.3" />
          <line x1="0" y1="100" x2="400" y2="300" stroke="url(#lineGrad1)" strokeWidth="0.3" />
          <line x1="0" y1="300" x2="400" y2="100" stroke="url(#lineGrad1)" strokeWidth="0.3" />
        </g>
      </svg>

      {/* 地图图片 */}
      <img
        src="https://d2xsxph8kpxj0f.cloudfront.net/96424428/ndB87EFGA8Wdoif5EKjKmt/pasted_file_7vyRfe_image_db3d1ff8.png"
        alt="宜川县地图"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ filter: 'brightness(1.05) contrast(1.05)' }}
      />

      {/* 监测点标记 */}
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
              pointerEvents: 'none',
            }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-cyan-400/20 rounded-full animate-ping" />
              <div className="absolute -inset-1 bg-cyan-400/30 rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-cyan-400 rounded-full relative z-10 shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
