export default function MapVisualization() {
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
      `}</style>

      {/* 地图图片 - 底层 */}
      <img
        src="https://d2xsxph8kpxj0f.cloudfront.net/96424428/ndB87EFGA8Wdoif5EKjKmt/pasted_file_7vyRfe_image_db3d1ff8.png"
        alt="宜川县地图"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ filter: 'brightness(1.05) contrast(1.05)', zIndex: 1 }}
      />
      
      {/* 沿同心圆轨迹流动的亮线 - 覆盖在地图上方 */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none', zIndex: 2 }}
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* 流动亮线渐变 - 主亮线 */}
          <linearGradient id="flowGrad1" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="600" y2="300">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="40%" stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#66ffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          {/* 流动亮线渐变 - 副亮线 */}
          <linearGradient id="flowGrad2" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="600" y2="300">
            <stop offset="0%" stopColor="#0088cc" stopOpacity="0" />
            <stop offset="40%" stopColor="#00aadd" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00ccff" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#00aadd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0088cc" stopOpacity="0" />
          </linearGradient>
          {/* 发光滤镜 */}
          <filter id="orbitGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* 最外圈 r=300 周长≈1885 */}
        <circle cx="300" cy="300" r="300" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-1" filter="url(#orbitGlow)" />
        <circle cx="300" cy="300" r="300" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-1b" />

        {/* 第二圈 r=240 周长≈1508 */}
        <circle cx="300" cy="300" r="240" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-2" filter="url(#orbitGlow)" />
        <circle cx="300" cy="300" r="240" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-2b" />

        {/* 第三圈 r=180 周长≈1131 */}
        <circle cx="300" cy="300" r="180" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-3" filter="url(#orbitGlow)" />
        <circle cx="300" cy="300" r="180" fill="none" stroke="url(#flowGrad2)" strokeWidth="1" className="orbit-line-3b" />

        {/* 最内圈 r=120 周长≈754 */}
        <circle cx="300" cy="300" r="120" fill="none" stroke="url(#flowGrad1)" strokeWidth="1" className="orbit-line-4" filter="url(#orbitGlow)" />
      </svg>
    </div>
  );
}
