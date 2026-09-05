import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PassDetails } from '../types';
import { PassTemplate } from '../components/PassTemplate';
import { Download, ArrowLeft, Printer, LogOut } from 'lucide-react';
import { authService } from '../utils/auth';
import { supabase, isSupabaseConfigured } from '../supabase';

// @ts-ignore
import html2pdf from 'html2pdf.js';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [passData, setPassData] = useState<PassDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    const fetchPass = async () => {
      if (!id) return;
      
      // Try fetching from Supabase first
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from('passes')
            .select('*')
            .eq('id', id)
            .single();

          if (data && !error) {
            setPassData(data as PassDetails);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error fetching from Supabase:', err);
        }
      }

      // Fallback to localStorage
      const stored = localStorage.getItem('passes');
      if (stored) {
        const passes: PassDetails[] = JSON.parse(stored);
        const found = passes.find(p => p.id === id);
        if (found) {
          setPassData(found);
        }
      }
      setLoading(false);
    };

    fetchPass();
  }, [id]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleDownload = async () => {
    if (!pdfRef.current) return;
    setDownloading(true);

    const opt = {
      margin: [6, 4.2, 6, 4.2] as [number, number, number, number], // 4.2mm left/right margin + 201.6mm table = 210mm A4 width
      filename: `DC_Pass_${passData?.dcPassNo || passData?.id || 'download'}.pdf`,
      image: { type: 'png' as const },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        scrollY: 0,
        scrollX: 0,
        width: 762,
        windowWidth: 762,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          // Lock cloned document and body to exact 762px centered
          clonedDoc.documentElement.style.width = '762px';
          clonedDoc.documentElement.style.margin = '0 auto';
          clonedDoc.body.style.width = '762px';
          clonedDoc.body.style.margin = '0 auto';
          clonedDoc.body.style.padding = '0';

          const wrapper = clonedDoc.getElementById('printable-pdf-wrapper');
          if (wrapper) {
            wrapper.style.width = '762px';
            wrapper.style.minWidth = '762px';
            wrapper.style.maxWidth = '762px';
            wrapper.style.margin = '0 auto';
            wrapper.style.padding = '0';
          }

          const el = clonedDoc.getElementById('pass-template-container');
          if (el) {
            el.style.width = '762px';
            el.style.minWidth = '762px';
            el.style.maxWidth = '762px';
            el.style.margin = '0 auto';
            el.style.padding = '0';
            el.style.boxSizing = 'border-box';
          }
          // Strip any modern oklch() color functions from CSS style tags so html2canvas doesn't crash
          const styleElements = clonedDoc.querySelectorAll('style');
          styleElements.forEach((style) => {
            if (style.innerHTML && style.innerHTML.includes('oklch')) {
              style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#000000');
            }
          });
        }
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    try {
      await html2pdf()
        .set(opt)
        .from(pdfRef.current)
        .save();
    } catch (err) {
      console.warn('html2pdf download failed, falling back to browser print dialog:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-slate-400 font-medium">Loading pass details...</p>
        </div>
      </div>
    );
  }

  if (!passData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Pass Not Found</h2>
          <p className="text-slate-400">The requested pass could not be found or has been deleted.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors cursor-pointer font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Ensure absolute URL for QR code scanning
  const viewUrl = window.location.href;

  return (
    <div className="min-h-screen bg-slate-200 py-6 px-2 sm:px-4 print:bg-white print:py-0 print:px-0">
      {/* Top action toolbar */}
      <div className="max-w-[794px] mx-auto mb-5 flex flex-wrap justify-between items-center gap-3 print:hidden">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg shadow hover:bg-slate-50 transition-colors font-medium cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Form
        </button>
        
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg shadow hover:bg-slate-600 transition-colors font-medium cursor-pointer text-sm"
            title="Open browser print dialog to print or save high-resolution vector PDF"
          >
            <Printer className="w-4 h-4" />
            Print Pass
          </button>
          
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500 transition-colors font-bold cursor-pointer text-sm disabled:opacity-50"
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
          </button>

          {isAuthenticated && (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors font-medium cursor-pointer text-sm"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
      
      {/* 
        Scrollable container so mobile screens won't compress the layout.
        html2canvas will capture the exact uncompressed desktop layout matching the preview.
      */}
      <div className="w-full overflow-x-auto flex justify-center pb-8 print:p-0 print:m-0 print:overflow-visible print:block print:w-full">
        <div 
          className="bg-white shadow-2xl rounded-sm print:shadow-none print:mx-auto"
          style={{ width: '762px', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <div ref={pdfRef} id="printable-pdf-wrapper" style={{ width: '762px', marginLeft: 'auto', marginRight: 'auto' }}>
            <PassTemplate data={passData} viewUrl={viewUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};
