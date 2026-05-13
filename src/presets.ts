export const defaultPresets = {
  'classic-chrono': {
    shape: {
      type: 'circle',
      borderRadius: 50,
      aspectRatio: 1.0,
    },
    background: {
      type: 'gradient',
      color: '#000000',
      imageUrl: null,
      gradientStyle: 'radial',
      gradientColors: ['#333333', '#000000'],
      materialType: 'sunburst',
      light: { angle: 45, intensity: 50 },
      opacity: 1,
    },
    dial: {
      showTicks: true,
      tickColor: '#cccccc',
      showNumbers: false,
      numberOrientation: 'upright',
      numberFont: "'Times New Roman', Times, serif",
      numberColor: '#ffffff',
      numberPadding: 8,
      tickPadding: 2,
      hugEdge: false,
      material: 'metallic',
    },
    hands: {
      style: 'classic',
      hourMinuteColor: '#ffffff',
      showSeconds: true,
      secondColor: '#ff3333',
      smoothSeconds: true,
      material: 'metallic',
      hourLength: 22,
      minuteLength: 35,
      secondLength: 45,
      widthScale: 1.0,
    },
    subDials: [
      { id: 's1', position: { x: 25, y: 50 }, size: 28, type: 'hours', color: '#ffffff', handColor: '#ffffff', material: 'metallic', showTicks: true, showNumbers: true },
      { id: 's2', position: { x: 75, y: 50 }, size: 28, type: 'minutes', color: '#ffffff', handColor: '#ffffff', material: 'metallic', showTicks: true, showNumbers: true },
      { id: 's3', position: { x: 50, y: 75 }, size: 28, type: 'seconds', color: '#ffffff', handColor: '#ff3333', material: 'metallic', showTicks: true, showNumbers: true }
    ],
    complications: [
      { id: 'c1', type: 'text', content: 'COSMOGRAPH', position: { x: 50, y: 30 }, fontSize: 12, color: '#ff3333', fontFamily: 'sans-serif', fontWeight: 'bold' },
      { id: 'c2', type: 'text', content: 'ROLEX', position: { x: 50, y: 22 }, fontSize: 18, color: '#ffffff', fontFamily: 'serif', fontWeight: 'bold' }
    ],
  },
  'modern-square': {
    shape: {
      type: 'rectangle',
      borderRadius: 22,
      aspectRatio: 0.8,
    },
    background: {
      type: 'color',
      color: '#111111',
      imageUrl: null,
      gradientStyle: 'linear',
      gradientColors: ['#111111', '#222222'],
      materialType: 'matte',
      light: { angle: 135, intensity: 30 },
      opacity: 1,
    },
    dial: {
      showTicks: true,
      tickColor: '#555555',
      showNumbers: true,
      numberOrientation: 'upright',
      numberFont: "'Inter', sans-serif",
      numberColor: '#ffffff',
      numberPadding: 6,
      tickPadding: 2,
      hugEdge: true, // Hugs the square edge
      material: 'flat',
    },
    hands: {
      style: 'minimal',
      hourMinuteColor: '#ffffff',
      showSeconds: true,
      secondColor: '#00ddff',
      smoothSeconds: true,
      material: 'flat',
      hourLength: 22,
      minuteLength: 35,
      secondLength: 45,
      widthScale: 1.0,
    },
    subDials: [],
    complications: [
      { id: 'c1', type: 'date', format: 'EEEE', position: { x: 50, y: 20 }, fontSize: 16, color: '#888888', fontFamily: "'Inter', sans-serif", fontWeight: '500' },
      { id: 'c2', type: 'date', format: 'dd', position: { x: 50, y: 28 }, fontSize: 32, color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 'bold' }
    ],
  }
};
