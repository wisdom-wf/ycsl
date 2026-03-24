import { ReservoirData } from '@shared/const';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

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
        <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">近期降雨过程</label>
        <div className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-2 h-full flex flex-col shadow-lg shadow-accent/10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rainfallData}>
              <defs>
                <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" opacity={0.5} />
              <XAxis dataKey="time" stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <YAxis stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '2px solid #00d4ff', borderRadius: '4px', fontSize: '12px' }}
                labelStyle={{ color: '#e0e8ff' }}
                cursor={{ stroke: '#00d4ff', strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#00d4ff" 
                strokeWidth={2.5}
                fill="url(#colorRainfall)"
                dot={{ fill: '#00d4ff', r: 3, strokeWidth: 2, stroke: '#0a1428' }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 渗流压力监测 */}
      <div className="flex-1 min-h-0">
        <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">渗流压力监测</label>
        <div className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-2 h-full flex flex-col shadow-lg shadow-accent/10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seepageData}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0088ff" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a52" opacity={0.5} />
              <XAxis dataKey="name" stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <YAxis stroke="#8ab4ff" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f1d35', border: '2px solid #00d4ff', borderRadius: '4px', fontSize: '12px' }}
                labelStyle={{ color: '#e0e8ff' }}
                cursor={{ fill: 'rgba(0, 212, 255, 0.1)' }}
              />
              <Bar dataKey="value" fill="url(#colorBar)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 水库水情监测 */}
      <div>
        <label className="block text-xs font-bold text-accent mb-2 bg-gradient-to-r from-accent/30 to-accent/10 px-2 py-1 rounded border border-accent/30">水库水情监测</label>
        <div className="bg-gradient-to-br from-card to-card/50 border border-accent/20 rounded p-3 space-y-3 text-xs shadow-lg shadow-accent/10">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-muted-foreground font-semibold">入流</span>
              <span className="text-accent font-bold">{reservoirData.inflow.toFixed(1)} m³/s</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden border border-accent/30">
              <div 
                className="h-full bg-gradient-to-r from-accent to-blue-400 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((reservoirData.inflow / 2) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-muted-foreground font-semibold">出流</span>
              <span className="text-accent font-bold">{reservoirData.outflow.toFixed(1)} m³/s</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden border border-accent/30">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min((reservoirData.outflow / 2) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


