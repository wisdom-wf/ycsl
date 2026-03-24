export default function MapVisualization() {
  return (
    <div className="h-full w-full overflow-hidden relative bg-[#0a1628]">
      {/* 旋转背景亮线动画 */}
      <style>{`
        @keyframes rotate-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .rotating-lines {
          animation: rotate-slow 25s linear infinite;
        }
      `}</style>

      {/* 地图图片 - 底层 */}
      <img
        src="https://d2xsxph8kpxj0f.cloudfront.net/96424428/ndB87EFGA8Wdoif5EKjKmt/pasted_file_7vyRfe_image_db3d1ff8.png"
        alt="宜川县地图"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ filter: 'brightness(1.05) contrast(1.05)', zIndex: 1 }}
      />
      
      {/* 旋转亮线层 - 覆盖在地图上方，1px宽度 */}
      <svg
        className="absolute rotating-lines"
        style={{ left: '50%', top: '50%', width: '160%', height: '160%', pointerEvents: 'none', zIndex: 2, opacity: 0.35 }}
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineGradH" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="30%" stopColor="#00d4ff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00eaff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#00d4ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradV" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="30%" stopColor="#00d4ff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00eaff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#00d4ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradD1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
            <stop offset="30%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00eaff" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#00d4ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g>
          {/* 主十字线 */}
          <line x1="200" y1="0" x2="200" y2="400" stroke="url(#lineGradV)" strokeWidth="1" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="url(#lineGradH)" strokeWidth="1" />
          {/* 对角线 */}
          <line x1="40" y1="40" x2="360" y2="360" stroke="url(#lineGradD1)" strokeWidth="1" />
          <line x1="360" y1="40" x2="40" y2="360" stroke="url(#lineGradD1)" strokeWidth="1" />
          {/* 辅助斜线 */}
          <line x1="120" y1="0" x2="280" y2="400" stroke="url(#lineGradV)" strokeWidth="1" />
          <line x1="280" y1="0" x2="120" y2="400" stroke="url(#lineGradV)" strokeWidth="1" />
          <line x1="0" y1="120" x2="400" y2="280" stroke="url(#lineGradH)" strokeWidth="1" />
          <line x1="0" y1="280" x2="400" y2="120" stroke="url(#lineGradH)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}
