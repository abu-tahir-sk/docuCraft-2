import React from 'react';

const CompanyForm = ({ company, setCompany, handleImageUpload, docSettings, handleTypoChange }) => {
  // ছবি মুছে ফেলার ফাংশন
  const handleRemoveImage = (field) => {
    setCompany({ ...company, [field]: null });
  };

  const currentCompSettings = docSettings?.typo?.compName || { size: 28, weight: '800' };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Company Name</label>
        <div className="flex gap-2 mt-1">
          <input type="text" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} className="flex-1 p-2.5 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. DocuCraft Ltd." />
          <div className="flex gap-2 shrink-0">
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden w-16">
              <input type="number" value={currentCompSettings.size} onChange={(e) => handleTypoChange('compName', 'size', Number(e.target.value))} className="w-full p-2 text-sm font-bold text-center bg-transparent outline-none text-gray-900 dark:text-white" title="Font Size" />
            </div>
            <select value={currentCompSettings.weight} onChange={(e) => handleTypoChange('compName', 'weight', e.target.value)} className="w-24 p-2 text-sm font-semibold border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none cursor-pointer" title="Font Weight">
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
              <option value="900">Black</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">GSTIN</label>
          <input type="text" value={company.gst} onChange={(e) => setCompany({ ...company, gst: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="22AAAAA0000A1Z5" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">PAN / Tax ID</label>
          <input type="text" value={company.pan} onChange={(e) => setCompany({ ...company, pan: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="ABCDE1234F" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Email</label>
          <input type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="billing@company.com" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Phone</label>
          <input type="text" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 98765 43210" />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Address</label>
        <textarea value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="w-full p-2.5 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm h-20 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full company address..." />
      </div>

      {/* ================= UPLOAD & PREVIEW SECTION ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        
        {/* Logo Upload/Preview */}
        <div className="flex flex-col items-center">
          <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-2">Company Logo</label>
          {company.logo ? (
            <div className="w-full relative border border-gray-200 dark:border-gray-700 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <img src={company.logo} alt="Logo" className="h-10 mx-auto object-contain" />
              <button onClick={() => handleRemoveImage('logo')} className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-2 hover:underline w-full">Remove</button>
            </div>
          ) : (
            <div className="w-full border border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
               <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companyLogo')} className="w-full text-[10px] text-gray-500" />
            </div>
          )}
        </div>

        {/* Signature Upload/Preview */}
        <div className="flex flex-col items-center">
          <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-2">Signature</label>
          {company.signature ? (
            <div className="w-full relative border border-gray-200 dark:border-gray-700 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <img src={company.signature} alt="Sign" className="h-10 mx-auto object-contain" />
              <button onClick={() => handleRemoveImage('signature')} className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-2 hover:underline w-full">Remove</button>
            </div>
          ) : (
            <div className="w-full border border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
               <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySignature')} className="w-full text-[10px] text-gray-500" />
            </div>
          )}
        </div>

        {/* Seal Upload/Preview */}
        <div className="flex flex-col items-center">
          <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mb-2">Seal / Stamp</label>
          {company.seal ? (
            <div className="w-full relative border border-gray-200 dark:border-gray-700 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
              <img src={company.seal} alt="Seal" className="h-10 mx-auto object-contain" />
              <button onClick={() => handleRemoveImage('seal')} className="text-[10px] text-red-500 dark:text-red-400 font-bold mt-2 hover:underline w-full">Remove</button>
            </div>
          ) : (
            <div className="w-full border border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
               <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'companySeal')} className="w-full text-[10px] text-gray-500" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CompanyForm;