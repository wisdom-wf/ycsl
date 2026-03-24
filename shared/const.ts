export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// 水库信息
export interface Reservoir {
  id: string;
  name: string;
  image?: string;
  coordinates: [number, number]; // [lng, lat]
  contacts: {
    adminName: string;
    adminPhone: string;
    techName: string;
    techPhone: string;
    inspectionName: string;
    inspectionPhone: string;
  };
}

// 水库实时数据
export interface ReservoirData {
  reservoirId: string;
  rainfall24h: number; // mm
  waterLevel: number; // m
  storageVolume: number; // 万m³
  inflow: number; // m³/s
  outflow: number; // m³/s
  normalWaterLevel: number; // 正常蓄水位
  floodWaterLevel: number; // 汛限水位
  checkFloodLevel: number; // 校核洪水位
  totalCapacity: number; // 总库容
  timestamp: string;
}

// 监测数据点
export interface MonitoringPoint {
  id: string;
  name: string;
  type: 'rainfall' | 'water_level' | 'seepage' | 'dam';
  coordinates: [number, number];
  value: number;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
}

// 工单信息
export interface WorkOrder {
  id: string;
  reservoirId: string;
  type: 'inspection' | 'maintenance' | 'cleaning' | 'safety';
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  planTime: string;
  actualTime?: string;
  executor: string;
  description: string;
  location: string;
  images?: string[];
  coordinates?: [number, number];
}

// 运维统计数据
export interface MaintenanceStats {
  reservoirId: string;
  inspectionCount: number;
  maintenanceCount: number;
  cleaningCount: number;
  completionRate: number;
  issueCount: number;
  issueResolutionRate: number;
}

// 模拟数据
export const RESERVOIRS: Reservoir[] = [
  {
    id: 'r1',
    name: '刘庄水库',
    coordinates: [109.5, 36.5],
    contacts: {
      adminName: '王先永',
      adminPhone: '18064311176',
      techName: '杨冬冬',
      techPhone: '13991799761',
      inspectionName: '贺定义',
      inspectionPhone: '13891158380',
    },
  },
  {
    id: 'r2',
    name: '木头沟水库',
    coordinates: [109.6, 36.4],
    contacts: {
      adminName: '李晓妮',
      adminPhone: '18991770099',
      techName: '王贝贝',
      techPhone: '15991561717',
      inspectionName: '冯建伟',
      inspectionPhone: '13891117327',
    },
  },
  {
    id: 'r3',
    name: '钟楼寺水库',
    coordinates: [109.7, 36.3],
    contacts: {
      adminName: '禹罡',
      adminPhone: '15991913033',
      techName: '王栓成',
      techPhone: '13891126568',
      inspectionName: '范月发',
      inspectionPhone: '18309114588',
    },
  },
  {
    id: 'r4',
    name: '崖底水库',
    coordinates: [109.4, 36.6],
    contacts: {
      adminName: '高思',
      adminPhone: '18391160417',
      techName: '范贺东',
      techPhone: '18909112331',
      inspectionName: '吴海燕',
      inspectionPhone: '13038447727',
    },
  },
];

export const RESERVOIR_DATA: Record<string, ReservoirData> = {
  r1: {
    reservoirId: 'r1',
    rainfall24h: 0.5,
    waterLevel: 45.2,
    storageVolume: 850,
    inflow: 0.8,
    outflow: 0.6,
    normalWaterLevel: 50,
    floodWaterLevel: 52,
    checkFloodLevel: 55,
    totalCapacity: 1200,
    timestamp: new Date().toISOString(),
  },
  r2: {
    reservoirId: 'r2',
    rainfall24h: 1.2,
    waterLevel: 48.5,
    storageVolume: 920,
    inflow: 1.2,
    outflow: 0.9,
    normalWaterLevel: 52,
    floodWaterLevel: 54,
    checkFloodLevel: 57,
    totalCapacity: 1500,
    timestamp: new Date().toISOString(),
  },
  r3: {
    reservoirId: 'r3',
    rainfall24h: 0.8,
    waterLevel: 42.1,
    storageVolume: 680,
    inflow: 0.5,
    outflow: 0.4,
    normalWaterLevel: 45,
    floodWaterLevel: 47,
    checkFloodLevel: 50,
    totalCapacity: 900,
    timestamp: new Date().toISOString(),
  },
  r4: {
    reservoirId: 'r4',
    rainfall24h: 1.8,
    waterLevel: 51.3,
    storageVolume: 1050,
    inflow: 1.5,
    outflow: 1.2,
    normalWaterLevel: 54,
    floodWaterLevel: 56,
    checkFloodLevel: 59,
    totalCapacity: 1800,
    timestamp: new Date().toISOString(),
  },
};

export const MONITORING_POINTS: MonitoringPoint[] = [
  {
    id: 'mp1',
    name: '刘庄水库',
    type: 'water_level',
    coordinates: [109.5, 36.5],
    value: 45.2,
    unit: 'm',
    status: 'normal',
  },
  {
    id: 'mp2',
    name: '木头沟水库',
    type: 'water_level',
    coordinates: [109.6, 36.4],
    value: 48.5,
    unit: 'm',
    status: 'normal',
  },
  {
    id: 'mp3',
    name: '钟楼寺水库',
    type: 'water_level',
    coordinates: [109.7, 36.3],
    value: 42.1,
    unit: 'm',
    status: 'normal',
  },
  {
    id: 'mp4',
    name: '崖底水库',
    type: 'water_level',
    coordinates: [109.4, 36.6],
    value: 51.3,
    unit: 'm',
    status: 'warning',
  },
];

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo1',
    reservoirId: 'r1',
    type: 'inspection',
    title: '刘庄水库日常巡检',
    status: 'completed',
    planTime: '2026-03-24 08:00',
    actualTime: '2026-03-24 09:30',
    executor: '张巡查',
    description: '进行日常巡查，检查大坝表面、溢洪道等设施',
    location: '刘庄水库大坝',
    coordinates: [109.5, 36.5],
  },
  {
    id: 'wo2',
    reservoirId: 'r2',
    type: 'maintenance',
    title: '木头沟水库闸门维修',
    status: 'in_progress',
    planTime: '2026-03-24 10:00',
    executor: '王工程',
    description: '检修闸门启闭机，润滑轴承',
    location: '木头沟水库闸门',
    coordinates: [109.6, 36.4],
  },
  {
    id: 'wo3',
    reservoirId: 'r3',
    type: 'cleaning',
    title: '钟楼寺水库库区清洁',
    status: 'pending',
    planTime: '2026-03-25 08:00',
    executor: '陈检查',
    description: '清理库区漂浮物和垃圾',
    location: '钟楼寺水库库区',
    coordinates: [109.7, 36.3],
  },
  {
    id: 'wo4',
    reservoirId: 'r4',
    type: 'safety',
    title: '崖底水库安全隐患排查',
    status: 'in_progress',
    planTime: '2026-03-24 14:00',
    executor: '郭检查',
    description: '排查大坝裂缝、渗漏等安全隐患',
    location: '崖底水库全区',
    coordinates: [109.4, 36.6],
  },
];

export const MAINTENANCE_STATS: Record<string, MaintenanceStats> = {
  r1: {
    reservoirId: 'r1',
    inspectionCount: 28,
    maintenanceCount: 5,
    cleaningCount: 12,
    completionRate: 100,
    issueCount: 0,
    issueResolutionRate: 100,
  },
  r2: {
    reservoirId: 'r2',
    inspectionCount: 32,
    maintenanceCount: 8,
    cleaningCount: 15,
    completionRate: 100,
    issueCount: 0,
    issueResolutionRate: 100,
  },
  r3: {
    reservoirId: 'r3',
    inspectionCount: 24,
    maintenanceCount: 4,
    cleaningCount: 10,
    completionRate: 100,
    issueCount: 0,
    issueResolutionRate: 100,
  },
  r4: {
    reservoirId: 'r4',
    inspectionCount: 30,
    maintenanceCount: 6,
    cleaningCount: 14,
    completionRate: 100,
    issueCount: 0,
    issueResolutionRate: 100,
  },
};
