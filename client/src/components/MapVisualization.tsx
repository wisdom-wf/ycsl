export default function MapVisualization() {
  // viewBox = "0 0 600 524"，与地图图片真实宽高比 1194:1042 ≈ 600:524 一致
  // 坐标基于截图像素坐标等比换算，确保点位与文字在任意缩放下不漂移
  const reservoirLabels = [
    { name: '刘庄水库',   px: 226, py: 88,  textDx: 12,  textDy: -10 },
    { name: '钟楼寺水库', px: 146, py: 156, textDx: 12,  textDy: -10 },
    { name: '崖底水库',   px: 153, py: 209, textDx: 12,  textDy: -10 },
    { name: '木头沟水库', px: 322, py: 412, textDx: -88, textDy: -14 },
  ];

  const cx = 300, cy = 262;
  const radii = [260, 208, 156, 104];

  return (
    <div className="h-full w-full overflow-hidden relative bg-[#0a1628]">
      <style>{`
        @keyframes orbit1 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1634; } }
        @keyframes orbit2 { from { stroke-dashoffset: 0; } to { stroke-dashoffset:  1307; } }
        @keyframes orbit3 { from { stroke-dashoffset: 0; } to { stroke-dashoffset:  -980; } }
        @keyframes orbit4 { from { stroke-dashoffset: 0; } to { stroke-dashoffset:   654; } }
        .orbit-line-1  { stroke-dasharray: 120 1514; animation: orbit1 12s linear infinite; }
        .orbit-line-2  { stroke-dasharray: 100 1207; animation: orbit2 10s linear infinite; }
        .orbit-line-3  { stroke-dasharray:  80  900; animation: orbit3  8s linear infinite; }
        .orbit-line-4  { stroke-dasharray:  50  604; animation: orbit4  6s linear infinite; }
        .orbit-line-1b { stroke-dasharray:  80 1554; animation: orbit1 15s linear infinite; animation-delay: -6s; }
        .orbit-line-2b { stroke-dasharray:  60 1247; animation: orbit2 13s linear infinite; animation-delay: -5s; }
        .orbit-line-3b { stroke-dasharray:  50  930; animation: orbit3 11s linear infinite; animation-delay: -4s; }
        @keyframes dot-pulse {
          0%, 100% { r: 4; opacity: 0.9; }
          50%       { r: 6; opacity: 1;   }
        }
        @keyframes ring-expand {
          0%   { r: 6;  opacity: 0.8; stroke-width: 1.5; }
          100% { r: 18; opacity: 0;   stroke-width: 0.5; }
        }
        .dot-core  { animation: dot-pulse   2s ease-in-out infinite; }
        .dot-ring  { animation: ring-expand 2.4s ease-out infinite; }
        .dot-ring2 { animation: ring-expand 2.4s ease-out infinite; animation-delay: -1.2s; }
        @keyframes label-pulse {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 1;  }
        }
        .reservoir-label-text { animation: label-pulse 3s ease-in-out infinite; }
      `}</style>

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 600 524"
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="flowGrad1" gradientUnits="userSpaceOnUse" x1="0" y1="262" x2="600" y2="262">
            <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="40%"  stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="50%"  stopColor="#66ffff" stopOpacity="1" />
            <stop offset="60%"  stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flowGrad2" gradientUnits="userSpaceOnUse" x1="0" y1="262" x2="600" y2="262">
            <stop offset="0%"   stopColor="#0088cc" stopOpacity="0" />
            <stop offset="40%"  stopColor="#00aadd" stopOpacity="0.4" />
            <stop offset="50%"  stopColor="#00ccff" stopOpacity="0.7" />
            <stop offset="60%"  stopColor="#00aadd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0088cc" stopOpacity="0" />
          </linearGradient>
          <filter id="orbitGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="textGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <image
          href="https://d2xsxph8kpxj0f.cloudfront.net/96424428/ndB87EFGA8Wdoif5EKjKmt/pasted_file_7vyRfe_image_db3d1ff8.png"
          x="0" y="0" width="600" height="524"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'brightness(1.05) contrast(1.05)' }}
        />

        <circle cx="300" cy="262" r="260" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-1"  filter="url(#orbitGlow)" />
        <circle cx="300" cy="262" r="260" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-1b" />
        <circle cx="300" cy="262" r="208" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-2"  filter="url(#orbitGlow)" />
        <circle cx="300" cy="262" r="208" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-2b" />
        <circle cx="300" cy="262" r="156" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-3"  filter="url(#orbitGlow)" />
        <circle cx="300" cy="262" r="156" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-3b" />
        <circle cx="300" cy="262" r="104" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-4"  filter="url(#orbitGlow)" />

        {reservoirLabels.map((item, i) => (
          <g key={i}>
            <circle cx={item.px} cy={item.py} r="6" fill="none" stroke="#00eaff" strokeWidth="1.5" className="dot-ring"  opacity="0.8" />
            <circle cx={item.px} cy={item.py} r="6" fill="none" stroke="#00eaff" strokeWidth="1"   className="dot-ring2" opacity="0.6" />
            <circle cx={item.px} cy={item.py} r="4" fill="#00eaff" className="dot-core" filter="url(#dotGlow)" />
            <circle cx={item.px} cy={item.py} r="2" fill="#ffffff" opacity="0.9" />
            <line
              x1={item.px} y1={item.py}
              x2={item.px + item.textDx * 0.7}
              y2={item.py + item.textDy * 0.7}
              stroke="#00eaff" strokeWidth="0.8" opacity="0.5"
            />
            <text
              x={item.px + item.textDx}
              y={item.py + item.textDy}
              fontSize="13"
              fontWeight="bold"
              fill="#00eaff"
              className="reservoir-label-text"
              filter="url(#textGlow)"
              style={{ letterSpacing: '0.05em' }}
            >
              {item.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
