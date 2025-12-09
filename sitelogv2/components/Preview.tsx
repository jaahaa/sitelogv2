
import React, { useState } from 'react';
import { Report } from '../types';
import { ReportPreview } from './ReportPreview';
import { EmailModal } from './EmailModal';
import { HelpModal } from './HelpModal';
import { ArrowLeft, Edit2, Mail, Download, HelpCircle, Share2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { generateReportHTML } from '../utils/reportGenerator';

interface PreviewProps {
  report: Report;
  onBack: () => void;
  onEdit: () => void;
}

const Preview: React.FC<PreviewProps> = ({ report, onBack, onEdit }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Function to convert file to base64 for PDF generation
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      // 1. Convert all photo files to base64 strings so html2canvas can render them
      const photoBase64s = await Promise.all(report.photos.map(p => fileToBase64(p)));
      
      // 2. Generate the PDF-specific HTML string
      const htmlContent = generateReportHTML(report, true, photoBase64s);
      
      // 3. Create a temporary container
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      document.body.appendChild(container);
      
      // 4. Use html2canvas
      const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // 5. Generate PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width
      const pageHeight = 297; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `Report_${report.projectName.replace(/\s+/g, '_')}_${report.date}.pdf`;
      pdf.save(filename);
      
      // Cleanup
      document.body.removeChild(container);
    } catch (err) {
      console.error("PDF Generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailSelect = (provider: 'default' | 'gmail' | 'outlook') => {
    // Generate mailto link
    // Note: We cannot attach files via mailto. We just fill subject/body.
    const subject = encodeURIComponent(`Daily Report: ${report.projectName} - ${report.date}`);
    const body = encodeURIComponent(
`Please find the daily report for ${report.projectName} attached (if sent manually) or see summary below.

Project: ${report.projectName} (${report.projectNumber})
Date: ${report.date}
Status: ${report.status}

Summary:
${report.summary || 'No summary provided.'}

--
Sent via SiteLog`
    );

    let url = '';
    switch (provider) {
        case 'gmail':
            url = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
            break;
        case 'outlook':
            url = `https://outlook.office.com/mail/deeplink/compose?subject=${subject}&body=${body}`;
            break;
        default:
            url = `mailto:?subject=${subject}&body=${body}`;
    }

    // Trigger PDF download first (user expectation management)
    handleDownloadPdf().then(() => {
        window.open(url, '_blank');
        setShowEmailModal(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft size={22} />
            </button>
            <h1 className="font-bold text-slate-800 text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">
            {report.projectName}
            </h1>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {report.status}
            </span>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={onEdit}
                className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-full transition-colors"
                title="Edit Report"
            >
                <Edit2 size={20} />
            </button>
            <button 
                onClick={() => setShowHelp(true)}
                className="p-2 text-slate-400 hover:text-slate-600"
            >
                <HelpCircle size={20} />
            </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <ReportPreview data={report} />
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 flex items-center justify-center gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
         <button 
           onClick={handleDownloadPdf}
           disabled={isExporting}
           className="flex-1 max-w-[200px] py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
         >
           {isExporting ? <span className="animate-spin">⌛</span> : <Download size={20} />}
           PDF
         </button>
         <button 
           onClick={() => setShowEmailModal(true)}
           className="flex-1 max-w-[200px] py-3 rounded-xl font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
         >
           <Mail size={20} />
           Email Report
         </button>
      </div>

      <EmailModal 
        isOpen={showEmailModal} 
        onClose={() => setShowEmailModal(false)}
        onSelect={handleEmailSelect}
        hasPhotos={report.photos.length > 0}
      />

      <HelpModal 
        isOpen={showHelp} 
        onClose={() => setShowHelp(false)} 
      />
    </div>
  );
};

export default Preview;
