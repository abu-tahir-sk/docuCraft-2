import React from 'react';
import HeaderSection from '../preview/HeaderSection';
import FooterSection from '../preview/FooterSection';
import { numberToWords, formatDate } from '../utils'; 

const DocumentLayout = ({ 
  docType, company, client, docMeta, items, 
  clauses, terms, financials, settings, currency, centerLogo, status
}) => {
  const themeColor = docMeta?.themeColor || '#2563EB';

  const subtotal = items?.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0;
  const taxAmount = items?.reduce((sum, item) => sum + ((item.qty * item.price) * (item.taxRate / 100)), 0) || 0;
  const discount = Number(financials?.discount) || 0;
  const shipping = Number(financials?.shipping) || 0;
  const grandTotal = subtotal - discount + taxAmount + shipping;

  const getBadgeStyle = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'paid': case 'accepted': return { bg: '#0f291e', text: '#4ade80' };
      case 'unpaid': case 'pending': return { bg: '#2a1a09', text: '#fbbf24' };
      case 'overdue': case 'rejected': return { bg: '#2a0e10', text: '#f87171' };
      default: return { bg: '#1e293b', text: '#94a3b8' };
    }
  };
  const badgeStyle = getBadgeStyle(status);

  return (
    <div className="w-full bg-transparent text-gray-900 flex flex-col relative z-10 p-12 box-border" style={{ fontFamily: settings?.fontFamily, minHeight: '297mm' }}>
      
      {/* Center Logo Overlay */}
      {centerLogo && company?.logo && company.logo !== '' && (
        <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none z-0">
          <img src={company.logo} alt="Center Logo" className="w-96 object-contain grayscale" />
        </div>
      )}

      {/* 1. HEADER */}
      <HeaderSection company={company} docMeta={docMeta} docType={docType} />

      {/* 2. CLIENT INFO & STATUS BADGE */}
      {docType !== 'agreement' && (
        <div className="mb-6 flex justify-between relative z-10">
          <div className="w-1/2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">Bill To</h3>
            <h4 className="text-sm font-bold text-gray-800">{client?.name || 'Client Name'}</h4>
            {client?.contactPerson && <p className="text-[10px] text-gray-600 mt-1"><strong>Attn:</strong> {client.contactPerson}</p>}
            <p className="text-[10px] text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">{client?.billingAddress}</p>
            <div className="flex gap-4 mt-2 text-[10px] text-gray-600">
              {client?.phone && <p><strong>Ph:</strong> {client.phone}</p>}
              {client?.gst && <p><strong>GST:</strong> {client.gst}</p>}
            </div>

            {/* ====== NEW STATUS BADGE POSITION ====== */}
            {status && status !== 'None' && (
              <div className="mt-4">
                <span 
                  className="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest inline-block shadow-sm"
                  style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                >
                  {status}
                </span>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* 3. DOCUMENT BODY */}
      <div className="flex-1 relative z-10">
        
        {/* --- INVOICE TABLE --- */}
        {docType !== 'agreement' && (
          <div className="mb-6 mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[9px] uppercase text-white tracking-wider" style={{ backgroundColor: themeColor }}>
                  <th className="py-2.5 px-3 font-bold w-8 text-center rounded-tl-sm">#</th>
                  <th className="py-2.5 px-3 font-bold">Item Description</th>
                  <th className="py-2.5 px-2 font-bold w-16 text-center">HSN</th>
                  <th className="py-2.5 px-2 font-bold w-12 text-center">Qty</th>
                  <th className="py-2.5 px-2 font-bold w-14 text-center">Unit</th>
                  <th className="py-2.5 px-3 font-bold w-20 text-right">Price</th>
                  <th className="py-2.5 px-2 font-bold w-14 text-center">Tax</th>
                  <th className="py-2.5 px-3 font-bold w-24 text-right rounded-tr-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, idx) => {
                  const itemTotal = (item.qty * item.price) + ((item.qty * item.price) * (item.taxRate / 100));
                  return (
                    <tr key={idx} className="border-b border-gray-200 text-[10px] align-top bg-transparent">
                      <td className="py-3 px-3 text-center text-gray-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-800">{item.name}</p>
                        {item.description && <p className="text-gray-500 mt-1 text-[9px] leading-relaxed">{item.description}</p>}
                      </td>
                      <td className="py-3 px-2 text-center text-gray-600">{item.hsn || '-'}</td>
                      <td className="py-3 px-2 text-center text-gray-800">{item.qty}</td>
                      <td className="py-3 px-2 text-center text-gray-500">{item.unit}</td>
                      <td className="py-3 px-3 text-right text-gray-800">{currency}{item.price.toFixed(2)}</td>
                      <td className="py-3 px-2 text-center text-gray-500">{item.taxRate}%</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">{currency}{itemTotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* --- AGREEMENT CLAUSES --- */}
        {docType === 'agreement' && (
          <div className="mb-6 space-y-6">
            <div className="text-center mb-8 bg-gray-50 py-4 px-6 rounded-lg border border-gray-100 relative">
              
              {/* ====== AGREEMENT STATUS BADGE POSITION ====== */}
              {status && status !== 'None' && (
                <div className="absolute top-4 right-4">
                  <span 
                    className="px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest inline-block shadow-sm"
                    style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                  >
                    {status}
                  </span>
                </div>
              )}

              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
                This Agreement is made on {formatDate(docMeta?.date)}
              </h3>
              <p className="text-[11px] mt-2 text-gray-600 uppercase tracking-wider">
                Between <strong className="text-gray-900 text-[12px]">{company?.name}</strong> And <strong className="text-gray-900 text-[12px]">{client?.name}</strong>
              </p>
            </div>
            
            {clauses?.map((clause, idx) => (
              <div key={idx} className="text-[11px] text-justify flex gap-4 pl-2">
                <span className="font-black w-6 text-right shrink-0 text-sm" style={{ color: themeColor }}>{idx + 1}.</span>
                <div className="border-l-2 pl-4 py-0.5" style={{ borderColor: `${themeColor}40` }}>
                  <h4 className="font-bold mb-1.5 text-[12px] uppercase tracking-wide text-gray-800">{clause.title}</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{clause.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. SUMMARY */}
        {docType !== 'agreement' && (
          <div className="flex justify-between items-start mb-8 mt-6">
            <div className="w-1/2 pt-2 pr-6">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Amount in Words:</p>
              <p className="text-[10px] font-bold text-gray-800 mt-1 italic capitalize leading-relaxed">
                {currency} {numberToWords(grandTotal)}
              </p>
            </div>
            
            <div className="w-1/2 flex justify-end">
              <div className="w-full max-w-[260px] bg-gray-50/80 p-4 rounded-lg border border-gray-200">
                <table className="w-full text-[10px]">
                  <tbody>
                    <tr>
                      <td className="py-1.5 text-gray-600 font-bold">Subtotal:</td>
                      <td className="py-1.5 text-right text-gray-900">{currency} {subtotal.toFixed(2)}</td>
                    </tr>
                    {discount > 0 && (
                      <tr>
                        <td className="py-1.5 text-red-500 font-bold">Discount:</td>
                        <td className="py-1.5 text-right text-red-500">- {currency} {discount.toFixed(2)}</td>
                      </tr>
                    )}
                    {taxAmount > 0 && (
                      <tr>
                        <td className="py-1.5 text-gray-600 font-bold">Total Tax:</td>
                        <td className="py-1.5 text-right text-gray-900">{currency} {taxAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    {shipping > 0 && (
                      <tr>
                        <td className="py-1.5 text-gray-600 font-bold">Shipping/Freight:</td>
                        <td className="py-1.5 text-right text-gray-900">{currency} {shipping.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr className="border-t border-gray-300">
                      <td className="pt-3 pb-1 text-[12px] font-black uppercase" style={{ color: themeColor }}>Grand Total:</td>
                      <td className="pt-3 pb-1 text-[12px] font-black text-right" style={{ color: themeColor }}>
                        {currency} {grandTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. FOOTER */}
      <div className="mt-auto relative z-10">
        <FooterSection terms={terms} docType={docType} company={company} themeColor={themeColor} />
      </div>

    </div>
  );
};

export default DocumentLayout;


