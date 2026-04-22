import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
  LineChart, Line, Area, AreaChart,
} from 'recharts';
import { ReservoirData } from '@shared/const';

interface Props {
  reservoirData: ReservoirData;
  currentTime: Date;
}

export default function MonitoringCharts({ reservoirData, currentTime }: Props) {
  // 近期降雨柱状图数据（固定随机，不随水库切换变化）
  const rainfallData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const random = Math.random();
      const value = random > 0.75 ? parseFloat((Math.random() * 0.8 + 0.1).toFixed(2)) : 0;
      data.push({ time: `${String(i).padStart(2, '0')}:00`, value });
    }
    return data;
  }, []);

  // ── 库水情监测：模拟近7天水位数据（在正常蓄水位附近波动）
  const waterLevelData = useMemo(() => {
    const base = reservoirData.normalWaterLevel;
    const days = ['3/4', '3/5', '3/6', '3/7', '3/8', '3/9', '3/10'];
    return days.map((day, i) => ({
      day,
      level: parseFloat((base - 3 + Math.sin(i * 0.8) * 2 + Math.random() * 0.5).toFixed(2)),
    }));
  }, [reservoirData.reservoirId]);

  // 库水位警戒线 = 汛限水位（汛期不得超过此值，最直接的运行警戒）
  const waterLevelWarning = reservoirData.floodWaterLevel;
  // Y轴范围：正常蓄水位 -6m 到 校核洪水位 +1m
  const yMin = Math.floor(reservoirData.normalWaterLevel - 6);
  const yMax = Math.ceil(reservoirData.checkFloodLevel + 1);

  // ── 渗流压力监测：警戒渗压水头 = 坝顶高程（校核洪水位）的 60%
  // 大坝渗流压力警戒：测压管水头不超过坝高的60%为安全值
  // 坝高约为 checkFloodLevel - normalWaterLevel + 基础高差(约10m)
  const damHeight = reservoirData.checkFloodLevel - reservoirData.normalWaterLevel + 10;
  // 警戒渗压水头（相对坝底，单位m）
  const seepageWarningHead = parseFloat((damHeight * 0.6).toFixed(1));

  // SVG坐标系参数（与原图保持一致）
  // Y轴：高程1097m~1125m 对应 SVG y=148~18，共130px，28m
  const elevBase = 1097;   // 坝底高程（对应 y=148）
  const elevTop = 1125;    // 坝顶高程（对应 y=18）
  const svgYBottom = 148;
  const svgYTop = 18;
  const elevRange = elevTop - elevBase; // 28m
  const svgYRange = svgYBottom - svgYTop; // 130px

  // 将高程转为SVG Y坐标
  const elevToSvgY = (elev: number) =>
    svgYBottom - ((elev - elevBase) / elevRange) * svgYRange;

  // 警戒渗压水头对应的高程（从坝底算起）
  const warningElev = elevBase + seepageWarningHead;
  const warningY = elevToSvgY(Math.min(warningElev, elevTop - 1));

  return (
    <div className="h-full flex flex-col gap-3">
      {/* ── 近期降雨过程 ── */}
      <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
          <div className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-sm font-bold text-accent">近期降雨过程</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-2" style={{ flex: '1 1 0', minHeight: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData} margin={{ top: 8, right: 8, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0066cc" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" opacity={0.3} />
              <XAxis dataKey="time" stroke="#4a7a9b" style={{ fontSize: '10px' }} interval={5} tickLine={false} axisLine={{ stroke: '#1a3a52' }} />
              <YAxis stroke="#4a7a9b" style={{ fontSize: '10px' }} domain={[0, 100]} tickLine={false} axisLine={{ stroke: '#1a3a52' }}
                label={{ value: 'mm', angle: -90, position: 'insideLeft', offset: 12, fill: '#4a7a9b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a1628', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                labelStyle={{ color: '#8ab4ff' }}
                formatter={(value: any) => [`${(value as number).toFixed(2)} mm`, '降雨量']}
              />
              <ReferenceLine y={50} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3"
                label={{ value: '警戒 50mm', position: 'insideTopRight', fill: '#ef4444', fontSize: 11, fontWeight: 'bold' }} />
              <Bar dataKey="value" fill="url(#rainGradient)" radius={[2, 2, 0, 0]} isAnimationActive animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 库水情监测 ── */}
      <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
          <div className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-sm font-bold text-accent">库水情监测</span>
          <span className="ml-auto text-xs text-red-400/70 font-mono">汛限 {waterLevelWarning}m</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-2" style={{ flex: '1 1 0', minHeight: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waterLevelData} margin={{ top: 8, right: 8, left: -8, bottom: 5 }}>
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" opacity={0.3} />
              <XAxis dataKey="day" stroke="#4a7a9b" style={{ fontSize: '10px' }} tickLine={false} axisLine={{ stroke: '#1a3a52' }} />
              <YAxis stroke="#4a7a9b" style={{ fontSize: '10px' }} domain={[yMin, yMax]} tickLine={false} axisLine={{ stroke: '#1a3a52' }}
                label={{ value: 'm', angle: -90, position: 'insideLeft', offset: 10, fill: '#4a7a9b', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a1628', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                labelStyle={{ color: '#8ab4ff' }}
                formatter={(value: any) => [`${value} m`, '水位']}
              />
              {/* 汛限水位警戒线 */}
              <ReferenceLine y={waterLevelWarning} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3"
                label={{ value: `汛限 ${waterLevelWarning}m`, position: 'insideTopRight', fill: '#ef4444', fontSize: 11, fontWeight: 'bold' }} />
              {/* 正常蓄水位参考线 */}
              <ReferenceLine y={reservoirData.normalWaterLevel} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 4"
                label={{ value: `正常 ${reservoirData.normalWaterLevel}m`, position: 'insideBottomRight', fill: '#f59e0b', fontSize: 11 }} />
              <Area dataKey="level" stroke="#3b82f6" strokeWidth={1.5} fill="url(#waterGradient)" dot={{ r: 2.5, fill: '#3b82f6' }} isAnimationActive animationDuration={600} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 渗流压力监测 ── */}
      <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
          <div className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-sm font-bold text-accent">渗流压力监测</span>
          <span className="ml-auto text-xs text-red-400/70 font-mono">警戒水头 {seepageWarningHead}m</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-2" style={{ flex: '1 1 0', minHeight: '140px' }}>
          <svg viewBox="0 0 320 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="trapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b8a44c" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#8a7a3c" stopOpacity="0.3" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Y轴标签 - 高程 */}
            <text x="5" y="12" fontSize="9" fill="#4a7a9b">高程(m)</text>
            <text x="30" y="25" fontSize="9" fill="#4a7a9b" textAnchor="end">1,125</text>
            <text x="30" y="45" fontSize="9" fill="#4a7a9b" textAnchor="end">1,120</text>
            <text x="30" y="65" fontSize="9" fill="#4a7a9b" textAnchor="end">1,115</text>
            <text x="30" y="85" fontSize="9" fill="#4a7a9b" textAnchor="end">1,110</text>
            <text x="30" y="105" fontSize="9" fill="#4a7a9b" textAnchor="end">1,105</text>
            <text x="30" y="125" fontSize="9" fill="#4a7a9b" textAnchor="end">1,100</text>
            <text x="30" y="145" fontSize="9" fill="#4a7a9b" textAnchor="end">1,097</text>

            {/* Y轴 */}
            <line x1="32" y1="18" x2="32" y2="148" stroke="#1a3a52" strokeWidth="0.5" />
            {/* X轴 */}
            <line x1="32" y1="148" x2="310" y2="148" stroke="#1a3a52" strokeWidth="0.5" />

            {/* 大坝梯形 */}
            <polygon points="80,148 100,82 160,22 220,22 260,82 280,148" fill="url(#trapGrad)" stroke="#ff69b4" strokeWidth="1.5" />

            {/* 中轴线 - 虚线 */}
            <line x1="180" y1="22" x2="180" y2="148" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8" />

            {/* 中轴线顶部标记 */}
            <circle cx="180" cy="18" r="3" fill="#ffffff" filter="url(#glow)" />
            <text x="180" y="12" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="bold">中轴线</text>

            {/* 中轴线底部标记 */}
            <circle cx="180" cy="152" r="3" fill="#ffffff" filter="url(#glow)" />
            <text x="180" y="165" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="bold">中轴线</text>

            {/* 测点标记 JRX01 */}
            <rect x="147" y="38" width="6" height="6" fill="#00ff88" rx="1" filter="url(#glow)" />
            <text x="168" y="44" fontSize="10" fill="#00ff88" fontWeight="bold">JRX01</text>

            {/* 测点标记 JRX02 */}
            <rect x="207" y="55" width="6" height="6" fill="#00ff88" rx="1" filter="url(#glow)" />
            <text x="228" y="61" fontSize="10" fill="#00ff88" fontWeight="bold">JRX02</text>

            {/* ── 警戒渗压水头线（红色虚线，随水库切换动态变化） ── */}
            <line
              x1="32" y1={warningY} x2="310" y2={warningY}
              stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.9"
            />
            {/* 警戒线左侧标签 */}
            <rect x="33" y={warningY - 10} width="52" height="11" fill="#1a0a0a" rx="2" opacity="0.8" />
            <text x="59" y={warningY - 2} fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="bold">
              警戒 {seepageWarningHead}m
            </text>

            {/* X轴标签 */}
            <text x="300" y="162" fontSize="10" fill="#4a7a9b" textAnchor="end">轴距</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
