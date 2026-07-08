import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from "react-router-dom";

// Layout & Modular Components
import DocumentLayout from '../preview/DocumentLayout';
import DocumentSettings from '../editor/DocumentSettings';
import CompanyForm from '../editor/CompanyForm';
import ClientForm from '../editor/ClientForm';
import ItemsManager from '../editor/ItemsManager';
import ClauseManager from '../editor/ClauseManager';
import BrandingForm from '../editor/BrandingForm';

const DocumentEditor = ({ docType: propDocType }) => {
  const pdfRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local Storage Loader
  const loadSavedData = (key, defaultData) => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : defaultData; }
    catch (e) { return defaultData; }
  };

  const [docType, setDocType] = useState(() => loadSavedData("doc_v3_docType", propDocType || "invoice"));
  useEffect(() => { if (propDocType) setDocType(propDocType); }, [propDocType]);

  const tabs = ['Settings', 'Company', 'Client', 'Details', docType === 'agreement' ? 'Clauses' : 'Items', 'Terms'];
  const [activeTab, setActiveTab] = useState(() => loadSavedData('doc_v3_active_tab', 'settings'));

  // ================= STATE MANAGEMENT =================
  const [docSettings, setDocSettings] = useState(() => loadSavedData('doc_v3_settings', { status: 'Draft', currency: '₹', fontFamily: 'Inter', pageSize: 'A4', margin: 'normal' }));
  const [company, setCompany] = useState(() => loadSavedData('doc_v3_company', { name: 'TechFlow Solutions Pvt. Ltd.', gst: '22AAAAA0000A1Z5', pan: '', cin: '', address: 'Sector V, Salt Lake, Kolkata', email: 'billing@techflow.in', phone: '+91 98765 43210', website: '', tagline: '', logo: null, signature: null, seal: null }));
  const [client, setClient] = useState(() => loadSavedData('doc_v3_client', { name: 'Acme Digital Corp.', companyName: 'Acme Corp', gst: '27BBBBB0000B1Z5', email: '', phone: '', contactPerson: '', billingAddress: '123 Business Ave, Mumbai, Maharashtra 400069' }));
  const [docMeta, setDocMeta] = useState(() => loadSavedData('doc_v3_docMeta', { title: docType === 'invoice' ? 'TAX INVOICE' : docType === 'quotation' ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT', number: `${docType === 'quotation' ? 'QUO' : docType === 'agreement' ? 'AGR' : 'INV'}-2026-00001`, date: new Date().toISOString().substring(0, 10), dueDate: '2026-08-06', themeColor: docType === 'invoice' ? '#EF4444' : docType === 'quotation' ? '#10B981' : '#8B5CF6', paperColor: '#FFFFFF' }));
  const [items, setItems] = useState(() => loadSavedData('doc_v3_items', [{ id: Date.now(), name: 'Web Development', description: 'Sample description', hsn: '', unit: 'Pcs', qty: 1, price: 50000, taxRate: 18 }]));
  const [clauses, setClauses] = useState(() => loadSavedData('doc_v3_clauses', [{ id: Date.now(), title: 'Scope of Work', text: 'The service provider agrees to deliver...' }]));
  const [terms, setTerms] = useState(() => loadSavedData('doc_v3_terms', { notes: 'Thank you for your business.', conditions: '1. Quotation valid for 30 days.\n2. Payment before delivery.\n3. Goods once sold cannot be returned.', bankDetails: 'Bank: State Bank of India\nA/C Name: TechFlow Solutions\nA/C No: 12345678901234\nIFSC: SBIN0001234\nUPI: techflow@sbi' }));
  const [financials, setFinancials] = useState(() => loadSavedData('doc_v3_financials', { taxRate: 0, discount: 0, shipping: 0 }));

  // Watermark Default Fix: Set to 'disabled' by default
  const [wmMode, setWmMode] = useState(() => loadSavedData('doc_v3_wmMode', 'disabled'));
  const [wmText, setWmText] = useState(() => loadSavedData('doc_v3_wmText', ''));
  const [wmLogo, setWmLogo] = useState(() => loadSavedData('doc_v3_wmLogo', null));
  const [wmIntensity, setWmIntensity] = useState(() => loadSavedData('doc_v3_wmIntensity', 12));
  const [wmSpacing, setWmSpacing] = useState(() => loadSavedData('doc_v3_wmSpacing', 250));
  const [wmSpread, setWmSpread] = useState(() => loadSavedData('doc_v3_wmSpread', 16));
  const [wmColor, setWmColor] = useState(() => loadSavedData('doc_v3_wmColor', '#cbd5e1'));
  const [centerLogo, setCenterLogo] = useState(() => loadSavedData('doc_v3_centerLogo', false));

  const themeColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#166534', '#3B82F6', '#8B5CF6', '#EC4899', '#1F2937'];

  // ================= LOAD FROM DATABASE =================
  useEffect(() => { if (id) { loadDocument(); setIsEditMode(true); } }, [id]);

  const loadDocument = async () => {
    try {
      const res = await axios.get(`https://docu-craft-server.vercel.app/api/documents/${id}`, { withCredentials: true });
      const doc = res.data;
      setDocType(doc.docType); setCompany(doc.data.company); setClient(doc.data.client); setDocMeta(doc.data.docMeta);
      setItems(doc.data.items || []); setClauses(doc.data.clauses || []); setTerms(doc.data.terms); setFinancials(doc.data.financials);

      // Load settings & watermark properly from DB
      if (doc.data.docSettings) setDocSettings(doc.data.docSettings);
      setWmMode(doc.data.wmMode || 'disabled'); setWmText(doc.data.wmText || ''); setWmLogo(doc.data.wmLogo || null);
      setWmIntensity(doc.data.wmIntensity || 12); setWmSpacing(doc.data.wmSpacing || 250); setWmSpread(doc.data.wmSpread || 16);
      setCenterLogo(doc.data.centerLogo || false);
    } catch (err) { toast.error("Failed to load document"); }
  };

  // ================= SAVE TO LOCAL STORAGE =================
  useEffect(() => {
    if (isEditMode) return;
    localStorage.setItem('doc_v3_active_tab', activeTab);
    localStorage.setItem("doc_v3_docType", JSON.stringify(docType));
    localStorage.setItem('doc_v3_company', JSON.stringify(company));
    localStorage.setItem('doc_v3_client', JSON.stringify(client));
    localStorage.setItem('doc_v3_docMeta', JSON.stringify(docMeta));
    localStorage.setItem('doc_v3_items', JSON.stringify(items));
    localStorage.setItem('doc_v3_clauses', JSON.stringify(clauses));
    localStorage.setItem('doc_v3_terms', JSON.stringify(terms));
    localStorage.setItem('doc_v3_financials', JSON.stringify(financials));
    localStorage.setItem('doc_v3_settings', JSON.stringify(docSettings));
    localStorage.setItem('doc_v3_wmMode', JSON.stringify(wmMode));
    localStorage.setItem('doc_v3_wmText', JSON.stringify(wmText));
    localStorage.setItem('doc_v3_centerLogo', JSON.stringify(centerLogo));
  }, [activeTab, docType, company, client, docMeta, items, clauses, terms, financials, docSettings, wmMode, wmText, centerLogo]);

  useEffect(() => {
    const isQuotation = docType === 'quotation';
    const isAgreement = docType === 'agreement';
    setDocMeta(prev => {
      let newNumber = prev.number || '';
      if (docType === 'invoice') newNumber = newNumber.replace('QUO-', 'INV-').replace('AGR-', 'INV-');
      if (isQuotation) newNumber = newNumber.replace('INV-', 'QUO-').replace('AGR-', 'QUO-');
      if (isAgreement) newNumber = newNumber.replace('INV-', 'AGR-').replace('QUO-', 'AGR-');
      return { ...prev, title: docType === 'invoice' ? 'TAX INVOICE' : isQuotation ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT', number: newNumber };
    });
  }, [docType]);

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("https://docu-craft-server.vercel.app/api/upload/image", formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
      const imageUrl = res.data.url;
      if (fieldName === "companyLogo") setCompany(prev => ({ ...prev, logo: imageUrl }));
      else if (fieldName === "companySignature") setCompany(prev => ({ ...prev, signature: imageUrl }));
      else if (fieldName === "companySeal") setCompany(prev => ({ ...prev, seal: imageUrl }));
      else if (fieldName === "wmLogo") setWmLogo(imageUrl);
    } catch (error) { toast.error("Image upload failed"); }
  };

  const handleDownloadPdf = () => {
    const element = pdfRef.current;
    const opt = { margin: docSettings.margin === 'compact' ? 5 : 10, filename: `${docMeta.number}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: docSettings.pageSize.toLowerCase(), orientation: 'portrait' } };
    html2pdf().set(opt).from(element).save();
  };

  // ================= SAVE TO DATABASE LOGIC (RESTORED) =================
  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving document to database...");

    try {
      // Packaging all data for the backend
      const docData = {
        docType,
        docNumber: docMeta.number,
        clientName: client.name,
        data: {
          company, client, docMeta, items, clauses, terms, financials,
          docSettings, // Added docSettings so status & font are saved
          wmMode, wmText, wmLogo, wmIntensity, wmSpacing, wmSpread, centerLogo
        },
      };

      if (isEditMode) {
        await axios.put(`https://docu-craft-server.vercel.app/api/documents/update/${id}`, docData, { withCredentials: true });
        toast.success("Document Updated Successfully!", { id: toastId });
      } else {
        await axios.post("https://docu-craft-server.vercel.app/api/documents/save", docData, { withCredentials: true });
        toast.success("Document Saved Successfully!", { id: toastId });
        // Optional: Redirect to saved documents after save
        // navigate('/dashboard/saved-documents');
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save document to database", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // ================= WATERMARK RENDERER =================
  const renderWatermarkLayer = () => {
    if (wmMode === 'disabled') return null;
    const opacity = wmIntensity / 100;
    const wmColor = '#cbd5e1';

    if (wmMode === 'single_text' && wmText) {
      return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div style={{ opacity, transform: `rotate(${wmSpread}deg)`, fontSize: `${wmSpacing}px`, color: wmColor, fontWeight: '900', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{wmText}</div>
        </div>
      );
    }
    if (wmMode === 'text_tiling' && wmText) {
      const fontSize = Math.max(12, Number(wmSpacing) / 4);
      const gap = Number(wmSpread) * 2;
      const textWidth = fontSize * 0.6 * wmText.length;
      const boxWidth = textWidth + gap;
      const boxHeight = fontSize + gap;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boxWidth}" height="${boxHeight}" viewBox="0 0 ${boxWidth} ${boxHeight}"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${wmColor}" font-size="${fontSize}px" font-family="Arial, sans-serif" font-weight="bold">${wmText}</text></svg>`;
      return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2" style={{ width: '300%', height: '300%', opacity, transform: 'translate(-50%, -50%) rotate(-35deg)', backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, backgroundRepeat: 'repeat', backgroundPosition: 'center' }} />
        </div>
      );
    }
    if (wmMode === 'single_logo' && wmLogo) {
      return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <img src={wmLogo} alt="Watermark" style={{ opacity, width: `${wmSpacing}px`, objectFit: 'contain', transform: `rotate(${wmSpread}deg)` }} />
        </div>
      );
    }
    if (wmMode === 'logo_tiling' && wmLogo) {
      const imgSize = Math.max(20, Number(wmSpacing) / 4);
      const gap = Number(wmSpread);
      const containerSize = 2200;
      const cols = Math.ceil(containerSize / (imgSize + gap));
      return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 grid" style={{ width: `${containerSize}px`, height: `${containerSize}px`, opacity, transform: 'translate(-50%, -50%) rotate(-35deg)', gridTemplateColumns: `repeat(${cols}, ${imgSize}px)`, gap: `${gap}px`, justifyContent: 'center', alignContent: 'center' }}>
            {Array.from({ length: cols * cols }).map((_, i) => (
              <img key={i} src={wmLogo} alt="wm-tile" style={{ width: `${imgSize}px`, height: `${imgSize}px`, objectFit: 'contain' }} />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-950 p-4 font-sans transition-colors duration-300 overflow-hidden">

      {/* ================= LEFT: CONTROL PANEL ================= */}
      <div className="w-full lg:w-[450px] bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden transition-colors duration-300 flex-shrink-0 relative">
        <div className="flex overflow-x-auto bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 p-2 gap-2 hide-scrollbar shrink-0 z-10">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${activeTab === tab.toLowerCase() ? 'bg-blue-600 text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 pb-24 bg-[#FCFAF8] dark:bg-gray-900 transition-colors duration-300">

          {activeTab === 'settings' && (

            <DocumentSettings
              docSettings={docSettings} setDocSettings={setDocSettings}
              docMeta={docMeta} setDocMeta={setDocMeta}
              wmMode={wmMode} setWmMode={setWmMode} wmText={wmText} setWmText={setWmText}
              wmLogo={wmLogo} setWmLogo={setWmLogo} wmIntensity={wmIntensity} setWmIntensity={setWmIntensity}
              wmSpacing={wmSpacing} setWmSpacing={setWmSpacing} wmSpread={wmSpread} setWmSpread={setWmSpread}
              centerLogo={centerLogo} setCenterLogo={setCenterLogo}
              handleImageUpload={handleImageUpload} themeColors={themeColors}
            />

          )}
          {activeTab === 'company' && <CompanyForm company={company} setCompany={setCompany} handleImageUpload={handleImageUpload} />}
          {activeTab === 'client' && <ClientForm client={client} setClient={setClient} />}
          {activeTab === 'items' && docType !== 'agreement' && <ItemsManager items={items} setItems={setItems} financials={financials} setFinancials={setFinancials} />}
          {activeTab === 'clauses' && docType === 'agreement' && <ClauseManager clauses={clauses} setClauses={setClauses} />}

          {activeTab === 'details' && (
            <div className="space-y-4 animate-fadeIn">
              <div><label className="text-xs text-gray-500 font-bold uppercase">Document Title</label><input type="text" value={docMeta.title} onChange={(e) => setDocMeta({ ...docMeta, title: e.target.value })} className="w-full p-2 mt-1 border rounded" /></div>
              <div><label className="text-xs text-gray-500 font-bold uppercase">Document Number</label><input type="text" value={docMeta.number} onChange={(e) => setDocMeta({ ...docMeta, number: e.target.value })} className="w-full p-2 mt-1 border rounded" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 font-bold uppercase">Issue Date</label><input type="date" value={docMeta.date} onChange={(e) => setDocMeta({ ...docMeta, date: e.target.value })} className="w-full p-2 mt-1 border rounded" /></div>
                {docType !== 'agreement' && <div><label className="text-xs text-gray-500 font-bold uppercase">Valid Date</label><input type="date" value={docMeta.dueDate} onChange={(e) => setDocMeta({ ...docMeta, dueDate: e.target.value })} className="w-full p-2 mt-1 border rounded" /></div>}
              </div>
            </div>
          )}
          {activeTab === 'terms' && (
            <div className="space-y-4 animate-fadeIn">
              <div><label className="text-xs text-gray-500 font-bold uppercase">Notes</label><textarea value={terms.notes} onChange={(e) => setTerms({ ...terms, notes: e.target.value })} className="w-full p-2 mt-1 border rounded h-16" /></div>
              <div><label className="text-xs text-gray-500 font-bold uppercase">Terms</label><textarea value={terms.conditions} onChange={(e) => setTerms({ ...terms, conditions: e.target.value })} className="w-full p-2 mt-1 border rounded h-24" /></div>
            </div>
          )}

          {activeTab === 'branding' && (
            <BrandingForm docMeta={docMeta} setDocMeta={setDocMeta} themeColors={themeColors} centerLogo={centerLogo} setCenterLogo={setCenterLogo} />
          )}
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-white dark:bg-gray-900 border-t z-10 flex gap-3">
          <button onClick={handleSave} disabled={isSaving} className="w-1/2 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 disabled:bg-blue-400">
            {isSaving ? "Saving..." : "Save to Database"}
          </button>
          <button onClick={handleDownloadPdf} className="w-1/2 bg-gray-900 text-white py-3 rounded-xl font-bold shadow-md hover:bg-black">
            Export PDF
          </button>
        </div>
      </div>

      {/* ================= RIGHT: LIVE PDF PREVIEW ================= */}
      <div className="flex-1 bg-gray-300 dark:bg-gray-800 flex justify-center items-start overflow-y-auto p-2 sm:p-8 shadow-inner transition-colors duration-300 rounded-xl relative">
        <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.7] xl:scale-100 origin-top transition-transform duration-300 pb-20">
          <div ref={pdfRef} className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden" style={{ backgroundColor: docMeta.paperColor || '#FFFFFF', fontFamily: docSettings.fontFamily }}>
            {renderWatermarkLayer()}
            <div className="relative z-10 h-full w-full">

              <DocumentLayout
                docType={docType} company={company} client={client} docMeta={docMeta}
                items={items} clauses={clauses} terms={terms} financials={financials}
                settings={docSettings} centerLogo={centerLogo} currency={docSettings.currency}
                status={docSettings.status}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;