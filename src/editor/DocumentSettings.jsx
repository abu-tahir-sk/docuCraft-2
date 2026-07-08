// import React from 'react';

// const DocumentSettings = ({ 
//   docSettings, setDocSettings,
//   wmMode, setWmMode, wmText, setWmText, 
//   wmLogo, setWmLogo, wmIntensity, setWmIntensity, 
//   wmSpacing, setWmSpacing, wmSpread, setWmSpread, 
//   handleImageUpload 
// }) => {
//   const currencies = ['₹ INR', '$ USD', '€ EUR', '£ GBP', '৳ BDT', 'د.إ AED'];
//   const statuses = ['Draft', 'Paid', 'Unpaid', 'Overdue', 'Accepted', 'Rejected'];
//   const fontFamilies = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato'];

//   return (
//     <div className="space-y-6 animate-fadeIn pb-10">
      
//       {/* ================= GENERAL SETTINGS (Status & Currency) ================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Document Status</label>
//           <select value={docSettings.status} onChange={(e) => setDocSettings({ ...docSettings, status: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
//             {statuses.map(s => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>

//         <div>
//           <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Currency</label>
//           <select value={docSettings.currency} onChange={(e) => setDocSettings({ ...docSettings, currency: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
//             {currencies.map(c => <option key={c} value={c.split(' ')[0]}>{c}</option>)}
//           </select>
//         </div>

//         <div>
//           <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Font Family</label>
//           <select value={docSettings.fontFamily} onChange={(e) => setDocSettings({ ...docSettings, fontFamily: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
//             {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
//           </select>
//         </div>

//         <div>
//           <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Page Size</label>
//           <select value={docSettings.pageSize} onChange={(e) => setDocSettings({ ...docSettings, pageSize: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all">
//             <option value="A4">A4</option>
//             <option value="Letter">Letter</option>
//             <option value="Legal">Legal</option>
//           </select>
//         </div>
//       </div>

//       <hr className="border-gray-200 dark:border-gray-700 my-6" />

//       {/* ================= WATERMARK SETTINGS ================= */}
//       <div>
//         <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-2">Watermark Settings</label>
//         <select value={wmMode} onChange={(e)=> setWmMode(e.target.value)} className="w-full p-2.5 mb-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
//            <option value="disabled">None (No Watermark)</option>
//            <option value="single_text">Single Text Overlay</option>
//            <option value="text_tiling">Text Tiling (Pattern)</option>
//            <option value="single_logo">Single Logo Overlay</option>
//            <option value="logo_tiling">Logo Tiling (Pattern)</option>
//         </select>

//         {wmMode !== 'disabled' && (
//           <div className="space-y-5 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            
//             {wmMode.includes('text') && (
//               <div>
//                 <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Watermark Text</label>
//                 <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value.toUpperCase())} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. PAID, DRAFT, CONFIDENTIAL" />
//               </div>
//             )}

//             {wmMode.includes('logo') && (
//               <div>
//                 <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Watermark Logo</label>
//                 {wmLogo ? (
//                   <div className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 mt-1">
//                     <img src={wmLogo} alt="Watermark" className="h-10 object-contain" />
//                     <button onClick={() => setWmLogo(null)} className="text-[10px] bg-red-100 text-red-600 px-3 py-1.5 rounded font-bold hover:bg-red-200">Remove</button>
//                   </div>
//                 ) : (
//                   <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'wmLogo')} className="w-full text-xs p-2.5 mt-1 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500" />
//                 )}
//               </div>
//             )}

//             {/* Sliders */}
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Opacity</label>
//                 <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{wmIntensity}%</span>
//               </div>
//               <input type="range" min="1" max="100" value={wmIntensity} onChange={(e) => setWmIntensity(e.target.value)} className="w-full accent-blue-600 cursor-pointer" />
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Size / Spacing</label>
//                 <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{wmSpacing}px</span>
//               </div>
//               <input type="range" min="20" max="800" value={wmSpacing} onChange={(e) => setWmSpacing(e.target.value)} className="w-full accent-blue-600 cursor-pointer" />
//             </div>

//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Rotation / Spread</label>
//                 <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{wmSpread}°</span>
//               </div>
//               <input type="range" min="-90" max="90" value={wmSpread} onChange={(e) => setWmSpread(e.target.value)} className="w-full accent-blue-600 cursor-pointer" />
//             </div>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DocumentSettings;


// import React from 'react';
// import { Maximize, Type, Image as ImageIcon, Grid } from 'lucide-react';

// const DocumentSettings = ({ 
//   docSettings, setDocSettings, docMeta, setDocMeta,
//   wmMode, setWmMode, wmText, setWmText, wmLogo, setWmLogo, 
//   wmIntensity, setWmIntensity, wmSpacing, setWmSpacing, 
//   wmSpread, setWmSpread, wmColor, setWmColor, centerLogo, setCenterLogo,
//   handleImageUpload
// }) => {
//   const currencies = ['₹ INR', '$ USD', '€ EUR', '£ GBP', '৳ BDT', 'د.إ AED'];
//   const statuses = ['Draft', 'Paid', 'Unpaid', 'Overdue', 'Accepted', 'Rejected'];
//   const fontFamilies = ['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato'];

//   const WatermarkOption = ({ id, label, icon }) => {
//     const isActive = wmMode === id;
//     return (
//       <div onClick={() => setWmMode(id)} className={`flex items-center justify-between p-2.5 border rounded-lg cursor-pointer transition-all ${isActive ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
//         <div className="flex items-center gap-2 text-xs font-bold">{icon} {label}</div>
//         <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`} />
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6 animate-fadeIn pb-10">
//       {/* Basic Settings */}
//       <div className="grid grid-cols-2 gap-4">
//         <div><label className="text-[10px] font-bold uppercase">Status</label><select value={docSettings.status} onChange={(e) => setDocSettings({ ...docSettings, status: e.target.value })} className="w-full p-2 mt-1 border rounded-lg text-sm">{statuses.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
//         <div><label className="text-[10px] font-bold uppercase">Currency</label><select value={docSettings.currency} onChange={(e) => setDocSettings({ ...docSettings, currency: e.target.value })} className="w-full p-2 mt-1 border rounded-lg text-sm">{currencies.map(c => <option key={c} value={c.split(' ')[0]}>{c}</option>)}</select></div>
//       </div>

//       {/* Colors */}
//       <div className="grid grid-cols-4 gap-2">
//         <div><label className="text-[9px] font-bold uppercase">Theme</label><input type="color" value={docMeta.themeColor} onChange={(e) => setDocMeta({ ...docMeta, themeColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" /></div>
//         <div><label className="text-[9px] font-bold uppercase">Paper</label><input type="color" value={docMeta.paperColor || '#FFFFFF'} onChange={(e) => setDocMeta({ ...docMeta, paperColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" /></div>
//         <div><label className="text-[9px] font-bold uppercase">Text</label><input type="color" value={docMeta.textColor || '#1F2937'} onChange={(e) => setDocMeta({ ...docMeta, textColor: e.target.value })} className="w-full h-8 rounded cursor-pointer" /></div>
//         <div><label className="text-[9px] font-bold uppercase">WM</label><input type="color" value={wmColor} onChange={(e) => setWmColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" /></div>
//       </div>

//       {/* Watermark Settings */}
//       <div className="space-y-3">
//         <label className="text-[10px] font-bold uppercase">Watermark Synthesis</label>
//         <div className="grid grid-cols-2 gap-2">
//           <WatermarkOption id="disabled" label="NONE" icon={<Maximize size={14} />} />
//           <WatermarkOption id="single_text" label="TEXT" icon={<Type size={14} />} />
//           <WatermarkOption id="single_logo" label="LOGO" icon={<ImageIcon size={14} />} />
//           <WatermarkOption id="text_tiling" label="TILING" icon={<Grid size={14} />} />
//         </div>
        
//         {wmMode !== 'disabled' && (
//           <div className="bg-gray-50 p-4 rounded-lg space-y-4">
//              {wmMode.includes('text') && <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value.toUpperCase())} className="w-full p-2 border rounded text-sm" placeholder="Watermark Text" />}
//              {wmMode.includes('logo') && (
//                 <div className="flex gap-2">
//                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'wmLogo')} className="text-xs" />
//                    {wmLogo && <button onClick={() => setWmLogo(null)} className="text-xs text-red-500">Remove</button>}
//                 </div>
//              )}
//              <div className="space-y-1">
//                 <label className="text-[9px] uppercase font-bold">Opacity</label>
//                 <input type="range" min="1" max="100" value={wmIntensity} onChange={(e) => setWmIntensity(e.target.value)} className="w-full" />
//              </div>
//              <div className="space-y-1">
//                 <label className="text-[9px] uppercase font-bold">Size</label>
//                 <input type="range" min="20" max="800" value={wmSpacing} onChange={(e) => setWmSpacing(e.target.value)} className="w-full" />
//              </div>
//              <div className="space-y-1">
//                 <label className="text-[9px] uppercase font-bold">Spread</label>
//                 <input type="range" min="-90" max="90" value={wmSpread} onChange={(e) => setWmSpread(e.target.value)} className="w-full" />
//              </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DocumentSettings; 

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
  const statuses = ['Draft', 'Paid', 'Unpaid', 'Overdue', 'Accepted', 'Rejected'];
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

      {/* 2. Colors Section */}
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
              <button key={color} onClick={() => setDocMeta({ ...docMeta, themeColor: color })} className={`w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 ${docMeta.themeColor === color ? 'ring-2 ring-blue-500' : ''}`} style={{ backgroundColor: color }} />
            ))}
        </div>
      </div>

      {/* 3. Security Overlays */}
      <div>
        <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">Security Overlays</label>
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer transition-colors" onClick={() => setCenterLogo(!centerLogo)}>
          <span className="text-xs font-bold text-gray-900 dark:text-white">CENTER LOGO</span>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${centerLogo ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${centerLogo ? 'left-5.5' : 'left-0.5'}`}></div>
          </div>
        </div>
      </div>

      {/* 4. Watermark Synthesis */}
      <div>
        <label className="text-[10px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-2 block">Watermark Synthesis</label>
        <div className="grid grid-cols-1 gap-2">
          <WatermarkOption id="disabled" label="DISABLED" icon={<Maximize size={15} />} />
          <WatermarkOption id="single_text" label="SINGLE TEXT" icon={<Type size={15} />} />
          <WatermarkOption id="single_logo" label="SINGLE LOGO" icon={<ImageIcon size={15} />} />
          <WatermarkOption id="text_tiling" label="TEXT TILING" icon={<Copy size={15} />} />
          <WatermarkOption id="logo_tiling" label="LOGO TILING" icon={<Grid size={15} />} />
        </div>
      </div>

      {/* 5. Dynamic Watermark Controls */}
      {wmMode !== 'disabled' && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
           {wmMode.includes('text') && <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value.toUpperCase())} className="w-full p-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-gray-900 dark:text-white text-sm" placeholder="Watermark Text" />}
           {wmMode.includes('logo') && (
              <div className="flex gap-2">
                 <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'wmLogo')} className="text-xs text-gray-500 dark:text-gray-400" />
                 {wmLogo && <button onClick={() => setWmLogo(null)} className="text-xs text-red-500">Remove</button>}
              </div>
           )}
           <div className="space-y-1"><label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Pattern Intensity</label><input type="range" min="1" max="100" value={wmIntensity} onChange={(e) => setWmIntensity(e.target.value)} className="w-full accent-blue-600" /></div>
           <div className="space-y-1"><label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Grain & Spacing</label><input type="range" min="20" max="800" value={wmSpacing} onChange={(e) => setWmSpacing(e.target.value)} className="w-full accent-blue-600" /></div>
           <div className="space-y-1"><label className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400">Font/Icon Spread</label><input type="range" min="-90" max="90" value={wmSpread} onChange={(e) => setWmSpread(e.target.value)} className="w-full accent-blue-600" /></div>
        </div>
      )}
    </div>
  );
};

export default DocumentSettings;

