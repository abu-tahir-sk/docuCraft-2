

import React from 'react';
import { numberToWords, formatDate } from '../utils';

const DocumentLayout = ({
  docType, company, client, docMeta, items,
  clauses, terms, financials, settings, currency, centerLogo, status
}) => {
  const themeColor = docMeta?.themeColor || '#2563EB';
  const textColor = docMeta?.textColor || '#1F2937';

  // Typography Options (কোম্পানির নাম এবং টাইটেল এর জন্য)
  const typo = settings?.typo || {
    compName: { size: 28, weight: '800' },
    docTitle: { size: 28, weight: '300' }
  };

  // Calculations
  const subtotal = items?.reduce((sum, item) => sum + (item.qty * item.price), 0) || 0;
  const taxAmount = items?.reduce((sum, item) => sum + ((item.qty * item.price) * (item.taxRate / 100)), 0) || 0;
  const discount = Number(financials?.discount) || 0;
  const shipping = Number(financials?.shipping) || 0;
  const grandTotal = subtotal - discount + taxAmount + shipping;

  // নরমাল স্ট্যাটাস ব্যাজ কালার (আগের মতো)
  const getBadgeStyle = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'paid': case 'accepted': case 'approved': case 'active': 
        return { bg: '#dcfce7', text: '#166534' }; // Green
      case 'sent': case 'viewed': case 'under review': 
        return { bg: '#e0f2fe', text: '#0369a1' }; // Blue
      case 'unpaid': case 'pending': case 'partially paid': case 'pending signature': 
        return { bg: '#fef9c3', text: '#854d0e' }; // Yellow
      case 'overdue': case 'rejected': case 'cancelled': case 'expired': case 'terminated': 
        return { bg: '#fee2e2', text: '#991b1b' }; // Red
      case 'signed': 
        return { bg: '#f3e8ff', text: '#6b21a8' }; // Purple
      case 'draft': default: 
        return { bg: '#f1f5f9', text: '#475569' }; // Gray
    }
  };
  const badgeStyle = getBadgeStyle(status);

  return (
    <div
      className="w-full bg-transparent flex flex-col relative z-10 box-border overflow-hidden"
      style={{
        fontFamily: settings?.fontFamily || 'Inter, sans-serif',
        color: textColor,
        padding: '15mm 20mm',
        width: '210mm',
        height: '297mm',
        boxSizing: 'border-box',
        lineHeight: '1.4'
      }}
    >


      {/* ================= 1. PREMIUM HEADER ================= */}
      <div className="flex justify-between items-start mb-[20px] pb-[16px] border-b-[2px] relative z-10" style={{ borderColor: themeColor }}>
        
        {/* Company Info */}
        <div className="flex-1 pr-[24px]">
          {company?.logo ? (
            <img src={company.logo} alt="Company Logo" className="h-[50px] object-contain mb-[10px]" />
          ) : null}
          
          <h1 
            className="tracking-tight leading-tight" 
            style={{ 
              fontSize: `${typo?.compName?.size || 26}px`, 
              fontWeight: typo?.compName?.weight || '800', 
              color: themeColor 
            }}
          >
            {company?.name || 'Company Name'}
          </h1>
          
          {company?.tagline && <p className="text-[11px] text-gray-500 italic mt-[2px] mb-[10px]">{company.tagline}</p>}

          <div className="text-[10.5px] text-gray-600 mt-[10px] leading-relaxed">
            {company?.address && <p className="whitespace-pre-wrap">{company.address}</p>}
            {company?.phone && <p className="mt-[4px]">T: {company.phone}</p>}
            {company?.email && <p>E: {company.email}</p>}
            <div className="flex gap-[12px] mt-[4px]">
              {company?.gst && <p>GST: {company.gst}</p>}
              {company?.pan && <p>PAN: {company.pan}</p>}
            </div>
          </div>
        </div>

        {/* Document Meta */}
        <div className="text-right flex flex-col items-end shrink-0">
          <h2 
            className="uppercase tracking-widest text-gray-800 mb-[10px] whitespace-nowrap leading-none" 
            style={{ 
              fontSize: `${typo?.docTitle?.size || 24}px`, 
              fontWeight: typo?.docTitle?.weight || '300' 
            }}
          >
            {docMeta?.title}
          </h2>
          
          <table className="text-[11px] text-gray-700 text-right w-full">
            <tbody>
              <tr>
                <td className="font-semibold py-[4px] pr-[12px] uppercase text-gray-400 border-b border-gray-100">{docType === 'quotation' ? 'Quote No' : docType === 'agreement' ? 'Agr No' : 'Invoice No'}</td>
                <td className="font-bold py-[4px] border-b border-gray-100 text-gray-900">{docMeta?.number}</td>
              </tr>
              <tr>
                <td className="font-semibold py-[4px] pr-[12px] uppercase text-gray-400 border-b border-gray-100">Date</td>
                <td className="py-[4px] border-b border-gray-100">{formatDate(docMeta?.date)}</td>
              </tr>
              {docType !== 'agreement' && docMeta?.dueDate && (
                <tr>
                  <td className="font-semibold py-[4px] pr-[12px] uppercase text-gray-400 border-b border-gray-100">Valid Till</td>
                  <td className="py-[4px] border-b border-gray-100">{formatDate(docMeta?.dueDate)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 2. CLIENT INFO & STATUS BADGE ================= */}
      {docType !== 'agreement' && (
        <div className="mb-[20px] flex justify-between items-start relative z-10">
          <div className="w-[50%] text-[11.5px]">
            <h3 className="font-bold text-gray-400 uppercase tracking-widest mb-[6px] border-b-2 inline-block pb-[3px]" style={{ borderColor: themeColor }}>Billed To</h3>
            <h4 className="text-[13px] font-bold text-gray-900 mt-[4px]">{client?.name || 'Client Name'}</h4>
            {client?.contactPerson && <p className="text-gray-600 mt-[3px]">Attn: {client.contactPerson}</p>}
            <p className="text-gray-600 mt-[3px] whitespace-pre-wrap leading-relaxed max-w-[85%]">{client?.billingAddress}</p>
            <div className="mt-[4px] text-gray-500 text-[11px]">
              {client?.phone && <p>Ph: {client.phone}</p>}
              {client?.gst && <p>GST: {client.gst}</p>}
            </div>

            {/* আগের মতো নরমাল স্ট্যাটাস ব্যাজ */}
            {status && status !== 'None' && (
              <div className="mt-[15px]">
                <span
                  style={{
                    display: "inline-block",
                    textAlign: "center",
                    minWidth: "90px",
                    padding: "6px 12px",
                    backgroundColor: badgeStyle.bg,
                    color: badgeStyle.text,
                    borderRadius: "6px",
                    fontWeight: 800,
                    fontSize: "12px",
                    lineHeight: 1,
                    textTransform: "capitalize"
                  }}
                >
                  {status}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 3. DOCUMENT BODY ================= */}
      <div className="flex-1 relative z-10">
        
        {/* --- INVOICE / QUOTATION TABLE --- */}
        {docType !== 'agreement' && (
          <div className="mb-[20px]">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="uppercase tracking-wider text-gray-500 border-b-2 border-t" style={{ borderColor: themeColor }}>
                  <th className="py-[8px] px-[6px] font-bold w-[5%] text-center">#</th>
                  <th className="py-[8px] px-[6px] font-bold w-[40%]">Description</th>
                  <th className="py-[8px] px-[6px] font-bold w-[12%] text-center">HSN</th>
                  <th className="py-[8px] px-[6px] font-bold w-[8%] text-center">Qty</th>
                  <th className="py-[8px] px-[6px] font-bold w-[15%] text-right">Price</th>
                  <th className="py-[8px] px-[6px] font-bold w-[20%] text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, idx) => {
                  const itemTotal = (item.qty * item.price) + ((item.qty * item.price) * (item.taxRate / 100));
                  return (
                    <tr key={idx} className="border-b border-gray-200 align-top">
                      <td className="py-[10px] px-[6px] text-center text-gray-400">{idx + 1}</td>
                      <td className="py-[10px] px-[6px]">
                        <p className="font-bold text-gray-900 leading-snug">{item.name}</p>
                        {item.description && <p className="text-gray-500 mt-[3px] text-[10.5px] leading-relaxed">{item.description}</p>}
                        {item.taxRate > 0 && <p className="text-gray-400 text-[9.5px] mt-[2px]">Includes {item.taxRate}% Tax</p>}
                      </td>
                      <td className="py-[10px] px-[6px] text-center text-gray-500">{item.hsn || '-'}</td>
                      <td className="py-[10px] px-[6px] text-center text-gray-700">{item.qty} <span className="text-[9.5px] text-gray-400">{item.unit}</span></td>
                      <td className="py-[10px] px-[6px] text-right text-gray-700">{currency}{item.price.toFixed(2)}</td>
                      <td className="py-[10px] px-[6px] text-right font-bold text-gray-900">{currency}{itemTotal.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* --- AGREEMENT CLAUSES --- */}
        {docType === 'agreement' && (
          <div className="mb-[20px] space-y-[20px]">
            <div className="text-center mb-[25px] bg-gray-50 py-[15px] px-[20px] rounded-sm border border-gray-200 relative">
              
              {/* Agreement Status Badge */}
              {status && status !== 'None' && (
                <div className="mb-[10px] flex justify-center">
                  <span
                    className="inline-block text-center font-bold rounded px-3 py-1 uppercase text-[11px] tracking-wider shadow-sm"
                    style={{
                      backgroundColor: badgeStyle.bg,
                      color: badgeStyle.text,
                    }}
                  >
                    {status}
                  </span>
                </div>
              )}

              <h3 className="text-[13px] font-bold uppercase tracking-widest text-gray-900">
                Agreement Execution Date: {formatDate(docMeta?.date)}
              </h3>
              <p className="text-[11px] mt-[6px] text-gray-600 uppercase tracking-wider">
                Between <strong className="text-gray-900">{company?.name}</strong> And <strong className="text-gray-900">{client?.name}</strong>
              </p>
            </div>
            {clauses?.map((clause, idx) => (
              <div key={idx} className="text-[11.5px] text-justify flex gap-[15px]">
                <span className="font-bold w-[20px] text-right shrink-0 text-[13px]" style={{ color: themeColor }}>{idx + 1}.</span>
                <div className="flex-1">
                  <h4 className="font-bold mb-[6px] text-[13px] text-gray-900">{clause.title}</h4>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{clause.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= 4. FINANCIAL SUMMARY ================= */}
        {docType !== 'agreement' && (
          <div className="flex justify-between items-start mb-[25px] mt-[10px]">
            <div className="w-[50%] pt-[6px] pr-[24px]">
              <p className="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest">Amount in Words</p>
              <p className="text-[11px] font-medium text-gray-800 mt-[6px] italic capitalize leading-relaxed border-l-2 pl-[12px]" style={{ borderColor: themeColor }}>
                {currency} {numberToWords(grandTotal)}
              </p>
            </div>
            <div className="w-[45%] flex justify-end">
              <div className="w-full max-w-[260px]">
                <table className="w-full text-[11px]">
                  <tbody>
                    <tr>
                      <td className="py-[4px] text-gray-500 font-medium">Subtotal</td>
                      <td className="py-[4px] text-right text-gray-900">{currency} {subtotal.toFixed(2)}</td>
                    </tr>
                    {discount > 0 && (
                      <tr>
                        <td className="py-[4px] text-gray-500 font-medium">Discount</td>
                        <td className="py-[4px] text-right text-red-600">- {currency} {discount.toFixed(2)}</td>
                      </tr>
                    )}
                    {taxAmount > 0 && (
                      <tr>
                        <td className="py-[4px] text-gray-500 font-medium">Total Tax</td>
                        <td className="py-[4px] text-right text-gray-900">{currency} {taxAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    {shipping > 0 && (
                      <tr>
                        <td className="py-[4px] text-gray-500 font-medium">Shipping & Handling</td>
                        <td className="py-[4px] text-right text-gray-900">{currency} {shipping.toFixed(2)}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan="2" className="pt-[6px]">
                        <div className="border-t-2 border-gray-300 w-full"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="pt-[8px] pb-[2px] text-[13px] font-bold uppercase text-gray-900">Total Due</td>
                      <td className="pt-[8px] pb-[2px] text-[15px] font-black text-right" style={{ color: themeColor }}>
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

      {/* ================= 5. FOOTER & SIGNATURES ================= */}
      <div className="mt-auto relative z-10 w-full pt-[15px]">
        
        {/* Signatures Section */}
        <div className={`flex w-full ${docType === 'agreement' ? 'justify-between' : 'justify-end'} items-end mb-[20px]`}>
          
          {docType === 'agreement' && (
            <div className="w-[160px] flex flex-col items-center">
              <div className="h-[45px] w-full border-b border-gray-400"></div>
              <div className="w-full pt-[6px] text-[9.5px] font-bold text-gray-500 text-center uppercase tracking-widest">
                Client Signature
              </div>
            </div>
          )}

          <div className="w-[180px] flex flex-col items-center relative">
            <div className="h-[55px] w-full flex justify-center items-end border-b border-gray-400 relative pb-[2px]">
              {company?.seal && (
                <img src={company.seal} alt="Seal" className="absolute h-[65px] opacity-20 bottom-0 mix-blend-multiply" />
              )}
              {company?.signature && (
                <img src={company.signature} alt="Sign" className="h-[40px] object-contain relative z-10" />
              )}
            </div>
            <div className="w-full pt-[6px] text-center">
              <p className="text-[9.5px] font-bold text-gray-500 uppercase tracking-widest">Authorized Signatory</p>
              <p className="text-[11px] text-gray-800 font-medium mt-[2px]">{company?.name}</p>
            </div>
          </div>
        </div>

        {/* Terms and Bank Details (Only for Invoice / Quotation or if agreement explicitly needs notes) */}
        {docType !== 'agreement' && (terms?.notes || terms?.conditions || terms?.bankDetails) && (
          <div className="border-t border-gray-200 pt-[14px] flex flex-row gap-[20px] text-[9.5px]">
            
            <div className="flex-1 space-y-[10px]">
              {terms?.notes && (
                <div>
                  <h4 className="font-bold text-gray-800 uppercase tracking-widest mb-[3px]">Notes</h4>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{terms.notes}</p>
                </div>
              )}
              {terms?.conditions && (
                <div>
                  <h4 className="font-bold text-gray-800 uppercase tracking-widest mb-[3px]">Terms & Conditions</h4>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{terms.conditions}</p>
                </div>
              )}
            </div>

            {terms?.bankDetails && (
              <div className="w-[40%] bg-gray-50 p-[12px] border border-gray-200 rounded-sm">
                <h4 className="font-bold text-gray-800 uppercase tracking-widest mb-[6px]">Payment Information</h4>
                <p className="text-gray-600 whitespace-pre-wrap font-mono leading-relaxed text-[10px]">{terms.bankDetails}</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default DocumentLayout;