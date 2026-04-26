# 宜川县水利工程运行管理平台 — 项目交付说明

## 项目概述

**项目名称：** 宜川县水利工程运行管理平台  
**项目版本：** v1.6.0  
**线上地址：** https://www.wisdomdance.cn/ycsl/  
**GitHub 仓库：** https://github.com/wisdom-wf/ycsl  
**最后更新：** 2026-04-26

---

## 项目特性

### 核心功能

1. **监测信息驾驶舱** — 三列布局，展示四座水库的实时监测数据
   - 左侧：水库选择、特征数据、监测指标、责任人、视频监控
   - 中部：宜川县地图 + 流动亮线特效
   - 右侧：降雨柱状图、水情折线图、渗透压力梯形图

2. **运维信息驾驶舱** — 运维统计和工单管理
   - 左侧：运维完成率、统计数据、问题处理统计
   - 中部：地图 + 顶部指标卡片
   - 右侧：水库运行列表、问题处理饼图、工单管理

3. **天气预警系统** — 实时天气 + 多级预警
   - 对接中国天气网 API（宜川县城市代码 101110304）
   - 四级预警等级：蓝色/黄色/橙色/红色
   - 24h 降水超过 20mm 或灾害性天气时触发预警

4. **视频监控模块** — 支持实景截图 + 失败状态
   - 刘庄、崖底水库：显示"视频信号丢失"
   - 钟楼寺、木头沟水库：显示实景监控截图
   - 点击可放大全屏查看

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 19.x |
| 类型系统 | TypeScript | 5.6.x |
| 样式 | Tailwind CSS | 4.x |
| 图表库 | Recharts | 2.x |
| 动画 | Framer Motion + CSS | 12.x |
| 构建工具 | Vite | 7.x |
| 包管理 | pnpm | 10.x |
| Web 服务器 | Nginx | 1.24.0 |
| 操作系统 | Ubuntu | 22.04 LTS |

---

## 项目结构

```
yichuan-water-management/
├── client/                          # 前端源码
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # ★ 主页面（标题、标签切换、预警逻辑）
│   │   │   ├── Home.tsx             # 入口页
│   │   │   └── NotFound.tsx         # 404 页
│   │   ├── components/
│   │   │   ├── MonitoringDashboard.tsx    # ★ 监测驾驶舱
│   │   │   ├── MaintenanceDashboard.tsx   # ★ 运维驾驶舱
│   │   │   ├── ReservoirInfo.tsx          # ★ 左侧面板
│   │   │   ├── MapVisualization.tsx       # ★ 中部地图
│   │   │   ├── MonitoringCharts.tsx       # ★ 右侧图表
│   │   │   ├── WorkOrderModal.tsx         # ★ 工单弹窗
│   │   │   └── ui/                        # shadcn/ui 组件库
│   │   ├── hooks/
│   │   │   ├── useWeather.ts        # ★ 天气数据 Hook
│   │   │   └── ...
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx     # 主题上下文
│   │   ├── App.tsx                  # 应用根组件
│   │   ├── main.tsx                 # React 入口
│   │   └── index.css                # 全局样式
│   ├── index.html                   # HTML 入口
│   └── public/                      # 静态资源（favicon 等）
├── shared/
│   └── const.ts                     # ★ 核心数据模型（水库、工单、统计）
├── server/
│   └── index.ts                     # Express 服务器
├── vite.config.ts                   # Vite 配置
├── tsconfig.json                    # TypeScript 配置
├── package.json                     # 依赖和脚本
├── README.md                        # 详细文档
├── CHANGELOG.md                     # 版本变更日志
└── DEPLOYMENT_GUIDE.md              # 本文档
```

> **★ 标注的文件**是最常需要维护的核心文件。

---

## 快速开始

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/wisdom-wf/ycsl.git
cd ycsl

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 打开浏览器
# http://localhost:3000
```

### 生产构建与部署

```bash
# 1. 修改 vite.config.ts，添加 base path
# export default defineConfig({
#   base: '/ycsl/',
#   ...
# });

# 2. 构建
pnpm build

# 3. 打包上传
cd dist/public && tar -czf /tmp/ycsl-dist.tar.gz .
sshpass -p 'PASSWORD' scp -o StrictHostKeyChecking=no \
  /tmp/ycsl-dist.tar.gz ubuntu@43.153.213.134:/tmp/

# 4. 服务器部署
ssh ubuntu@43.153.213.134
sudo cp -r /var/www/ycsl/video /tmp/video-backup
sudo rm -rf /var/www/ycsl/assets /var/www/ycsl/index.html
sudo tar -xzf /tmp/ycsl-dist.tar.gz -C /var/www/ycsl
sudo cp -r /tmp/video-backup/* /var/www/ycsl/video/
sudo chown -R www-data:www-data /var/www/ycsl

# 5. 还原 vite.config.ts（去掉 base 配置）
```

---

## 核心组件维护指南

### 1. Dashboard.tsx — 主页面

**职责：** 顶部导航、标签切换、天气显示、预警逻辑

**预警触发条件（修改此处调整阈值）：**
```typescript
const isAlert = weather.hasAlert || weather.rainfall24h > 20;
```

**预警等级映射：**
- `'none'` — 无预警
- `'blue'` — 一般（蓝色）
- `'yellow'` — 注意（黄色）
- `'orange'` — 警告（橙色）
- `'red'` — 严重（红色）

---

### 2. ReservoirInfo.tsx — 左侧面板

**视频监控配置：**
```typescript
const VIDEO_CONFIG = {
  r1: { type: 'fail' },   // 刘庄水库 → 失败状态
  r2: { type: 'image', imagePath: '/ycsl/video/mutougou.jpg' },
  r3: { type: 'image', imagePath: '/ycsl/video/zhonglousi.jpg' },
  r4: { type: 'fail' },   // 崖底水库 → 失败状态
};
```

**更换视频图片：**
1. 上传新图片到服务器 `/var/www/ycsl/video/` 目录
2. 修改上方 `imagePath` 对应的文件名
3. 重新构建并部署

---

### 3. MapVisualization.tsx — 中部地图

**地图图片 URL：**
```typescript
const MAP_IMAGE_URL = 'https://static.manus.space/...'; // CDN 地址
```

**流动亮线特效参数：**
- 4 个同心圆轨道
- 每个轨道 2 条亮线，以不同速度和方向流动
- 1px 宽度，带发光滤镜

---

### 4. MonitoringCharts.tsx — 右侧图表

**三个图表：**

**1. 近期降雨过程（柱状图）**
- 纵坐标固定 0–100mm
- 修改 `rainfallData` 数组更新数据

**2. 库水情监测（折线图）**
- 当前无数据，显示占位
- 修改 `waterLevelData` 数组接入真实数据

**3. 渗透压力监测（梯形剖面图）**
- SVG 手绘梯形大坝剖面
- 纵轴：高程（m）
- 横轴：轴距

---

### 5. useWeather.ts — 天气数据 Hook

**接口地址（通过 Nginx 代理）：**
```typescript
const SK_URL = 'https://www.wisdomdance.cn/weather-api/weatherinfo/?cityid=101110304&units=m';
const FORECAST_URL = 'https://www.wisdomdance.cn/weather-api/weather/forecast/?cityid=101110304';
```

**返回数据结构：**
```typescript
interface WeatherData {
  temperature: string;    // 温度，如 "18.6"
  weather: string;        // 天气状况，如 "多云"
  windDirection: string;  // 风向，如 "东南风"
  windSpeed: string;      // 风速，如 "2级"
  humidity: string;       // 湿度，如 "23%"
  rainfall24h: number;    // 24h 降水量（mm）
  aqi: string;            // AQI 空气质量指数
  hasAlert: boolean;      // 是否有灾害预警
  alertLevel: 'none' | 'blue' | 'yellow' | 'orange' | 'red';
}
```

**刷新频率：** 每 30 分钟自动刷新

---

### 6. shared/const.ts — 核心数据模型

**水库基础信息：**
```typescript
interface Reservoir {
  id: string;              // 'r1' | 'r2' | 'r3' | 'r4'
  name: string;            // 水库名称
  coordinates: [number, number]; // [经度, 纬度]
  contacts: {
    adminName: string;     // 行政责任人
    adminPhone: string;    // 电话
    techName: string;      // 技术责任人
    techPhone: string;
    inspectionName: string; // 巡查责任人
    inspectionPhone: string;
  };
}
```

**当前责任人信息：**

| 水库 | 行政责任人 | 技术责任人 | 巡查责任人 |
|------|-----------|-----------|-----------|
| 刘庄水库 | 王先永 18064311176 | 杨冬冬 13991799761 | 贺定义 13891158380 |
| 钟楼寺水库 | 禹罡 15991913033 | 王栓成 13891126568 | 范月发 18309114588 |
| 崖底水库 | 高思 18391160417 | 范贺东 18909112331 | 吴海燕 13038447727 |
| 木头沟水库 | 李晓妮 18991770099 | 王贝贝 15991561717 | 冯建伟 13891117327 |

---

## 服务器配置

### 基本信息

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

### Nginx 关键配置

```nginx
# 宜川水利平台
location /ycsl/ {
    alias /var/www/ycsl/;
    try_files $uri $uri/ /ycsl/index.html;
}

# 天气 API 反向代理
location /weather-api/ {
    proxy_pass http://d1.weather.com.cn/;
    proxy_set_header Referer http://www.weather.com.cn/;
    proxy_set_header Host d1.weather.com.cn;
    add_header Access-Control-Allow-Origin *;
}
```

---

## 常见问题

### Q1: 页面显示 404

**原因：** Nginx 的 `try_files` 配置不正确

**排查：**
```bash
sudo nginx -t
cat /etc/nginx/sites-enabled/wisdomdance.conf | grep -A5 "ycsl"
ls /var/www/ycsl/index.html
```

### Q2: 天气显示 "--"

**原因 1：** 本地开发环境未配置代理（正常）

**原因 2：** 生产环境 Nginx 代理失效

**排查：**
```bash
curl -s "https://www.wisdomdance.cn/weather-api/weatherinfo/?cityid=101110304&units=m"
sudo nginx -t && sudo nginx -s reload
```

### Q3: 视频监控图片不显示

**原因：** 图片文件不在服务器或文件名不匹配

**排查：**
```bash
ls -la /var/www/ycsl/video/
curl -sI https://www.wisdomdance.cn/ycsl/video/zhonglousi.jpg | head -3
```

### Q4: 部署后样式错乱

**原因：** 构建时未设置 `base: '/ycsl/'`

**解决：** 按照"生产构建与部署"章节的步骤，确保构建前在 `vite.config.ts` 中添加 `base: '/ycsl/'`

---

## 后续开发建议

### 高优先级

1. **真实传感器数据对接** — 将左侧水库特征数据对接真实传感器 API，替换 `shared/const.ts` 中的模拟数据
2. **实时视频流** — 将视频监控从静态截图升级为真实 RTSP 视频流，通过 FFmpeg 转码为 HLS 格式
3. **预警短信/微信通知** — 触发天气预警时，通过短信网关或企业微信 Webhook 推送告警消息

### 中优先级

4. **历史数据查询** — 添加时间范围选择器，支持查询各水库历史监测数据的趋势图
5. **数据导出功能** — 支持将监测数据和工单列表导出为 Excel/PDF 格式
6. **移动端适配** — 当前为大屏设计，增加响应式布局支持平板和手机端查看

### 低优先级

7. **用户登录鉴权** — 添加登录页面和 JWT 鉴权
8. **多语言支持** — 添加英文界面切换
9. **GIS 地图升级** — 将静态地图替换为高德地图/百度地图 SDK

---

## 版本历史

### v1.6.0（2026-04-16）

- 视频监控点击放大功能
- 图表警戒线（降雨、水位、渗压）
- 字号放大和排版优化
- 地图标注点漂移修复

### v1.5.0（2026-04-05）

- 视频监控模块上线
- 支持旋转加载动效和故障状态

### v1.4.0（2026-04-04）

- 天气预警系统
- 四级预警等级

### v1.3.0（2026-04-04）

- 实时天气接口对接
- Nginx 反向代理

### v1.2.0（2026-04-04）

- 地图与图表优化
- 沿同心圆轨迹流动的亮线特效

### v1.1.0（2026-04-04）

- 数据与展示调整
- 天气信息位置调整

### v1.0.0（2026-03-24）

- 初始版本发布

---

## 联系方式

- **项目负责人：** 饭饭老板（OPC 创始人）
- **GitHub 仓库：** https://github.com/wisdom-wf/ycsl
- **线上地址：** https://www.wisdomdance.cn/ycsl/

---

*项目由 Manus AI 辅助开发，数据均为本地模拟，仅供演示使用。*
