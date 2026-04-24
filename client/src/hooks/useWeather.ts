import { useState, useEffect } from 'react';

// 天气图标映射
const weatherIconMap: Record<string, string> = {
  '00': '☀️', 'd00': '☀️', 'n00': '🌙',  // 晴
  '01': '⛅', 'd01': '⛅', 'n01': '☁️',  // 多云
  '02': '☁️', 'd02': '☁️', 'n02': '☁️',  // 阴
  '03': '🌧️', 'd03': '🌧️', 'n03': '🌧️', // 阵雨
  '04': '⛈️', 'd04': '⛈️', 'n04': '⛈️', // 雷阵雨
  '07': '🌦️', 'd07': '🌦️', 'n07': '🌦️', // 小雨
  '08': '🌧️', 'd08': '🌧️', 'n08': '🌧️', // 中雨
  '09': '🌧️', 'd09': '🌧️', 'n09': '🌧️', // 大雨
  '10': '🌧️', 'd10': '🌧️', 'n10': '🌧️', // 暴雨
  '13': '🌨️', 'd13': '🌨️', 'n13': '🌨️', // 阵雪
  '14': '🌨️', 'd14': '🌨️', 'n14': '🌨️', // 小雪
  '15': '🌨️', 'd15': '🌨️', 'n15': '🌨️', // 中雪
  '16': '🌨️', 'd16': '🌨️', 'n16': '🌨️', // 大雪
  '17': '🌨️', 'd17': '🌨️', 'n17': '🌨️', // 暴雪
  '18': '🌫️', 'd18': '🌫️', 'n18': '🌫️', // 雾
  '19': '🌧️', 'd19': '🌧️', 'n19': '🌧️', // 冻雨
  '20': '🌪️', 'd20': '🌪️', 'n20': '🌪️', // 沙尘暴
  '53': '🌫️', 'd53': '🌫️', 'n53': '🌫️', // 霾
};

export interface HourlyRainItem {
  hour: string;      // '00', '02', '04' ... '22'
  rain: number;      // 该时段降雨量(mm)，预报值
  cumulative: number; // 当天累计降雨量(mm)
}

export interface WeatherData {
  cityName: string;
  temp: string;
  weather: string;
  weatherIcon: string;
  windDirection: string;
  windSpeed: string;
  humidity: string;
  rain24h: string;
  aqi: string;
  // 预报数据
  forecastHigh: string;
  forecastLow: string;
  // 降水概率
  rainProbability: string;
  // 逐小时降雨（当天0-24时，每2小时一格，共12格）
  hourlyRain: HourlyRainItem[];
  // 预警信息
  hasAlert: boolean;
  alertText: string;
  alertLevel: string; // '红色' | '橙色' | '黄色' | '蓝色' | ''
}

// 生成空的12格逐小时数据
function emptyHourlyRain(): HourlyRainItem[] {
  return Array.from({ length: 12 }, (_, i) => ({
    hour: String(i * 2).padStart(2, '0'),
    rain: 0,
    cumulative: 0,
  }));
}

// 解析 hour3data["1d"] 生成当天0-24时每2小时累计降雨数据
function parseHourlyRain(text: string): HourlyRainItem[] {
  const slots = emptyHourlyRain();
  try {
    // 匹配 var hour3data={...}; 注意内容可能跨行
    const match = text.match(/var\s+hour3data\s*=\s*(\{[\s\S]*?\});/);
    if (!match) return slots;
    const data = JSON.parse(match[1]);
    const today: string[] = data['1d'];
    if (!Array.isArray(today)) return slots;

    // 获取今天的日期（日），用于过滤跨天数据
    const now = new Date();
    const todayDay = now.getDate();

    today.forEach((item: string) => {
      const parts = item.split(',');
      if (parts.length < 7) return;
      // 格式: "23日11时,d01,多云,20℃,东南风,<3级,2"
      const dayMatch = parts[0].match(/(\d+)日(\d+)时/);
      if (!dayMatch) return;
      const day = parseInt(dayMatch[1], 10);
      const hour = parseInt(dayMatch[2], 10);
      // 只取今天的数据
      if (day !== todayDay) return;
      const rainVal = parseFloat(parts[6]) || 0;
      // 向下取整到偶数小时槽
      const slotIdx = Math.floor(hour / 2);
      if (slotIdx >= 0 && slotIdx < 12) {
        slots[slotIdx].rain += rainVal;
      }
    });

    // 计算累计值
    let cum = 0;
    slots.forEach(s => {
      cum += s.rain;
      s.cumulative = parseFloat(cum.toFixed(2));
      s.rain = parseFloat(s.rain.toFixed(2));
    });
  } catch {}
  return slots;
}

// 判断是否需要预警（降水量>20mm 或有灾害预警天气）
function checkAlert(rain24h: string, weatherCode: string): { hasAlert: boolean; alertText: string; alertLevel: string } {
  const rain = parseFloat(rain24h || '0');
  // 降水量超过20mm
  if (rain >= 20) {
    let level = '蓝色';
    let text = '降水预警';
    if (rain >= 100) { level = '红色'; text = `特大暴雨预警 ${rain}mm`; }
    else if (rain >= 50) { level = '橙色'; text = `暴雨预警 ${rain}mm`; }
    else if (rain >= 25) { level = '黄色'; text = `大雨预警 ${rain}mm`; }
    else { level = '蓝色'; text = `降雨预警 ${rain}mm`; }
    return { hasAlert: true, alertText: text, alertLevel: level };
  }
  // 灾害性天气代码
  const disasterCodes = ['04', '05', '06', '09', '10', '11', '12', '19', '20', '21', '22', '23', '24', '25'];
  const code = weatherCode.replace(/^[dn]/, '');
  if (disasterCodes.includes(code)) {
    const weatherNames: Record<string, string> = {
      '04': '雷阵雨', '05': '雷阵雨伴冰雹', '06': '雨夹雪',
      '09': '大雨', '10': '暴雨', '11': '大暴雨', '12': '特大暴雨',
      '19': '冻雨', '20': '沙尘暴', '21': '小到中雨', '22': '中到大雨',
      '23': '大到暴雨', '24': '暴雨到大暴雨', '25': '大暴雨到特大暴雨'
    };
    const name = weatherNames[code] || '灾害天气';
    return { hasAlert: true, alertText: `${name}预警`, alertLevel: '黄色' };
  }
  return { hasAlert: false, alertText: '', alertLevel: '' };
}

// 解析中国天气网返回的JSONP格式数据
function parseWeatherResponse(text: string): Record<string, any> | null {
  try {
    const match = text.match(/var\s+dataSK\s*=\s*(\{[^}]+\})/);
    if (match) {
      return JSON.parse(match[1]);
    }
    return null;
  } catch {
    return null;
  }
}

function parseForecastResponse(text: string): { sk: Record<string, any> | null; forecast: Record<string, any> | null; fc: Record<string, any> | null } {
  try {
    const skMatch = text.match(/var\s+dataSK\s*=\s*(\{[^}]+\})/);
    const forecastMatch = text.match(/var\s+cityDZ\s*=\s*(\{"weatherinfo":\{[^}]+\}\})/);
    const fcMatch = text.match(/var\s+fc\s*=\s*(\{"f":\[.*?\]\})/);
    
    return {
      sk: skMatch ? JSON.parse(skMatch[1]) : null,
      forecast: forecastMatch ? JSON.parse(forecastMatch[1]) : null,
      fc: fcMatch ? JSON.parse(fcMatch[1]) : null,
    };
  } catch {
    return { sk: null, forecast: null, fc: null };
  }
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      // 通过Nginx代理获取天气数据，避免跨域问题
      // 宜川县城市代码: 101110304
      const response = await fetch('/weather-api/weather_index/101110304.html', {
        headers: {
          'Accept': '*/*',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const text = await response.text();
      const { sk, forecast, fc } = parseForecastResponse(text);
      
      if (sk) {
        const weatherCode = sk.weathercode || 'd00';
        const icon = weatherIconMap[weatherCode] || '🌤️';
        
        // 计算降水概率 - 从预报数据中获取
        let rainProb = '0%';
        if (fc && fc.f && fc.f[0]) {
          const todayForecast = fc.f[0];
          const humidity = parseFloat(todayForecast.fm || '0');
          const rainWeatherCodes = ['03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '19', '21', '22', '23', '24', '25'];
          const dayCode = todayForecast.fa || '';
          const nightCode = todayForecast.fb || '';
          if (rainWeatherCodes.includes(dayCode) || rainWeatherCodes.includes(nightCode)) {
            rainProb = `${Math.min(Math.round(humidity), 100)}%`;
          } else {
            rainProb = `${Math.min(Math.round(humidity * 0.3), 30)}%`;
          }
        }

        // 尝试从 weather1d 接口获取逐小时数据
        let hourlyRain = emptyHourlyRain();
        try {
          const h3Res = await fetch('/weather-api/weather1d/101110304.shtml', { headers: { 'Accept': '*/*' } });
          if (h3Res.ok) {
            const h3Text = await h3Res.text();
            hourlyRain = parseHourlyRain(h3Text);
          }
        } catch {}
        
        const alertInfo = checkAlert(sk.rain24h || '0', weatherCode);
        setWeather({
          cityName: sk.cityname || '宜川',
          temp: sk.temp || '--',
          weather: sk.weather || '--',
          weatherIcon: icon,
          windDirection: sk.WD || '--',
          windSpeed: sk.WS || '--',
          humidity: sk.SD || '--',
          rain24h: sk.rain24h || '0',
          aqi: sk.aqi || '--',
          forecastHigh: forecast?.weatherinfo?.temp || '--',
          forecastLow: forecast?.weatherinfo?.tempn || '--',
          rainProbability: rainProb,
          hourlyRain,
          ...alertInfo,
        });
        setError(null);
      } else {
        throw new Error('解析天气数据失败');
      }
    } catch (err: any) {
      console.warn('天气API请求失败，使用备用数据:', err.message);
      // 备用：尝试直接请求实况数据
      try {
        const skResponse = await fetch('/weather-api/sk_2d/101110304.html');
        if (skResponse.ok) {
          const skText = await skResponse.text();
          const skData = parseWeatherResponse(skText);
          if (skData) {
            const weatherCode = skData.weathercode || 'd00';
            const icon = weatherIconMap[weatherCode] || '🌤️';
            const alertInfo2 = checkAlert(skData.rain24h || '0', weatherCode);
            setWeather({
              cityName: skData.cityname || '宜川',
              temp: skData.temp || '--',
              weather: skData.weather || '--',
              weatherIcon: icon,
              windDirection: skData.WD || '--',
              windSpeed: skData.WS || '--',
              humidity: skData.SD || '--',
              rain24h: skData.rain24h || '0',
              aqi: skData.aqi || '--',
              forecastHigh: '--',
              forecastLow: '--',
              rainProbability: '--',
              hourlyRain: emptyHourlyRain(),
              ...alertInfo2,
            });
            setError(null);
            return;
          }
        }
      } catch {}
      
      setError(err.message);
      // 使用默认数据
      setWeather({
        cityName: '宜川',
        temp: '--',
        weather: '--',
        weatherIcon: '🌤️',
        windDirection: '--',
        windSpeed: '--',
        humidity: '--',
        rain24h: '0',
        aqi: '--',
        forecastHigh: '--',
        forecastLow: '--',
        rainProbability: '--',
        hourlyRain: emptyHourlyRain(),
        hasAlert: false,
        alertText: '',
        alertLevel: '',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // 每30分钟刷新一次天气数据
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error, refetch: fetchWeather };
}
