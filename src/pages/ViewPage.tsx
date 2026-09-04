import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PassDetails } from '../types';
import { PassTemplate } from '../components/PassTemplate';
import { Download, ArrowLeft } from 'lucide-react';

import { supabase, isSupabaseConfigured } from '../supabase';

// @ts-ignore
import html2pdf from 'html2pdf.js';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [passData, setPassData] = useState<PassDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pdfRef = useRef<HTMLDivElement>(null);

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

  const handleDownload = () => {
    if (pdfRef.current) {
      const opt = {
        margin: 0,
        filename: `DC_Pass_${passData?.dcPassNo || passData?.id || 'download'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          onclone: (clonedDoc: Document) => {
            // Strip any modern oklch() color functions from CSS style tags so html2canvas doesn't crash
            const styleElements = clonedDoc.querySelectorAll('style');
            styleElements.forEach((style) => {
              if (style.innerHTML && style.innerHTML.includes('oklch')) {
                style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/g, '#000000');
              }
            });
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      try {
        html2pdf()
          .set(opt)
          .from(pdfRef.current)
          .save()
          .catch((err: any) => {
            console.warn('html2pdf download failed, falling back to browser print dialog:', err);
            window.print();
          });
      } catch (err) {
        console.warn('html2pdf initialization failed, printing instead:', err);
        window.print();
      }
    } else {
      window.print();
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
            className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
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
    <div className="min-h-screen bg-slate-200 py-8 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between items-center print:hidden">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg shadow hover:bg-slate-50 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Form
        </button>
        
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-500 transition-colors font-bold"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
      
      {/* Container with shadow for the PDF preview */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl rounded-sm overflow-hidden print:shadow-none print:m-0">
        <div ref={pdfRef}>
          <PassTemplate data={passData} viewUrl={viewUrl} />
        </div>
      </div>
    </div>
  );
};
