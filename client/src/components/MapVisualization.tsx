export default function MapVisualization() {
  // 坐标来源：Python精确检测地图原图(1380x1258)中各水库发光点的像素坐标
  // 换算公式：svgX = pixelX/1380*600, svgY = pixelY/1258*547
  // viewBox="0 0 600 547" 与原图宽高比 1380:1258 完全一致，消除任何缩放漂移
  const reservoirLabels = [
    { name: '刘庄水库',   px: 203, py: 130, textDx: 12,  textDy: -12 },
    { name: '钟楼寺水库', px: 157, py: 192, textDx: 12,  textDy: -12 },
    { name: '崖底水库',   px: 239, py: 222, textDx: 12,  textDy: -12 },
    { name: '木头沟水库', px: 362, py: 431, textDx: -90, textDy: -14 },
  ];

  return (
    <div className="h-full w-full overflow-hidden relative bg-[#0a1628]">
      <style>{`
        @keyframes orbit1 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1885; } }
        @keyframes orbit2 { from { stroke-dashoffset: 0; } to { stroke-dashoffset:  1508; } }
        @keyframes orbit3 { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -1131; } }
        @keyframes orbit4 { from { stroke-dashoffset: 0; } to { stroke-dashoffset:   754; } }
        .orbit-line-1  { stroke-dasharray: 120 1765; animation: orbit1 12s linear infinite; }
        .orbit-line-2  { stroke-dasharray: 100 1408; animation: orbit2 10s linear infinite; }
        .orbit-line-3  { stroke-dasharray:  80 1051; animation: orbit3  8s linear infinite; }
        .orbit-line-4  { stroke-dasharray:  50  704; animation: orbit4  6s linear infinite; }
        .orbit-line-1b { stroke-dasharray:  80 1805; animation: orbit1 15s linear infinite; animation-delay: -6s; }
        .orbit-line-2b { stroke-dasharray:  60 1448; animation: orbit2 13s linear infinite; animation-delay: -5s; }
        .orbit-line-3b { stroke-dasharray:  50 1081; animation: orbit3 11s linear infinite; animation-delay: -4s; }
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

      {/*
        viewBox="0 0 600 547" 精确匹配地图原图宽高比 1380:1258
        所有元素在同一坐标系，任意缩放下相对位置永远固定
      */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 600 547"
        preserveAspectRatio="xMidYMid meet"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="flowGrad1" gradientUnits="userSpaceOnUse" x1="0" y1="273" x2="600" y2="273">
            <stop offset="0%"   stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="40%"  stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="50%"  stopColor="#66ffff" stopOpacity="1" />
            <stop offset="60%"  stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="flowGrad2" gradientUnits="userSpaceOnUse" x1="0" y1="273" x2="600" y2="273">
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

        {/* 地图图片，铺满整个 viewBox */}
        <image
          href="https://d2xsxph8kpxj0f.cloudfront.net/96424428/ndB87EFGA8Wdoif5EKjKmt/pasted_file_7vyRfe_image_db3d1ff8.png"
          x="0" y="0" width="600" height="547"
          preserveAspectRatio="none"
          style={{ filter: 'brightness(1.05) contrast(1.05)' }}
        />

        {/* 同心圆流动动画，圆心取地图中央 */}
        <circle cx="300" cy="273" r="280" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-1"  filter="url(#orbitGlow)" />
        <circle cx="300" cy="273" r="280" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-1b" />
        <circle cx="300" cy="273" r="224" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-2"  filter="url(#orbitGlow)" />
        <circle cx="300" cy="273" r="224" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-2b" />
        <circle cx="300" cy="273" r="168" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-3"  filter="url(#orbitGlow)" />
        <circle cx="300" cy="273" r="168" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-3b" />
        <circle cx="300" cy="273" r="112" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-4"  filter="url(#orbitGlow)" />

        {/* 水库标注点 + 文字 */}
        {reservoirLabels.map((item, i) => (
          <g key={i}>
            <circle cx={item.px} cy={item.py} r="6" fill="none" stroke="#00eaff" strokeWidth="1.5" className="dot-ring"  opacity="0.8" />
            <circle cx={item.px} cy={item.py} r="6" fill="none" stroke="#00eaff" strokeWidth="1"   className="dot-ring2" opacity="0.6" />
            <circle cx={item.px} cy={item.py} r="4" fill="#00eaff" className="dot-core" filter="url(#dotGlow)" />
            <circle cx={item.px} cy={item.py} r="2" fill="#ffffff" opacity="0.9" />
            <line
              x1={item.px} y1={item.py}
              x2={item.px + item.textDx * 0.6}
              y2={item.py + item.textDy * 0.6}
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
