// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { ArrowLeft, Printer } from 'lucide-react';
// import DocumentLayout from '../preview/DocumentLayout'; 


// const ViewPdf = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [doc, setDoc] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDoc = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(`https://docu-craft-server.vercel.app/api/documents/${id}`, { withCredentials: true });
//         setDoc(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching document:", err);
//         setLoading(false);
//       }
//     };
//     fetchDoc();
//   }, [id]);

//   const handleDownload = async () => {
//     const element = document.getElementById("pdf-content");
//     if (!element) return;
//     const canvas = await html2canvas(element, { scale: 2, useCORS: true });
//     const imgData = canvas.toDataURL("image/png");
//     const pageSize = doc?.data?.docSettings?.pageSize?.toLowerCase() || 'a4';
//     const pdf = new jsPDF("p", "mm", pageSize);
//     const pdfWidth = 210;
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`${doc.docNumber || 'document'}.pdf`);
//   };

//   if (loading) return <div className="text-center mt-10 font-semibold text-gray-600">Loading Document...</div>;
//   if (!doc || !doc.data) return <div className="text-center mt-10 font-semibold text-red-500">Document not found or corrupt!</div>;

//   const data = doc.data;
//   const company = data.company || {};
//   const client = data.client || {};
//   const docMeta = data.docMeta || {};
//   const items = data.items || [];
//   const clauses = data.clauses || [];
//   const terms = data.terms || {};
//   const financials = data.financials || {};
//   const docSettings = data.docSettings || {};
//   const centerLogo = data.centerLogo || false;
//   const wmMode = data.wmMode || 'disabled';
//   const wmText = data.wmText || '';
//   const wmLogo = data.wmLogo || null;
//   const wmIntensity = data.wmIntensity || 12;
//   const wmSpacing = data.wmSpacing || 250;
//   const wmSpread = data.wmSpread || 16;
//   const wmColor = data.wmColor || '#cbd5e1';

//   const renderWatermarkLayer = () => {
//     if (wmMode === 'disabled') return null;
//     const opacity = wmIntensity / 100;
//     if (wmMode === 'single_text' && wmText) {
//       return (
//         <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
//           <div style={{ opacity, transform: `rotate(${wmSpread}deg)`, fontSize: `${wmSpacing}px`, color: wmColor, fontWeight: '900', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{wmText}</div>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      
//       {/* Top er button gulo mobile e pashapashi na theke upore niche hobe */}
//       <div className="no-print flex flex-col sm:flex-row justify-between items-center mb-6 max-w-[210mm] mx-auto gap-4">
//         <button onClick={() => navigate(-1)} className="flex items-center justify-center w-full sm:w-auto gap-2 text-gray-600 hover:text-black transition font-semibold">
//           <ArrowLeft size={20} /> Back
//         </button>
//         <button onClick={handleDownload} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-bold">
//           <Printer size={20} /> Save as PDF
//         </button>
//       </div>

//       {/* PDF Document Container - Ekhane Tailwind er responsive scaling add kora hoyeche */}
//       <div className="flex justify-center items-start overflow-hidden pb-20">
        
//         {/* Scale wrapper: screen er size onujayi zoom-out hobe */}
//         <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top transition-transform duration-300 print:scale-100 print:transform-none">
          
//           <div
//            ref={componentRef} 
//   className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden mx-auto print:shadow-none print:w-full print:min-h-0 print:m-0"
//             style={{ 
//               backgroundColor: docMeta.paperColor || '#FFFFFF',
//               fontFamily: docSettings.fontFamily || 'Inter'
//             }}
//           >
//             {renderWatermarkLayer()}
//             <div id="pdf-content" className="relative z-10 h-full w-full">
//               <DocumentLayout
//                 docType={doc.docType}
//                 company={company}
//                 client={client}
//                 docMeta={{ ...docMeta, number: doc.docNumber }}
//                 items={items}
//                 clauses={clauses}
//                 terms={terms}
//                 financials={financials}
//                 settings={docSettings}
//                 currency={docSettings.currency || '₹'}
//                 status={docSettings.status}
//                 centerLogo={centerLogo}
//               />
//             </div>
//           </div>
          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewPdf;

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';
import api from '../api/axios';
import { ArrowLeft, Download } from 'lucide-react';
import DocumentLayout from '../preview/DocumentLayout'; 


const ViewPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/documents/${id}`);
        setDoc(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching document:", err);
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [logoTileUrl, setLogoTileUrl] = useState('');

  // Generate seamless repeating pattern for Logo Tiling (avoids empty corners)
  useEffect(() => {
    const data = doc?.data || {};
    const activeLogo = data.wmLogo || data.company?.logo;
    const wmMode = data.wmMode || 'disabled';
    const wmSpacing = data.wmSpacing || 250;

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
  }, [doc]);

  const handleDownload = async () => {
    const wrapper = document.getElementById("pdf-wrapper");
    const element = document.getElementById("pdf-content");
    if (!element || !wrapper) return;
    
    setIsDownloading(true);

    try {
      // Temporarily remove scaling from the wrapper to capture at full resolution natively
      // This avoids cloning which breaks flexbox and text wrapping in html2canvas
      const originalCssText = wrapper.style.cssText;
      wrapper.style.cssText += 'transform: scale(1) !important;';

      // Wait a tick for browser layout recalculation
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

      // Restore original scale
      wrapper.style.cssText = originalCssText;

      const pdf = new jsPDF('p', 'mm', 'a4');

      // A4 size: 210mm x 297mm
      // Target Margins: 0mm on all sides for full bleed
      const margin = 0;
      const maxPdfWidth = 210 - (margin * 2);  // 210mm
      const maxPdfHeight = 297 - (margin * 2); // 297mm

      const canvasWidth = element.clientWidth * scale;
      const canvasHeight = element.clientHeight * scale;

      // Calculate initial dimensions based on width
      let finalWidth = maxPdfWidth;
      let finalHeight = (canvasHeight * maxPdfWidth) / canvasWidth;

      // Ensure everything fits exactly on one page
      if (finalHeight > maxPdfHeight) {
        const ratio = maxPdfHeight / finalHeight;
        finalHeight = maxPdfHeight;
        finalWidth = finalWidth * ratio;
      }

      // Center the content horizontally if it was scaled down by height
      const xOffset = margin + (maxPdfWidth - finalWidth) / 2;
      const yOffset = margin;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`${doc?.docNumber || 'document'}.pdf`);

    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  // const handleDownload = async () => {
  //   const element = document.getElementById("pdf-content");
  //   if (!element) return;
  //   const canvas = await html2canvas(element, { scale: 2, useCORS: true });
  //   const imgData = canvas.toDataURL("image/png");
  //   const pageSize = doc?.data?.docSettings?.pageSize?.toLowerCase() || 'a4';
  //   const pdf = new jsPDF("p", "mm", pageSize);
  //   const pdfWidth = 210;
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //   pdf.save(`${doc.docNumber || 'document'}.pdf`);
  // };

  if (loading) return <div className="text-center mt-10 font-semibold text-gray-600">Loading Document...</div>;
  if (!doc || !doc.data) return <div className="text-center mt-10 font-semibold text-red-500">Document not found or corrupt!</div>;

  const data = doc.data;
  const company = data.company || {};
  const client = data.client || {};
  const docMeta = data.docMeta || {};
  const items = data.items || [];
  const clauses = data.clauses || [];
  const terms = data.terms || {};
  const financials = data.financials || {};
  const docSettings = data.docSettings || {};
  const centerLogo = data.centerLogo || false;
  const wmMode = data.wmMode || 'disabled';
  const wmText = data.wmText || '';
  const wmLogo = data.wmLogo || null;
  const wmIntensity = data.wmIntensity || 12;
  const wmSpacing = data.wmSpacing || 250;
  const wmSpread = data.wmSpread || 16;
  const wmColor = data.wmColor || '#cbd5e1';

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
            
            const fontSize = Math.max(12, Math.min(55, Math.round(12 + spacingVal * 0.08)));
            const charWidth = fontSize * 0.62;
            const textWidth = Math.round(charWidth * textToDisplay.length);
            
            const gapX = Math.max(20, Math.round(fontSize * 1.6));
            const gapY = Math.max(8, Math.round(fontSize * 0.65));

            const boxWidth = textWidth + gapX;
            const boxHeight = fontSize + gapY;

            const safeText = textToDisplay
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;');

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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      
      {/* Top er button gulo mobile e pashapashi na theke upore niche hobe */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-center mb-6 max-w-[210mm] mx-auto gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-full sm:w-auto gap-2 text-gray-600 hover:text-black transition font-semibold">
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={handleDownload} disabled={isDownloading} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-bold disabled:bg-blue-400">
          <Download size={20} /> {isDownloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      {/* PDF Document Container - Zoom Fix & Shadow Fix */}
      <div className="w-full overflow-auto pb-20 min-h-screen">
        <div className="flex justify-center min-w-max p-4 md:p-8">
          <div id="pdf-wrapper" className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top transition-transform duration-300 print:scale-100 print:transform-none">
            
            {/* Shadow ref theke alada kora hoyeche */}
            <div className="shadow-2xl print:shadow-none mx-auto w-[210mm]">
              <div
                id="pdf-content"
                className="bg-white w-[210mm] min-h-[296mm] text-black relative overflow-hidden box-border"
                style={{ 
                  backgroundColor: docMeta.paperColor || '#FFFFFF',
                  fontFamily: docSettings.fontFamily || 'Inter'
                }}
              >
                {renderWatermarkLayer()}
                <div className="relative z-10 h-full w-full">
                  <DocumentLayout
                    docType={doc.docType}
                    company={company}
                    client={client}
                    docMeta={{ ...docMeta, number: doc.docNumber }}
                    items={items}
                    clauses={clauses}
                    terms={terms}
                    financials={financials}
                    settings={docSettings}
                    currency={docSettings.currency || '₹'}
                    status={docSettings.status}
                    centerLogo={centerLogo}
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

export default ViewPdf;