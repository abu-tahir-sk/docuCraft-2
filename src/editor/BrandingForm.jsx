import React from 'react';
import { Maximize, Type, Image as ImageIcon, Copy, Grid, Palette, ChevronUp } from 'lucide-react';

const BrandingForm = ({ 
  docMeta, setDocMeta, wmMode, setWmMode, wmText, setWmText, 
  wmLogo, setWmLogo, wmIntensity, setWmIntensity, wmSpacing, setWmSpacing, 
  wmSpread, setWmSpread, centerLogo, setCenterLogo, handleImageUpload, themeColors 
}) => {

  const WatermarkOption = ({ id, label, icon }) => {
    const isActive = wmMode === id;
    return (
      <div
        onClick={() => setWmMode(id)}
        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${isActive ? 'border-[#8C4A28] dark:border-orange-500 bg-[#F8EFEA] dark:bg-orange-900/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${isActive ? 'border-transparent bg-white dark:bg-gray-800 shadow-sm text-[#8C4A28] dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
            {icon}
          </div>
          <span className="font-extrabold text-[13px] text-gray-900 dark:text-white tracking-wide">{label}</span>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-[#8C4A28] dark:border-orange-400' : 'border-gray-300 dark:border-gray-600'}`}>
          {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#8C4A28] dark:bg-orange-400" />}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-10">
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden shadow-sm transition-colors duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F8EFEA] dark:bg-orange-900/30 text-[#8C4A28] dark:text-orange-400 flex items-center justify-center">
              <Palette size={16} />
            </div>
            <span className="font-extrabold text-[13px] text-gray-900 dark:text-white tracking-wide uppercase">Branding System</span>
          </div>
          <ChevronUp size={18} className="text-gray-500 dark:text-gray-400" />
        </div>

        <div className="p-6 space-y-8 bg-[#FCFAF8] dark:bg-gray-900">
          
          {/* Theme Colors & Paper Color */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Theme Color</label>
              <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:border-orange-500 transition-colors">
                <input type="color" value={docMeta.themeColor} onChange={(e) => setDocMeta({ ...docMeta, themeColor: e.target.value })} className="w-full h-8 border-0 rounded cursor-pointer" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Paper Color</label>
              <div className="p-1 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:border-orange-500 transition-colors">
                <input type="color" value={docMeta.paperColor || '#FFFFFF'} onChange={(e) => setDocMeta({ ...docMeta, paperColor: e.target.value })} className="w-full h-8 border-0 rounded cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Quick Color Palette */}
          <div className="flex flex-wrap gap-2 justify-between">
            {themeColors.map((color) => (
              <button key={color} type="button" onClick={() => setDocMeta({ ...docMeta, themeColor: color })}
                className={`w-6 h-6 rounded-full transition-all duration-200 shadow-sm ${docMeta.themeColor === color ? 'ring-2 ring-offset-2 ring-gray-800 dark:ring-gray-300 scale-110' : 'border border-gray-300 dark:border-gray-600 hover:scale-110'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Security Overlays */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Security Overlays</label>
            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setCenterLogo(!centerLogo)}>
              <span className="font-extrabold text-[12px] text-gray-900 dark:text-white tracking-wide">CENTER LOGO</span>
              <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 shadow-inner ${centerLogo ? 'bg-[#8C4A28] dark:bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-sm ${centerLogo ? 'left-6' : 'left-1'}`}></div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Watermark Radio Cards */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-3 uppercase">Watermark Synthesis</label>
            <div className="space-y-3">
              <WatermarkOption id="disabled" label="DISABLED" icon={<Maximize size={15} />} />
              <WatermarkOption id="single_text" label="SINGLE TEXT" icon={<Type size={15} />} />
              <WatermarkOption id="single_logo" label="SINGLE LOGO" icon={<ImageIcon size={15} />} />
              <WatermarkOption id="text_tiling" label="TEXT TILING" icon={<Copy size={15} />} />
              <WatermarkOption id="logo_tiling" label="LOGO TILING" icon={<Grid size={15} />} />
            </div>
          </div>

          {/* Dynamic Inputs & Sliders */}
          {wmMode !== 'disabled' && (
            <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm space-y-6">
              
              {wmMode.includes('text') && (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest mb-2 uppercase">Watermark Text</label>
                  <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value.toUpperCase())} className="w-full p-3.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-black tracking-widest text-gray-900 dark:text-white bg-[#FCFAF8] dark:bg-gray-900 shadow-inner focus:outline-none focus:border-[#8C4A28] dark:focus:border-orange-500 transition-all uppercase" />
                </div>
              )}

              {wmMode.includes('logo') && (
                <div>
                  <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-wider mb-2 uppercase">Watermark Logo</label>
                  {wmLogo ? (
                    <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-[#FCFAF8] dark:bg-gray-900">
                      <img src={wmLogo} alt="Watermark" className="h-10 object-contain" />
                      <button onClick={() => setWmLogo(null)} className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded font-bold hover:bg-red-200 dark:hover:bg-red-900/50">Remove</button>
                    </div>
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'wmLogo')} className="w-full text-xs p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400" />
                  )}
                </div>
              )}

              <hr className="border-gray-100 dark:border-gray-700" />

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase">Pattern Intensity</label>
                    <span className="text-[11px] font-black text-[#8C4A28] dark:text-orange-400">{wmIntensity}%</span>
                  </div>
                  <input type="range" min="1" max="100" value={wmIntensity} onChange={(e) => setWmIntensity(e.target.value)} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8C4A28] dark:accent-orange-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase">Grain & Spacing</label>
                    <span className="text-[11px] font-black text-[#8C4A28] dark:text-orange-400">{wmSpacing}px</span>
                  </div>
                  <input type="range" min="10" max="800" value={wmSpacing} onChange={(e) => setWmSpacing(e.target.value)} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8C4A28] dark:accent-orange-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase">Font/Icon Spread</label>
                    <span className="text-[11px] font-black text-[#8C4A28] dark:text-orange-400">{wmSpread}</span>
                  </div>
                  <input type="range" min="0" max="100" value={wmSpread} onChange={(e) => setWmSpread(e.target.value)} className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8C4A28] dark:accent-orange-500" />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BrandingForm;

