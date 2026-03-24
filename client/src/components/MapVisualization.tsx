export default function MapVisualization() {
  // 四个水库对应地图图片上的四个亮点位置（从上到下）
  const reservoirLabels = [
    { name: '刘庄水库', x: 38, y: 18, labelX: 5, labelY: -2 },
    { name: '钟楼寺水库', x: 28, y: 32, labelX: 5, labelY: -2 },
    { name: '崖底水库', x: 40, y: 40, labelX: 5, labelY: -2 },
    { name: '木头沟水库', x: 60, y: 72, labelX: -12, labelY: -4 },
  ];

  return (
    <div className="h-full w-full overflow-hidden relative bg-[#0a1628]">
      {/* 沿圆圈轨迹流动的亮线动画 */}
      <style>{`
        @keyframes orbit1 {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -1885; }
        }
        @keyframes orbit2 {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 1508; }
        }
        @keyframes orbit3 {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -1131; }
        }
        @keyframes orbit4 {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 754; }
        }
        .orbit-line-1 {
          stroke-dasharray: 120 1765;
          animation: orbit1 12s linear infinite;
        }
        .orbit-line-2 {
          stroke-dasharray: 100 1408;
          animation: orbit2 10s linear infinite;
        }
        .orbit-line-3 {
          stroke-dasharray: 80 1051;
          animation: orbit3 8s linear infinite;
        }
        .orbit-line-4 {
          stroke-dasharray: 50 704;
          animation: orbit4 6s linear infinite;
        }
        .orbit-line-1b {
          stroke-dasharray: 80 1805;
          animation: orbit1 15s linear infinite;
          animation-delay: -6s;
        }
        .orbit-line-2b {
          stroke-dasharray: 60 1448;
          animation: orbit2 13s linear infinite;
          animation-delay: -5s;
        }
        .orbit-line-3b {
          stroke-dasharray: 50 1081;
          animation: orbit3 11s linear infinite;
          animation-delay: -4s;
        }
        @keyframes label-pulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .reservoir-label {
          animation: label-pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* 地图图片 - 底层 */}
      <img
        src="https://d2xsxph8kpxj0f.cloudfront.net/96424428/ndB87EFGA8Wdoif5EKjKmt/pasted_file_7vyRfe_image_db3d1ff8.png"
        alt="宜川县地图"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ filter: 'brightness(1.05) contrast(1.05)', zIndex: 1 }}
      />
      
      {/* 沿同心圆轨迹流动的亮线 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none', zIndex: 2 }}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="flowGrad1" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="600" y2="300">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="40%" stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#66ffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flowGrad2" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="600" y2="300">
            <stop offset="0%" stopColor="#0088cc" stopOpacity="0" />
            <stop offset="40%" stopColor="#00aadd" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00ccff" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#00aadd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0088cc" stopOpacity="0" />
          </linearGradient>
          <filter id="orbitGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 最外圈 r=300 */}
        <circle cx="300" cy="300" r="300" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-1" filter="url(#orbitGlow)" />
        <circle cx="300" cy="300" r="300" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-1b" />

        {/* 第二圈 r=240 */}
        <circle cx="300" cy="300" r="240" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-2" filter="url(#orbitGlow)" />
        <circle cx="300" cy="300" r="240" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-2b" />

        {/* 第三圈 r=180 */}
        <circle cx="300" cy="300" r="180" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-3" filter="url(#orbitGlow)" />
        <circle cx="300" cy="300" r="180" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-3b" />

        {/* 最内圈 r=120 */}
        <circle cx="300" cy="300" r="120" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-4" filter="url(#orbitGlow)" />
      </svg>

      {/* 水库名称标注 - 覆盖在最上层 */}
      {reservoirLabels.map((item, index) => (
        <div
          key={index}
          className="absolute reservoir-label"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        >
          <div className="relative flex items-center">
            {/* 标注文字 */}
            <div 
              className="whitespace-nowrap text-[10px] font-bold tracking-wide"
              style={{
                color: '#00eaff',
                textShadow: '0 0 6px rgba(0,212,255,0.6), 0 0 12px rgba(0,212,255,0.3)',
                marginLeft: `${item.labelX * 4}px`,
                marginTop: `${item.labelY * 4}px`,
              }}
            >
              {item.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
