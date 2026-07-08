import React from 'react';
import { formatDate } from '../utils';

const HeaderSection = ({ company, docMeta, docType }) => {
  const themeColor = docMeta?.themeColor || '#2563EB';

  return (
    <div className="flex justify-between items-start border-b-2 pb-6 mb-6" style={{ borderColor: themeColor }}>
      {/* Left: Company Info */}
      <div className="w-1/2 pr-4">

      <div className="flex items-center gap-4 mb-3">
          {company?.logo && company.logo !== '' && (
            <img src={company.logo} alt="Company Logo" className="h-14 object-contain" />
          )}
          <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: themeColor }}>
            {company?.name || 'Company Name'}
          </h1>
        </div>
        
        {/* ================= FIX: লোগো এবং নাম এখন দুটোই একসাথে দেখাবে ================= */}
        {/* {company?.logo && company.logo !== '' && (
          <img src={company.logo} alt="Company Logo" className="h-14 object-contain mb-3" />
        )}
        
        <h1 className="text-2xl font-black mb-1 uppercase tracking-wide" style={{ color: themeColor }}>
          {company?.name || 'Company Name'}
        </h1> */}
        {/* =========================================================================== */}

        {company?.tagline && <p className="text-[10px] text-gray-500 italic mb-3">{company.tagline}</p>}
        
        <div className="text-[10px] leading-relaxed text-gray-700 space-y-1">
          {company?.address && <p className="whitespace-pre-wrap pr-4">{company.address}</p>}
          {company?.phone && <p><strong>Phone:</strong> {company.phone}</p>}
          {company?.email && <p><strong>Email:</strong> {company.email}</p>}
          
          <div className="flex flex-wrap gap-x-4 pt-1">
            {company?.gst && <p><strong>GSTIN:</strong> {company.gst}</p>}
            {company?.pan && <p><strong>PAN:</strong> {company.pan}</p>}
          </div>
        </div>
      </div>

      {/* Right: Meta Information */}
      <div className="w-1/2 flex flex-col items-end text-right">
        <h2 className="text-3xl font-black uppercase tracking-widest" style={{ color: themeColor }}>
          {docMeta?.title}
        </h2>
        
        <div className="mt-4 text-[10px] space-y-1.5 text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100 min-w-[200px]">
          <p className="flex justify-between gap-4">
            <span className="font-bold text-gray-500 uppercase">{docType === 'quotation' ? 'Quote #' : docType === 'agreement' ? 'Agr #' : 'Inv #'}</span> 
            <span className="font-bold">{docMeta?.number}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="font-bold text-gray-500 uppercase">Issue Date:</span> 
            <span>{formatDate(docMeta?.date)}</span>
          </p>
          {docType !== 'agreement' && docMeta?.dueDate && (
            <p className="flex justify-between gap-4">
              <span className="font-bold text-gray-500 uppercase">Valid Till:</span> 
              <span>{formatDate(docMeta?.dueDate)}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;