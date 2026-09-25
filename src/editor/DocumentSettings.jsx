
import React from 'react';
import { Maximize, Type, Image as ImageIcon, Copy, Grid } from 'lucide-react';

const DocumentSettings = ({
   docSettings, setDocSettings, docMeta, setDocMeta,
   wmMode, setWmMode, wmText, setWmText, wmLogo, setWmLogo,
   wmIntensity, setWmIntensity, wmSpacing, setWmSpacing,
   wmSpread, setWmSpread, wmColor, setWmColor, centerLogo, setCenterLogo,
   handleImageUpload, themeColors
 }) => {
  const currencies = ['₹ INR', '$ USD', '€ EUR', '£ GBP', '৳ BDT', 'د.إ AED'];
  const statuses = [
   'Draft', 'Sent', 'Viewed', 'Pending', 'Partially Paid', 'Paid', 'Unpaid', 
   'Overdue', 'Cancelled', 'Accepted', 'Rejected', 'Expired', 'Under Review', 
   'Pending Signature', 'Signed', 'Active', 'Terminated'
  ];
  const fontFamilies = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato'];
  const pageSizes = ['A4', 'Letter', 'Legal'];

  const WatermarkOption = ({ id, label, icon }) => {
    const isActive = wmMode === id;
    return (
      <div
         onClick={() => setWmMode(id)}
         className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all
         ${isActive ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'}`}
      >
        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>{icon}</div>
        <span className="text-xs font-bold text-gray-900 dark:text-white tracking-widest">{label}</span>
      </div>
    );
  };

  // Typography Handler
  const handleTypoChange = (key, field, value) => {
    setDocSettings(prev => ({
      ...prev,
      typo: {
        ...prev.typo,
        [key]: {
          ...prev.typo?.[key],
          [field]: value
        }
      }
    }));
  };

  const typoConfig = [
    { key: 'compName', label: 'Company Name' },
    { key: 'docTitle', label: 'Document Title' }
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Basic Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Status</label>
          <select value={docSettings.status} onChange={(e) => setDocSettings({ ...docSettings, status: e.target.value })} className="w-full p-2.5 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Currency</label>
          <select value={docSettings.currency} onChange={(e) => setDocSettings({ ...docSettings, currency: e.target.value })} className="w-full p-2.5 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
            {currencies.map(c => <option key={c} value={c.split(' ')[0]}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Font Family</label>
          <select value={docSettings.fontFamily} onChange={(e) => setDocSettings({ ...docSettings, fontFamily: e.target.value })} className="w-full p-2.5 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
            {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Page Size</label>
          <select value={docSettings.pageSize} onChange={(e) => setDocSettings({ ...docSettings, pageSize: e.target.value })} className="w-full p-2.5 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white outline-none">
            {pageSizes.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>



      {/* 3. Colors Section */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
           <div><label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Theme</label><input type="color" value={docMeta.themeColor} onChange={(e) => setDocMeta({ ...docMeta, themeColor: e.target.value })} className="w-full h-8 rounded cursor-pointer mt-1" /></div>
           <div><label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Paper</label><input type="color" value={docMeta.paperColor || '#FFFFFF'} onChange={(e) => setDocMeta({ ...docMeta, paperColor: e.target.value })} className="w-full h-8 rounded cursor-pointer mt-1" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div><label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Text</label><input type="color" value={docMeta.textColor || '#1F2937'} onChange={(e) => setDocMeta({ ...docMeta, textColor: e.target.value })} className="w-full h-8 rounded cursor-pointer mt-1" /></div>
           <div><label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400">Watermark</label><input type="color" value={wmColor} onChange={(e) => setWmColor(e.target.value)} className="w-full h-8 rounded cursor-pointer mt-1" /></div>
        </div>
        <div className="flex flex-wrap gap-2">
            {themeColors.map((color) => (
              <button key={color} type="button" onClick={() => setDocMeta({ ...docMeta, themeColor: color })} className={`w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 ${docMeta.themeColor === color ? 'ring-2 ring-blue-500' : ''}`} style={{ backgroundColor: color }} />
            ))}
        </div>
      </div>

      {/* 4. Security Overlays */}
      <div>
        <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">Security Overlays</label>
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer transition-colors" onClick={() => setCenterLogo(!centerLogo)}>
          <span className="text-xs font-bold text-gray-900 dark:text-white">CENTER LOGO</span>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${centerLogo ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${centerLogo ? 'left-5.5' : 'left-0.5'}`}></div>
          </div>
        </div>
      </div>

      {/* 5. Watermark Synthesis */}
      <div>
        <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">Watermark Synthesis</label>
        <div className="grid grid-cols-1 gap-2">
          <WatermarkOption id="disabled" label="DISABLED" icon={<Maximize size={15} />} />
          <WatermarkOption id="single_text" label="SINGLE TEXT" icon={<Type size={15} />} />
          <WatermarkOption id="single_logo" label="SINGLE LOGO" icon={<ImageIcon size={15} />} />
          <WatermarkOption id="text_tiling" label="TEXT TILING" icon={<Copy size={15} />} />
          <WatermarkOption id="light_text_tiling" label="LIGHT TEXT TILING" icon={<Type size={15} opacity={0.6} />} />
          <WatermarkOption id="logo_tiling" label="LOGO TILING" icon={<Grid size={15} />} />
        </div>
      </div>

      {/* Dynamic Watermark Controls */}
      {wmMode !== 'disabled' && (
        <div className="bg-gray-100 dark:bg-gray-800/80 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4 shadow-sm">
           {wmMode.includes('text') && (
             <div className="space-y-1">
               <label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Watermark Text</label>
               <input 
                 type="text" 
                 value={wmText || ''} 
                 onChange={(e) => setWmText(e.target.value.toUpperCase())} 
                 className="w-full p-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm font-semibold tracking-wider outline-none focus:ring-2 focus:ring-blue-500" 
                 placeholder="e.g. CONFIDENTIAL / PAID" 
               />
             </div>
           )}

           {wmMode.includes('logo') && (
              <div className="space-y-2">
                 <label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Watermark Logo</label>
                 <div className="flex items-center justify-between gap-2 p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'wmLogo')} 
                      className="text-xs text-gray-500 dark:text-gray-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/40 dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer" 
                    />
                    {wmLogo && (
                      <button 
                        type="button" 
                        onClick={() => setWmLogo(null)} 
                        className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    )}
                 </div>
                 {wmLogo ? (
                   <div className="flex items-center gap-2 p-1.5 bg-white/60 dark:bg-gray-900/60 rounded border border-gray-200 dark:border-gray-700">
                     <img src={wmLogo} alt="WM Preview" className="h-7 w-12 object-contain rounded" />
                     <span className="text-[10px] text-green-600 dark:text-green-400 font-medium truncate">Watermark Logo Active</span>
                   </div>
                 ) : (
                   <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">No custom logo selected (uses company logo by default)</p>
                 )}
              </div>
           )}

           <div className="space-y-1">
             <div className="flex justify-between items-center">
               <label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Pattern Intensity</label>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{wmIntensity ?? 15}%</span>
             </div>
             <input 
               type="range" 
               min="1" 
               max="100" 
               value={wmIntensity ?? 15} 
               onChange={(e) => setWmIntensity(Number(e.target.value))} 
               className="w-full accent-blue-600 cursor-pointer" 
             />
           </div>

           <div className="space-y-1">
             <div className="flex justify-between items-center">
               <label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">
                 Grain & Spacing <span className="text-[8px] font-normal lowercase text-gray-400">(lower = denser)</span>
               </label>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{wmSpacing ?? 250}</span>
             </div>
             <input 
               type="range" 
               min="5" 
               max="600" 
               value={wmSpacing ?? 250} 
               onChange={(e) => setWmSpacing(Number(e.target.value))} 
               className="w-full accent-blue-600 cursor-pointer" 
             />
           </div>

           <div className="space-y-1">
             <div className="flex justify-between items-center">
               <label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Font/Icon Spread</label>
               <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{wmSpread ?? -30}°</span>
             </div>
             <input 
               type="range" 
               min="-90" 
               max="90" 
               value={wmSpread ?? -30} 
               onChange={(e) => setWmSpread(Number(e.target.value))} 
               className="w-full accent-blue-600 cursor-pointer" 
             />
           </div>
        </div>
      )}
    </div>
  );
};

export default DocumentSettings;