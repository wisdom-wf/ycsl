import { useState, useEffect, useRef } from 'react';
import { Reservoir, ReservoirData } from '@shared/const';
import { Phone, Video, Shield, Wrench, Eye, AlertTriangle, RefreshCw, Maximize2, X } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

// ─── 动态视频滤镜 ───────────────────────────────────────────────────────────
// 根据当前时间段和天气状况，返回一组 CSS filter 参数，让监控画面更真实
function useVideoFilter() {
  const { weather } = useWeather();
  const hour = new Date().getHours();

  // 1. 时间段基础亮度 & 色调
  let brightness = 1.0;
  let saturate  = 1.0;
  let sepia     = 0;
  let hueRotate = 0;
  let contrast  = 1.0;
  let overlay   = ''; // 额外叠加层颜色（rgba）

  if (hour >= 0 && hour < 5) {
    // 深夜：极暗，轻微蓝绿偏色（夜视感）
    brightness = 0.25; saturate = 0.3; hueRotate = 160; contrast = 1.4;
    overlay = 'rgba(0,30,20,0.55)';
  } else if (hour >= 5 && hour < 7) {
    // 黎明：昏暗橙蓝混合
    brightness = 0.45; saturate = 0.6; sepia = 0.25; hueRotate = 10; contrast = 1.1;
    overlay = 'rgba(30,10,0,0.35)';
  } else if (hour >= 7 && hour < 9) {
    // 清晨：偏暖，轻微雾感
    brightness = 0.80; saturate = 0.85; sepia = 0.12; contrast = 0.95;
    overlay = 'rgba(255,220,150,0.08)';
  } else if (hour >= 9 && hour < 17) {
    // 白天：正常
    brightness = 1.0; saturate = 1.0; contrast = 1.0;
  } else if (hour >= 17 && hour < 19) {
    // 傍晚：暖橙
    brightness = 0.75; saturate = 0.9; sepia = 0.2; hueRotate = -10; contrast = 1.05;
    overlay = 'rgba(255,120,30,0.12)';
  } else if (hour >= 19 && hour < 21) {
    // 夜幕降临：较暗，偏蓝
    brightness = 0.45; saturate = 0.5; hueRotate = 20; contrast = 1.2;
    overlay = 'rgba(0,10,40,0.40)';
  } else {
    // 深夜前段
    brightness = 0.30; saturate = 0.35; hueRotate = 150; contrast = 1.35;
    overlay = 'rgba(0,20,15,0.50)';
  }

  // 2. 天气修正（叠加在时间基础上）
  const w = weather?.weather || '';
  const rain = parseFloat(weather?.rain24h || '0');

  if (/雷|暴雨|大雨/.test(w) || rain > 30) {
    // 暴雨：大幅压暗，高对比，蓝灰偏色
    brightness *= 0.55; saturate *= 0.45; contrast *= 1.3; hueRotate += 15;
    overlay = 'rgba(5,15,40,0.55)';
  } else if (/中雨|阵雨/.test(w) || rain > 10) {
    // 中雨：压暗，轻微蓝灰
    brightness *= 0.70; saturate *= 0.60; contrast *= 1.15; hueRotate += 8;
    overlay = overlay || 'rgba(10,20,50,0.35)';
  } else if (/小雨|毛毛雨|细雨/.test(w) || rain > 2) {
    // 小雨：轻微压暗，雾感
    brightness *= 0.82; saturate *= 0.75; contrast *= 1.05;
    overlay = overlay || 'rgba(20,30,60,0.20)';
  } else if (/阴|多云/.test(w)) {
    // 阴天：轻微压暗，去饱和
    brightness *= 0.88; saturate *= 0.80; contrast *= 1.05;
    overlay = overlay || 'rgba(20,20,30,0.15)';
  } else if (/雾|霾|沙尘/.test(w)) {
    // 雾霾：大幅去饱和，暖黄偏色
    brightness *= 0.70; saturate *= 0.30; sepia += 0.30; contrast *= 0.90;
    overlay = 'rgba(180,150,80,0.25)';
  } else if (/雪/.test(w)) {
    // 雪天：冷白，高亮度
    brightness *= 1.10; saturate *= 0.40; hueRotate += 200; contrast *= 0.95;
    overlay = 'rgba(200,220,255,0.15)';
  }

  // 3. 组装 CSS filter 字符串
  const parts = [
    `brightness(${brightness.toFixed(2)})`,
    `contrast(${contrast.toFixed(2)})`,
    `saturate(${saturate.toFixed(2)})`,
  ];
  if (sepia > 0)     parts.push(`sepia(${sepia.toFixed(2)})`);
  if (hueRotate !== 0) parts.push(`hue-rotate(${hueRotate}deg)`);

  return { filter: parts.join(' '), overlay };
}

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
  r4: { type: 'image', imagePath: '/ycsl/video/yadi.jpg' },
};

// 渲染视频内容（loading / failed / success 三种状态）
// isLarge: 是否为放大模式，控制部分尺寸
function renderVideoContent(
  status: VideoStatus,
  config: { type: 'fail' | 'image'; imagePath?: string },
  handleRetry: () => void,
  isLarge = false,
  videoFilter?: { filter: string; overlay: string }
) {
  return (
    <>
      {/* 加载中：旋转动效 */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1628]">
          <div className={`relative mb-3 ${isLarge ? 'w-20 h-20' : 'w-14 h-14'}`}>
            <div
              className="absolute inset-0 rounded-full border border-transparent"
              style={{
                borderTopColor: 'rgba(0,212,255,0.6)',
                borderRightColor: 'rgba(0,212,255,0.2)',
                animation: 'spin 2s linear infinite',
              }}
            />
            <div
              className="absolute inset-[5px] rounded-full border border-transparent"
              style={{
                borderTopColor: 'rgba(0,212,255,0.9)',
                borderLeftColor: 'rgba(0,212,255,0.3)',
                animation: 'spin 1.2s linear infinite reverse',
              }}
            />
            <div
              className="absolute inset-[10px] rounded-full border border-transparent"
              style={{
                borderTopColor: 'rgba(0,212,255,1)',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className={`text-cyan-400/70 ${isLarge ? 'w-6 h-6' : 'w-4 h-4'}`} />
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
          <p className={`text-cyan-400/60 tracking-widest ${isLarge ? 'text-sm' : 'text-[10px]'}`}>信号连接中...</p>
          <div className="flex gap-1 mt-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className={`rounded-full bg-cyan-400/50 ${isLarge ? 'w-2 h-2' : 'w-1 h-1'}`}
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
            <div className={`bg-red-900/30 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-2 ${isLarge ? 'w-16 h-16' : 'w-10 h-10'}`}>
              <AlertTriangle className={`text-red-400 ${isLarge ? 'w-8 h-8' : 'w-5 h-5'}`} />
            </div>
            <p className={`text-red-400 font-medium mb-0.5 ${isLarge ? 'text-base' : 'text-[11px]'}`}>视频信号丢失</p>
            <p className={`text-red-400/50 mb-2 ${isLarge ? 'text-sm' : 'text-[9px]'}`}>无法连接到摄像头</p>
            <button
              onClick={handleRetry}
              className={`flex items-center gap-1 bg-red-900/20 border border-red-500/30 rounded text-red-400/80 hover:bg-red-900/40 hover:text-red-300 transition-all duration-200 mx-auto ${isLarge ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-[10px]'}`}
            >
              <RefreshCw className={isLarge ? 'w-4 h-4' : 'w-2.5 h-2.5'} />
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
            className="w-full h-full object-cover transition-all duration-1000"
            style={videoFilter ? { filter: videoFilter.filter } : undefined}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* 天气/时间叠加色调层 */}
          {videoFilter?.overlay && (
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-1000"
              style={{ background: videoFilter.overlay }}
            />
          )}
          {/* 监控叠加层 */}
          <div className="absolute inset-0 pointer-events-none">
            {/* LIVE 角标 */}
            <div className={`absolute top-1.5 left-1.5 flex items-center gap-1`}>
              <div className={`rounded-full bg-green-400 animate-pulse ${isLarge ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'}`} />
              <span className={`text-green-400 font-mono ${isLarge ? 'text-xs' : 'text-[9px]'}`}>LIVE</span>
            </div>
            <div className={`absolute top-1.5 right-1.5 text-white/50 font-mono ${isLarge ? 'text-xs' : 'text-[9px]'}`}>
              {new Date().toLocaleTimeString('zh-CN', { hour12: false })}
            </div>
            {/* 底部信息栏 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
              <p className={`text-white/70 font-mono ${isLarge ? 'text-xs' : 'text-[9px]'}`}>CAM-01 库区大坝</p>
            </div>
            {/* 四角边框装饰 */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} border-cyan-400/50 ${i < 2 ? 'border-t' : 'border-b'} ${i % 2 === 0 ? 'border-l' : 'border-r'} ${isLarge ? 'w-5 h-5' : 'w-3 h-3'}`}
              />
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
    <>
      {/* 小窗：点击放大 */}
      <div
        className="bg-[#0f1d35] border border-accent/15 rounded-lg overflow-hidden aspect-video relative cursor-pointer group"
        onClick={() => setExpanded(true)}
        title="点击放大"
      >
        {renderVideoContent(status, config, handleRetry, false, videoFilter)}

        {/* 悬停时显示放大图标提示 */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/50 border border-cyan-400/30 rounded-full p-1.5 backdrop-blur-sm">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-300" />
          </div>
        </div>

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

      {/* 放大弹窗：Portal 渲染，覆盖全屏 */}
      {expanded && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={() => setExpanded(false)}
        >
          {/* 遮罩层 */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* 弹窗主体 */}
          <div
            className="relative z-10 w-[85vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 顶部标题栏 */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a1628] border border-cyan-500/30 border-b-0 rounded-t-lg">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-300 font-medium tracking-wide">
                  {reservoirName} — 视频监控
                </span>
                {status === 'success' && (
                  <div className="flex items-center gap-1 ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-green-400 font-mono">LIVE</span>
                  </div>
                )}
                {status === 'failed' && (
                  <span className="text-[10px] text-red-400/80 bg-red-900/20 border border-red-500/20 px-1.5 py-0.5 rounded font-mono ml-2">
                    信号丢失
                  </span>
                )}
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-7 h-7 flex items-center justify-center rounded text-cyan-400/60 hover:text-cyan-300 hover:bg-cyan-400/10 transition-all duration-200"
                title="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 视频内容区域 */}
            <div className="bg-[#0a1628] border border-cyan-500/30 border-t-0 rounded-b-lg overflow-hidden aspect-video relative">
              {renderVideoContent(status, config, handleRetry, true, videoFilter)}
            </div>

            {/* 底部提示 */}
            <p className="text-center text-[10px] text-cyan-400/30 mt-2 font-mono tracking-widest">
              点击空白区域或右上角 × 关闭
            </p>
          </div>
        </div>
      )}
    </>
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
          <span className="text-[9px] text-cyan-400/40 ml-auto font-mono">点击可放大</span>
        </div>
        <VideoMonitor reservoirId={reservoir.id} reservoirName={reservoir.name} />
      </div>

      {/* 责任人信息 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(0,212,255,0.5)]" />
          <span className="text-xs font-bold text-accent tracking-wide">责任人信息</span>
        </div>
        <div className="bg-[#0f1d35] border border-accent/15 rounded-lg p-3 space-y-2.5">
          {[
            { role: '行政责任人', name: reservoir.contacts.adminName, phone: reservoir.contacts.adminPhone, icon: Shield },
            { role: '技术责任人', name: reservoir.contacts.techName, phone: reservoir.contacts.techPhone, icon: Wrench },
            { role: '巡查责任人', name: reservoir.contacts.inspectionName, phone: reservoir.contacts.inspectionPhone, icon: Eye },
          ].map((person, i) => (
            <div key={i} className="pb-2.5 border-b border-accent/5 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 bg-accent/10 rounded flex items-center justify-center flex-shrink-0">
                  <person.icon className="w-3 h-3 text-accent/60" />
                </div>
                <span className="text-xs text-muted-foreground">{person.role}</span>
              </div>
              <div className="flex items-center justify-between gap-2 pl-1">
                <span className="text-sm text-cyan-300 font-medium">{person.name}</span>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-accent/40 flex-shrink-0" />
                  <span className="font-mono text-sm text-muted-foreground">{person.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
