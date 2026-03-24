import { ReservoirData } from '@shared/const';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  reservoirData: ReservoirData;
}

export default function MonitoringCharts({ reservoirData }: Props) {
  const rainfallData = [
    { time: '00:00', value: 0 },
    { time: '04:00', value: 0.2 },
    { time: '08:00', value: 0.5 },
    { time: '12:00', value: 0.8 },
    { time: '16:00', value: 0.6 },
    { time: '20:00', value: 0.3 },
    { time: '24:00', value: 0 },
  ];

  const seepageData = [
    { name: '测点1', value: 45 },
    { name: '测点2', value: 52 },
    { name: '测点3', value: 48 },
    { name: '测点4', value: 55 },
  ];

  return (
    <div className="space-y-3 h-full flex flex-col">
      {/* 近期降雨过程 */}
      <div className="flex-1 min-h-0">
        <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">近期降雨过程</label>
        <div className="bg-card border border-border rounded p-2 h-full flex flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="time" stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <YAxis stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '1px solid #1a3a52', fontSize: '12px' }}
                labelStyle={{ color: '#e0e8ff' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00d4ff" 
                strokeWidth={2}
                dot={{ fill: '#00d4ff', r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 渗流压力监测 */}
      <div className="flex-1 min-h-0">
        <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">渗流压力监测</label>
        <div className="bg-card border border-border rounded p-2 h-full flex flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seepageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" />
              <XAxis dataKey="name" stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <YAxis stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '1px solid #1a3a52', fontSize: '12px' }}
                labelStyle={{ color: '#e0e8ff' }}
              />
              <Bar dataKey="value" fill="#0088ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 水库水情监测 */}
      <div>
        <label className="block text-xs font-bold text-accent mb-2 bg-accent/20 px-2 py-1 rounded">水库水情监测</label>
        <div className="bg-card border border-border rounded p-2 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">入流</span>
            <div className="flex items-center gap-1">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden max-w-16">
                <div className="h-full bg-accent" style={{ width: `${(reservoirData.inflow / 2) * 100}%` }}></div>
              </div>
              <span className="text-foreground w-10 text-right text-xs">{reservoirData.inflow.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">出流</span>
            <div className="flex items-center gap-1">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden max-w-16">
                <div className="h-full bg-accent" style={{ width: `${(reservoirData.outflow / 2) * 100}%` }}></div>
              </div>
              <span className="text-foreground w-10 text-right text-xs">{reservoirData.outflow.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
