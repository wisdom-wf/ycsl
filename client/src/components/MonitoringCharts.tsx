import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ReservoirData } from '@shared/const';

interface Props {
  reservoirData: ReservoirData;
  currentTime: Date;
}

export default function MonitoringCharts({ reservoirData, currentTime }: Props) {
  // 生成零星降雨数据（不超过1mm的柱状图）
  const rainfallData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 24; i++) {
      // 随机生成零星降雨数据，大部分为0，偶尔有0.1-0.8mm
      const random = Math.random();
      const value = random > 0.7 ? parseFloat((Math.random() * 0.8).toFixed(2)) : 0;
      data.push({
        time: `${String(i).padStart(2, '0')}:00`,
        value: value,
      });
    }
    return data;
  }, []);

  // 渗透压力数据 - 梯形/三角形设计
  const seepageData = useMemo(() => {
    return [
      { distance: 0, height: 1097 },
      { distance: 50, height: 1110 },
      { distance: 100, height: 1120 },
      { distance: 150, height: 1125 },
      { distance: 200, height: 1120 },
      { distance: 250, height: 1110 },
      { distance: 300, height: 1097 },
    ];
  }, []);

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* 近期降雨过程 - 柱状图 */}
      <div className="flex-1 min-h-0 flex flex-col">
        <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
          近期降雨过程
        </label>
        <div className="flex-1 min-h-0 bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-2 flex flex-col shadow-lg shadow-accent/10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData} margin={{ top: 10, right: 5, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                stroke="#8ab4ff" 
                style={{ fontSize: '9px' }}
                interval={3}
              />
              <YAxis 
                stroke="#8ab4ff" 
                style={{ fontSize: '9px' }}
                domain={[0, 100]}
                label={{ value: 'mm', angle: -90, position: 'insideLeft', offset: 10, fill: '#8ab4ff', fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '2px solid #00d4ff', borderRadius: '4px', fontSize: '11px' }}
                labelStyle={{ color: '#e0e8ff' }}
                formatter={(value: any) => `${(value as number).toFixed(2)} mm`}
              />
              <Bar 
                dataKey="value" 
                fill="#00d4ff" 
                radius={[2, 2, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 库水情监测 - 绿色柱状图 */}
      <div className="flex-1 min-h-0 flex flex-col">
        <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
          库水情监测
        </label>
        <div className="flex-1 min-h-0 bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-2 flex flex-col shadow-lg shadow-accent/10">
          {/* 无数据显示 */}
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            暂无数据
          </div>
        </div>
      </div>

      {/* 渗透压力监测 - 梯形图 */}
      <div className="flex-1 min-h-0 flex flex-col">
        <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">
          渗透压力监测
        </label>
        <div className="flex-1 min-h-0 bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-3 flex flex-col shadow-lg shadow-accent/10">
          <svg viewBox="0 0 350 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* 背景网格 */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a3a52" strokeWidth="0.5" opacity="0.3" />
              </pattern>
              <linearGradient id="trapezoidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* 网格背景 */}
            <rect width="350" height="200" fill="url(#grid)" />

            {/* Y轴标签 */}
            <text x="10" y="20" fontSize="10" fill="#8ab4ff" textAnchor="end">1,125</text>
            <text x="10" y="50" fontSize="10" fill="#8ab4ff" textAnchor="end">1,120</text>
            <text x="10" y="80" fontSize="10" fill="#8ab4ff" textAnchor="end">1,115</text>
            <text x="10" y="110" fontSize="10" fill="#8ab4ff" textAnchor="end">1,110</text>
            <text x="10" y="140" fontSize="10" fill="#8ab4ff" textAnchor="end">1,105</text>
            <text x="10" y="170" fontSize="10" fill="#8ab4ff" textAnchor="end">1,097</text>

            {/* Y轴 */}
            <line x1="25" y1="15" x2="25" y2="165" stroke="#8ab4ff" strokeWidth="1" opacity="0.5" />

            {/* X轴 */}
            <line x1="25" y1="165" x2="340" y2="165" stroke="#8ab4ff" strokeWidth="1" opacity="0.5" />

            {/* 梯形压力分布 */}
            <polygon 
              points="35,155 100,95 200,75 300,95 330,155" 
              fill="url(#trapezoidGradient)" 
              stroke="#00d4ff" 
              strokeWidth="2"
            />

            {/* 中轴线 */}
            <line x1="200" y1="75" x2="200" y2="165" stroke="#00d4ff" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
            <circle cx="200" cy="75" r="3" fill="#00d4ff" />
            <text x="200" y="65" fontSize="11" fill="#00d4ff" textAnchor="middle" fontWeight="bold">中轴线</text>

            {/* 测点标记 */}
            <circle cx="100" cy="95" r="2.5" fill="#00ff00" />
            <text x="100" y="110" fontSize="10" fill="#00ff00" textAnchor="middle">JRX01</text>

            <circle cx="300" cy="95" r="2.5" fill="#00ff00" />
            <text x="300" y="110" fontSize="10" fill="#00ff00" textAnchor="middle">JRX02</text>

            {/* X轴标签 */}
            <text x="200" y="180" fontSize="10" fill="#8ab4ff" textAnchor="middle">轴距</text>

            {/* Y轴标签 */}
            <text x="15" y="10" fontSize="10" fill="#8ab4ff" textAnchor="middle" transform="rotate(-90 15 10)">高程(m)</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
