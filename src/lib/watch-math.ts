import { MaterialStyle, ShapeConfig } from '../types';

export const getShapeClipPath = (shape: ShapeConfig): string | undefined => {
  if (shape.type === 'circle') return 'circle(50% at 50% 50%)';
  if (shape.type === 'rectangle') return undefined; // Handled by border-radius
  
  const points = [];
  const steps = 72; // every 5 degrees
  
  if (shape.type === 'tonneau') {
    // Barrel shape approximation
    for (let i = 0; i < steps; i++) {
       const t = (i / steps) * 2 * Math.PI;
       // basic tonneau parametric equation ideas
       // x = width * cos(t), but width bulges in middle
       const dx = Math.cos(t) * (1 + 0.15 * Math.sin(t)**2);
       const dy = Math.sin(t) * 1.1; // longer
       // normalize
       const x = 50 + dx * 45; 
       const y = 50 + dy * 45;
       points.push(`${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`);
    }
  } else if (shape.type === 'custom_curve') {
    // Superellipse: |x/a|^n + |y/b|^n = 1
    const n = shape.curvePower || 3;
    for (let i = 0; i < steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const cosT = Math.cos(t);
        const sinT = Math.sin(t);
        const signs = { x: Math.sign(cosT), y: Math.sign(sinT) };
        const dx = signs.x * Math.pow(Math.abs(cosT), 2/n);
        const dy = signs.y * Math.pow(Math.abs(sinT), 2/n);
        const x = 50 + dx * 50;
        const y = 50 + dy * 50;
        points.push(`${x}% ${y}%`);
    }
  }

  return points.length > 0 ? `polygon(${points.join(', ')})` : undefined;
};

export const getMetallicStyle = (color: string, material: MaterialStyle, type: 'text' | 'hand' = 'text'): React.CSSProperties => {
  if (material === 'flat') {
    if (type === 'text') return { color };
    return { backgroundColor: color };
  }
  
  if (material === 'metallic') {
    if (type === 'text') {
      return {
        backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${color} 40%, #555555 60%, ${color} 100%)`,
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.6)) drop-shadow(0px -1px 0px rgba(255,255,255,0.2))',
      };
    }
    // Hands
    return {
      background: `linear-gradient(to right, #ffffff 0%, ${color} 30%, #333333 70%, ${color} 100%)`,
      boxShadow: '0 3px 6px rgba(0,0,0,0.6), inset 0 0 1px rgba(255,255,255,0.8)',
    };
  }

  if (material === 'glow') {
     if (type === 'text') {
        return {
           color,
           textShadow: `0 0 8px ${color}, 0 0 12px ${color}`,
        }
     }
     return {
        backgroundColor: color,
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
     }
  }

  return {};
};

export const getDialPosition = (
  W: number,
  H: number,
  angleDeg: number,
  shape: ShapeConfig,
  hugEdge: boolean,
  insetPx: number
): { x: number; y: number } => {
  const cx = W / 2;
  const cy = H / 2;
  const rad = angleDeg * (Math.PI / 180);
  const nx = Math.sin(rad);
  const ny = -Math.cos(rad);

  if (!hugEdge || shape.type === 'circle') {
    const maxSize = Math.min(W, H) / 2;
    const r = Math.max(0, maxSize - insetPx);
    return { x: cx + r * nx, y: cy + r * ny };
  }

  // Inner bounding box
  const w = Math.max(0, W / 2 - insetPx);
  const h = Math.max(0, H / 2 - insetPx);

  if (shape.type === 'rectangle') {
    // CSS border-radius is percentage of width for rx, height for ry
    const rx = Math.max(0, ((shape.borderRadius || 0) / 100) * W - insetPx);
    const ry = Math.max(0, ((shape.borderRadius || 0) / 100) * H - insetPx);

    // Box intersection
    let t_box = Math.min(
      w / (Math.abs(nx) + 0.0001),
      h / (Math.abs(ny) + 0.0001)
    );

    if (rx > 0 && ry > 0) {
      const center_x = w - rx;
      const center_y = h - ry;
      const px = Math.abs(nx);
      const py = Math.abs(ny);
      if (t_box * px > center_x && t_box * py > center_y) {
        // intersect with ellipse (x - center_x)^2 / rx^2 + (y - center_y)^2 / ry^2 = 1
        const A = (px * px) / (rx * rx) + (py * py) / (ry * ry);
        const B = -2 * ((px * center_x) / (rx * rx) + (py * center_y) / (ry * ry));
        const C = 
          (center_x * center_x) / (rx * rx) + 
          (center_y * center_y) / (ry * ry) - 1;
        const det = B * B - 4 * A * C;
        if (det >= 0) {
          t_box = (-B + Math.sqrt(det)) / (2 * A);
        }
      }
    }
    return { x: cx + t_box * nx, y: cy + t_box * ny };
  } 

  if (shape.type === 'custom_curve') {
    const n = shape.curvePower || 3;
    const denom = Math.pow(Math.abs(nx) / w, n) + Math.pow(Math.abs(ny) / h, n);
    const t = Math.pow(1 / denom, 1 / n);
    return { x: cx + t * nx, y: cy + t * ny };
  }

  if (shape.type === 'tonneau') {
    let bestR = 0;
    let minDiff = 100;
    const targetAng = Math.atan2(ny, nx);
    for (let i = 0; i < 360; i++) {
        const t = (i / 180) * Math.PI;
        const dx = Math.cos(t) * (1 + 0.15 * Math.sin(t)**2);
        const dy = Math.sin(t) * 1.1; 
        const px = dx * w * 0.9;
        const py = dy * h * 0.9;
        const ang = Math.atan2(py, px);
        
        let diff = Math.abs(ang - targetAng);
        if (diff > Math.PI) diff = 2 * Math.PI - diff;
        if (diff < minDiff) {
            minDiff = diff;
            bestR = Math.sqrt(px*px + py*py);
        }
    }
    return { x: cx + bestR * nx, y: cy + bestR * ny };
  }

  return { x: cx, y: cy };
};
