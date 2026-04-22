import { useState, useEffect, useRef, useCallback } from 'react';
import { Reservoir, ReservoirData } from '@shared/const';
import { Phone, Video, Shield, Wrench, Eye, AlertTriangle, RefreshCw, Maximize2, X } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

// ─── 天气类型判断 ────────────────────────────────────────────────────────────
type WeatherEffect = 'none' | 'light-rain' | 'medium-rain' | 'heavy-rain' | 'snow' | 'fog' | 'haze' | 'overcast';

function getWeatherEffect(weatherStr: string, rain24h: string): WeatherEffect {
  const w = weatherStr || '';
  const rain = parseFloat(rain24h || '0');

  // 雨：优先用文字描述，再兜底用24h累计量
  if (/特大暴雨|大暴雨/.test(w) || rain > 50) return 'heavy-rain';
  if (/暴雨|大雨|雷暴|雷阵雨|强雷|强对流/.test(w) || rain > 25) return 'heavy-rain';
  if (/中雨|阵雨|雷雨|冻雨/.test(w) || rain > 10) return 'medium-rain';
  if (/小雨|毛毛雨|细雨|小到中雨|雨夹雪/.test(w) || rain > 0.1) return 'light-rain';

  // 雪
  if (/暴雪|大雪|强降雪/.test(w)) return 'snow';
  if (/中雪|小雪|阵雪|雪/.test(w)) return 'snow';

  // 雾/霾/沙尘
  if (/大雾|浓雾|强浓雾|特强浓雾/.test(w)) return 'fog';
  if (/雾|轻雾/.test(w)) return 'fog';
  if (/霾|重度霾|中度霾|轻度霾/.test(w)) return 'haze';
  if (/沙尘暴|扬沙|浮尘/.test(w)) return 'haze';

  // 阴天
  if (/阴|多云/.test(w)) return 'overcast';

  return 'none';
}

// ─── 动态视频滤镜 ────────────────────────────────────────────────────────────
function useVideoFilter() {
  const { weather } = useWeather();
  const hour = new Date().getHours();

  let brightness = 1.0, saturate = 1.0, sepia = 0, hueRotate = 0, contrast = 1.0;
  let overlay = '';

  // 1. 时间段基础滤镜
  if (hour < 5) {
    brightness = 0.25; saturate = 0.3; hueRotate = 160; contrast = 1.4;
    overlay = 'rgba(0,30,20,0.55)';
  } else if (hour < 7) {
    brightness = 0.45; saturate = 0.6; sepia = 0.25; hueRotate = 10; contrast = 1.1;
    overlay = 'rgba(30,10,0,0.35)';
  } else if (hour < 9) {
    brightness = 0.80; saturate = 0.85; sepia = 0.12; contrast = 0.95;
    overlay = 'rgba(255,220,150,0.08)';
  } else if (hour < 17) {
    brightness = 1.0; saturate = 1.0; contrast = 1.0;
  } else if (hour < 19) {
    brightness = 0.75; saturate = 0.9; sepia = 0.2; hueRotate = -10; contrast = 1.05;
    overlay = 'rgba(255,120,30,0.12)';
  } else if (hour < 21) {
    brightness = 0.45; saturate = 0.5; hueRotate = 20; contrast = 1.2;
    overlay = 'rgba(0,10,40,0.40)';
  } else {
    brightness = 0.30; saturate = 0.35; hueRotate = 150; contrast = 1.35;
    overlay = 'rgba(0,20,15,0.50)';
  }

  // 2. 天气修正
  const effect = getWeatherEffect(weather?.weather || '', weather?.rain24h || '0');

  switch (effect) {
    case 'heavy-rain':
      brightness *= 0.52; saturate *= 0.40; contrast *= 1.35; hueRotate += 18;
      overlay = 'rgba(3,12,38,0.60)';
      break;
    case 'medium-rain':
      brightness *= 0.68; saturate *= 0.55; contrast *= 1.18; hueRotate += 10;
      overlay = 'rgba(8,18,48,0.40)';
      break;
    case 'light-rain':
      brightness *= 0.82; saturate *= 0.72; contrast *= 1.06;
      overlay = overlay || 'rgba(18,28,58,0.22)';
      break;
    case 'snow':
      brightness *= 1.08; saturate *= 0.35; hueRotate += 195; contrast *= 0.92;
      overlay = 'rgba(200,220,255,0.18)';
      break;
    case 'fog':
      brightness *= 0.75; saturate *= 0.20; contrast *= 0.82; sepia += 0.05;
      overlay = 'rgba(200,210,220,0.38)';
      break;
    case 'haze':
      brightness *= 0.68; saturate *= 0.25; sepia += 0.35; contrast *= 0.85;
      overlay = 'rgba(180,148,70,0.32)';
      break;
    case 'overcast':
      brightness *= 0.86; saturate *= 0.78; contrast *= 1.05;
      overlay = overlay || 'rgba(20,20,32,0.16)';
      break;
  }

  const parts = [
    `brightness(${brightness.toFixed(2)})`,
    `contrast(${contrast.toFixed(2)})`,
    `saturate(${saturate.toFixed(2)})`,
  ];
  if (sepia > 0) parts.push(`sepia(${sepia.toFixed(2)})`);
  if (hueRotate !== 0) parts.push(`hue-rotate(${hueRotate}deg)`);

  return { filter: parts.join(' '), overlay, effect };
}

// ─── Canvas 天气粒子动画 ─────────────────────────────────────────────────────
function WeatherCanvas({ effect }: { effect: WeatherEffect }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const dropsRef = useRef<number[][]>([]);

  const initDrops = useCallback((w: number, h: number, count: number) => {
    dropsRef.current = Array.from({ length: count }, () => [
      Math.random() * w,
      Math.random() * h,
      0.4 + Math.random() * 0.8,  // speed multiplier
      Math.random() * Math.PI * 2, // phase (for snow drift)
    ]);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const drops = dropsRef.current;

    if (effect === 'light-rain' || effect === 'medium-rain' || effect === 'heavy-rain') {
      // 雨滴参数
      const cfg = {
        'light-rain':  { count: 55,  speed: 5.5,  len: 13, opacity: 0.32, angle: 18, width: 0.7 },
        'medium-rain': { count: 110, speed: 9.5,  len: 20, opacity: 0.48, angle: 22, width: 0.9 },
        'heavy-rain':  { count: 200, speed: 16,   len: 30, opacity: 0.62, angle: 26, width: 1.2 },
      }[effect];

      const rad = (cfg.angle * Math.PI) / 180;
      const dx = Math.sin(rad) * cfg.speed;
      const dy = Math.cos(rad) * cfg.speed;

      ctx.strokeStyle = `rgba(180,215,255,${cfg.opacity})`;
      ctx.lineWidth = cfg.width;
      ctx.lineCap = 'round';

      for (const d of drops) {
        const [x, y, spd] = d;
        const tailX = x - dx * spd * (cfg.len / cfg.speed);
        const tailY = y - dy * spd * (cfg.len / cfg.speed);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        d[0] += dx * spd;
        d[1] += dy * spd;
        if (d[1] > h + cfg.len || d[0] > w + cfg.len) {
          d[0] = Math.random() * (w + 60) - 60;
          d[1] = -cfg.len - Math.random() * h * 0.25;
        }
      }

      // 暴雨额外加水花溅射效果
      if (effect === 'heavy-rain' && Math.random() < 0.15) {
        const sx = Math.random() * w;
        const sy = h - 2;
        ctx.strokeStyle = 'rgba(180,215,255,0.25)';
        ctx.lineWidth = 0.6;
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2.5;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + Math.cos(angle) * 5, sy + Math.sin(angle) * 5);
          ctx.stroke();
        }
      }

    } else if (effect === 'snow') {
      // 雪花：圆形粒子，随机飘动
      const count = drops.length;
      for (let i = 0; i < count; i++) {
        const d = drops[i];
        const [x, y, spd, phase] = d;
        const size = 1.5 + spd * 1.5;
        const alpha = 0.55 + spd * 0.2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,240,255,${alpha})`;
        ctx.fill();
        // 飘落 + 左右摆动
        d[0] = x + Math.sin(phase + y * 0.02) * 0.8;
        d[1] = y + spd * 1.2;
        d[3] = phase + 0.02;
        if (d[1] > h + 10) {
          d[0] = Math.random() * w;
          d[1] = -10;
        }
      }

    } else if (effect === 'fog') {
      // 雾气：横向漂移的半透明椭圆
      const count = drops.length;
      for (let i = 0; i < count; i++) {
        const d = drops[i];
        const [x, y, spd, phase] = d;
        const rx = 40 + spd * 30;
        const ry = 8 + spd * 6;
        const alpha = 0.04 + spd * 0.04;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, rx);
        grad.addColorStop(0, `rgba(210,220,230,${alpha})`);
        grad.addColorStop(1, 'rgba(210,220,230,0)');
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        d[0] = x + spd * 0.4;
        d[1] = y + Math.sin(phase) * 0.15;
        d[3] = phase + 0.008;
        if (d[0] > w + rx) d[0] = -rx;
      }

    } else if (effect === 'haze') {
      // 霾：缓慢漂移的黄褐色粒子
      const count = drops.length;
      for (let i = 0; i < count; i++) {
        const d = drops[i];
        const [x, y, spd, phase] = d;
        const r = 20 + spd * 20;
        const alpha = 0.03 + spd * 0.03;
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(180,148,70,${alpha})`);
        grad.addColorStop(1, 'rgba(180,148,70,0)');
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        d[0] = x + spd * 0.3;
        d[1] = y + Math.sin(phase) * 0.1;
        d[3] = phase + 0.005;
        if (d[0] > w + r) d[0] = -r;
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [effect]);

  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    const canvas = canvasRef.current;
    if (!canvas || effect === 'none' || effect === 'overcast') return;

    const countMap: Record<string, number> = {
      'light-rain': 55, 'medium-rain': 110, 'heavy-rain': 200,
      'snow': 80, 'fog': 25, 'haze': 20,
    };
    initDrops(canvas.width, canvas.height, countMap[effect] || 0);
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [effect, draw, initDrops]);

  if (effect === 'none' || effect === 'overcast') return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      width={480}
      height={270}
    />
  );
}

interface Props {
  reservoir: Reservoir;
  data: ReservoirData;
}

type VideoStatus = 'idle' | 'loading' | 'failed' | 'success';

const VIDEO_CONFIG: Record<string, { type: 'fail' | 'image'; imagePath?: string }> = {
  r1: { type: 'fail' },
  r2: { type: 'image', imagePath: '/ycsl/video/mutougou.jpg' },
  r3: { type: 'image', imagePath: '/ycsl/video/zhonglousi.jpg' },
  r4: { type: 'image', imagePath: '/ycsl/video/yadi.jpg' },
};

function renderVideoContent(
  status: VideoStatus,
  config: { type: 'fail' | 'image'; imagePath?: string },
  handleRetry: () => void,
  isLarge = false,
  videoFilter?: { filter: string; overlay: string; effect: WeatherEffect }
) {
  return (
    <>
      {/* 加载中 */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628]">
          <div className={`relative mb-3 ${isLarge ? 'w-20 h-20' : 'w-14 h-14'}`}>
            <div className="absolute inset-0 rounded-full border border-transparent"
              style={{ borderTopColor: 'rgba(0,212,255,0.6)', borderRightColor: 'rgba(0,212,255,0.2)', animation: 'spin 2s linear infinite' }} />
            <div className="absolute inset-[5px] rounded-full border border-transparent"
              style={{ borderTopColor: 'rgba(0,212,255,0.9)', borderLeftColor: 'rgba(0,212,255,0.3)', animation: 'spin 1.2s linear infinite reverse' }} />
            <div className="absolute inset-[10px] rounded-full border border-transparent"
              style={{ borderTopColor: 'rgba(0,212,255,1)', animation: 'spin 0.8s linear infinite' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className={`text-cyan-400/70 ${isLarge ? 'w-6 h-6' : 'w-4 h-4'}`} />
            </div>
          </div>
          <div className="absolute left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5), transparent)', animation: 'scanLine 2s ease-in-out infinite' }} />
          <p className={`text-cyan-400/60 tracking-widest ${isLarge ? 'text-sm' : 'text-[10px]'}`}>信号连接中...</p>
          <div className="flex gap-1 mt-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div key={i} className={`rounded-full bg-cyan-400/50 ${isLarge ? 'w-2 h-2' : 'w-1 h-1'}`}
                style={{ animation: `pulse 1s ease-in-out ${delay}s infinite` }} />
            ))}
          </div>
        </div>
      )}

      {/* 加载失败 */}
      {status === 'failed' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628]">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute left-0 right-0 h-[1px] bg-red-500/50"
                style={{ top: `${15 + i * 15}%`, animation: `glitch ${0.5 + i * 0.1}s ease-in-out ${i * 0.05}s infinite alternate` }} />
            ))}
          </div>
          <div className="relative z-10 text-center">
            <div className={`bg-red-900/30 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-2 ${isLarge ? 'w-16 h-16' : 'w-10 h-10'}`}>
              <AlertTriangle className={`text-red-400 ${isLarge ? 'w-8 h-8' : 'w-5 h-5'}`} />
            </div>
            <p className={`text-red-400 font-medium mb-0.5 ${isLarge ? 'text-base' : 'text-[11px]'}`}>视频信号丢失</p>
            <p className={`text-red-400/50 mb-2 ${isLarge ? 'text-sm' : 'text-[9px]'}`}>无法连接到摄像头</p>
            <button onClick={handleRetry}
              className={`flex items-center gap-1 bg-red-900/20 border border-red-500/30 rounded text-red-400/80 hover:bg-red-900/40 hover:text-red-300 transition-all duration-200 mx-auto ${isLarge ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-[10px]'}`}>
              <RefreshCw className={isLarge ? 'w-4 h-4' : 'w-2.5 h-2.5'} />
              重试
            </button>
          </div>
        </div>
      )}

      {/* 加载成功：显示图片 + 天气特效 */}
      {status === 'success' && config.type === 'image' && config.imagePath && (
        <div className="absolute inset-0">
          {/* 底层图片 */}
          <img
            src={config.imagePath}
            alt="视频监控画面"
            className="w-full h-full object-cover transition-all duration-1000"
            style={videoFilter ? { filter: videoFilter.filter } : undefined}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* 色调叠加层 */}
          {videoFilter?.overlay && (
            <div className="absolute inset-0 pointer-events-none transition-all duration-1000"
              style={{ background: videoFilter.overlay }} />
          )}
          {/* 天气粒子动画 */}
          {videoFilter && <WeatherCanvas effect={videoFilter.effect} />}
          {/* 监控 UI 叠加层 */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
              <div className={`rounded-full bg-green-400 animate-pulse ${isLarge ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'}`} />
              <span className={`text-green-400 font-mono ${isLarge ? 'text-xs' : 'text-[9px]'}`}>LIVE</span>
            </div>
            <div className={`absolute top-1.5 right-1.5 text-white/50 font-mono ${isLarge ? 'text-xs' : 'text-[9px]'}`}>
              {new Date().toLocaleTimeString('zh-CN', { hour12: false })}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
              <p className={`text-white/70 font-mono ${isLarge ? 'text-xs' : 'text-[9px]'}`}>CAM-01 库区大坝</p>
            </div>
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div key={i}
                className={`absolute ${pos} border-cyan-400/50 ${i < 2 ? 'border-t' : 'border-b'} ${i % 2 === 0 ? 'border-l' : 'border-r'} ${isLarge ? 'w-5 h-5' : 'w-3 h-3'}`} />
            ))}
          </div>
        </div>
      )}

      {/* 初始状态 */}
      {status === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a1628]">
          <Video className={`text-cyan-400/30 ${isLarge ? 'w-10 h-10' : 'w-6 h-6'}`} />
        </div>
      )}
    </>
  );
}

function VideoMonitor({ reservoirId, reservoirName }: { reservoirId: string; reservoirName: string }) {
  const [status, setStatus] = useState<VideoStatus>('idle');
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = VIDEO_CONFIG[reservoirId];
  const videoFilter = useVideoFilter();

  useEffect(() => {
    setStatus('loading');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setStatus(config.type === 'fail' ? 'failed' : 'success');
    }, 3000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [reservoirId]);

  const handleRetry = () => {
    setStatus('loading');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('failed'), 3000);
  };

  return (
    <>
      <div
        className="bg-[#0f1d35] border border-accent/15 rounded-lg overflow-hidden aspect-video relative cursor-pointer group"
        onClick={() => setExpanded(true)}
        title="点击放大"
      >
        {renderVideoContent(status, config, handleRetry, false, videoFilter)}
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/50 border border-cyan-400/30 rounded-full p-1.5 backdrop-blur-sm">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
          </div>
        </div>
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

      {expanded && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={() => setExpanded(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 w-[85vw] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a1628] border border-cyan-500/30 border-b-0 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300 font-medium tracking-wide">{reservoirName} — 视频监控</span>
                {status === 'success' && (
                  <div className="flex items-center gap-1 ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-green-400 font-mono">LIVE</span>
                  </div>
                )}
                {status === 'failed' && (
                  <span className="text-[10px] text-red-400/80 bg-red-900/20 border border-red-500/20 px-1.5 py-0.5 rounded font-mono ml-2">信号丢失</span>
                )}
              </div>
              <button onClick={() => setExpanded(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-400/10 transition-all duration-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#0a1628] border border-cyan-500/30 border-t-0 rounded-b-lg overflow-hidden aspect-video relative">
              {renderVideoContent(status, config, handleRetry, true, videoFilter)}
            </div>
            <p className="text-center text-[10px] text-cyan-400/30 mt-2 font-mono tracking-widest">点击空白区域或右上角 × 关闭</p>
          </div>
        </div>
      )}
    </>
  );
}

export default function ReservoirInfo({ reservoir, data }: Props) {
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
          <span className="text-sm font-bold text-accent tracking-wide">水库特征</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg px-3 py-2 space-y-1.5">
          {[
            { label: '水库规模', value: '中型' },
            { label: '工程规模', value: '中型' },
            { label: '正常蓄水位', value: `${data.normalWaterLevel}m` },
            { label: '汛限水位', value: `${data.floodWaterLevel}m` },
            { label: '校核洪水位', value: `${data.checkFloodLevel}m` },
            { label: '总库容', value: `${data.totalCapacity}万m³` },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-accent/5 last:border-b-0">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm text-cyan-300 font-semibold font-mono">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
          <span className="text-sm font-bold text-accent tracking-wide">视频监控</span>
          <span className="text-xs text-cyan-400/40 ml-auto font-mono">点击可放大</span>
        </div>
        <VideoMonitor reservoirId={reservoir.id} reservoirName={reservoir.name} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center gap-2 mb-2 flex-shrink-0">
          <div className="w-1.5 h-5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
          <span className="text-sm font-bold text-accent tracking-wide">责任人信息</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg px-3 py-2 flex flex-col justify-around flex-1">
          {[
            { role: '行政责任人', name: reservoir.contacts.adminName, phone: reservoir.contacts.adminPhone, icon: Shield },
            { role: '技术责任人', name: reservoir.contacts.techName, phone: reservoir.contacts.techPhone, icon: Wrench },
            { role: '巡查责任人', name: reservoir.contacts.inspectionName, phone: reservoir.contacts.inspectionPhone, icon: Eye },
          ].map((person, i) => (
            <div key={i} className="py-2 border-b border-accent/5 last:border-b-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-6 h-6 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
                  <person.icon className="w-3.5 h-3.5 text-accent/60" />
                </div>
                <span className="text-sm text-muted-foreground">{person.role}</span>
              </div>
              <div className="flex items-center justify-between gap-2 pl-1">
                <span className="text-base text-cyan-300 font-semibold">{person.name}</span>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-accent/40 flex-shrink-0" />
                  <span className="font-mono text-base text-muted-foreground tracking-wide">{person.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
