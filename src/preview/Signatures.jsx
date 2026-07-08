import React from 'react';

const Signatures = ({ company, docType }) => {
  // ================= AGREEMENT SIGNATURE STYLE =================
  if (docType === 'agreement') {
    return (
      <div className="w-full flex justify-between items-end mt-8">
        {/* Client Signature */}
        <div className="w-40 flex flex-col items-center">
          <div className="h-16 w-full border-b border-gray-400"></div>
          <div className="w-full pt-2 text-[10px] font-bold text-gray-800 text-center uppercase tracking-wider">
            Client Signature
          </div>
        </div>
        
        {/* Company Signature */}
        <div className="w-40 flex flex-col items-center">
          <div className="h-16 w-full flex justify-center items-end border-b border-gray-400 relative pb-1">
            {company?.seal && (
              <img src={company.seal} alt="Seal" className="absolute h-16 opacity-20 bottom-0 mix-blend-multiply" />
            )}
            {company?.signature && (
              <img src={company.signature} alt="Sign" className="h-12 object-contain relative z-10" />
            )}
          </div>
          <div className="w-full pt-2 text-[10px] font-bold text-gray-800 text-center uppercase tracking-wider">
            Authorized Signatory
          </div>
        </div>
      </div>
    );
  }

  // ================= INVOICE / QUOTATION SIGNATURE STYLE =================
  return (
    <div className="relative w-48 flex flex-col items-center">
      <div className="h-20 w-full flex justify-center items-center relative pb-1">
         {company?.seal && (
           <img src={company.seal} alt="Seal" className="absolute h-24 opacity-20 right-0 top-0 -z-10 mix-blend-multiply" />
         )}
         {company?.signature && (
           <img src={company.signature} alt="Signature" className="h-16 object-contain z-10" />
         )}
      </div>
      <div className="border-t-2 w-full border-gray-800 pt-1 mt-1 text-center">
        <p className="text-[10px] font-bold text-gray-900 uppercase">Authorized Signatory</p>
        <p className="text-[9px] text-gray-500 truncate">{company?.name}</p>
      </div>
    </div>
  );
};

export default Signatures;