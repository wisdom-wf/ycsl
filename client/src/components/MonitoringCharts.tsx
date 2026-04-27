import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
  Area, AreaChart,
} from 'recharts';
import { ReservoirData } from '@shared/const';
import { WeatherData } from '@/hooks/useWeather';

interface Props {
  reservoirData: ReservoirData;
  currentTime: Date;
  weather?: WeatherData | null;
}

export default function MonitoringCharts({ reservoirData, currentTime, weather }: Props) {

  // ── 当天0-24时每2小时降雨量（来自weather.hourlyRain预报数据）
  const rainfallData = useMemo(() => {
    // 固定12个时间槽：00,02,04,...,22
    const slots = Array.from({ length: 12 }, (_, i) => ({
      time: `${String(i * 2).padStart(2, '0')}`,
      value: 0,
    }));
    if (weather?.hourlyRain) {
      weather.hourlyRain.forEach((item, idx) => {
        if (idx < 12) slots[idx].value = item.rain;
      });
    }
    return slots;
  }, [weather?.hourlyRain]);

  // 实测24h累计降雨量
  const rain24h = weather?.rain24h ?? '--';
  const rain24hNum = parseFloat(rain24h) || 0;

  // 当前小时（用于在图表上标注当前时刻）
  const currentHour = currentTime.getHours();
  // 当前时刻对应的槽索引（向下取整到偶数）
  const currentSlotHour = Math.floor(currentHour / 2) * 2;

  // ── 库水情监测：模拟近7天水位数据（全部置0）
  const waterLevelData = useMemo(() => {
    const base = 0;
    const now = new Date(currentTime);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - 6 + i);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
    return days.map((day, i) => ({
      day,
      level: parseFloat((base + Math.sin(i * 0.8) * 0.1 + (i * 0.05) % 0.1).toFixed(2)),
    }));
  }, [reservoirData.reservoirId]);

  // 库水位警戒线 = 汛限水位
  const waterLevelWarning = reservoirData.floodWaterLevel;
  const yMin = Math.floor(reservoirData.normalWaterLevel - 6);
  const yMax = Math.ceil(reservoirData.checkFloodLevel + 1);

  // ── 渗流压力监测
  const damHeight = reservoirData.checkFloodLevel - reservoirData.normalWaterLevel + 10;
  const seepageWarningHead = parseFloat((damHeight * 0.6).toFixed(1));
  const elevBase = 1097;
  const elevTop = 1125;
  const svgYBottom = 148;
  const svgYTop = 18;
  const elevRange = elevTop - elevBase;
  const svgYRange = svgYBottom - svgYTop;
  const elevToSvgY = (elev: number) =>
    svgYBottom - ((elev - elevBase) / elevRange) * svgYRange;
  const warningElev = elevBase + seepageWarningHead;
  const warningY = elevToSvgY(Math.min(warningElev, elevTop - 1));

  // Y轴最大值：至少10，或最大单时段降雨量的1.2倍，或警戒值的1.1倍
  const maxRain = Math.max(...rainfallData.map(d => d.value), 1);
  const yMaxRain = Math.max(10, Math.ceil(maxRain * 1.3), Math.ceil(50 * 1.1));

  return (
    <div className="h-full flex flex-col gap-3">

      {/* ── 当天降雨过程 ── */}
      <div className="flex flex-col" style={{ flex: '1 1 0', minHeight: 0 }}>
        <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
          <div className="w-1.5 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-sm font-bold text-accent">当天降雨过程</span>
          {/* 右上角：实测24h累计值 */}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-xs text-muted-foreground/70">24小时累计</span>
            <span className={`text-sm font-bold font-mono ${rain24hNum > 50 ? 'text-red-400' : rain24hNum > 10 ? 'text-yellow-400' : 'text-cyan-300'}`}>
              {rain24h}
            </span>
            <span className="text-xs text-muted-foreground/70">mm</span>
          </div>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-2" style={{ flex: '1 1 0', minHeight: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rainfallData} margin={{ top: 8, right: 8, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0066cc" stopOpacity={0.6} />
                </linearGradient>
                <linearGradient id="rainGradientAlert" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b6b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#cc2200" stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" opacity={0.3} />
              <XAxis
                dataKey="time"
                stroke="#4a7a9b"
                style={{ fontSize: '10px' }}
                tickLine={false}
                axisLine={{ stroke: '#1a3a52' }}
                interval={1}
                tickFormatter={(v) => v}
              />
              <YAxis
                stroke="#4a7a9b"
                style={{ fontSize: '10px' }}
                domain={[0, yMaxRain]}
                tickLine={false}
                axisLine={{ stroke: '#1a3a52' }}
                label={{ value: 'mm', angle: -90, position: 'insideLeft', offset: 12, fill: '#4a7a9b', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0a1628', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '6px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                labelStyle={{ color: '#8ab4ff' }}
                labelFormatter={(label) => `${label}:00 时段`}
                formatter={(value: any) => [`${(value as number).toFixed(2)} mm`, '预报降雨']}
              />
              {/* 50mm 警戒线 */}
              <ReferenceLine y={50} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3"
                label={{ value: '警戒 50mm', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
              {/* 当前时刻参考线 */}
              <ReferenceLine
                x={String(currentSlotHour).padStart(2, '0')}
                stroke="#00ff88"
                strokeWidth={1}
                strokeDasharray="3 3"
                label={{ value: '当前', position: 'insideTopLeft', fill: '#00ff88', fontSize: 9 }}
              />
              <Bar
                dataKey="value"
                fill="url(#rainGradient)"
                radius={[2, 2, 0, 0]}
                isAnimationActive
                animationDuration={800}
              />
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
              <ReferenceLine y={waterLevelWarning} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 3"
                label={{ value: `汛限 ${waterLevelWarning}m`, position: 'insideTopRight', fill: '#ef4444', fontSize: 11, fontWeight: 'bold' }} />
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

        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-2" style={{ flex: '1 1 0', minHeight: '160px' }}>
          <svg viewBox="0 0 320 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
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
            <text x="5" y="30" fontSize="13" fill="#4a7a9b">高程(m)</text>
            <text x="30" y="42" fontSize="13" fill="#4a7a9b" textAnchor="end">1,125</text>
            <text x="30" y="62" fontSize="13" fill="#4a7a9b" textAnchor="end">1,120</text>
            <text x="30" y="82" fontSize="13" fill="#4a7a9b" textAnchor="end">1,115</text>
            <text x="30" y="102" fontSize="13" fill="#4a7a9b" textAnchor="end">1,110</text>
            <text x="30" y="122" fontSize="13" fill="#4a7a9b" textAnchor="end">1,105</text>
            <text x="30" y="142" fontSize="13" fill="#4a7a9b" textAnchor="end">1,100</text>
            <text x="30" y="162" fontSize="13" fill="#4a7a9b" textAnchor="end">1,097</text>
            <line x1="32" y1="38" x2="32" y2="168" stroke="#1a3a52" strokeWidth="0.5" />
            <line x1="32" y1="168" x2="310" y2="168" stroke="#1a3a52" strokeWidth="0.5" />
            <polygon points="80,168 100,102 160,42 220,42 260,102 280,168" fill="url(#trapGrad)" stroke="#ff69b4" strokeWidth="1.5" />
            <line x1="180" y1="42" x2="180" y2="168" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8" />
            <circle cx="180" cy="38" r="3" fill="#ffffff" filter="url(#glow)" />
            <text x="180" y="30" fontSize="14" fill="#ffffff" textAnchor="middle" fontWeight="bold">中轴线</text>
            <circle cx="180" cy="172" r="3" fill="#ffffff" filter="url(#glow)" />
            <text x="180" y="188" fontSize="14" fill="#ffffff" textAnchor="middle" fontWeight="bold">中轴线</text>
            <text x="300" y="195" fontSize="14" fill="#4a7a9b" textAnchor="end">轴距</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
