import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ReservoirData } from '@shared/const';

interface Props {
  reservoirData: ReservoirData;
  currentTime: Date;
}

export default function MonitoringCharts({ reservoirData, currentTime }: Props) {
  const rainfallData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      const random = Math.random();
      const value = random > 0.75 ? parseFloat((Math.random() * 0.8 + 0.1).toFixed(2)) : 0;
      data.push({
        time: `${String(i).padStart(2, '0')}:00`,
        value: value,
      });
    }
    return data;
  }, []);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* 近期降雨过程 - 柱状图 */}
      <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
          <div className="w-1 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_4px_rgba(0,212,255,0.5)]" />
          <span className="text-sm font-bold text-accent">近期降雨过程</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-2" style={{ flex: '1 1 0', minHeight: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData} margin={{ top: 8, right: 5, left: -15, bottom: 5 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0066cc" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#4a7a9b" 
                style={{ fontSize: '8px' }}
                interval={5}
                tickLine={false}
                axisLine={{ stroke: '#1a3a52' }}
              />
              <YAxis 
                stroke="#4a7a9b" 
                style={{ fontSize: '8px' }}
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: '#1a3a52' }}
                label={{ value: 'mm', angle: -90, position: 'insideLeft', offset: 10, fill: '#4a7a9b', fontSize: 9 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0a1628', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px', fontSize: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                labelStyle={{ color: '#8ab4ff' }}
                formatter={(value: any) => [`${(value as number).toFixed(2)} mm`, '降雨量']}
              />
              <ReferenceLine
                y={50}
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                label={{ value: '警戒 50mm', position: 'insideTopRight', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }}
              />
              <Bar 
                dataKey="value" 
                fill="url(#rainGradient)" 
                radius={[2, 2, 0, 0]}
                isAnimationActive={true}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 库水情监测 */}
      <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
          <div className="w-1 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_4px_rgba(0,212,255,0.5)]" />
          <span className="text-sm font-bold text-accent">库水情监测</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-2 flex items-center justify-center" style={{ flex: '1 1 0', minHeight: '120px' }}>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full border border-accent/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground/60">暂无数据</span>
          </div>
        </div>
      </div>

      {/* 渗透压力监测 - 纯梯形大坝图，无柱状图 */}
      <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
          <div className="w-1 h-3.5 bg-cyan-400 rounded-full shadow-[0_0_4px_rgba(0,212,255,0.5)]" />
          <span className="text-sm font-bold text-accent">渗流压力监测</span>
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
            <text x="5" y="12" fontSize="7" fill="#4a7a9b">高程(m)</text>
            <text x="28" y="25" fontSize="7" fill="#4a7a9b" textAnchor="end">1,125</text>
            <text x="28" y="45" fontSize="7" fill="#4a7a9b" textAnchor="end">1,120</text>
            <text x="28" y="65" fontSize="7" fill="#4a7a9b" textAnchor="end">1,115</text>
            <text x="28" y="85" fontSize="7" fill="#4a7a9b" textAnchor="end">1,110</text>
            <text x="28" y="105" fontSize="7" fill="#4a7a9b" textAnchor="end">1,105</text>
            <text x="28" y="125" fontSize="7" fill="#4a7a9b" textAnchor="end">1,100</text>
            <text x="28" y="145" fontSize="7" fill="#4a7a9b" textAnchor="end">1,097</text>

            {/* Y轴 */}
            <line x1="32" y1="18" x2="32" y2="148" stroke="#1a3a52" strokeWidth="0.5" />
            {/* X轴 */}
            <line x1="32" y1="148" x2="310" y2="148" stroke="#1a3a52" strokeWidth="0.5" />

            {/* 大坝梯形 */}
            <polygon 
              points="80,148 100,82 160,22 220,22 260,82 280,148" 
              fill="url(#trapGrad)" 
              stroke="#ff69b4" 
              strokeWidth="1.5"
            />

            {/* 中轴线 - 虚线 */}
            <line x1="180" y1="22" x2="180" y2="148" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8" />
            
            {/* 中轴线顶部标记 */}
            <circle cx="180" cy="18" r="3" fill="#ffffff" filter="url(#glow)" />
            <text x="180" y="12" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="bold">中轴线</text>

            {/* 中轴线底部标记 */}
            <circle cx="180" cy="152" r="3" fill="#ffffff" filter="url(#glow)" />
            <text x="180" y="165" fontSize="8" fill="#ffffff" textAnchor="middle" fontWeight="bold">中轴线</text>

            {/* 测点标记 JRX01 */}
            <rect x="147" y="38" width="6" height="6" fill="#00ff88" rx="1" filter="url(#glow)" />
            <text x="168" y="44" fontSize="8" fill="#00ff88" fontWeight="bold">JRX01</text>

            {/* 测点标记 JRX02 */}
            <rect x="207" y="55" width="6" height="6" fill="#00ff88" rx="1" filter="url(#glow)" />
            <text x="228" y="61" fontSize="8" fill="#00ff88" fontWeight="bold">JRX02</text>

            {/* X轴标签 */}
            <text x="300" y="162" fontSize="8" fill="#4a7a9b" textAnchor="end">轴距</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
