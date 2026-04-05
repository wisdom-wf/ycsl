# 宜川县水利工程运行管理平台

> **项目版本：** v1.5.0 | **最后更新：** 2026-04-05 | **线上地址：** https://www.wisdomdance.cn/ycsl/

宜川县水利工程运行管理平台是一套面向水利工程运行管理人员的数字化大屏系统，提供辖区内四座水库的实时监测数据可视化、运维管理统计、工单跟踪和天气预警等核心功能。系统采用纯前端架构，本地模拟数据，通过 Nginx 反向代理对接中国天气网实时天气接口。

---

## 目录

- [功能概览](#功能概览)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [核心组件说明](#核心组件说明)
- [数据模型](#数据模型)
- [本地开发环境搭建](#本地开发环境搭建)
- [生产构建与部署](#生产构建与部署)
- [服务器配置详情](#服务器配置详情)
- [天气接口说明](#天气接口说明)
- [视频监控资源管理](#视频监控资源管理)
- [水库责任人信息维护](#水库责任人信息维护)
- [常见问题与故障排查](#常见问题与故障排查)
- [后续开发建议](#后续开发建议)

---

## 功能概览

系统包含两个主要驾驶舱，通过顶部标签页切换：

### 监测信息驾驶舱

采用 **20% + 60% + 20%** 三列布局，从左到右依次为：

| 区域 | 内容 |
|------|------|
| 左侧面板 | 水库选择下拉框、水库特征数据（正常蓄水位/汛限水位/校核洪水位/总库容）、实时监测指标（24h降雨/水位/库容/入流/出流）、责任人信息（行政/技术/巡查）、视频监控区域 |
| 中部地图 | 宜川县地图图片、沿同心圆轨迹流动的亮线特效（与地图背景雷达圆环呼应）、四个水库名称标注 |
| 右侧图表 | 近期降雨过程（柱状图，纵坐标固定100mm）、库水情监测（折线图，暂无数据）、渗透压力监测（梯形大坝剖面图） |

### 运维信息驾驶舱

同样采用三列布局：

| 区域 | 内容 |
|------|------|
| 左侧面板 | 区县运维情况（圆形进度条）、运维综合统计（巡检/维修/清洁次数）、问题处理统计（已解决/处理中/待处理）、责任人信息 |
| 中部地图 | 顶部三个指标卡片（空置）、宜川县地图（与监测驾驶舱共用） |
| 右侧面板 | 区县水库运行信息列表、问题处理情况饼状图、库区水情监测、"查看工单"按钮 |

### 工单管理弹窗

点击运维驾驶舱右侧的"查看工单"按钮弹出，支持按状态筛选（全部/待处理/处理中/已完成），展示工单编号、类型、水库、描述、负责人、创建时间和状态。

### 天气预警系统

- 左上角实时显示宜川县天气（温度、天气状况、风向风速、湿度、24h降水、AQI）
- 当 24h 降水量超过 20mm 或出现灾害性天气时，标题区自动变色并触发呼吸灯动画
- 支持蓝色（一般）、黄色（注意）、橙色（警告）、红色（严重）四级预警

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.x |
| 类型系统 | TypeScript | 5.6.x |
| 路由 | Wouter | 3.x |
| 样式 | Tailwind CSS | 4.x |
| UI 组件库 | shadcn/ui + Radix UI | 最新 |
| 图表库 | Recharts | 2.x |
| 动画 | Framer Motion + CSS Animation | 12.x |
| 构建工具 | Vite | 7.x |
| 包管理器 | pnpm | 10.x |
| Web 服务器 | Nginx | 1.24.0 |
| 操作系统 | Ubuntu 22.04 | — |
| 天气数据 | 中国天气网 API | — |

---

## 项目结构

```
yichuan-water-management/
├── client/                          # 前端源码目录
│   ├── index.html                   # HTML 入口，引入字体和分析脚本
│   ├── public/                      # 静态资源（favicon 等）
│   └── src/
│       ├── App.tsx                  # 应用根组件，配置路由和主题
│       ├── main.tsx                 # React 入口文件
│       ├── index.css                # 全局样式，Tailwind 主题变量
│       ├── const.ts                 # 前端常量（如有）
│       ├── pages/
│       │   ├── Dashboard.tsx        # ★ 主页面：顶部导航、标签切换、天气显示、预警逻辑
│       │   ├── Home.tsx             # 入口页（重定向到 Dashboard）
│       │   └── NotFound.tsx         # 404 页面
│       ├── components/
│       │   ├── MonitoringDashboard.tsx  # ★ 监测信息驾驶舱（三列布局容器）
│       │   ├── MaintenanceDashboard.tsx # ★ 运维信息驾驶舱（三列布局容器）
│       │   ├── ReservoirInfo.tsx        # ★ 左侧面板：水库选择、数据、责任人、视频监控
│       │   ├── MapVisualization.tsx     # ★ 中部地图：图片 + 流动亮线特效
│       │   ├── MonitoringCharts.tsx     # ★ 右侧图表：降雨柱状图、水情折线图、渗透压力图
│       │   ├── WorkOrderModal.tsx       # ★ 工单管理弹窗
│       │   ├── WorkOrderList.tsx        # 工单列表组件（被 WorkOrderModal 使用）
│       │   ├── Map.tsx                  # Google Maps 集成（备用，当前未使用）
│       │   ├── ManusDialog.tsx          # 通用对话框组件
│       │   ├── ErrorBoundary.tsx        # React 错误边界
│       │   └── ui/                      # shadcn/ui 基础组件（button、card、dialog 等）
│       ├── hooks/
│       │   ├── useWeather.ts        # ★ 天气数据获取 Hook（对接中国天气网 API）
│       │   ├── useMobile.tsx        # 移动端检测 Hook
│       │   ├── useComposition.ts    # 输入法组合状态 Hook
│       │   └── usePersistFn.ts      # 持久化函数引用 Hook
│       ├── contexts/
│       │   └── ThemeContext.tsx     # 主题上下文（深色主题）
│       └── lib/
│           └── utils.ts             # 工具函数（cn 类名合并等）
├── shared/
│   └── const.ts                     # ★ 核心数据模型和模拟数据（水库、工单、运维统计）
├── server/
│   └── index.ts                     # Express 服务器（生产环境静态文件服务）
├── vite.config.ts                   # Vite 构建配置
├── tailwind.config.ts               # Tailwind 配置（如有）
├── tsconfig.json                    # TypeScript 配置
├── package.json                     # 依赖和脚本
├── CHANGELOG.md                     # 版本变更日志
└── README.md                        # 本文档
```

> **★ 标注的文件**是最常需要维护和修改的核心文件。

---

## 核心组件说明

### `Dashboard.tsx` — 主页面

这是整个应用的外层容器，负责以下职责：

- **顶部导航栏**：显示系统标题（居中）、左上角天气信息、右上角实时时钟
- **标签切换**：通过 `activeTab` state 控制显示监测信息或运维信息驾驶舱
- **天气预警逻辑**：调用 `useWeather` Hook，根据 `hasAlert` 和 `rainfall24h` 字段决定是否触发预警样式
- **预警样式**：通过 `alertLevel`（`'none' | 'blue' | 'yellow' | 'orange' | 'red'`）动态切换标题区背景色和呼吸灯动画

**预警触发条件（修改此处调整阈值）：**
```typescript
// Dashboard.tsx 中的预警判断逻辑
const isAlert = weather.hasAlert || weather.rainfall24h > 20;
```

---

### `ReservoirInfo.tsx` — 左侧面板

接收 `selectedReservoir`（当前选中水库 ID）和 `onReservoirChange`（切换回调）两个 Props。

**视频监控逻辑：**

```typescript
// 视频监控配置（在组件顶部的 VIDEO_CONFIG 对象中）
const VIDEO_CONFIG = {
  r1: { type: 'fail' },   // 刘庄水库 → 3秒后显示失败
  r2: { type: 'image', imagePath: '/ycsl/video/mutougou.jpg' },   // 木头沟水库
  r3: { type: 'image', imagePath: '/ycsl/video/zhonglousi.jpg' }, // 钟楼寺水库
  r4: { type: 'fail' },   // 崖底水库 → 3秒后显示失败
};
```

**如需更换视频图片：** 将新图片上传到服务器 `/var/www/ycsl/video/` 目录，修改上方 `imagePath` 对应的文件名即可。

---

### `MapVisualization.tsx` — 中部地图

地图图片文件存储在服务器 `/var/www/ycsl/video/` 目录，通过 CDN URL 引用：

```typescript
// 地图图片 URL（当前使用 CDN 地址）
const MAP_IMAGE_URL = 'https://static.manus.space/...'; // 宜川县地图
```

**流动亮线特效**通过 SVG + CSS Animation 实现，4 个同心圆轨道，每个轨道有 2 条亮线以不同速度和方向流动。如需调整效果，修改 `MapVisualization.tsx` 中的 `animationDuration` 和 `strokeOpacity` 参数。

---

### `MonitoringCharts.tsx` — 右侧图表

包含三个图表，从上到下依次为：

**1. 近期降雨过程（柱状图）**
- 使用 Recharts `BarChart` 实现
- 纵坐标固定为 0–100mm（`domain={[0, 100]}`）
- 模拟数据为零星降雨，不超过 1mm
- 如需修改数据，编辑组件内的 `rainfallData` 数组

**2. 库水情监测（折线图）**
- 使用 Recharts `LineChart` 实现
- 当前无数据，显示"暂无数据"占位
- 如需接入真实数据，将数据赋值给 `waterLevelData` 数组

**3. 渗透压力监测（梯形剖面图）**
- 使用 SVG 手绘梯形大坝剖面，包含中轴线虚线、JRX01/JRX02 测点标记
- 纵轴为高程（m），横轴为轴距
- 参考设计图：图中大坝顶部高程约 1120m，底部约 1097m

---

### `useWeather.ts` — 天气数据 Hook

```typescript
// 接口调用路径（通过 Nginx 代理）
const SK_URL = 'https://www.wisdomdance.cn/weather-api/weatherinfo/?cityid=101110304&units=m';
const FORECAST_URL = 'https://www.wisdomdance.cn/weather-api/weather/forecast/?cityid=101110304';

// 返回的数据结构
interface WeatherData {
  temperature: string;    // 温度，如 "18.6"
  weather: string;        // 天气状况，如 "多云"
  windDirection: string;  // 风向，如 "东南风"
  windSpeed: string;      // 风速，如 "2级"
  humidity: string;       // 湿度，如 "23%"
  rainfall24h: number;    // 24h 降水量（mm），用于预警判断
  aqi: string;            // AQI 空气质量指数
  hasAlert: boolean;      // 是否有灾害预警
  alertText: string;      // 预警内容描述
  alertLevel: 'none' | 'blue' | 'yellow' | 'orange' | 'red';
}
```

天气数据每 **30 分钟**自动刷新一次（`setInterval` 30 × 60 × 1000 ms）。

---

### `shared/const.ts` — 核心数据模型

这是最重要的数据文件，包含所有水库的模拟数据。**修改水库信息、责任人、监测数据等都在此文件中操作。**

---

## 数据模型

### 水库基础信息（`Reservoir`）

```typescript
interface Reservoir {
  id: string;              // 水库唯一标识：'r1' | 'r2' | 'r3' | 'r4'
  name: string;            // 水库名称
  coordinates: [number, number]; // [经度, 纬度]
  contacts: {
    adminName: string;     // 行政责任人姓名
    adminPhone: string;    // 行政责任人电话
    techName: string;      // 技术责任人姓名
    techPhone: string;     // 技术责任人电话
    inspectionName: string; // 巡查责任人姓名
    inspectionPhone: string; // 巡查责任人电话
  };
}
```

### 水库实时监测数据（`ReservoirData`）

```typescript
interface ReservoirData {
  reservoirId: string;       // 对应水库 ID
  rainfall24h: number;       // 24h 降雨量（mm）
  waterLevel: number;        // 当前水位（m）
  storageVolume: number;     // 当前库容（万m³）
  inflow: number;            // 入库流量（m³/s）
  outflow: number;           // 出库流量（m³/s）
  normalWaterLevel: number;  // 正常蓄水位（m）
  floodWaterLevel: number;   // 汛限水位（m）
  checkFloodLevel: number;   // 校核洪水位（m）
  totalCapacity: number;     // 总库容（万m³）
  timestamp: string;         // 数据时间戳
}
```

### 工单（`WorkOrder`）

```typescript
interface WorkOrder {
  id: string;
  reservoirId: string;
  type: 'inspection' | 'maintenance' | 'cleaning' | 'safety'; // 巡检/维修/清洁/安全
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  planTime: string;          // 计划时间
  actualTime?: string;       // 实际完成时间
  executor: string;          // 执行人
  description: string;       // 工单描述
  location: string;          // 作业位置
}
```

### 运维统计（`MaintenanceStats`）

```typescript
interface MaintenanceStats {
  reservoirId: string;
  inspectionCount: number;       // 巡检次数
  maintenanceCount: number;      // 维修次数
  cleaningCount: number;         // 清洁次数
  completionRate: number;        // 完成率（0–100）
  issueCount: number;            // 问题总数
  issueResolutionRate: number;   // 问题解决率（0–100）
}
```

---

## 本地开发环境搭建

### 前置要求

- **Node.js** >= 18.x（推荐 22.x）
- **pnpm** >= 10.x（`npm install -g pnpm`）
- **Git**

### 克隆与安装

```bash
# 克隆仓库
git clone https://github.com/wisdom-wf/ycsl.git
cd ycsl

# 安装依赖
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

开发服务器默认运行在 `http://localhost:3000`。

> **注意：** 本地开发时天气数据会显示 "--"，因为 `/weather-api/` 代理只配置在生产服务器上。如需本地调试天气功能，可在 `vite.config.ts` 中添加代理配置（见下方"常见问题"章节）。

### 代码检查

```bash
# TypeScript 类型检查
npx tsc --noEmit

# 代码格式化
pnpm format
```

---

## 生产构建与部署

### 第一步：修改 vite.config.ts 添加 base path

```typescript
// vite.config.ts
export default defineConfig({
  base: '/ycsl/',  // ← 添加此行
  plugins,
  // ...
});
```

### 第二步：构建

```bash
pnpm build
```

构建产物输出到 `dist/public/` 目录。

### 第三步：打包上传

```bash
# 打包构建产物
cd dist/public && tar -czf /tmp/ycsl-dist.tar.gz .

# 上传到服务器（需要 sshpass）
sshpass -p 'YOUR_PASSWORD' scp -o StrictHostKeyChecking=no \
  /tmp/ycsl-dist.tar.gz ubuntu@43.153.213.134:/tmp/ycsl-dist.tar.gz
```

### 第四步：服务器部署

```bash
# SSH 登录服务器
ssh ubuntu@43.153.213.134

# 备份旧版本（可选但推荐）
sudo cp -r /var/www/ycsl /var/www/ycsl-backup-$(date +%Y%m%d)

# ⚠️ 重要：保留 video 目录（视频监控图片）
sudo mkdir -p /tmp/ycsl-video-backup
sudo cp /var/www/ycsl/video/* /tmp/ycsl-video-backup/ 2>/dev/null || true

# 清空旧文件（不删除 video 目录）
sudo find /var/www/ycsl -maxdepth 1 -not -name 'video' -not -path '/var/www/ycsl' -exec rm -rf {} +

# 解压新版本
sudo tar -xzf /tmp/ycsl-dist.tar.gz -C /var/www/ycsl

# 恢复 video 目录
sudo mkdir -p /var/www/ycsl/video
sudo cp /tmp/ycsl-video-backup/* /var/www/ycsl/video/ 2>/dev/null || true

# 修正文件权限
sudo chown -R www-data:www-data /var/www/ycsl
```

### 第五步：还原 vite.config.ts

```typescript
// vite.config.ts — 还原，去掉 base 配置
export default defineConfig({
  // base: '/ycsl/',  // ← 注释掉或删除
  plugins,
  // ...
});
```

> **为什么要还原？** `base: '/ycsl/'` 会影响本地开发时的资源路径，导致开发环境无法正常访问。

---

## 服务器配置详情

### 服务器基本信息

| 项目 | 值 |
|------|-----|
| 服务器 IP | 43.153.213.134 |
| 操作系统 | Ubuntu 22.04 LTS |
| SSH 用户 | ubuntu |
| Web 服务器 | Nginx 1.24.0 |
| SSL 证书 | Let's Encrypt（自动续期） |
| 域名 | wisdomdance.cn / www.wisdomdance.cn |

### 网站文件目录

| 路径 | 说明 |
|------|------|
| `/var/www/ycsl/` | 宜川水利平台前端文件 |
| `/var/www/ycsl/video/` | 视频监控截图（**部署时勿覆盖**） |
| `/var/www/wisdomdance/dist/` | 主站前端文件 |
| `/var/www/dingfeng-data/` | 丁峰数据大屏 |
| `/var/www/jctx/` | 其他项目 |

### Nginx 关键配置（`/etc/nginx/sites-enabled/wisdomdance.conf`）

```nginx
# 宜川水利平台
location /ycsl/ {
    alias /var/www/ycsl/;
    try_files $uri $uri/ /ycsl/index.html;
}

# 天气 API 反向代理（解决跨域）
location /weather-api/ {
    proxy_pass http://d1.weather.com.cn/;
    proxy_set_header Referer http://www.weather.com.cn/;
    proxy_set_header Host d1.weather.com.cn;
    add_header Access-Control-Allow-Origin *;
}
```

### 修改 Nginx 配置后重载

```bash
# 测试配置语法
sudo nginx -t

# 重载配置（不中断服务）
sudo nginx -s reload
```

### SSL 证书续期

Let's Encrypt 证书有效期 90 天，已配置 certbot 自动续期。手动续期命令：

```bash
sudo certbot renew --nginx
```

---

## 天气接口说明

### 接口信息

| 项目 | 值 |
|------|-----|
| 数据来源 | 中国天气网（weather.com.cn） |
| 宜川县城市代码 | **101110304** |
| 实况接口 | `http://d1.weather.com.cn/weatherinfo/?cityid=101110304&units=m` |
| 预报接口 | `http://d1.weather.com.cn/weather/forecast/?cityid=101110304` |
| 代理路径 | `https://www.wisdomdance.cn/weather-api/` |
| 刷新频率 | 每 30 分钟 |

### 接口返回数据示例

```json
{
  "weatherinfo": {
    "city": "宜川",
    "temp": "18.6",
    "WD": "东南风",
    "WS": "2级",
    "SD": "23%",
    "weather": "多云",
    "time": "14:00"
  }
}
```

### 本地开发时调试天气接口

在 `vite.config.ts` 中添加代理：

```typescript
server: {
  proxy: {
    '/weather-api': {
      target: 'http://d1.weather.com.cn',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/weather-api/, ''),
      headers: {
        Referer: 'http://www.weather.com.cn/',
        Host: 'd1.weather.com.cn',
      },
    },
  },
},
```

---

## 视频监控资源管理

### 当前配置

| 水库 | 行为 | 图片路径 |
|------|------|----------|
| 刘庄水库（r1） | 3秒后显示"视频信号丢失" | — |
| 木头沟水库（r2） | 3秒后显示图片 | `/ycsl/video/mutougou.jpg` |
| 钟楼寺水库（r3） | 3秒后显示图片 | `/ycsl/video/zhonglousi.jpg` |
| 崖底水库（r4） | 3秒后显示"视频信号丢失" | — |

### 更换监控截图

1. 将新图片上传到服务器 `/var/www/ycsl/video/` 目录
2. 修改 `client/src/components/ReservoirInfo.tsx` 中的 `VIDEO_CONFIG` 对象对应的 `imagePath`
3. 重新构建并部署

### 将"失败"改为"显示图片"

修改 `ReservoirInfo.tsx` 中的 `VIDEO_CONFIG`：

```typescript
// 将 r1（刘庄水库）从失败改为显示图片
const VIDEO_CONFIG = {
  r1: { type: 'image', imagePath: '/ycsl/video/liuzhuang.jpg' }, // ← 修改此处
  // ...
};
```

---

## 水库责任人信息维护

所有责任人信息存储在 `shared/const.ts` 的 `RESERVOIRS` 数组中。修改步骤：

1. 打开 `shared/const.ts`
2. 找到对应水库的 `contacts` 对象
3. 修改姓名和电话
4. 重新构建并部署

**当前责任人信息：**

| 水库 | 行政责任人 | 技术责任人 | 巡查责任人 |
|------|-----------|-----------|-----------|
| 刘庄水库 | 王先永 18064311176 | 杨冬冬 13991799761 | 贺定义 13891158380 |
| 钟楼寺水库 | 禹罡 15991913033 | 王栓成 13891126568 | 范月发 18309114588 |
| 崖底水库 | 高思 18391160417 | 范贺东 18909112331 | 吴海燕 13038447727 |
| 木头沟水库 | 李晓妮 18991770099 | 王贝贝 15991561717 | 冯建伟 13891117327 |

---

## 常见问题与故障排查

### 问题 1：页面显示 404

**原因：** Nginx 的 `try_files` 配置不正确，或前端路由 base path 与 Nginx alias 不匹配。

**排查步骤：**
```bash
# 检查 Nginx 配置
sudo nginx -t
cat /etc/nginx/sites-enabled/wisdomdance.conf | grep -A5 "ycsl"

# 检查文件是否存在
ls /var/www/ycsl/index.html
```

---

### 问题 2：天气显示 "--"

**原因 1：** 本地开发环境未配置代理，属于正常现象。

**原因 2：** 生产环境 Nginx 天气代理失效。

**排查步骤：**
```bash
# 直接测试代理
curl -s "https://www.wisdomdance.cn/weather-api/weatherinfo/?cityid=101110304&units=m"

# 如果返回空或错误，检查 Nginx 配置
sudo nginx -t && sudo nginx -s reload
```

---

### 问题 3：视频监控图片不显示

**原因：** 图片文件不在服务器 `/var/www/ycsl/video/` 目录，或文件名不匹配。

**排查步骤：**
```bash
# 检查图片文件
ls -la /var/www/ycsl/video/

# 测试图片是否可访问
curl -sI https://www.wisdomdance.cn/ycsl/video/zhonglousi.jpg | head -3
curl -sI https://www.wisdomdance.cn/ycsl/video/mutougou.jpg | head -3
```

---

### 问题 4：图表变形（高度为 0）

**原因：** Recharts `ResponsiveContainer` 的父容器高度为 0，通常发生在 flex 布局中。

**解决方案：** 确保图表容器有明确的高度，例如 `style={{ height: '200px' }}` 或 `className="h-48"`，而非仅使用 `flex-1`。

---

### 问题 5：部署后样式错乱

**原因：** 构建时未设置 `base: '/ycsl/'`，导致静态资源路径错误。

**解决方案：** 按照"生产构建与部署"章节的步骤，确保构建前在 `vite.config.ts` 中添加 `base: '/ycsl/'`。

---

### 问题 6：SSH 连接被拒绝

**原因：** 服务器防火墙或安全组限制了 SSH 端口（22）。

**解决方案：** 登录腾讯云控制台，检查安全组入站规则，确保 TCP 22 端口对外开放。

---

## 后续开发建议

以下功能为本期未实现的扩展方向，按优先级排列：

**高优先级**

1. **真实传感器数据对接** — 将左侧水库特征数据（水位、库容、流量等）对接真实传感器 API，替换 `shared/const.ts` 中的模拟数据，建议使用 `useEffect` + `setInterval` 实现定时轮询
2. **实时视频流** — 将视频监控区域从静态截图升级为真实 RTSP 视频流，通过 FFmpeg 转码为 HLS 格式后嵌入 `<video>` 标签
3. **预警短信/微信通知** — 当触发天气预警时，通过短信网关或企业微信 Webhook 向责任人推送告警消息

**中优先级**

4. **历史数据查询** — 添加时间范围选择器，支持查询各水库历史水位、降雨量等监测数据的趋势图
5. **数据导出功能** — 支持将监测数据和工单列表导出为 Excel/PDF 格式
6. **移动端适配** — 当前为大屏设计（1920×1080 最佳），增加响应式布局支持平板和手机端查看

**低优先级**

7. **用户登录鉴权** — 添加登录页面和 JWT 鉴权，防止未授权访问
8. **多语言支持** — 添加英文界面切换
9. **GIS 地图升级** — 将中部静态地图图片替换为高德地图/百度地图 SDK，支持真实地理坐标定位和点击交互

---

## GitHub 仓库

- **仓库地址：** https://github.com/wisdom-wf/ycsl
- **主分支：** `main`
- **提交规范：** 使用 `feat:` / `fix:` / `docs:` / `chore:` 前缀

---

*文档由 Manus AI 辅助编写，如有疑问请联系项目负责人。*
