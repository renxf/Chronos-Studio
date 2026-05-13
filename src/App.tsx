import React, { useState, useEffect } from 'react';
import { WatchConfig } from './types';
import { WatchPreview } from './components/WatchPreview';
import { DesignerSidebar } from './components/DesignerSidebar';
import { defaultPresets } from './presets';
import { Save, Download } from 'lucide-react';

export default function App() {
  const [watchConfig, setWatchConfig] = useState<WatchConfig>(defaultPresets['modern-square'] as WatchConfig);
  const [selectedComplication, setSelectedComplication] = useState<string | null>(null);
  const [workspaceColor, setWorkspaceColor] = useState<string>('#050505');

  useEffect(() => {
    const saved = localStorage.getItem('saved-watch-design');
    if (saved) {
      try {
        setWatchConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved design');
      }
    }
  }, []);

  const saveDesign = () => {
    localStorage.setItem('saved-watch-design', JSON.stringify(watchConfig));
    alert('Design saved locally!');
  };

  const loadPreset = (key: keyof typeof defaultPresets) => {
    setWatchConfig(defaultPresets[key] as WatchConfig);
    setSelectedComplication(null);
  };

  const handleUpdatePosition = (id: string, x: number, y: number, type: 'complication' | 'subDial') => {
    setWatchConfig((prev) => {
      if (type === 'complication') {
        return {
          ...prev,
          complications: prev.complications.map((c) =>
            c.id === id ? { ...c, position: { x, y } } : c
          ),
        };
      } else {
        return {
           ...prev,
           subDials: prev.subDials.map((s) => 
            s.id === id ? { ...s, position: { x, y } } : s
           )
        }
      }
    });
  };

  return (
    <div className="flex h-screen w-full bg-[#0A0A0B] text-[#E0E0E0] overflow-hidden font-sans">
      <DesignerSidebar
        config={watchConfig}
        onChange={setWatchConfig}
        selectedComplicationId={selectedComplication}
        onSelectComplication={setSelectedComplication}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header toolbar */}
        <header className="h-14 border-b border-[#222224] bg-[#111113] flex items-center justify-between px-6 shrink-0 z-10 w-full relative">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="text-sm font-semibold tracking-wide uppercase">Chronos Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3">
              <label className="text-xs text-[#888]">Scene:</label>
              <input 
                type="color" 
                value={workspaceColor} 
                onChange={(e) => setWorkspaceColor(e.target.value)} 
                className="w-6 h-6 rounded cursor-pointer border border-[#333] p-0 bg-transparent"
              />
            </div>
            <select 
              className="bg-[#1A1A1C] border border-[#333] text-xs px-2 py-1.5 rounded focus:outline-none"
              onChange={(e) => loadPreset(e.target.value as any)}
              defaultValue="modern-square"
            >
              <option value="modern-square">Preset: Modern Square</option>
              <option value="classic-chrono">Preset: Classic Chronograph</option>
            </select>
            <button onClick={saveDesign} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-[#1A1A1C] border border-[#333] rounded hover:bg-[#252528] transition-colors">
              <Save size={14} /> Save Design
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 text-xs bg-indigo-600 text-white rounded font-medium hover:bg-indigo-500 transition-colors">
              <Download size={14} /> Export
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: workspaceColor }}>
          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '20px 20px', color: '#888' }} 
          />
          
          <div className="relative">
             {/* Outer Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -z-20 pointer-events-none" />
             
             {/* Watch Case Frame (Physical appearance) */}
             <div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#000] border-[12px] border-[#1C1C1E] shadow-[0_0_80px_rgba(0,0,0,0.8)] -z-10 transition-all duration-300 pointer-events-none" 
               style={{
                 width: '348px', // 324 + 12*2
                 height: watchConfig.shape.type === 'circle' ? '348px' : `${(324 / (watchConfig.shape.aspectRatio || 1)) + 24}px`,
                 borderRadius: watchConfig.shape.type === 'circle' ? '50%' : `${Math.max(16, watchConfig.shape.borderRadius)}%`,
               }}
             />
             
             <WatchPreview
                config={watchConfig}
                selectedComplicationId={selectedComplication}
                onSelectComplication={setSelectedComplication}
                onUpdatePosition={handleUpdatePosition}
              />
          </div>
        </div>
      </main>
    </div>
  );
}
