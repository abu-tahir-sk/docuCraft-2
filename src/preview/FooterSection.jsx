import React from 'react';
import Signatures from './Signatures';

const FooterSection = ({ terms, docType, company, themeColor }) => {
  return (
    <div className="mt-8 pt-6 border-t-2 border-gray-100 w-full">
      
      {/* ================= AGREEMENT FOOTER ================= */}
      {docType === 'agreement' ? (
        <div className="flex flex-col gap-6 w-full">
          {/* Notes for agreement (if any) */}
          {(terms?.notes || terms?.conditions) && (
            <div className="flex gap-6 mb-4">
              {terms?.notes && (
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Notes</h4>
                  <p className="text-[9px] text-gray-600 whitespace-pre-wrap">{terms.notes}</p>
                </div>
              )}
              {terms?.conditions && (
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Terms</h4>
                  <p className="text-[9px] text-gray-600 whitespace-pre-wrap">{terms.conditions}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Agreement Signatures (Full Width) */}
          <Signatures company={company} docType={docType} />
        </div>
      ) : (

      /* ================= INVOICE / QUOTATION FOOTER ================= */
        <div className="flex justify-between items-start gap-8">
          <div className="w-2/3 flex flex-col gap-4">
            {terms?.notes && (
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Notes</h4>
                <p className="text-[10px] text-gray-700 whitespace-pre-wrap leading-relaxed">{terms.notes}</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              {terms?.conditions && (
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Terms & Conditions</h4>
                  <p className="text-[9px] text-gray-600 whitespace-pre-wrap leading-relaxed">{terms.conditions}</p>
                </div>
              )}
              {terms?.bankDetails && (
                <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase mb-2 tracking-wider">Payment Details</h4>
                  <p className="text-[9px] text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">{terms.bankDetails}</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-1/3 flex justify-end">
            <Signatures company={company} docType={docType} />
          </div>
        </div>
      )}

      {/* Footer Colored Ribbon */}
      <div className="h-1.5 w-full mt-8" style={{ backgroundColor: themeColor }}></div>
    </div>
  );
};

export default FooterSection;