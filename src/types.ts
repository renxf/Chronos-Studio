export type Point = { x: number; y: number }; // x,y as percentages 0-100

export type WatchShapeType = 'rectangle' | 'circle' | 'tonneau' | 'custom_curve';

export type ShapeConfig = {
  type: WatchShapeType;
  aspectRatio: number; // 0.5 - 2.0
  borderRadius: number; // 0-50 for rectangle
  curvePower?: number; // for custom_curve, n in |x/a|^n + |y/b|^n = 1. n=2 (circle), n>2 (squircle)
};

export type LightSource = {
  angle: number; // 0-360
  intensity: number; // 0-100
};

export type BackgroundConfig = {
  type: 'color' | 'image' | 'gradient' | 'material';
  color: string;
  imageUrl: string | null;
  gradientStyle: 'linear' | 'radial';
  gradientColors: [string, string];
  materialType: 'matte' | 'brushed_metal' | 'carbon_fiber' | 'sunburst';
  opacity: number;
  light: LightSource;
};

export type MaterialStyle = 'flat' | 'metallic' | 'glow';

export type DialConfig = {
  showTicks: boolean;
  tickColor: string;
  showNumbers: boolean;
  numberOrientation: 'upright' | 'rotated';
  numberFont: string;
  numberColor: string;
  numberPadding: number;
  tickPadding: number;
  hugEdge: boolean;
  material: MaterialStyle;
};

export type HandsConfig = {
  style: 'classic' | 'minimal';
  hourMinuteColor: string;
  showSeconds: boolean;
  secondColor: string;
  smoothSeconds: boolean;
  material: MaterialStyle;
  hourLength: number; // 10-50%
  minuteLength: number; // 10-50%
  secondLength: number; // 10-60%
  widthScale: number; // 0.5 - 2.0
};

export type SubDialType = 'seconds' | 'minutes' | 'hours' | '24hour';

export type SubDialConfig = {
  id: string;
  position: Point;
  size: number;
  type: SubDialType;
  color: string;
  handColor: string;
  material: MaterialStyle;
  showTicks: boolean;
  showNumbers: boolean;
  label?: string;
};

export type ComplicationType = 'text' | 'date' | 'dayOfWeek' | 'battery';

export type ComplicationConfig = {
  id: string;
  type: ComplicationType;
  content?: string; // Used for text
  format?: string; // Used for date
  position: Point; // center coordinates in percentages
  fontSize: number;
  color: string;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '500' | '600';
  align?: 'left' | 'center' | 'right';
  material?: MaterialStyle;
};

export type WatchConfig = {
  id?: string;
  name?: string;
  shape: ShapeConfig;
  background: BackgroundConfig;
  dial: DialConfig;
  hands: HandsConfig;
  subDials: SubDialConfig[];
  complications: ComplicationConfig[];
};
