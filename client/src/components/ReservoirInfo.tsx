import { useState, useEffect, useRef } from 'react';
import { Reservoir, ReservoirData } from '@shared/const';
import { Phone, Video, Shield, Wrench, Eye, AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  reservoir: Reservoir;
  data: ReservoirData;
}

// 视频加载状态类型
type VideoStatus = 'idle' | 'loading' | 'failed' | 'success';

// 水库视频配置：
// r1 刘庄水库 → 加载失败
// r2 木头沟水库 → 显示图片（路径预留）
// r3 钟楼寺水库 → 显示图片（路径预留）
// r4 崖底水库 → 加载失败
const VIDEO_CONFIG: Record<string, { type: 'fail' | 'image'; imagePath?: string }> = {
  r1: { type: 'fail' },
  r2: { type: 'image', imagePath: '/ycsl/video/mutougou.jpg' },
  r3: { type: 'image', imagePath: '/ycsl/video/zhonglousi.jpg' },
  r4: { type: 'fail' },
};

function VideoMonitor({ reservoirId }: { reservoirId: string }) {
  const [status, setStatus] = useState<VideoStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = VIDEO_CONFIG[reservoirId];

  // 每次切换水库时重置并重新加载
  useEffect(() => {
    setStatus('loading');
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (config.type === 'fail') {
        setStatus('failed');
      } else {
        setStatus('success');
      }
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [reservoirId]);

  const handleRetry = () => {
    setStatus('loading');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus('failed');
    }, 3000);
  };

  return (
    <div className="bg-[#0f1d35] border border-accent/15 rounded-lg overflow-hidden aspect-video relative">
      {/* 加载中：旋转动效 */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628]">
          {/* 外圈旋转 */}
          <div className="relative w-14 h-14 mb-3">
            {/* 最外圈 - 慢速旋转 */}
            <div
              className="absolute inset-0 rounded-full border border-transparent"
              style={{
                borderTopColor: 'rgba(0,212,255,0.6)',
                borderRightColor: 'rgba(0,212,255,0.2)',
                animation: 'spin 2s linear infinite',
              }}
            />
            {/* 中圈 - 反向旋转 */}
            <div
              className="absolute inset-[5px] rounded-full border border-transparent"
              style={{
                borderTopColor: 'rgba(0,212,255,0.9)',
                borderLeftColor: 'rgba(0,212,255,0.3)',
                animation: 'spin 1.2s linear infinite reverse',
              }}
            />
            {/* 内圈 - 快速旋转 */}
            <div
              className="absolute inset-[10px] rounded-full border border-transparent"
              style={{
                borderTopColor: 'rgba(0,212,255,1)',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            {/* 中心图标 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="w-4 h-4 text-cyan-400/70" />
            </div>
          </div>
          {/* 扫描线 */}
          <div
            className="absolute left-0 right-0 h-[1px]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)',
              animation: 'scanLine 2s ease-in-out infinite',
            }}
          />
          <p className="text-[10px] text-cyan-400/60 tracking-widest">信号连接中...</p>
          <div className="flex gap-1 mt-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-cyan-400/50"
                style={{ animation: `pulse 1s ease-in-out ${delay}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 加载失败 */}
      {status === 'failed' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628]">
          {/* 故障扫描线效果 */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-[1px] bg-red-500/50"
                style={{ top: `${15 + i * 15}%`, animation: `glitch ${0.5 + i * 0.1}s ease-in-out ${i * 0.05}s infinite alternate` }}
              />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <div className="w-10 h-10 bg-red-900/30 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-[11px] text-red-400 font-medium mb-0.5">视频信号丢失</p>
            <p className="text-[9px] text-red-400/50 mb-2">无法连接到摄像头</p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-900/20 border border-red-500/30 rounded text-[10px] text-red-400/80 hover:bg-red-900/40 hover:text-red-300 transition-all duration-200 mx-auto"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              重试
            </button>
          </div>
        </div>
      )}

      {/* 加载成功：显示图片 */}
      {status === 'success' && config.type === 'image' && config.imagePath && (
        <div className="absolute inset-0">
          <img
            src={config.imagePath}
            alt="视频监控画面"
            className="w-full h-full object-cover"
            onError={(e) => {
              // 图片加载失败时显示占位
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* 监控叠加层 */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 角标 */}
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-mono">LIVE</span>
            </div>
            <div className="absolute top-1.5 right-1.5 text-[9px] text-white/50 font-mono">
              {new Date().toLocaleTimeString('zh-CN', { hour12: false })}
            </div>
            {/* 底部信息栏 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
              <p className="text-[9px] text-white/70 font-mono">CAM-01 库区大坝</p>
            </div>
            {/* 四角边框装饰 */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-3 h-3 border-cyan-400/50 ${i < 2 ? 'border-t' : 'border-b'} ${i % 2 === 0 ? 'border-l' : 'border-r'}`} />
            ))}
          </div>
        </div>
      )}

      {/* 初始状态 */}
      {status === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]">
          <Video className="w-6 h-6 text-cyan-400/30" />
        </div>
      )}

      {/* CSS 动画定义 */}
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes glitch {
          0% { transform: translateX(0); opacity: 0.3; }
          50% { transform: translateX(3px); opacity: 0.6; }
          100% { transform: translateX(-3px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default function ReservoirInfo({ reservoir, data }: Props) {
  return (
    <div className="space-y-3">
      {/* 水库特征 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-xs font-bold text-accent tracking-wide">水库特征</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 space-y-2 text-xs">
          {[
            { label: '水库规模', value: '中型' },
            { label: '工程规模', value: '中型' },
            { label: '正常蓄水位', value: `${data.normalWaterLevel}m` },
            { label: '汛限水位', value: `${data.floodWaterLevel}m` },
            { label: '校核洪水位', value: `${data.checkFloodLevel}m` },
            { label: '总库容', value: `${data.totalCapacity}万m³` },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-0.5 border-b border-accent/5 last:border-b-0">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="text-cyan-300 font-medium font-mono text-[11px]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 视频监控 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-xs font-bold text-accent tracking-wide">视频监控</span>
        </div>
        <VideoMonitor reservoirId={reservoir.id} />
      </div>

      {/* 责任人信息 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-xs font-bold text-accent tracking-wide">责任人信息</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 space-y-3 text-xs">
          {[
            { role: '行政责任人', name: reservoir.contacts.adminName, phone: reservoir.contacts.adminPhone, icon: Shield },
            { role: '技术责任人', name: reservoir.contacts.techName, phone: reservoir.contacts.techPhone, icon: Wrench },
            { role: '巡查责任人', name: reservoir.contacts.inspectionName, phone: reservoir.contacts.inspectionPhone, icon: Eye },
          ].map((person, i) => (
            <div key={i} className="flex items-start gap-2 pb-2 border-b border-accent/5 last:border-b-0 last:pb-0">
              <div className="w-6 h-6 bg-accent/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <person.icon className="w-3 h-3 text-accent/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-muted-foreground text-[10px]">{person.role}</div>
                <div className="text-cyan-300 font-medium">{person.name}</div>
                <div className="text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Phone className="w-2.5 h-2.5 text-accent/40" />
                  <span className="font-mono text-[10px]">{person.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
