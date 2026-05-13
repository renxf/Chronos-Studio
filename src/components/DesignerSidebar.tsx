import React from 'react';
import { WatchConfig, ComplicationConfig, ComplicationType, SubDialConfig, SubDialType } from '../types';
import { Settings, Clock, Hand, Type, Trash2, CircleGauge } from 'lucide-react';
import { cn } from '../lib/utils';

interface DesignerSidebarProps {
  config: WatchConfig;
  onChange: (config: WatchConfig) => void;
  selectedComplicationId: string | null;
  onSelectComplication: (id: string | null) => void;
}

type Tab = 'global' | 'dial' | 'hands' | 'elements';

export const DesignerSidebar: React.FC<DesignerSidebarProps> = ({
  config,
  onChange,
  selectedComplicationId,
  onSelectComplication,
}) => {
  const [activeTab, setActiveTab] = React.useState<Tab>('global');

  const updateConfig = (updates: Partial<WatchConfig>) => onChange({ ...config, ...updates });
  const updateShape = (updates: Partial<WatchConfig['shape']>) => updateConfig({ shape: { ...config.shape, ...updates } });
  const updateGlobal = (updates: Partial<WatchConfig['background']>) => updateConfig({ background: { ...config.background, ...updates } });
  const updateDial = (updates: Partial<WatchConfig['dial']>) => updateConfig({ dial: { ...config.dial, ...updates } });
  const updateHands = (updates: Partial<WatchConfig['hands']>) => updateConfig({ hands: { ...config.hands, ...updates } });
  
  const updateComplication = (id: string, updates: Partial<ComplicationConfig>) => {
    updateConfig({ complications: config.complications.map((c) => (c.id === id ? { ...c, ...updates } : c)) });
  };
  
  const updateSubDial = (id: string, updates: Partial<SubDialConfig>) => {
      updateConfig({ subDials: config.subDials.map((s) => (s.id === id ? { ...s, ...updates } : s)) });
  };

  const addComplication = (type: ComplicationType) => {
    const newComp: ComplicationConfig = {
      id: `c_${Math.random().toString(36).substr(2, 6)}`,
      type,
      position: { x: 50, y: 50 },
      fontSize: type === 'text' ? 24 : 16,
      color: '#E0E0E0',
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
      content: type === 'text' ? 'New Text' : undefined,
      format: type === 'date' ? 'dd' : type === 'dayOfWeek' ? 'EEEE' : undefined,
      material: 'flat',
    };
    updateConfig({ complications: [...config.complications, newComp] });
    onSelectComplication(newComp.id);
    setActiveTab('elements');
  };

  const addSubDial = () => {
     const newSub: SubDialConfig = {
         id: `s_${Math.random().toString(36).substr(2, 6)}`,
         position: { x: 50, y: 70 },
         size: 25,
         type: 'seconds',
         color: '#888888',
         handColor: '#ff3333',
         material: 'flat',
         showTicks: true,
         showNumbers: false,
     }
     updateConfig({ subDials: [...config.subDials, newSub] });
     onSelectComplication(newSub.id);
     setActiveTab('elements');
  }

  const removeElement = (id: string, isSubDial = false) => {
    if (isSubDial) {
       updateConfig({ subDials: config.subDials.filter((s) => s.id !== id) });
    } else {
       updateConfig({ complications: config.complications.filter((c) => c.id !== id) });
    }
    if (selectedComplicationId === id) onSelectComplication(null);
  };

  const selectedComplication = config.complications.find((c) => c.id === selectedComplicationId);
  const selectedSubDial = config.subDials.find(s => s.id === selectedComplicationId);

  return (
    <div className="w-80 h-full border-r border-[#222224] bg-[#0D0D0F] flex flex-col overflow-hidden text-[#E0E0E0] text-sm">
      <div className="flex border-b border-[#222224] bg-[#111113]">
        <TabButton active={activeTab === 'global'} onClick={() => setActiveTab('global')} icon={<Settings size={16} />} label="Face" />
        <TabButton active={activeTab === 'dial'} onClick={() => setActiveTab('dial')} icon={<Clock size={16} />} label="Dial" />
        <TabButton active={activeTab === 'hands'} onClick={() => setActiveTab('hands')} icon={<Hand size={16} />} label="Hands" />
        <TabButton active={activeTab === 'elements'} onClick={() => setActiveTab('elements')} icon={<Type size={16} />} label="Elements" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'global' && (
          <div className="space-y-4">
             <SectionTitle>Shape</SectionTitle>
             <div className="grid grid-cols-2 gap-2 mb-2">
                <button 
                  onClick={() => updateShape({ type: 'rectangle' })}
                  className={cn("px-2 py-1.5 rounded text-xs font-medium border", config.shape.type === 'rectangle' ? "border-indigo-500 bg-indigo-500/10 text-[#E0E0E0]" : "border-[#333] bg-[#111] text-[#E0E0E0] hover:bg-[#1A1A1C]")}
                >Rectangle</button>
                <button 
                  onClick={() => updateShape({ type: 'circle' })}
                  className={cn("px-2 py-1.5 rounded text-xs font-medium border", config.shape.type === 'circle' ? "border-indigo-500 bg-indigo-500/10 text-[#E0E0E0]" : "border-[#333] bg-[#111] text-[#E0E0E0] hover:bg-[#1A1A1C]")}
                >Circular</button>
                <button 
                  onClick={() => updateShape({ type: 'tonneau' })}
                  className={cn("px-2 py-1.5 rounded text-xs font-medium border", config.shape.type === 'tonneau' ? "border-indigo-500 bg-indigo-500/10 text-[#E0E0E0]" : "border-[#333] bg-[#111] text-[#E0E0E0] hover:bg-[#1A1A1C]")}
                >Tonneau</button>
                 <button 
                  onClick={() => updateShape({ type: 'custom_curve' })}
                  className={cn("px-2 py-1.5 rounded text-xs font-medium border", config.shape.type === 'custom_curve' ? "border-indigo-500 bg-indigo-500/10 text-[#E0E0E0]" : "border-[#333] bg-[#111] text-[#E0E0E0] hover:bg-[#1A1A1C]")}
                >Superellipse</button>
             </div>

             {config.shape.type === 'rectangle' && (
                <div className="space-y-4">
                   <div>
                     <div className="flex justify-between">
                       <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Border Radius</label>
                       <span className="text-[10px] text-[#888]">{config.shape.borderRadius}%</span>
                     </div>
                     <input type="range" min="0" max="50" value={config.shape.borderRadius || 0} onChange={e => updateShape({ borderRadius: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
                   </div>
                   <div>
                     <div className="flex justify-between">
                       <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Aspect Ratio</label>
                       <span className="text-[10px] text-[#888]">{config.shape.aspectRatio?.toFixed(2) || 1.0}</span>
                     </div>
                     <input type="range" min="0.5" max="1.5" step="0.05" value={config.shape.aspectRatio || 1.0} onChange={e => updateShape({ aspectRatio: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
                   </div>
                </div>
             )}

             {config.shape.type === 'tonneau' && (
                <div className="space-y-4 pt-2">
                   <div>
                     <div className="flex justify-between">
                       <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Aspect Ratio</label>
                       <span className="text-[10px] text-[#888]">{config.shape.aspectRatio?.toFixed(2) || 1.0}</span>
                     </div>
                     <input type="range" min="0.5" max="1.5" step="0.05" value={config.shape.aspectRatio || 1.0} onChange={e => updateShape({ aspectRatio: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
                   </div>
                </div>
             )}

             {config.shape.type === 'custom_curve' && (
                <div className="space-y-4 pt-2">
                   <div>
                     <div className="flex justify-between">
                       <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Curve Power (Squircle)</label>
                       <span className="text-[10px] text-[#888]">{config.shape.curvePower?.toFixed(1) || 3.0}</span>
                     </div>
                     <input type="range" min="1" max="10" step="0.1" value={config.shape.curvePower || 3.0} onChange={e => updateShape({ curvePower: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
                   </div>
                   <div>
                     <div className="flex justify-between">
                       <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Aspect Ratio</label>
                       <span className="text-[10px] text-[#888]">{config.shape.aspectRatio?.toFixed(2) || 1.0}</span>
                     </div>
                     <input type="range" min="0.5" max="1.5" step="0.05" value={config.shape.aspectRatio || 1.0} onChange={e => updateShape({ aspectRatio: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
                   </div>
                </div>
             )}

            <SectionTitle>Background Info</SectionTitle>
              <select
              className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              value={config.background.type || 'color'}
              onChange={(e) => updateGlobal({ type: e.target.value as any })}
            >
              <option value="color">Solid Color</option>
              <option value="gradient">Gradient</option>
            </select>

            {config.background.type === 'color' && (
              <div>
                <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Color</label>
                <input type="color" className="h-8 w-12 cursor-pointer bg-transparent border-0 p-0" value={config.background.color || '#000000'} onChange={(e) => updateGlobal({ color: e.target.value })} />
               </div>
            )}

            {config.background.type === 'gradient' && (
                <div className="space-y-3">
                   <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={config.background.gradientStyle || 'linear'} onChange={e => updateGlobal({ gradientStyle: e.target.value as any })}>
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                   </select>
                   <div className="flex gap-2">
                      <input type="color" className="h-8 w-12 cursor-pointer bg-transparent border-0 p-0" value={config.background.gradientColors?.[0] || '#000000'} onChange={(e) => updateGlobal({ gradientColors: [e.target.value, config.background.gradientColors?.[1] || '#333333'] })} />
                      <input type="color" className="h-8 w-12 cursor-pointer bg-transparent border-0 p-0" value={config.background.gradientColors?.[1] || '#333333'} onChange={(e) => updateGlobal({ gradientColors: [config.background.gradientColors?.[0] || '#000000', e.target.value] })} />
                   </div>
                </div>
            )}
          </div>
        )}

        {activeTab === 'dial' && (
          <div className="space-y-4">
             <div>
                <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Material</label>
                <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={config.dial.material || 'flat'} onChange={(e) => updateDial({ material: e.target.value as any })}>
                  <option value="flat">Flat (Solid Paint)</option>
                  <option value="metallic">Metallic (3D Shine)</option>
                  <option value="glow">Glow (Luminous)</option>
                </select>
             </div>

            <Toggle label="Show Ticks" checked={!!config.dial.showTicks} onChange={(v) => updateDial({ showTicks: v })} />
            {config.dial.showTicks && (
                <input type="color" className="h-8 w-12 cursor-pointer bg-transparent border-0 p-0" value={config.dial.tickColor || '#ffffff'} onChange={(e) => updateDial({ tickColor: e.target.value })} />
            )}
            
            <Toggle label="Show Numbers" checked={!!config.dial.showNumbers} onChange={(v) => updateDial({ showNumbers: v })} />
             {config.dial.showNumbers && (
               <div className="space-y-2">
                  <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={config.dial.numberOrientation || 'upright'} onChange={(e) => updateDial({ numberOrientation: e.target.value as any })}>
                     <option value="upright">Upright</option>
                     <option value="rotated">Radial</option>
                  </select>
                  <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={config.dial.numberFont || "'Inter', sans-serif"} onChange={(e) => updateDial({ numberFont: e.target.value })}>
                     <option value="'Inter', sans-serif">Modern Sans</option>
                     <option value="'Times New Roman', serif">Classic Serif</option>
                     <option value="monospace">Monospace</option>
                  </select>
                  <div className="flex gap-2 items-center">
                     <span className="text-[10px] text-[#555] uppercase tracking-wider">Color:</span>
                     <input type="color" className="h-6 w-8 cursor-pointer bg-transparent border-0 p-0" value={config.dial.numberColor || '#ffffff'} onChange={(e) => updateDial({ numberColor: e.target.value })} />
                  </div>
                  <div>
                     <div className="flex justify-between">
                       <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Number Padding Edge</label>
                       <span className="text-[10px] text-[#888]">{config.dial.numberPadding ?? 12}</span>
                     </div>
                     <input type="range" min="0" max="30" value={config.dial.numberPadding ?? 12} onChange={e => updateDial({ numberPadding: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
                  </div>
               </div>
             )}

             <div className="pt-2">
                <div className="flex justify-between">
                  <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Tick Padding Edge</label>
                  <span className="text-[10px] text-[#888]">{config.dial.tickPadding ?? 4}</span>
                </div>
                <input type="range" min="0" max="25" step="0.5" value={config.dial.tickPadding ?? 4} onChange={e => updateDial({ tickPadding: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
             </div>

            {config.shape.type !== 'circle' && (
                <Toggle label="Hug Corners/Edges" checked={!!config.dial.hugEdge} onChange={(v) => updateDial({ hugEdge: v })} />
            )}
          </div>
        )}

        {activeTab === 'hands' && (
          <div className="space-y-4">
             <div>
                <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Style & Material</label>
                <div className="space-y-2">
                   <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={config.hands.style || 'classic'} onChange={(e) => updateHands({ style: e.target.value as any })}>
                     <option value="classic">Classic (Pointed/Hollow)</option>
                     <option value="minimal">Minimal (Baton)</option>
                   </select>
                   <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={config.hands.material || 'flat'} onChange={(e) => updateHands({ material: e.target.value as any })}>
                     <option value="flat">Flat Paint</option>
                     <option value="metallic">Metallic Polish</option>
                   </select>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Main Hands</label>
                  <input type="color" className="h-8 w-12 cursor-pointer bg-transparent border-0 p-0" value={config.hands.hourMinuteColor || '#ffffff'} onChange={(e) => updateHands({ hourMinuteColor: e.target.value })} />
                </div>
                <div>
                   <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Seconds</label>
                   <input type="color" className="h-8 w-12 cursor-pointer bg-transparent border-0 p-0" value={config.hands.secondColor || '#ff0000'} onChange={(e) => updateHands({ secondColor: e.target.value })} />
                </div>
             </div>

             <div className="space-y-4">
                <div>
                   <div className="flex justify-between">
                     <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Hour Length</label>
                   </div>
                   <input type="range" min="10" max="50" value={config.hands.hourLength || 22} onChange={e => updateHands({ hourLength: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
                </div>
                <div>
                   <div className="flex justify-between">
                     <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Minute Length</label>
                   </div>
                   <input type="range" min="20" max="60" value={config.hands.minuteLength || 35} onChange={e => updateHands({ minuteLength: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
                </div>
                {config.hands.showSeconds && (
                    <div>
                       <div className="flex justify-between">
                         <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Seconds Length</label>
                       </div>
                       <input type="range" min="20" max="60" value={config.hands.secondLength || 45} onChange={e => updateHands({ secondLength: parseInt(e.target.value) })} className="w-full accent-indigo-500" />
                    </div>
                )}
                 <div>
                   <div className="flex justify-between">
                     <label className="text-[10px] text-[#555] block mb-1 uppercase tracking-wider">Thickness Scale</label>
                   </div>
                   <input type="range" min="0.5" max="2" step="0.1" value={config.hands.widthScale || 1} onChange={e => updateHands({ widthScale: parseFloat(e.target.value) })} className="w-full accent-indigo-500" />
                </div>
             </div>

             <Toggle label="Show Second Hand" checked={!!config.hands.showSeconds} onChange={(v) => updateHands({ showSeconds: v })} />
             {config.hands.showSeconds && (
                <Toggle label="Smooth Sweeping Seconds" checked={!!config.hands.smoothSeconds} onChange={(v) => updateHands({ smoothSeconds: v })} />
             )}
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => addComplication('text')} className="flex items-center justify-center gap-1 bg-[#1A1A1C] border border-[#333] hover:bg-[#252528] py-1.5 rounded text-xs"><Type size={12} /> Text</button>
                <button onClick={() => addComplication('date')} className="flex items-center justify-center gap-1 bg-[#1A1A1C] border border-[#333] hover:bg-[#252528] py-1.5 rounded text-xs"><Clock size={12} /> Date</button>
                <button onClick={() => addSubDial()} className="col-span-2 flex items-center justify-center gap-1 bg-indigo-600 border border-indigo-500 hover:bg-indigo-500 py-1.5 rounded text-xs text-white"><CircleGauge size={12} /> Add Sub-Dial</button>
             </div>

             <div className="space-y-2 mt-4">
                <SectionTitle>Layers</SectionTitle>
                {[...config.subDials, ...config.complications].map(elem => {
                   const isComp = 'content' in elem || 'format' in elem;
                   return (
                   <div 
                     key={elem.id} 
                     className={cn("flex items-center justify-between p-2 rounded cursor-pointer border text-xs", selectedComplicationId === elem.id ? "bg-indigo-500/10 border-indigo-500/50" : "bg-[#1A1A1C] hover:bg-[#151517] border-[#333]")}
                     onClick={() => onSelectComplication(elem.id)}
                   >
                      <div className="font-medium truncate">{isComp ? `Text/Date: ${(elem as any).content || (elem as any).format}` : `Sub-Dial: ${(elem as any).type}`}</div>
                      <button onClick={(e) => { e.stopPropagation(); removeElement(elem.id, !isComp); }} className="text-red-400 hover:text-red-300 p-1">
                         <Trash2 size={12} />
                      </button>
                   </div>
                )})}
             </div>

             {/* Selected Editor Context */}
             {selectedComplication && (
                <div className="p-3 border border-[#333] bg-[#111] rounded space-y-3">
                   <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-widest">{selectedComplication.type} Settings</h4>
                   {selectedComplication.type === 'text' && (
                      <input type="text" className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={selectedComplication.content || ''} onChange={(e) => updateComplication(selectedComplication.id, { content: e.target.value })} />
                   )}
                   {selectedComplication.type === 'date' && (
                      <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={selectedComplication.format || 'dd'} onChange={(e) => updateComplication(selectedComplication.id, { format: e.target.value })}>
                         <option value="dd">Day (13)</option>
                         <option value="EEE">Day short (Mon)</option>
                         <option value="EEEE">Day full (Monday)</option>
                      </select>
                   )}
                   
                   <div className="grid grid-cols-2 gap-2">
                       <div>
                          <label className="text-[10px] text-[#555] block mb-1">Color</label>
                          <input type="color" className="h-8 cursor-pointer bg-transparent border-0 p-0" value={selectedComplication.color || '#ffffff'} onChange={e => updateComplication(selectedComplication.id, { color: e.target.value })} />
                       </div>
                       <div>
                          <label className="text-[10px] text-[#555] block mb-1">Font Size</label>
                          <input type="number" className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1 text-xs text-white" value={selectedComplication.fontSize || 12} onChange={e => updateComplication(selectedComplication.id, { fontSize: parseInt(e.target.value) })} />
                       </div>
                   </div>

                    <div>
                      <label className="text-[10px] text-[#555] block mb-1">Material</label>
                      <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={selectedComplication.material || 'flat'} onChange={(e) => updateComplication(selectedComplication.id, { material: e.target.value as any })}>
                         <option value="flat">Flat</option>
                         <option value="metallic">Metallic</option>
                         <option value="glow">Glow</option>
                      </select>
                   </div>
                </div>
             )}

             {selectedSubDial && (
                 <div className="p-3 border border-[#333] bg-[#111] rounded space-y-3">
                     <h4 className="text-[10px] font-bold text-[#666] uppercase tracking-widest">Sub-Dial Settings</h4>
                     <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={selectedSubDial.type || 'seconds'} onChange={(e) => updateSubDial(selectedSubDial.id, { type: e.target.value as any })}>
                         <option value="seconds">Small Seconds</option>
                         <option value="minutes">Chronograph Minutes</option>
                         <option value="hours">Chronograph Hours</option>
                         <option value="24hour">24h Time</option>
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                         <div>
                            <label className="text-[10px] text-[#555] block mb-1">Ring Color</label>
                            <input type="color" className="h-6 cursor-pointer bg-transparent border-0 p-0" value={selectedSubDial.color || '#ffffff'} onChange={e => updateSubDial(selectedSubDial.id, { color: e.target.value })} />
                         </div>
                         <div>
                            <label className="text-[10px] text-[#555] block mb-1">Hand Color</label>
                            <input type="color" className="h-6 cursor-pointer bg-transparent border-0 p-0" value={selectedSubDial.handColor || '#ffffff'} onChange={e => updateSubDial(selectedSubDial.id, { handColor: e.target.value })} />
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <label className="text-[10px] text-[#555]">Size</label>
                         <input type="range" min="10" max="50" value={selectedSubDial.size || 25} onChange={e => updateSubDial(selectedSubDial.id, { size: parseInt(e.target.value) })} className="flex-1 accent-indigo-500" />
                      </div>

                      <select className="w-full bg-[#1A1A1C] border border-[#333] rounded px-2 py-1.5 text-xs text-white" value={selectedSubDial.material || 'flat'} onChange={(e) => updateSubDial(selectedSubDial.id, { material: e.target.value as any })}>
                         <option value="flat">Flat Paint</option>
                         <option value="metallic">Metallic Chrome</option>
                      </select>
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors border-b-2",
      active ? "text-indigo-400 border-indigo-400 bg-[#1A1A1C]" : "text-[#666] border-transparent hover:text-[#E0E0E0] hover:bg-[#151517]"
    )}
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[10px] font-bold text-[#666] uppercase tracking-widest mb-3">{children}</h3>
);

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-xs text-[#E0E0E0] font-medium">{label}</span>
    <div className="relative inline-block w-8 mr-2 align-middle select-none transition duration-200 ease-in">
      <input type="checkbox" className="toggle-checkbox absolute block w-4 h-4 rounded-full border border-gray-400 appearance-none cursor-pointer" checked={!!checked} onChange={(e) => onChange(e.target.checked)} style={{ right: checked ? '0' : '1rem', borderColor: checked ? '#4f46e5' : '#333', background: checked ? '#4f46e5' : '#1A1A1C' }} />
      <div className="toggle-label block overflow-hidden h-4 rounded-full cursor-pointer" style={{ backgroundColor: checked ? '#6366f1' : '#252528' }}></div>
    </div>
  </label>
);
