import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from "react-router-dom";
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

import api from '../api/axios';

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

  const loadSavedData = (key, defaultData) => {
    try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : defaultData; }
    catch (e) { return defaultData; }
  };

  const [docType, setDocType] = useState(() => loadSavedData("doc_v3_docType", propDocType || "invoice"));

  useEffect(() => { if (propDocType) setDocType(propDocType); }, [propDocType]);

  const tabs = ['Settings', 'Company', 'Client', 'Details', docType === 'agreement' ? 'Clauses' : 'Items', 'Terms'];
  const [activeTab, setActiveTab] = useState(() => loadSavedData('doc_v3_active_tab', 'settings'));

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

  // ================= STATE MANAGEMENT =================
  const [docSettings, setDocSettings] = useState(() => loadSavedData('doc_v3_settings', { 
    status: 'Draft', 
    currency: '₹', 
    fontFamily: 'Inter', 
    pageSize: 'A4', 
    margin: 'normal',
    typo: {
      compName: { size: 28, weight: '800' },
      docTitle: { size: 28, weight: '300' }
    }
  }));

  const [company, setCompany] = useState(() => loadSavedData('doc_v3_company', { name: 'TechFlow Solutions Pvt. Ltd.', gst: '22AAAAA0000A1Z5', pan: '', cin: '', address: 'Sector V, Salt Lake, Kolkata', email: 'billing@techflow.in', phone: '+91 98765 43210', website: '', tagline: '', logo: null, signature: null, seal: null }));
  const [client, setClient] = useState(() => loadSavedData('doc_v3_client', { name: 'Acme Digital Corp.', companyName: 'Acme Corp', gst: '27BBBBB0000B1Z5', email: '', phone: '', contactPerson: '', billingAddress: '123 Business Ave, Mumbai, Maharashtra 400069' }));
  const [docMeta, setDocMeta] = useState(() => loadSavedData('doc_v3_docMeta', { title: docType === 'invoice' ? 'TAX INVOICE' : docType === 'quotation' ? 'PRICE QUOTATION' : 'SERVICE AGREEMENT', number: `${docType === 'quotation' ? 'QUO' : docType === 'agreement' ? 'AGR' : 'INV'}-2026-00001`, date: new Date().toISOString().substring(0, 10), dueDate: '2026-08-06', themeColor: docType === 'invoice' ? '#EF4444' : docType === 'quotation' ? '#10B981' : '#8B5CF6', paperColor: '#FFFFFF', textColor: '#1F2937' }));
  const [items, setItems] = useState(() => loadSavedData('doc_v3_items', [{ id: Date.now(), name: 'Web Development', description: 'Sample description', hsn: '', unit: 'Pcs', qty: 1, price: 50000, taxRate: 18 }]));
  const [clauses, setClauses] = useState(() => loadSavedData('doc_v3_clauses', [{ id: Date.now(), title: 'Scope of Work', text: 'The service provider agrees to deliver...' }]));
  const [terms, setTerms] = useState(() => loadSavedData('doc_v3_terms', { notes: 'Thank you for your business.', conditions: '1. Quotation valid for 30 days.\n2. Payment before delivery.\n3. Goods once sold cannot be returned.', bankDetails: 'Bank: State Bank of India\nA/C Name: TechFlow Solutions\nA/C No: 12345678901234\nIFSC: SBIN0001234\nUPI: techflow@sbi' }));
  const [financials, setFinancials] = useState(() => loadSavedData('doc_v3_financials', { taxRate: 0, discount: 0, shipping: 0 }));
  
  // Watermark & Security Overlay States
  const [wmMode, setWmMode] = useState(() => loadSavedData('doc_v3_wmMode', 'disabled'));
  const [wmText, setWmText] = useState(() => loadSavedData('doc_v3_wmText', ''));
  const [wmLogo, setWmLogo] = useState(() => loadSavedData('doc_v3_wmLogo', null));
  const [wmColor, setWmColor] = useState(() => loadSavedData('doc_v3_wmColor', '#cbd5e1'));
  const [wmIntensity, setWmIntensity] = useState(() => loadSavedData('doc_v3_wmIntensity', 15));
  const [wmSpacing, setWmSpacing] = useState(() => loadSavedData('doc_v3_wmSpacing', 250));
  const [wmSpread, setWmSpread] = useState(() => loadSavedData('doc_v3_wmSpread', -30));
  const [centerLogo, setCenterLogo] = useState(() => loadSavedData('doc_v3_centerLogo', false));
  const [logoTileUrl, setLogoTileUrl] = useState('');

  // Generate seamless repeating pattern for Logo Tiling (avoids empty corners)
  useEffect(() => {
    const activeLogo = wmLogo || company?.logo;
    if (!activeLogo || wmMode !== 'logo_tiling') return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (!isMounted) return;
      try {
        const spacingVal = Number(wmSpacing || 100);
        const imgSize = Math.max(22, Math.min(140, Math.round(22 + spacingVal * 0.2)));
        const gap = Math.max(10, Math.round(imgSize * 0.45));
        const cell = imgSize + gap;

        const canvas = document.createElement('canvas');
        canvas.width = cell;
        canvas.height = cell;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, (cell - imgSize) / 2, (cell - imgSize) / 2, imgSize, imgSize);
          setLogoTileUrl(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.warn('Logo pattern generation error:', err);
      }
    };

    img.onerror = () => {
      console.warn('Failed to load logo for pattern');
    };

    img.src = activeLogo;

    return () => {
      isMounted = false;
    };
  }, [wmLogo, company?.logo, wmSpacing, wmMode]);

  const themeColors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#166534', '#3B82F6', '#8B5CF6', '#EC4899', '#1F2937'];

  // ================= LOAD FROM DATABASE =================
  useEffect(() => { if (id) { loadDocument(); setIsEditMode(true); } }, [id]);

  const loadDocument = async () => {
    try {
      const res = await api.get(`/documents/${id}`);
      const doc = res.data;
      setDocType(doc.docType);
      setCompany(doc.data.company);
      setClient(doc.data.client);
      setDocMeta(doc.data.docMeta);
      setItems(doc.data.items || []);
      setClauses(doc.data.clauses || []);
      setTerms(doc.data.terms);
      setFinancials(doc.data.financials);
      if (doc.data.docSettings) setDocSettings(doc.data.docSettings);
      setWmMode(doc.data.wmMode || 'disabled');
      setWmText(doc.data.wmText || '');
      setWmLogo(doc.data.wmLogo || null);
      setWmColor(doc.data.wmColor || '#cbd5e1');
      setWmIntensity(doc.data.wmIntensity ?? doc.data.wmOpacity ?? 15);
      setWmSpacing(doc.data.wmSpacing ?? 250);
      setWmSpread(doc.data.wmSpread ?? doc.data.wmRotation ?? -30);
      setCenterLogo(doc.data.centerLogo || false);
    } catch (err) {
      toast.error("Failed to load document");
    }
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
    localStorage.setItem('doc_v3_wmLogo', JSON.stringify(wmLogo));
    localStorage.setItem('doc_v3_wmColor', JSON.stringify(wmColor));
    localStorage.setItem('doc_v3_wmIntensity', JSON.stringify(wmIntensity));
    localStorage.setItem('doc_v3_wmSpacing', JSON.stringify(wmSpacing));
    localStorage.setItem('doc_v3_wmSpread', JSON.stringify(wmSpread));
    localStorage.setItem('doc_v3_centerLogo', JSON.stringify(centerLogo));
  }, [activeTab, docType, company, client, docMeta, items, clauses, terms, financials, docSettings, wmMode, wmText, wmLogo, wmColor, wmIntensity, wmSpacing, wmSpread, centerLogo]);

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

  // Image Upload Handler: Instant Local Preview + Cloudinary Upload
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Instant local preview via FileReader (Base64)
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target?.result;
      if (!base64Url) return;
      if (fieldName === "companyLogo" || fieldName === "logo") {
        setCompany(prev => ({ ...prev, logo: base64Url }));
      } else if (fieldName === "companySignature") {
        setCompany(prev => ({ ...prev, signature: base64Url }));
      } else if (fieldName === "companySeal") {
        setCompany(prev => ({ ...prev, seal: base64Url }));
      } else if (fieldName === "wmLogo") {
        setWmLogo(base64Url);
      }
    };
    reader.readAsDataURL(file);

    // 2. Background Cloudinary upload
    const formData = new FormData();
    formData.append("image", file);

    const toastId = toast.loading("Processing image...");

    try {
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = res.data?.url;
      if (imageUrl) {
        if (fieldName === "companyLogo" || fieldName === "logo") {
          setCompany(prev => ({ ...prev, logo: imageUrl }));
        } else if (fieldName === "companySignature") {
          setCompany(prev => ({ ...prev, signature: imageUrl }));
        } else if (fieldName === "companySeal") {
          setCompany(prev => ({ ...prev, seal: imageUrl }));
        } else if (fieldName === "wmLogo") {
          setWmLogo(imageUrl);
        }
      }
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (error) {
      console.warn("Server image upload failed, using local image:", error);
      toast.success("Image loaded successfully!", { id: toastId });
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    const wrapper = document.getElementById("pdf-wrapper");
    const element = document.getElementById("pdf-content-editor");
    if (!element || !wrapper) return;
    
    setIsExporting(true);
    const toastId = toast.loading("Generating PDF...");
    
    try {
      const originalCssText = wrapper.style.cssText;
      wrapper.style.cssText += 'transform: scale(1) !important;';

      await new Promise(r => setTimeout(r, 100));

      const scale = 2;
      const imgData = await domtoimage.toPng(element, {
        bgcolor: docMeta?.paperColor || '#FFFFFF',
        width: element.clientWidth * scale,
        height: element.clientHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }
      });

      wrapper.style.cssText = originalCssText;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 0;
      const maxPdfWidth = 210 - (margin * 2);
      const maxPdfHeight = 297 - (margin * 2);

      const canvasWidth = element.clientWidth * scale;
      const canvasHeight = element.clientHeight * scale;

      let finalWidth = maxPdfWidth;
      let finalHeight = (canvasHeight * maxPdfWidth) / canvasWidth;

      if (finalHeight > maxPdfHeight) {
        const ratio = maxPdfHeight / finalHeight;
        finalHeight = maxPdfHeight;
        finalWidth = finalWidth * ratio;
      }

      const xOffset = margin + (maxPdfWidth - finalWidth) / 2;
      const yOffset = margin;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`${docMeta?.number || 'document'}.pdf`);

      toast.success("PDF Downloaded Successfully!", { id: toastId });
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to download PDF", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // ================= SAVE TO DATABASE LOGIC =================
  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving document to database...");
    try {
      const docData = {
        docType,
        docNumber: docMeta.number,
        clientName: client.name,
        data: {
          company, client, docMeta, items, clauses, terms, financials,
          docSettings,
          wmMode, wmText, wmLogo, wmColor,
          wmIntensity, wmSpacing, wmSpread,
          centerLogo
        },
      };

      if (isEditMode) {
        await api.put(`/documents/update/${id}`, docData);
        toast.success("Document Updated Successfully!", { id: toastId });
      } else {
        await api.post("/documents/save", docData);
        toast.success("Document Saved Successfully!", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to save document to database";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // ================= WATERMARK RENDERER =================
  const renderWatermarkLayer = () => {
    const opacity = Number(wmIntensity || 15) / 100;
    const rotation = Number(wmSpread ?? -30);

    return (
      <>
        {/* Security Overlay: Center Logo */}
        {centerLogo && company?.logo && (
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <img 
              src={company.logo} 
              alt="Security Center Logo" 
              className="object-contain" 
              style={{ width: '320px', opacity: 0.08, filter: 'grayscale(100%)' }} 
            />
          </div>
        )}

        {/* Dynamic Watermark Synthesis */}
        {(() => {
          if (wmMode === 'disabled') return null;

          if (wmMode === 'single_text') {
            const textToDisplay = wmText || company?.name || 'CONFIDENTIAL';
            const fontSize = Math.max(20, Math.min(130, Number(wmSpacing) / 3 || 60));
            return (
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div 
                  style={{ 
                    opacity, 
                    transform: `rotate(${rotation}deg)`, 
                    fontSize: `${fontSize}px`, 
                    color: wmColor || '#cbd5e1', 
                    fontWeight: '900', 
                    letterSpacing: '0.1em', 
                    whiteSpace: 'nowrap' 
                  }}
                >
                  {textToDisplay}
                </div>
              </div>
            );
          }

          if (wmMode === 'single_logo' && (wmLogo || company?.logo)) {
            const activeLogo = wmLogo || company?.logo;
            const imgWidth = Math.max(80, Math.min(500, Number(wmSpacing) || 280));
            return (
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <img 
                  src={activeLogo} 
                  alt="Watermark Logo" 
                  style={{ 
                    opacity, 
                    width: `${imgWidth}px`, 
                    objectFit: 'contain', 
                    transform: `rotate(${rotation}deg)` 
                  }} 
                />
              </div>
            );
          }

          if (wmMode === 'text_tiling') {
            const textToDisplay = wmText || company?.name || 'CONFIDENTIAL';
            const spacingVal = Number(wmSpacing || 100);
            
            // Font size scales from 12px at low slider up to 55px at high slider
            const fontSize = Math.max(12, Math.min(55, Math.round(12 + spacingVal * 0.08)));
            const charWidth = fontSize * 0.62;
            const textWidth = Math.round(charWidth * textToDisplay.length);
            
            // Proportional gaps: words stay close, lines stay close regardless of size!
            const gapX = Math.max(20, Math.round(fontSize * 1.6));
            const gapY = Math.max(8, Math.round(fontSize * 0.65));

            const boxWidth = textWidth + gapX;
            const boxHeight = fontSize + gapY;

            const safeText = textToDisplay
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');

            // Clean single row repeating in parallel lines without empty voids
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${boxWidth}" height="${boxHeight}" viewBox="0 0 ${boxWidth} ${boxHeight}">
              <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="${wmColor || '#cbd5e1'}" font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">${safeText}</text>
            </svg>`;

            return (
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div 
                  style={{ 
                    position: 'absolute',
                    width: '300%', 
                    height: '300%', 
                    opacity,
                    transform: `rotate(${rotation}deg)`,
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, 
                    backgroundRepeat: 'repeat', 
                    backgroundPosition: 'center' 
                  }} 
                />
              </div>
            );
          }

          if (wmMode === 'light_text_tiling') {
            const textToDisplay = wmText || company?.name || 'CONFIDENTIAL';
            const spacingVal = Number(wmSpacing || 250);
            
            const fontSize = Math.max(14, Math.min(60, Math.round(14 + spacingVal * 0.1)));
            const charWidth = fontSize * 0.62;
            const textWidth = Math.round(charWidth * textToDisplay.length);
            
            // Huge gaps for staggered sparse feel
            const gapX = Math.max(150, Math.round(fontSize * 8)); 
            const gapY = Math.max(100, Math.round(fontSize * 6)); 

            const boxWidth = textWidth + gapX;
            const boxHeight = fontSize + gapY;
            const doubleW = boxWidth * 2;
            const doubleH = boxHeight * 2;

            const safeText = textToDisplay
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');

            // Staggered grid SVG (Brick pattern)
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${doubleW}" height="${doubleH}" viewBox="0 0 ${doubleW} ${doubleH}">
              <text x="${boxWidth / 2}" y="${boxHeight / 2}" dominant-baseline="middle" text-anchor="middle" fill="${wmColor || '#cbd5e1'}" font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">${safeText}</text>
              <text x="${boxWidth + boxWidth / 2}" y="${boxHeight / 2}" dominant-baseline="middle" text-anchor="middle" fill="${wmColor || '#cbd5e1'}" font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">${safeText}</text>
              <text x="0" y="${boxHeight + boxHeight / 2}" dominant-baseline="middle" text-anchor="middle" fill="${wmColor || '#cbd5e1'}" font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">${safeText}</text>
              <text x="${boxWidth}" y="${boxHeight + boxHeight / 2}" dominant-baseline="middle" text-anchor="middle" fill="${wmColor || '#cbd5e1'}" font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">${safeText}</text>
              <text x="${doubleW}" y="${boxHeight + boxHeight / 2}" dominant-baseline="middle" text-anchor="middle" fill="${wmColor || '#cbd5e1'}" font-size="${fontSize}px" font-family="sans-serif" font-weight="bold">${safeText}</text>
            </svg>`;

            return (
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div 
                  style={{ 
                    position: 'absolute',
                    width: '300%', 
                    height: '300%', 
                    opacity: opacity * 0.45, 
                    transform: `rotate(${rotation}deg)`,
                    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`, 
                    backgroundRepeat: 'repeat', 
                    backgroundPosition: 'center' 
                  }} 
                />
              </div>
            );
          }

          if (wmMode === 'logo_tiling' && (wmLogo || company?.logo)) {
            const activeLogo = wmLogo || company?.logo;
            const spacingVal = Number(wmSpacing || 100);
            const imgSize = Math.max(22, Math.min(140, Math.round(22 + spacingVal * 0.2)));
            const gap = Math.max(10, Math.round(imgSize * 0.45));

            // 1. Infinite repeating background pattern: 100% full coverage, zero empty corners!
            if (logoTileUrl) {
              return (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                  <div 
                    style={{ 
                      position: 'absolute',
                      width: '320%', 
                      height: '320%', 
                      opacity, 
                      transform: `rotate(${rotation}deg)`,
                      backgroundImage: `url("${logoTileUrl}")`,
                      backgroundRepeat: 'repeat', 
                      backgroundPosition: 'center' 
                    }} 
                  />
                </div>
              );
            }

            // 2. Fallback full-coverage grid if canvas pattern is loading
            const cell = imgSize + gap;
            const containerDim = 2400;
            const cols = Math.min(50, Math.ceil(containerDim / cell));
            const rows = Math.min(50, Math.ceil(containerDim / cell));
            const totalItems = cols * rows;

            return (
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                <div 
                  style={{ 
                    width: `${containerDim}px`, 
                    height: `${containerDim}px`, 
                    opacity, 
                    transform: `rotate(${rotation}deg)`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, ${imgSize}px)`,
                    gap: `${gap}px`,
                    alignItems: 'center',
                    justifyItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {Array.from({ length: totalItems }).map((_, i) => (
                    <img 
                      key={i} 
                      src={activeLogo} 
                      alt="" 
                      style={{ 
                        width: `${imgSize}px`, 
                        height: `${imgSize}px`, 
                        objectFit: 'contain' 
                      }} 
                    />
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })()}
      </>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-64px)] lg:h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-950 p-4 font-sans transition-colors duration-300 lg:overflow-hidden overflow-y-auto">
      
      {/* ================= LEFT: CONTROL PANEL ================= */}
      <div className="w-full lg:w-[450px] h-[550px] lg:h-full bg-white dark:bg-gray-900 border border-transparent dark:border-gray-800 rounded-xl shadow-lg flex flex-col overflow-hidden transition-colors duration-300 shrink-0 relative">
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
              wmMode={wmMode} setWmMode={setWmMode} 
              wmText={wmText} setWmText={setWmText}
              wmLogo={wmLogo} setWmLogo={setWmLogo} 
              wmIntensity={wmIntensity} setWmIntensity={setWmIntensity}
              wmSpacing={wmSpacing} setWmSpacing={setWmSpacing}
              wmSpread={wmSpread} setWmSpread={setWmSpread}
              wmColor={wmColor} setWmColor={setWmColor}
              centerLogo={centerLogo} setCenterLogo={setCenterLogo}
              handleImageUpload={handleImageUpload} themeColors={themeColors}
            />
          )}
          {activeTab === 'company' && <CompanyForm company={company} setCompany={setCompany} handleImageUpload={handleImageUpload} docSettings={docSettings} handleTypoChange={handleTypoChange} />}
          {activeTab === 'client' && <ClientForm client={client} setClient={setClient} />}
          {activeTab === 'items' && docType !== 'agreement' && <ItemsManager items={items} setItems={setItems} financials={financials} setFinancials={setFinancials} />}
          {activeTab === 'clauses' && docType === 'agreement' && <ClauseManager clauses={clauses} setClauses={setClauses} />}
          
          {activeTab === 'details' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase">Document Title</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" value={docMeta.title} onChange={(e) => setDocMeta({ ...docMeta, title: e.target.value })} className="flex-1 p-2 border rounded" />
                  <div className="flex gap-2 shrink-0">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 overflow-hidden w-16">
                      <input type="number" value={docSettings?.typo?.docTitle?.size || 28} onChange={(e) => handleTypoChange('docTitle', 'size', Number(e.target.value))} className="w-full p-2 text-sm font-bold text-center bg-transparent outline-none text-gray-900 dark:text-white" title="Font Size" />
                    </div>
                    <select value={docSettings?.typo?.docTitle?.weight || '300'} onChange={(e) => handleTypoChange('docTitle', 'weight', e.target.value)} className="w-24 p-2 text-sm font-semibold border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none cursor-pointer" title="Font Weight">
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
            <BrandingForm 
              docMeta={docMeta} setDocMeta={setDocMeta} 
              wmMode={wmMode} setWmMode={setWmMode} 
              wmText={wmText} setWmText={setWmText} 
              wmLogo={wmLogo} setWmLogo={setWmLogo} 
              wmIntensity={wmIntensity} setWmIntensity={setWmIntensity} 
              wmSpacing={wmSpacing} setWmSpacing={setWmSpacing} 
              wmSpread={wmSpread} setWmSpread={setWmSpread} 
              centerLogo={centerLogo} setCenterLogo={setCenterLogo} 
              handleImageUpload={handleImageUpload} themeColors={themeColors} 
            />
          )}
        </div>

        <div className="absolute bottom-0 w-full p-4 bg-white dark:bg-gray-900 border-t z-10 flex gap-3">
          <button onClick={handleSave} disabled={isSaving} className="w-1/2 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 disabled:bg-blue-400">
            {isSaving ? "Saving..." : "Save to Database"}
          </button>
          <button onClick={handleDownloadPdf} disabled={isExporting} className="w-1/2 bg-gray-900 text-white py-3 rounded-xl font-bold shadow-md hover:bg-black disabled:bg-gray-600">
            {isExporting ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* ================= RIGHT: LIVE PDF PREVIEW ================= */}
      <div className="w-full lg:flex-1 h-[500px] lg:h-full bg-gray-300 dark:bg-gray-800 overflow-auto p-4 sm:p-8 shadow-inner transition-colors duration-300 rounded-xl relative shrink-0">
        <div className="flex justify-center min-w-max pb-20">
          <div id="pdf-wrapper" className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.7] xl:scale-100 origin-top transition-transform duration-300 pb-20">
            
            {/* Shadow */}
            <div className="shadow-2xl mx-auto w-[210mm]">
              <div id="pdf-content-editor" className="bg-white w-[210mm] min-h-[296mm] text-black relative overflow-hidden box-border mb-40" style={{
                backgroundColor: docMeta.paperColor || '#FFFFFF',
                fontFamily: docSettings.fontFamily || 'Inter'
              }}>
                {renderWatermarkLayer()}
                <div className="relative z-10 h-full w-full">
                  <DocumentLayout
                    docType={docType} company={company} client={client} docMeta={docMeta}
                    items={items} clauses={clauses} terms={terms} financials={financials}
                    settings={docSettings} currency={docSettings.currency}
                    status={docSettings.status}
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;