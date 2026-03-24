import { ReservoirData } from '@shared/const';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  reservoirData: ReservoirData;
}

export default function MonitoringCharts({ reservoirData }: Props) {
  // 模拟降雨过程数据
  const rainfallData = [
    { time: '00:00', value: 0 },
    { time: '04:00', value: 0.2 },
    { time: '08:00', value: 0.5 },
    { time: '12:00', value: 0.8 },
    { time: '16:00', value: 0.6 },
    { time: '20:00', value: 0.3 },
    { time: '24:00', value: 0 },
  ];

  // 模拟渗流压力数据
  const seepageData = [
    { name: '测点1', value: 45 },
    { name: '测点2', value: 52 },
    { name: '测点3', value: 48 },
    { name: '测点4', value: 55 },
  ];

  return (
    <div className="space-y-4">
      {/* 近期降雨过程 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-accent mb-3 pb-2 border-b border-border">近期降雨过程</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={rainfallData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
            <XAxis dataKey="time" stroke="#8ab4ff" style={{ fontSize: '12px' }} />
            <YAxis stroke="#8ab4ff" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f1d35', border: '1px solid #1a3a52' }}
              labelStyle={{ color: '#e0e8ff' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#00d4ff" 
              strokeWidth={2}
              dot={{ fill: '#00d4ff', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 渗流压力监测 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-accent mb-3 pb-2 border-b border-border">渗流压力监测</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={seepageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
            <XAxis dataKey="name" stroke="#8ab4ff" style={{ fontSize: '12px' }} />
            <YAxis stroke="#8ab4ff" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f1d35', border: '1px solid #1a3a52' }}
              labelStyle={{ color: '#e0e8ff' }}
            />
            <Bar dataKey="value" fill="#0088ff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 水库水情监测 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-accent mb-3 pb-2 border-b border-border">水库水情监测</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">入流</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-24">
                <div className="h-full bg-accent" style={{ width: `${(reservoirData.inflow / 2) * 100}%` }}></div>
              </div>
              <span className="text-foreground w-12 text-right">{reservoirData.inflow.toFixed(1)} m³/s</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">出流</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-24">
                <div className="h-full bg-accent" style={{ width: `${(reservoirData.outflow / 2) * 100}%` }}></div>
              </div>
              <span className="text-foreground w-12 text-right">{reservoirData.outflow.toFixed(1)} m³/s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
