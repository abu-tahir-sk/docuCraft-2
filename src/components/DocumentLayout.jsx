import React from 'react';
import { numberToWords, formatDate } from '../utils';


const DocumentLayout = ({ 
  docType, company, client, docMeta, items, 
  clauses, terms, financials, settings, currency 
}) => {
  const themeColor = docMeta.themeColor || '#2563EB';

  // Calculations
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.qty * item.price;
      return sum + (itemTotal * (item.taxRate / 100));
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const taxAmount = calculateTotalTax();
  const discount = Number(financials?.discount) || 0;
  const shipping = Number(financials?.shipping) || 0;
  const grandTotal = subtotal - discount + taxAmount + shipping;

  // Number to Words Converter (Basic Indian format for ₹)
  

  return (
    <div className="w-full h-full bg-white text-gray-900 flex flex-col relative z-10" style={{ fontFamily: settings?.fontFamily }}>
      
      {/* --- STATUS STAMP --- */}
      {settings?.status && settings.status !== 'Draft' && (
        <div className="absolute top-40 right-10 opacity-20 pointer-events-none transform rotate-12 z-0">
          <span className={`text-6xl font-black uppercase border-8 p-4 rounded-xl ${
            settings.status === 'Paid' || settings.status === 'Accepted' ? 'text-green-600 border-green-600' :
            settings.status === 'Overdue' || settings.status === 'Rejected' ? 'text-red-600 border-red-600' :
            'text-gray-600 border-gray-600'
          }`}>
            {settings.status}
          </span>
        </div>
      )}

      {/* ================= 1. HEADER ================= */}
      <div className="flex justify-between items-start border-b-2 pb-6 mb-6" style={{ borderColor: themeColor }}>
        {/* Company Info */}
        <div className="flex-1">
          {company?.logo ? (
            <img src={company.logo} alt="Company Logo" className="h-16 object-contain mb-3" />
          ) : (
            <h1 className="text-2xl font-black mb-1" style={{ color: themeColor }}>{company?.name || 'Company Name'}</h1>
          )}
          {company?.tagline && <p className="text-xs text-gray-500 italic mb-2">{company.tagline}</p>}
          
          <div className="text-[11px] leading-tight text-gray-600 space-y-0.5">
            {company?.address && <p className="whitespace-pre-wrap w-2/3">{company.address}</p>}
            {company?.phone && <p><strong>Phone:</strong> {company.phone}</p>}
            {company?.email && <p><strong>Email:</strong> {company.email}</p>}
            {company?.website && <p><strong>Web:</strong> {company.website}</p>}
            <div className="flex gap-4 mt-2">
              {company?.gst && <p><strong>GSTIN:</strong> {company.gst}</p>}
              {company?.pan && <p><strong>PAN:</strong> {company.pan}</p>}
              {company?.cin && <p><strong>CIN:</strong> {company.cin}</p>}
            </div>
          </div>
        </div>

        {/* Document Meta */}
        <div className="text-right">
          <h2 className="text-3xl font-black uppercase tracking-widest" style={{ color: themeColor }}>
            {docMeta?.title}
          </h2>
          <div className="mt-4 text-[11px] space-y-1">
            <p><span className="font-bold text-gray-500 uppercase mr-2">{docType === 'quotation' ? 'Quote #' : docType === 'agreement' ? 'Agr #' : 'Inv #'}</span> <span className="font-bold">{docMeta?.number}</span></p>
            <p><span className="font-bold text-gray-500 uppercase mr-2">Issue Date:</span> {new Date(docMeta?.date).toLocaleDateString()}</p>
            {docType !== 'agreement' && (
              <p><span className="font-bold text-gray-500 uppercase mr-2">Valid Till:</span> {new Date(docMeta?.dueDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </div>

      {/* ================= 2. CLIENT INFO (BILL TO) ================= */}
      {docType !== 'agreement' && (
        <div className="mb-6 flex justify-between">
          <div className="w-1/2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Bill To</h3>
            <h4 className="text-sm font-bold text-gray-800">{client?.name || 'Client Name'}</h4>
            {client?.contactPerson && <p className="text-[11px] text-gray-600 mt-1"><strong>Attn:</strong> {client.contactPerson}</p>}
            <p className="text-[11px] text-gray-600 mt-1 whitespace-pre-wrap">{client?.billingAddress}</p>
            {client?.phone && <p className="text-[11px] text-gray-600 mt-1"><strong>Phone:</strong> {client.phone}</p>}
            {client?.email && <p className="text-[11px] text-gray-600 mt-1"><strong>Email:</strong> {client.email}</p>}
            {client?.gst && <p className="text-[11px] text-gray-600 mt-1"><strong>GSTIN:</strong> {client.gst}</p>}
          </div>
        </div>
      )}

      {/* ================= 3. DOCUMENT BODY (ITEMS OR CLAUSES) ================= */}
      <div className="flex-1">
        
        {/* --- INVOICE & QUOTATION ITEMS TABLE --- */}
        {docType !== 'agreement' && (
          <div className="mb-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-white" style={{ backgroundColor: themeColor }}>
                  <th className="py-2 px-3 font-bold w-8 text-center rounded-tl-lg">#</th>
                  <th className="py-2 px-3 font-bold">Item Description</th>
                  <th className="py-2 px-2 font-bold w-16 text-center">HSN</th>
                  <th className="py-2 px-2 font-bold w-16 text-center">Qty</th>
                  <th className="py-2 px-2 font-bold w-16 text-center">Unit</th>
                  <th className="py-2 px-3 font-bold w-24 text-right">Price</th>
                  <th className="py-2 px-2 font-bold w-16 text-center">Tax%</th>
                  <th className="py-2 px-3 font-bold w-28 text-right rounded-tr-lg">Total</th>
                </tr>
              </thead>
              <tbody>
                {items?.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200 text-[11px] align-top">
                    <td className="py-3 px-3 text-center text-gray-500">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-800">{item.name}</p>
                      {item.description && <p className="text-gray-500 mt-0.5 text-[10px]">{item.description}</p>}
                    </td>
                    <td className="py-3 px-2 text-center text-gray-600">{item.hsn || '-'}</td>
                    <td className="py-3 px-2 text-center">{item.qty}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{item.unit}</td>
                    <td className="py-3 px-3 text-right">{currency} {item.price.toFixed(2)}</td>
                    <td className="py-3 px-2 text-center text-gray-500">{item.taxRate}%</td>
                    <td className="py-3 px-3 text-right font-bold">
                      {currency} {((item.qty * item.price) + ((item.qty * item.price) * (item.taxRate / 100))).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- AGREEMENT CLAUSES --- */}
        {docType === 'agreement' && (
          <div className="mb-6 space-y-4">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold">THIS AGREEMENT is made on {new Date(docMeta?.date).toLocaleDateString()}</h3>
              <p className="text-sm mt-2">BETWEEN <strong>{company?.name}</strong> AND <strong>{client?.name}</strong></p>
            </div>
            {clauses?.map((clause, idx) => (
              <div key={idx} className="text-sm text-justify">
                <h4 className="font-bold mb-1" style={{ color: themeColor }}>
                  {idx + 1}. {clause.title}
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap ml-4">
                  {clause.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ================= 4. SUMMARY (FINANCIALS) ================= */}
        {docType !== 'agreement' && (
          <div className="flex justify-between items-start mb-8">
            <div className="w-1/2 pt-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Amount in Words:</p>
              <p className="text-xs font-bold text-gray-800 mt-1 italic">
                {currency} {numberToWords(grandTotal)}
              </p>
            </div>
            <div className="w-72">
              <table className="w-full text-[11px]">
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-600 font-bold">Subtotal:</td>
                    <td className="py-1 text-right">{currency} {subtotal.toFixed(2)}</td>
                  </tr>
                  {discount > 0 && (
                    <tr>
                      <td className="py-1 text-red-500 font-bold">Discount:</td>
                      <td className="py-1 text-right text-red-500">- {currency} {discount.toFixed(2)}</td>
                    </tr>
                  )}
                  {taxAmount > 0 && (
                    <tr>
                      <td className="py-1 text-gray-600 font-bold">Tax Amount:</td>
                      <td className="py-1 text-right">{currency} {taxAmount.toFixed(2)}</td>
                    </tr>
                  )}
                  {shipping > 0 && (
                    <tr>
                      <td className="py-1 text-gray-600 font-bold">Shipping/Freight:</td>
                      <td className="py-1 text-right">{currency} {shipping.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-gray-800">
                    <td className="py-2 text-sm font-black" style={{ color: themeColor }}>Grand Total:</td>
                    <td className="py-2 text-sm font-black text-right" style={{ color: themeColor }}>
                      {currency} {grandTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ================= 5. FOOTER DETAILS & SIGNATURE ================= */}
      <div className="mt-auto pt-6">
        <div className="flex justify-between items-end">
          
          {/* Terms & Notes */}
          <div className="w-3/5 space-y-4">
            {terms?.notes && (
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase">Notes</h4>
                <p className="text-[11px] text-gray-700 whitespace-pre-wrap">{terms.notes}</p>
              </div>
            )}
            
            <div className="flex gap-4">
              {terms?.conditions && (
                <div className="flex-1">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase">Terms & Conditions</h4>
                  <p className="text-[10px] text-gray-600 whitespace-pre-wrap">{terms.conditions}</p>
                </div>
              )}
              
              {docType !== 'agreement' && terms?.bankDetails && (
                <div className="flex-1 bg-gray-50 p-3 rounded-lg border">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">Payment Details</h4>
                  <p className="text-[10px] text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{terms.bankDetails}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signatures */}
          <div className="w-2/5 flex flex-col items-end text-center">
            {docType === 'agreement' && (
               <div className="mb-10 w-full flex justify-between items-end border-b pb-2">
                 <div className="w-32 border-t border-gray-400 pt-1 mt-16 text-[10px] font-bold">Client Signature</div>
                 <div className="w-32 border-t border-gray-400 pt-1 mt-16 text-[10px] font-bold">Company Signature</div>
               </div>
            )}
            
            {docType !== 'agreement' && (
              <div className="relative w-48 flex flex-col items-center">
                <div className="h-20 w-full flex justify-center items-center relative">
                   {company?.seal && (
                     <img src={company.seal} alt="Seal" className="absolute h-24 opacity-30 right-0 top-0 -z-10 mix-blend-multiply" />
                   )}
                   {company?.signature && (
                     <img src={company.signature} alt="Signature" className="h-16 object-contain z-10" />
                   )}
                </div>
                <div className="border-t-2 w-full border-gray-800 pt-1 mt-2">
                  <p className="text-[11px] font-bold">Authorized Signatory</p>
                  <p className="text-[9px] text-gray-500">{company?.name}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Ribbon (Optional Base Decoration) */}
        <div className="h-2 w-full mt-6 rounded-b-xl" style={{ backgroundColor: themeColor }}></div>
      </div>

    </div>
  );
};

export default DocumentLayout;