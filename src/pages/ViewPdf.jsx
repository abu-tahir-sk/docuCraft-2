import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Printer } from 'lucide-react';
import DocumentLayout from '../preview/DocumentLayout'; 
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ViewPdf = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://docu-craft-server.vercel.app/api/documents/${id}`, { withCredentials: true });
        setDoc(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching document:", err);
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleDownload = async () => {
    const element = document.getElementById("pdf-content");
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pageSize = doc?.data?.docSettings?.pageSize?.toLowerCase() || 'a4';
    const pdf = new jsPDF("p", "mm", pageSize);
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${doc.docNumber || 'document'}.pdf`);
  };

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
    if (wmMode === 'disabled') return null;
    const opacity = wmIntensity / 100;
    if (wmMode === 'single_text' && wmText) {
      return (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div style={{ opacity, transform: `rotate(${wmSpread}deg)`, fontSize: `${wmSpacing}px`, color: wmColor, fontWeight: '900', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{wmText}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      
      {/* Top er button gulo mobile e pashapashi na theke upore niche hobe */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-center mb-6 max-w-[210mm] mx-auto gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center w-full sm:w-auto gap-2 text-gray-600 hover:text-black transition font-semibold">
          <ArrowLeft size={20} /> Back
        </button>
        <button onClick={handleDownload} className="flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-bold">
          <Printer size={20} /> Save as PDF
        </button>
      </div>

      {/* PDF Document Container - Ekhane Tailwind er responsive scaling add kora hoyeche */}
      <div className="flex justify-center items-start overflow-hidden pb-20">
        
        {/* Scale wrapper: screen er size onujayi zoom-out hobe */}
        <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top transition-transform duration-300 print:scale-100 print:transform-none">
          
          <div
            className="bg-white w-[210mm] min-h-[297mm] text-black shadow-2xl relative overflow-hidden mx-auto print:shadow-none print:w-full print:min-h-0 print:m-0"
            style={{ 
              backgroundColor: docMeta.paperColor || '#FFFFFF',
              fontFamily: docSettings.fontFamily || 'Inter'
            }}
          >
            {renderWatermarkLayer()}
            <div id="pdf-content" className="relative z-10 h-full w-full">
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
  );
};

export default ViewPdf;