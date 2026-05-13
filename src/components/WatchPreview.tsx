import React from 'react';
import { WatchConfig, ComplicationConfig, SubDialConfig } from '../types';
import { useTime } from '../hooks/useTime';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { getMetallicStyle, getShapeClipPath, getDialPosition } from '../lib/watch-math';

interface WatchPreviewProps {
  config: WatchConfig;
  selectedComplicationId: string | null;
  onSelectComplication: (id: string | null) => void;
  onUpdatePosition: (id: string, x: number, y: number, type: 'complication' | 'subDial') => void;
}

export const WatchPreview: React.FC<WatchPreviewProps> = ({
  config,
  selectedComplicationId,
  onSelectComplication,
  onUpdatePosition,
}) => {
  const time = useTime(config.hands.smoothSeconds);

  // Time calculations
  const miliseconds = time.getMilliseconds();
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondAngle = (seconds + miliseconds / 1000) * 6; // 360 / 60
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  const getBackgroundStyle = () => {
    const bg = config.background;
    if (bg.type === 'color') return { backgroundColor: bg.color, opacity: bg.opacity };
    if (bg.type === 'image' && bg.imageUrl) return { backgroundImage: `url(${bg.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: bg.opacity };
    if (bg.type === 'gradient') {
      return {
        background: bg.gradientStyle === 'linear' 
          ? `linear-gradient(135deg, ${bg.gradientColors[0]}, ${bg.gradientColors[1]})`
          : `radial-gradient(circle, ${bg.gradientColors[0]}, ${bg.gradientColors[1]})`,
        opacity: bg.opacity
      };
    }
    return {};
  };

  const isSquare = config.shape.type === 'rectangle';

  const clipPath = getShapeClipPath(config.shape);

  return (
    <div
      className={cn(
        'relative overflow-hidden shadow-2xl transition-all duration-300'
      )}
      style={{
        width: '324px',
        height: isSquare || config.shape.type === 'tonneau' || config.shape.type === 'custom_curve' ? `${324 / (config.shape.aspectRatio || 1)}px` : '324px',
        borderRadius: isSquare ? `${config.shape.borderRadius}%` : config.shape.type === 'circle' ? '50%' : '0%',
        clipPath: clipPath,
        backgroundColor: '#000',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectComplication(null);
        }
      }}
    >
      {/* Background layer */}
      <div className="absolute inset-0 pointer-events-none" style={getBackgroundStyle()} />

      {/* Dial (Ticks and Numbers) */}
      <WatchDial config={config.dial} shape={config.shape} />

      {/* Sub-dials */}
      {config.subDials.map((subDial) => (
         <DraggableSubDial
            key={subDial.id}
            subDial={subDial}
            isSelected={selectedComplicationId === subDial.id}
            onSelect={() => onSelectComplication(subDial.id)}
            onMove={(x, y) => onUpdatePosition(subDial.id, x, y, 'subDial')}
            time={time}
         />
      ))}

      {/* Complications */}
      {config.complications.map((comp) => (
        <DraggableComplication
          key={comp.id}
          complication={comp}
          isSelected={selectedComplicationId === comp.id}
          onSelect={() => onSelectComplication(comp.id)}
          onMove={(x, y) => onUpdatePosition(comp.id, x, y, 'complication')}
          time={time}
        />
      ))}

      {/* Hands */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
        {/* Hour Hand */}
        <div
          className="absolute origin-bottom rounded-full"
          style={{
            height: `${config.hands.hourLength}%`,
            width: `${8 * (config.hands.widthScale || 1)}px`,
            bottom: '50%',
            left: '50%',
            transform: `translateX(-50%) rotate(${hourAngle}deg)`,
            ...getMetallicStyle(config.hands.hourMinuteColor, config.hands.material, 'hand'),
            clipPath: config.hands.style === 'classic' ? 'polygon(10% 100%, 90% 100%, 50% 0%)' : undefined,
          }}
        >
           {config.hands.style === 'classic' && (
              <div className="absolute top-[10%] bottom-[5%] left-[2px] right-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.8)', clipPath: 'polygon(10% 100%, 90% 100%, 50% 0%)' }} />
           )}
        </div>

        {/* Minute Hand */}
        <div
          className="absolute origin-bottom rounded-full"
          style={{
            height: `${config.hands.minuteLength}%`,
            width: `${6 * (config.hands.widthScale || 1)}px`,
            bottom: '50%',
            left: '50%',
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
            ...getMetallicStyle(config.hands.hourMinuteColor, config.hands.material, 'hand'),
            clipPath: config.hands.style === 'classic' ? 'polygon(10% 100%, 90% 100%, 50% 0%)' : undefined,
          }}
        >
          {config.hands.style === 'classic' && (
              <div className="absolute top-[10%] bottom-[5%] left-[1.5px] right-[1.5px] rounded-full" style={{ background: 'rgba(255,255,255,0.8)', clipPath: 'polygon(10% 100%, 90% 100%, 50% 0%)' }} />
           )}
        </div>

        {/* Second Hand */}
        {config.hands.showSeconds !== false && (
          <div
            className="absolute origin-bottom"
            style={{
              height: `${config.hands.secondLength || 45}%`,
              width: `${2 * (config.hands.widthScale || 1)}px`,
              bottom: '50%',
              left: '50%',
              transform: `translateX(-50%) rotate(${config.hands.smoothSeconds ? secondAngle : Math.floor(secondAngle)}deg)`,
              ...getMetallicStyle(config.hands.secondColor, config.hands.material, 'hand'),
            }}
          >
          </div>
        )}

        {/* Center Pin */}
        <div
          className="absolute w-3 h-3 rounded-full border-2 bg-white"
          style={{
             left: '50%',
             top: '50%',
             transform: 'translate(-50%, -50%)',
             borderColor: config.hands.secondColor,
             ...getMetallicStyle('#ffffff', config.hands.material, 'hand')
          }}
        />
      </div>

       {/* Gloss overlay */}
       <div 
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-40 mix-blend-overlay" 
          style={{
             background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.2) 100%)',
             boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 6px rgba(0,0,0,0.5)'
          }} 
       />
    </div>
  );
};

// --- Subcomponents ---

const WatchDial: React.FC<{ config: WatchConfig['dial'], shape: ShapeConfig }> = ({ config, shape }) => {
  const W = 100; // Work in 100-based unit system for width
  const H = 100 / (shape.aspectRatio || 1);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Ticks */}
      {config.showTicks &&
        Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          const rotation = i * 6;
          
          const inset = config.tickPadding ?? 4;
          const pos = getDialPosition(W, H, rotation, shape, config.hugEdge, inset);

          return (
            <div
              key={`tick-${i}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(pos.x / W) * 100}%`,
                top: `${(pos.y / H) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                width: isHour ? '4px' : '2px',
                height: isHour ? '12px' : '8px',
                borderRadius: '1px',
                ...getMetallicStyle(config.tickColor, config.material, 'hand'), // Use hand material for physical ticks
              }}
            />
          );
        })}

      {/* Numbers */}
      {config.showNumbers &&
        Array.from({ length: 12 }).map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const rotation = i * 30;
          
          const numberStyle: React.CSSProperties = {
            fontFamily: config.numberFont,
            fontSize: '32px',
            fontWeight: 500,
            ...getMetallicStyle(config.numberColor, config.material, 'text'),
          };

          const numInset = config.numberPadding ?? 12;
          const pos = getDialPosition(W, H, rotation, shape, config.hugEdge, numInset);

          const transformStr = config.numberOrientation === 'rotated' 
              ? `translate(-50%, -50%) rotate(${rotation}deg)` 
              : `translate(-50%, -50%)`;

          return (
            <div
                key={`num-${i}`}
                className="absolute flex items-center justify-center leading-none"
                style={{
                  left: `${(pos.x / W) * 100}%`,
                  top: `${(pos.y / H) * 100}%`,
                  transform: transformStr,
                }}
              >
                <span style={numberStyle} className="scale-x-[0.85] text-center">
                  {hour}
                </span>
            </div>
          );
        })}
    </div>
  );
};

interface DraggableSubDialProps {
  subDial: SubDialConfig;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  time: Date;
}

const DraggableSubDial: React.FC<DraggableSubDialProps> = ({ subDial, isSelected, onSelect, onMove, time }) => {
   const [isDragging, setIsDragging] = React.useState(false);
   const dragRef = React.useRef<HTMLDivElement>(null);
 
   const startDrag = (e: React.PointerEvent) => {
     e.stopPropagation();
     onSelect();
     setIsDragging(true);
     e.currentTarget.setPointerCapture(e.pointerId);
   };
 
   const handlePointerMove = (e: React.PointerEvent) => {
     if (!isDragging) return;
     const parent = dragRef.current?.parentElement;
     if (!parent) return;
     const rect = parent.getBoundingClientRect();
     let newX = ((e.clientX - rect.left) / rect.width) * 100;
     let newY = ((e.clientY - rect.top) / rect.height) * 100;
     onMove(Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
   };
 
   const endDrag = (e: React.PointerEvent) => {
     setIsDragging(false);
     e.currentTarget.releasePointerCapture(e.pointerId);
   };

   // Calculate angle based on type
   let angle = 0;
   if (subDial.type === 'seconds') {
       angle = time.getSeconds() * 6;
   } else if (subDial.type === 'minutes') {
       angle = time.getMinutes() * 6;
   } else if (subDial.type === 'hours') {
       angle = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;
   } else if (subDial.type === '24hour') {
       angle = time.getHours() * 15 + time.getMinutes() * 0.25;
   }

   return (
      <div 
         ref={dragRef}
         onPointerDown={startDrag}
         onPointerMove={handlePointerMove}
         onPointerUp={endDrag}
         onPointerCancel={endDrag}
         className={cn(
            'absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing rounded-full',
            isSelected ? 'ring-2 ring-indigo-500/50 bg-indigo-500/10' : ''
         )}
         style={{
            left: `${subDial.position.x}%`,
            top: `${subDial.position.y}%`,
            width: `${subDial.size}%`,
            height: `${subDial.size}%`,
            zIndex: isSelected ? 20 : 10,
         }}
      >
         <div className="absolute inset-0 rounded-full border border-black/10" style={getMetallicStyle(subDial.color, subDial.material, 'text')}>
             {/* Sub dial ticks */}
             {subDial.showTicks && Array.from({length: 12}).map((_, i) => (
                <div key={i} className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2" style={{ transform: `rotate(${i*30}deg)` }}>
                   <div className="w-[1px] h-1.5 mx-auto mt-0.5" style={getMetallicStyle(subDial.color, subDial.material, 'hand')} />
                </div>
             ))}

             {/* Sub dial hand */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="absolute origin-bottom rounded-full"
                  style={{
                     height: '40%', width: '2px', bottom: '50%', left: '50%',
                     transform: `translateX(-50%) rotate(${angle}deg)`,
                     ...getMetallicStyle(subDial.handColor, subDial.material, 'hand')
                  }}
                />
                <div className="w-1.5 h-1.5 rounded-full" style={getMetallicStyle(subDial.handColor, subDial.material, 'hand')} />
             </div>
         </div>
      </div>
   )
}

interface DraggableComplicationProps {
  complication: ComplicationConfig;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  time: Date;
}

const DraggableComplication: React.FC<DraggableComplicationProps> = ({
  complication,
  isSelected,
  onSelect,
  onMove,
  time,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const dragRef = React.useRef<HTMLDivElement>(null);

  const startDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const parent = dragRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    let newX = ((e.clientX - rect.left) / rect.width) * 100;
    let newY = ((e.clientY - rect.top) / rect.height) * 100;
    onMove(Math.max(0, Math.min(100, newX)), Math.max(0, Math.min(100, newY)));
  };

  const endDrag = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  let content = complication.content || '';
  if (complication.type === 'date') {
    content = format(time, complication.format || 'dd');
  } else if (complication.type === 'dayOfWeek') {
    content = format(time, complication.format || 'EEEE');
  } else if (complication.type === 'battery') {
    content = '85%'; // Mock battery
  }

  return (
    <div
      ref={dragRef}
      onPointerDown={startDrag}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing whitespace-nowrap p-1',
        isSelected ? 'border border-indigo-500 rounded ring-2 ring-indigo-500/30 bg-indigo-500/10' : 'border border-transparent'
      )}
      style={{
        left: `${complication.position.x}%`,
        top: `${complication.position.y}%`,
        fontSize: `${complication.fontSize}px`,
        fontFamily: complication.fontFamily,
        fontWeight: complication.fontWeight,
        textAlign: complication.align || 'center',
        zIndex: isSelected ? 25 : 15,
        ...getMetallicStyle(complication.color, complication.material || 'flat', 'text'),
      }}
    >
      {content}
    </div>
  );
};
